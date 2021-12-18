import NFTStorefront from "../../contracts/NFTStorefront.cdc"

// This script returns the number of NFTs for sale in a given account's storefront.

pub fun main(address: Address): Int {
    let account = getAccount(address)

    let storefrontRef = account
        .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
            NFTStorefront.StorefrontPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public storefront from address")
  
    return storefrontRef.getListingIDs().length
}
