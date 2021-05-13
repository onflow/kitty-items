import FungibleToken from "../../contracts/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import Kibble from "../../contracts/Kibble.cdc"
import KittyItems from "../../contracts/KittyItems.cdc"
import KittyItemsMarket from "../../contracts/KittyItemsMarket.cdc"

transaction(itemID: UInt64, price: UFix64) {
    let kibbleVault: Capability<&Kibble.Vault{FungibleToken.Receiver}>
    let kittyItemsCollection: Capability<&KittyItems.Collection{NonFungibleToken.Provider, KittyItems.KittyItemsCollectionPublic}>
    let marketCollection: &KittyItemsMarket.Collection

    prepare(signer: AuthAccount) {
        // we need a provider capability, but one is not provided by default so we create one.
        let KittyItemsCollectionProviderPrivatePath = /private/kittyItemsCollectionProvider

        self.kibbleVault = signer.getCapability<&Kibble.Vault{FungibleToken.Receiver}>(Kibble.ReceiverPublicPath)!
        assert(self.kibbleVault.borrow() != nil, message: "Missing or mis-typed Kibble receiver")

        if !signer.getCapability<&KittyItems.Collection{NonFungibleToken.Provider, KittyItems.KittyItemsCollectionPublic}>(KittyItemsCollectionProviderPrivatePath)!.check() {
            signer.link<&KittyItems.Collection{NonFungibleToken.Provider, KittyItems.KittyItemsCollectionPublic}>(KittyItemsCollectionProviderPrivatePath, target: KittyItems.CollectionStoragePath)
        }

        self.kittyItemsCollection = signer.getCapability<&KittyItems.Collection{NonFungibleToken.Provider, KittyItems.KittyItemsCollectionPublic}>(KittyItemsCollectionProviderPrivatePath)!
        assert(self.kittyItemsCollection.borrow() != nil, message: "Missing or mis-typed KittyItemsCollection provider")

        self.marketCollection = signer.borrow<&KittyItemsMarket.Collection>(from: KittyItemsMarket.CollectionStoragePath)
            ?? panic("Missing or mis-typed KittyItemsMarket Collection")
    }

    execute {
        let offer <- KittyItemsMarket.createSaleOffer (
            sellerItemProvider: self.kittyItemsCollection,
            itemID: itemID,
            typeID: self.kittyItemsCollection.borrow()!.borrowKittyItem(id: itemID)!.typeID,
            sellerPaymentReceiver: self.kibbleVault,
            price: price
        )
        self.marketCollection.insert(offer: <-offer)
    }
}
