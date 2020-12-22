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
        // We need a provider capability, but one is not provided by default so we create one.
        let KittyItemsCollectionProviderPrivatePath = /private/KittyItemsCollectionProvider

        self.kibbleVault = acct.getCapability<&Kibble.Vault{FungibleToken.Receiver}>(Kibble.ReceiverPublicPath)!
        assert(self.kibbleVault.borrow() != nil, message: "Missing or mis-typed Kibble receiver")

        if !acct.getCapability<&KittyItems.Collection{NonFungibleToken.Provider}>(KittyItemsCollectionProviderPrivatePath)!.check() {
            acct.link<&KittyItems.Collection{NonFungibleToken.Provider}>(KittyItemsCollectionProviderPrivatePath, target: KittyItems.CollectionStoragePath)
        }

        self.kittyItemsCollection = acct.getCapability<&KittyItems.Collection{NonFungibleToken.Provider}>(KittyItemsCollectionProviderPrivatePath)!
        assert(self.kittyItemsCollection.borrow() != nil, message: "Missing or mis-typed KittyItemsCollection provider")

        self.marketCollection = acct.borrow<&KittyItemsMarket.Collection>(from: KittyItemsMarket.CollectionStoragePath)
            ?? panic("Missing or mis-typed KittyItemsMarket Collection")
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