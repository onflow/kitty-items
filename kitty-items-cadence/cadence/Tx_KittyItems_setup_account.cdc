import NonFungibleToken from 0xNONFUNGIBLETOKEN
import KittyItems from 0xKITTYITEMS
// This transaction is what an account would run
// to set itself up to receive NFTs

transaction {
    prepare(acct: AuthAccount) {

        // If the account doesn't already have a collection
        if acct.borrow<&KittyItems.Collection>(from: KittyItems.CollectionStoragePath) == nil {

            // Create a new empty collection
            let collection <- KittyItems.createEmptyCollection()
            
            // save it to the account
            acct.save(<-collection, to: KittyItems.CollectionStoragePath)

            // create a public capability for the collection
            acct.link<&KittyItems.Collection{NonFungibleToken.CollectionPublic, KittyItems.KittyItemsCollectionPublic}>(KittyItems.CollectionPublicPath, target: KittyItems.CollectionStoragePath)
        }
    }
}
