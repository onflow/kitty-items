import FungibleToken from 0xFUNGIBLETOKENADDRESS
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import Kibble from 0xKIBBLE
import KittyItems from 0xKITTYITEMS
import KittyItemsMarket from 0xKITTYMARKET

transaction(saleItemID: UInt64, saleItemPrice: UFix64) {
    let kibbleVault: Capability<&Kibble.Vault{FungibleToken.Receiver}>
    let kittyItemsCollection: Capability<&KittyItems.Collection{NonFungibleToken.Provider}>
    let marketCollection: &KittyItemsMarket.Collection

    prepare(acct: AuthAccount) {

        self.kibbleVault = acct.getCapability<&Kibble.Vault{FungibleToken.Receiver}>(/public/KibbleReceiver)
        assert(self.kibbleVault.borrow() != nil, message: "Missing or mis-typed Kibble receiver")

        self.kittyItemsCollection = acct.getCapability<&KittyItems.Collection{NonFungibleToken.Provider}>(/private/KittyItemsCollectionProvider)
        assert(self.kittyItemsCollection.borrow() != nil, message: "Missing or mis-typed KittyItemsCollection provider")

        self.marketCollection = acct.borrow<&KittyItemsMarket.Collection>(from: /storage/KittyItemsMarketCollection)
            ?? panic("Missing or mis-typed  KittyItemsMarket Collection")

    }

    execute {
        let offer <- KittyItemsMarket.createSaleOffer (
            sellerItemProvider: self.kittyItemsCollection,
            saleItemID: saleItemID,
            sellerPaymentReceiver: self.kibbleVault,
            salePrice: saleItemPrice
        )
        self.marketCollection.insert(offer: <-offer)
    }
}