import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken
import KittyItems from 0xKittyItems
import NFTStorefrontV2 from 0xNFTStorefront

pub fun hasItems(_ address: Address): Bool {
  return getAccount(address)
    .getCapability<&KittyItems.Collection{NonFungibleToken.CollectionPublic, KittyItems.KittyItemsCollectionPublic}>(KittyItems.CollectionPublicPath)
    .check()
}

pub fun hasStorefront(_ address: Address): Bool {
  return getAccount(address)
    .getCapability<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(NFTStorefrontV2.StorefrontPublicPath)
    .check()
}

pub fun main(address: Address): {String: Bool} {
  let ret: {String: Bool} = {}
  ret["KittyItems"] = hasItems(address)
  ret["KittyItemsMarket"] = hasStorefront(address)
  return ret
}