import KittyItemsMarket from 0xKITTYMARKET

// This transaction returns an array of all the nft ids fro sale in the collection

pub fun main(account: Address): [UInt64] {
    let acct = getAccount(account)
    let collectionRefself.marketCollection = getAccount(marketCollectionAddress)
         .getCapability<&KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}>(
            /public/KittyItemsMarketCollection
        )
        .borrow()
        ?? panic("Could not borrow market collection from market address")
    
    return collectionRef.getSaleOfferIDs()
}
 