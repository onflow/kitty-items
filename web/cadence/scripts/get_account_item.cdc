import NonFungibleToken from 0xNonFungibleToken
import KittyItems from 0xKittyItems

pub struct AccountItem {
  pub let itemID: UInt64
  pub let typeID: UInt64
  pub let rarityID: UInt64
  pub let owner: Address

  init(itemID: UInt64, typeID: UInt64, rarityID: UInt64, owner: Address) {
    self.itemID = itemID
    self.typeID = typeID
    self.rarityID = rarityID
    self.owner = owner
  }
}

pub fun fetch(address: Address, id: UInt64): AccountItem? {
  if let col = getAccount(address).getCapability<&KittyItems.Collection{NonFungibleToken.CollectionPublic, KittyItems.KittyItemsCollectionPublic}>(KittyItems.CollectionPublicPath).borrow() {
    if let item = col.borrowKittyItem(id: id) {
      return AccountItem(itemID: id, typeID: item.typeID, rarityID: item.rarityID, owner: address)
    }
  }

  return nil
}

pub fun main(keys: [String], addresses: [Address], ids: [UInt64]): {String: AccountItem?} {
  let r: {String: AccountItem?} = {}
  var i = 0
  while i < keys.length {
    let key = keys[i]
    let address = addresses[i]
    let id = ids[i]
    r[key] = fetch(address: address, id: id)
    i = i + 1
  }
  return r
}