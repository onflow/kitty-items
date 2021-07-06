import NFTStorefront from 0xNFTSTOREFRONT

transaction(saleOfferResourceID: UInt64, storefrontAddress: Address) {
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}

    prepare(acct: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
                NFTStorefront.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")
    }

    execute {
        
        // Be kind and recycle
        self.storefront.cleanup(saleOfferResourceID: saleOfferResourceID)
    }
}
