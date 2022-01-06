import {tx} from "src/flow/util/tx"

const CREATE_LISTING_TRANSACTION = `
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  import FlowToken from 0xFlowToken
  import KittyItems from 0xKittyItems
  import NFTStorefront from 0xNFTStorefront

  pub fun getOrCreateStorefront(account: AuthAccount): &NFTStorefront.Storefront {
    if let storefrontRef = account.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) {
      return storefrontRef
    }

    let storefront <- NFTStorefront.createStorefront()

    let storefrontRef = &storefront as &NFTStorefront.Storefront

    account.save(<-storefront, to: NFTStorefront.StorefrontStoragePath)

    account.link<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath)

    return storefrontRef
  }

  transaction(saleItemID: UInt64, saleItemPrice: UFix64) {

    let flowReceiver: Capability<&FlowToken.Vault{FungibleToken.Receiver}>
    let kittyItemsProvider: Capability<&KittyItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let storefront: &NFTStorefront.Storefront

    prepare(account: AuthAccount) {
      // We need a provider capability, but one is not provided by default so we create one if needed.
      let kittyItemsCollectionProviderPrivatePath = /private/kittyItemsCollectionProvider

      self.flowReceiver = account.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)!

      assert(self.flowReceiver.borrow() != nil, message: "Missing or mis-typed FLOW receiver")

      if !account.getCapability<&KittyItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(kittyItemsCollectionProviderPrivatePath)!.check() {
        account.link<&KittyItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(kittyItemsCollectionProviderPrivatePath, target: KittyItems.CollectionStoragePath)
      }

      self.kittyItemsProvider = account.getCapability<&KittyItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(kittyItemsCollectionProviderPrivatePath)!

      assert(self.kittyItemsProvider.borrow() != nil, message: "Missing or mis-typed KittyItems.Collection provider")

      self.storefront = getOrCreateStorefront(account: account)
    }

    execute {
      let saleCut = NFTStorefront.SaleCut(
        receiver: self.flowReceiver,
        amount: saleItemPrice
      )

      self.storefront.createListing(
        nftProviderCapability: self.kittyItemsProvider,
        nftType: Type<@KittyItems.NFT>(),
        nftID: saleItemID,
        salePaymentVaultType: Type<@FlowToken.Vault>(),
        saleCuts: [saleCut]
      )
    }
  }
`

export function createListing({itemID, price}, opts = {}) {
  if (itemID == null)
    throw new Error("createListing(itemID, price) -- itemID required")
  if (price == null)
    throw new Error("createListing(itemID, price) -- price required")
  return tx(
    {
      cadence: CREATE_LISTING_TRANSACTION,
      args: (arg, t) => [
        arg(Number(itemID), t.UInt64),
        arg(String(price.toFixed(2)), t.UFix64),
      ],
      limit: 1000,
    },
    opts,
  )
}
