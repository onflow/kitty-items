import KittyItemsMarket from 0xKITTYMARKET

// This transaction gets the length of an account's nft collection

pub fun main(account: Address): Int {
    let acct = getAccount(account)
    let marketCollectionRef = getAccount(marketCollectionAddress)
        .getCapability<&KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}>(
             KittyItemsMarket.CollectionPublicPath
        )
        .borrow()
        ?? panic("Could not borrow market collection from market address")
    
    return marketCollectionRef.getSaleOfferIDs().length
}
 