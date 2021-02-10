// prettier-ignore
import {transaction, limit, proposer, payer, authorizations, authz, cdc} from "@onflow/fcl"
import {invariant} from "@onflow/util-invariant"
import {tx} from "./util/tx"

const CODE = cdc`
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  import Kibble from 0xKibble
  import KittyItems from 0xKittyItems
  import KittyItemsMarket from 0xKittyItemsMarket

  pub fun hasKibble(_ address: Address): Bool {
    let receiver = getAccount(address)
      .getCapability<&Kibble.Vault{FungibleToken.Receiver}>(Kibble.ReceiverPublicPath)
      .check()

    let balance = getAccount(address)
      .getCapability<&Kibble.Vault{FungibleToken.Balance}>(Kibble.BalancePublicPath)
      .check()

    return receiver && balance
  }

  pub fun hasItems(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&KittyItems.Collection{NonFungibleToken.CollectionPublic, KittyItems.KittyItemsCollectionPublic}>(KittyItems.CollectionPublicPath)
      .check()
  }

  pub fun hasMarket(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}>(KittyItemsMarket.CollectionPublicPath)
      .check()
  }

  transaction {
    prepare(acct: AuthAccount) {
      if !hasKibble(acct.address) {
        if acct.borrow<&Kibble.Vault>(from: Kibble.VaultStoragePath) == nil {
          acct.save(<-Kibble.createEmptyVault(), to: Kibble.VaultStoragePath)
        }
        acct.unlink(Kibble.ReceiverPublicPath)
        acct.unlink(Kibble.BalancePublicPath)
        acct.link<&Kibble.Vault{FungibleToken.Receiver}>(Kibble.ReceiverPublicPath, target: Kibble.VaultStoragePath)
        acct.link<&Kibble.Vault{FungibleToken.Balance}>(Kibble.BalancePublicPath, target: Kibble.VaultStoragePath)
      }

      if !hasItems(acct.address) {
        if acct.borrow<&KittyItems.Collection>(from: KittyItems.CollectionStoragePath) == nil {
          acct.save(<-KittyItems.createEmptyCollection(), to: KittyItems.CollectionStoragePath)
        }
        acct.unlink(KittyItems.CollectionPublicPath)
        acct.link<&KittyItems.Collection{NonFungibleToken.CollectionPublic, KittyItems.KittyItemsCollectionPublic}>(KittyItems.CollectionPublicPath, target: KittyItems.CollectionStoragePath)
      }

      if !hasMarket(acct.address) {
        if acct.borrow<&KittyItemsMarket.Collection>(from: KittyItemsMarket.CollectionStoragePath) == nil {
          acct.save(<-KittyItemsMarket.createEmptyCollection(), to: KittyItemsMarket.CollectionStoragePath)
        }
        acct.unlink(KittyItemsMarket.CollectionPublicPath)
        acct.link<&KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}>(KittyItemsMarket.CollectionPublicPath, target:KittyItemsMarket.CollectionStoragePath)
      }
    }
  }
`

export async function initializeAccount(address, opts = {}) {
  // prettier-ignore
  invariant(address != null, "Tried to initialize an account but no address was supplied")

  return tx(
    [
      transaction(CODE),
      limit(70),
      proposer(authz),
      payer(authz),
      authorizations([authz]),
    ],
    opts
  )
}
