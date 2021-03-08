import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import KittyItems from "../../contracts/KittyItems.cdc"

// This transaction configures an account to hold Kitty Items.

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&KittyItems.Collection>(from: KittyItems.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- KittyItems.createEmptyCollection()
            
            // save it to the account
            signer.save(<-collection, to: KittyItems.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&KittyItems.Collection{NonFungibleToken.CollectionPublic, KittyItems.KittyItemsCollectionPublic}>(KittyItems.CollectionPublicPath, target: KittyItems.CollectionStoragePath)
        }
    }
}
