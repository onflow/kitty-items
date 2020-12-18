import KittyItemsMarket from 0xKITTYMARKET
// This transaction is what an account would run
// to hold SaleOffer items.

transaction {
    prepare(acct: AuthAccount) {

        // If the account doesn't already have a collection
        if acct.borrow<&KittyItemsMarket.Collection>(from: KittyItemsMarket.CollectionStoragePath) == nil {

            // Create a new empty collection
            let collection <- KittyItemsMarket.createEmptyCollection() as! @KittyItemsMarket.Collection
            
            // save it to the account
            acct.save(<-collection, to: KittyItemsMarket.CollectionStoragePath)

            // create a public capability for the collection
            acct.link<&KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}>(KittyItemsMarket.CollectionPublicPath, target: KittyItemsMarket.CollectionStoragePath)
        }
    }
}
