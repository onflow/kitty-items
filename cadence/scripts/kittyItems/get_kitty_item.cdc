import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import KittyItems from "../../contracts/KittyItems.cdc"

pub struct AccountItem {
  pub let itemID: UInt64
  pub let typeID: UInt64
  pub let resourceID: UInt64
  pub let owner: Address

  init(itemID: UInt64, typeID: UInt64, resourceID: UInt64, owner: Address) {
    self.itemID = itemID
    self.typeID = typeID
    self.resourceID = resourceID
    self.owner = owner
  }
}

pub fun main(address: Address, itemID: UInt64): AccountItem? {
  if let collection = getAccount(address).getCapability<&KittyItems.Collection{NonFungibleToken.CollectionPublic, KittyItems.KittyItemsCollectionPublic}>(KittyItems.CollectionPublicPath).borrow() {
    if let item = collection.borrowKittyItem(id: itemID) {
      return AccountItem(itemID: itemID, typeID: item.typeID, resourceID: item.uuid, owner: address)
    }
  }

  return nil
}
