import NFTStorefrontV2 from "../contracts/NFTStorefrontV2.cdc"

/// Transaction to facilitate the cleanup of the expired listings of a given
/// storefront resource account holder.
/// This transaction facilitates the cleanup in pagination model where signer
/// of the transaction will provide the `fromIndex` & `toIndex` of `listingsIDs` array
/// to remove the expired listings under the given range.
///
/// It can be sign/authorize by anyone.

transaction(fromIndex: UInt64, toIndex: UInt64, storefrontAddress: Address) {
    let storefront: &NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}

    prepare(acct: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(
                NFTStorefrontV2.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")
    }

    execute {
        // Be kind and recycle
        self.storefront.cleanupExpiredListings(fromIndex: fromIndex, toIndex: toIndex)
    }
}