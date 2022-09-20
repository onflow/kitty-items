import NFTStorefrontV2 from "../contracts/NFTStorefrontV2.cdc"

/// Transaction to facilitate the removal of listing by the
/// listing owner.
/// Listing owner should provide the `listingResourceID` that
/// needs to be removed.

transaction(listingResourceID: UInt64) {
    let storefront: &NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontManager}

    prepare(acct: AuthAccount) {
        self.storefront = acct.borrow<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontManager}>(from: NFTStorefrontV2.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefrontV2.Storefront")
    }

    execute {
        self.storefront.removeListing(listingResourceID: listingResourceID)
    }
}