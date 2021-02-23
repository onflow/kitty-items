import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import KittyItems from "../../contracts/KittyItems.cdc"

// This script returns the metadata for an NFT in an account's collection.

pub fun main(address: Address, itemID: UInt64): UInt64 {

    // get the public account object for the token owner
    let owner = getAccount(address)

    let collectionBorrow = owner.getCapability(KittyItems.CollectionPublicPath)!
        .borrow<&{KittyItems.KittyItemsCollectionPublic}>()
        ?? panic("Could not borrow KittyItemsCollectionPublic")

    // borrow a reference to a specific NFT in the collection
    let kittyItem = collectionBorrow.borrowKittyItem(id: itemID)
        ?? panic("No such itemID in that collection")

    return kittyItem.typeID
}
