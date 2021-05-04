import KittyItemsMarket from "../../contracts/KittyItemsMarket.cdc"

// This script returns an array of all the NFT IDs for sale 
// in an account's SaleOffer collection.

pub fun main(address: Address): [UInt64] {
    let marketCollectionRef = getAccount(address)
        .getCapability<&KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}>(
            KittyItemsMarket.CollectionPublicPath
        )
        .borrow()
        ?? panic("Could not borrow market collection from market address")
    
    return marketCollectionRef.getSaleOfferIDs()
}
