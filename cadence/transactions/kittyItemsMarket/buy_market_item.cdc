import FungibleToken from "../../contracts/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import Kibble from "../../contracts/Kibble.cdc"
import KittyItems from "../../contracts/KittyItems.cdc"
import KittyItemsMarket from "../../contracts/KittyItemsMarket.cdc"

transaction(itemID: UInt64, marketCollectionAddress: Address) {
    let paymentVault: @FungibleToken.Vault
    let kittyItemsCollection: &KittyItems.Collection{NonFungibleToken.Receiver}
    let marketCollection: &KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}

    prepare(signer: AuthAccount) {
        self.marketCollection = getAccount(marketCollectionAddress)
            .getCapability<&KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}>(
                KittyItemsMarket.CollectionPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow market collection from market address")

        let saleItem = self.marketCollection.borrowSaleItem(itemID: itemID)
                    ?? panic("No item with that ID")
        let price = saleItem.price

        let mainKibbleVault = signer.borrow<&Kibble.Vault>(from: Kibble.VaultStoragePath)
            ?? panic("Cannot borrow Kibble vault from acct storage")
        self.paymentVault <- mainKibbleVault.withdraw(amount: price)

        self.kittyItemsCollection = signer.borrow<&KittyItems.Collection{NonFungibleToken.Receiver}>(
            from: KittyItems.CollectionStoragePath
        ) ?? panic("Cannot borrow KittyItems collection receiver from acct")
    }

    execute {
        self.marketCollection.purchase(
            itemID: itemID,
            buyerCollection: self.kittyItemsCollection,
            buyerPayment: <- self.paymentVault
        )
    }
}
