import KittyItemsMarket from "../../contracts/KittyItemsMarket.cdc"

transaction(saleItemId: UInt64) {
    let marketCollection: &KittyItemsMarket.Collection

    prepare(signer: AuthAccount) {
        self.marketCollection = signer.borrow<&KittyItemsMarket.Collection>(from: KittyItemsMarket.CollectionStoragePath)
            ?? panic("Missing or mis-typed KittyItemsMarket Collection")
    }

    execute {
        let offer <-self.marketCollection.remove(saleItemId: saleItemId)
        destroy offer
    }
}
