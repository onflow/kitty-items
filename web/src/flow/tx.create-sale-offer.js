import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {tx} from "./util/tx"

const CODE = fcl.cdc`
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  import Kibble from 0xKibble
  import KittyItems from 0xKittyItems
  import NFTStorefront from 0xNFTStorefront

  transaction(saleItemID: UInt64, saleItemPrice: UFix64) {

    let kibbleReceiver: Capability<&Kibble.Vault{FungibleToken.Receiver}>
    let kittyItemsCollection: Capability<&KittyItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let storefront: &NFTStorefront.Storefront

    prepare(account: AuthAccount) {
      // We need a provider capability, but one is not provided by default so we create one if needed.
      let kittyItemsCollectionProviderPrivatePath = /private/kittyItemsCollectionProvider

      self.kibbleReceiver = account.getCapability<&Kibble.Vault{FungibleToken.Receiver}>(Kibble.ReceiverPublicPath)!
      assert(self.kibbleReceiver.borrow() != nil, message: "Missing or mis-typed Kibble receiver")

      if !account.getCapability<&KittyItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(kittyItemsCollectionProviderPrivatePath)!.check() {
        account.link<&KittyItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(kittyItemsCollectionProviderPrivatePath, target: KittyItems.CollectionStoragePath)
      }

      self.kittyItemsCollection = account.getCapability<&KittyItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(kittyItemsCollectionProviderPrivatePath)!
      assert(self.kittyItemsCollection.borrow() != nil, message: "Missing or mis-typed KittyItemsCollection provider")
      
      self.storefront = account.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)
        ?? panic("Missing or mis-typed NFTStorefront Storefront")
    }

    execute {
      let saleCut = NFTStorefront.SaleCut(
        receiver: self.kibbleReceiver,
        amount: saleItemPrice
      )

      self.storefront.createSaleOffer(
        nftProviderCapability: self.kittyItemsCollection,
        nftType: Type<@KittyItems.NFT>(),
        nftID: saleItemID,
        salePaymentVaultType: Type<@Kibble.Vault>(),
        saleCuts: [saleCut]
      )
    }
  }

`

export function createSaleOffer({itemID, price}, opts = {}) {
  if (itemID == null)
    throw new Error("createSaleOffer(itemID, price) -- itemID required")
  if (price == null)
    throw new Error("createSaleOffer(itemID, price) -- price required")

  // prettier-ignore
  return tx([
    fcl.transaction(CODE),
    fcl.args([
      fcl.arg(Number(itemID), t.UInt64),
      fcl.arg(String(price), t.UFix64),
    ]),
    fcl.proposer(fcl.authz),
    fcl.payer(fcl.authz),
    fcl.authorizations([
      fcl.authz
    ]),
    fcl.limit(1000)
  ], opts)
}
