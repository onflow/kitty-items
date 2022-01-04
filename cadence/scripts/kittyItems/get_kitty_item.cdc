import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import KittyItems from "../../contracts/KittyItems.cdc"

pub struct AccountItem {
  pub let itemID: UInt64
  pub let resourceID: UInt64
  pub let kind: KittyItems.Kind
  pub let rarity: KittyItems.Rarity
  pub let owner: Address

  init(
    itemID: UInt64,
    resourceID: UInt64,
    kind: KittyItems.Kind,
    rarity: KittyItems.Rarity,
    owner: Address,
  ) {
    self.itemID = itemID
    self.resourceID = resourceID
    self.kind = kind
    self.rarity = rarity
    self.owner = owner
  }
}

pub fun main(address: Address, itemID: UInt64): AccountItem? {
  if let collection = getAccount(address).getCapability<&KittyItems.Collection{NonFungibleToken.CollectionPublic, KittyItems.KittyItemsCollectionPublic}>(KittyItems.CollectionPublicPath).borrow() {
    if let item = collection.borrowKittyItem(id: itemID) {
      return AccountItem(
        itemID: itemID,
        resourceID: item.uuid,
        kind: item.kind, 
        rarity: item.rarity, 
        owner: address,
      )
    }
  }

  return nil
}
