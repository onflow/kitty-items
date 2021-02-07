import KittyItemsMarket from 0xKITTYMARKET

transaction(saleItemID: UInt64) {
    let marketCollection: &KittyItemsMarket.Collection

    prepare(acct: AuthAccount) {
        self.marketCollection = acct.borrow<&KittyItemsMarket.Collection>(from: KittyItemsMarket.CollectionStoragePath)
            ?? panic("Missing or mis-typed KittyItemsMarket Collection")
    }

    execute {
        let offer <-self.marketCollection.remove(saleItemID: saleItemID)
        destroy offer
    }
}