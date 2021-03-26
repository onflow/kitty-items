import KittyItemsMarket from "../../contracts/KittyItemsMarket.cdc"

transaction(itemID: UInt64) {
    let marketCollection: &KittyItemsMarket.Collection

    prepare(signer: AuthAccount) {
        self.marketCollection = signer.borrow<&KittyItemsMarket.Collection>(from: KittyItemsMarket.CollectionStoragePath)
            ?? panic("Missing or mis-typed KittyItemsMarket Collection")
    }

    execute {
        let offer <-self.marketCollection.remove(itemID: itemID)
        destroy offer
    }
}
