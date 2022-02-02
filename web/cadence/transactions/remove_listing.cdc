import NFTStorefront from 0xNFTStorefront

transaction(listingResourceID: UInt64) {
  let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontManager}

  prepare(acct: AuthAccount) {
    self.storefront = acct.borrow<&NFTStorefront.Storefront{NFTStorefront.StorefrontManager}>(from: NFTStorefront.StorefrontStoragePath)
      ?? panic("Missing or mis-typed NFTStorefront.Storefront")
  }

  execute {
    self.storefront.removeListing(listingResourceID: listingResourceID)
  }
}