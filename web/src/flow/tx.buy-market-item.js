import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {tx} from "./util/tx"
import {invariant} from "@onflow/util-invariant"

const CODE = fcl.cdc`
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  import Kibble from 0xKibble
  import KittyItems from 0xKittyItems
  import KittyItemsMarket from 0xKittyItemsMarket

  transaction(itemID: UInt64, marketCollectionAddress: Address) {
      let paymentVault: @FungibleToken.Vault
      let kittyItemsCollection: &KittyItems.Collection{NonFungibleToken.Receiver}
      let marketCollection: &KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}

      prepare(acct: AuthAccount) {
          self.marketCollection = getAccount(marketCollectionAddress)
              .getCapability<&KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}>(KittyItemsMarket.CollectionPublicPath)
              .borrow() ?? panic("Could not borrow market collection from market address")

          let price = self.marketCollection.borrowSaleItem(itemID: itemID)!.price

          let mainKibbleVault = acct.borrow<&Kibble.Vault>(from: Kibble.VaultStoragePath)
              ?? panic("Cannot borrow Kibble vault from acct storage")
          self.paymentVault <- mainKibbleVault.withdraw(amount: price)

          self.kittyItemsCollection = acct.borrow<&KittyItems.Collection{NonFungibleToken.Receiver}>(
              from: KittyItems.CollectionStoragePath
          ) ?? panic("Cannot borrow KittyItems collection receiver from acct")
      }

      execute {
          self.marketCollection.purchase(
              itemID: itemID,
              buyerCollection: self.kittyItemsCollection,
              buyerPayment: <- self.paymentVault
          )
      }
  }
`

// prettier-ignore
export function buyMarketItem({itemID, ownerAddress}, opts = {}) {
  invariant(itemID != null, "buyMarketItem({itemID, ownerAddress}) -- itemID required")
  invariant(ownerAddress != null, "buyMarketItem({itemID, ownerAddress}) -- ownerAddress required")

  return tx([
    fcl.transaction(CODE),
    fcl.args([
      fcl.arg(Number(itemID), t.UInt64),
      fcl.arg(String(ownerAddress), t.Address),
    ]),
    fcl.proposer(fcl.authz),
    fcl.payer(fcl.authz),
    fcl.authorizations([fcl.authz]),
    fcl.limit(1000),
  ], opts)
}
