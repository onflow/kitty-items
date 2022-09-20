import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken
import FlowToken from 0xFlowToken
import KittyItems from 0xKittyItems
import NFTStorefrontV2 from 0xNFTStorefront

pub fun getOrCreateStorefront(account: AuthAccount): &NFTStorefrontV2.Storefront {
  if let storefrontRef = account.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath) {
    return storefrontRef
  }

  let storefront <- NFTStorefrontV2.createStorefront()

  let storefrontRef = &storefront as &NFTStorefrontV2.Storefront

  account.save(<-storefront, to: NFTStorefrontV2.StorefrontStoragePath)

  account.link<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(NFTStorefrontV2.StorefrontPublicPath, target: NFTStorefrontV2.StorefrontStoragePath)

  return storefrontRef
}

transaction(saleItemID: UInt64, saleItemPrice: UFix64) {

  let flowReceiver: Capability<&FlowToken.Vault{FungibleToken.Receiver}>
  let kittyItemsProvider: Capability<&KittyItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
  let storefront: &NFTStorefrontV2.Storefront

  prepare(account: AuthAccount) {
    // We need a provider capability, but one is not provided by default so we create one if needed.
    let kittyItemsCollectionProviderPrivatePath = /private/kittyItemsCollectionProviderV14

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
    let saleCut = NFTStorefrontV2.SaleCut(
      receiver: self.flowReceiver,
      amount: saleItemPrice
    )

    self.storefront.createListing(
      nftProviderCapability: self.kittyItemsProvider,
      nftType: Type<@KittyItems.NFT>(),
      nftID: saleItemID,
      salePaymentVaultType: Type<@FlowToken.Vault>(),
      saleCuts: [saleCut],
      marketplacesCapability: nil, // [Capability<&{FungibleToken.Receiver}>]?
      customID: nil, // String?
      commissionAmount: UFix64(0),
      expiry: UInt64(getCurrentBlock().timestamp) + UInt64(500)
    )
  }
}