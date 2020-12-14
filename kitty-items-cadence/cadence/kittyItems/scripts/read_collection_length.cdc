import NonFungibleToken from 0xNONFUNGIBLETOKEN
import KittyItems from 0xKITTYITEMS

// This transaction gets the length of an account's nft collection

pub fun main(account: Address): Int {
    let acct = getAccount(account)
    let collectionRef = acct.getCapability(/public/KittyItemsCollection)!.borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getIDs().length
}
 