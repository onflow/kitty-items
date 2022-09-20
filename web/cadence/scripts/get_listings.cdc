import NFTStorefrontV2 from 0xNFTStorefront

pub fun main(address: Address): [UInt64] {
  let storefrontRef = getAccount(address)
    .getCapability<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(
        NFTStorefrontV2.StorefrontPublicPath
    )
    .borrow()
    ?? panic("Could not borrow public storefront from address")

  return storefrontRef.getListingIDs()
}