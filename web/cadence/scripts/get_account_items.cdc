import NonFungibleToken from 0xNonFungibleToken
import KittyItems from 0xKittyItems

pub fun main(address: Address): [UInt64] {
  if let collection = getAccount(address).getCapability<&KittyItems.Collection{NonFungibleToken.CollectionPublic, KittyItems.KittyItemsCollectionPublic}>(KittyItems.CollectionPublicPath).borrow() {
    return collection.getIDs()
  }

  return []
}