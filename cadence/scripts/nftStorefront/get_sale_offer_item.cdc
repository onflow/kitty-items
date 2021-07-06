import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import NFTStorefront from "../../contracts/NFTStorefront.cdc"
import KittyItems from "../../contracts/KittyItems.cdc"

pub struct SaleItem {
  pub let itemID: UInt64
  pub let typeID: UInt64
  pub let owner: Address
  pub let price: UFix64

  init(itemID: UInt64, typeID: UInt64, owner: Address, price: UFix64) {
    self.itemID = itemID
    self.typeID = typeID
    self.owner = owner
    self.price = price
  }
}

pub fun main(address: Address, saleOfferResourceID: UInt64): SaleItem? {
  let account = getAccount(address)

  if let storefrontRef = account.getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath).borrow() {
    if let saleOffer = storefrontRef.borrowSaleOffer(saleOfferResourceID: saleOfferResourceID) {
      let details = saleOffer.getDetails()

      let itemID = details.nftID
      let itemPrice = details.salePrice

      if let collection = account.getCapability<&KittyItems.Collection{NonFungibleToken.CollectionPublic, KittyItems.KittyItemsCollectionPublic}>(KittyItems.CollectionPublicPath).borrow() {
        if let item = collection.borrowKittyItem(id: itemID) {
          return SaleItem(itemID: itemID, typeID: item.typeID, owner: address, price: itemPrice)
        }
      }
    }
  }
    
  return nil
}
