import NonFungibleToken from 0xNONFUNGIBLETOKEN
import KittyItems from 0xKITTYITEMS

// This script reads metadata about an NFT in a user's collection
pub fun main(account: Address, kittyID: UInt64): UInt64 {

    // Get the public account object of the owner of the token
    let owner = getAccount(account)

    let collectionBorrow = owner
        .getCapability(/public/KittyItemsCollection)!
        .borrow<&{NonFungibleToken.CollectionPublic}>()!

    // Borrow a reference to a specific NFT in the collection
    let kittyItem = collectionBorrow.borrowNFT(id: kittyID)

    return kittyItem.typeID
}