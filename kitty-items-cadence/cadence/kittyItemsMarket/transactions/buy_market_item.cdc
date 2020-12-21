import FungibleToken from 0xFUNGIBLETOKENADDRESS
import NonFungibleToken from 0xNONFUNGIBLETOKEN
import Kibble from 0xKIBBLE
import KittyItems from 0xKITTYITEMS
import KittyItemsMarket from 0xKITTYMARKET

transaction(saleItemID: UInt64, marketCollectionAddress: Address) {
    let paymentVault: @FungibleToken.Vault
    let kittyItemsCollection: &KittyItems.Collection{NonFungibleToken.Receiver}
    let marketCollection: &KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}

    prepare(acct: AuthAccount) {
        self.marketCollection = getAccount(marketCollectionAddress)
            .getCapability<&KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}>(
                KittyItemsMarket.CollectionPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow market collection from market address")

        let price = self.marketCollection.borrowSaleItem(saleItemID: saleItemID).salePrice

        let mainKibbleVault = acct.borrow<&Kibble.Vault>(from: Kibble.VaultStoragePath)
            ?? panic("Cannot borrow Kibble vault from acct storage")
        self.paymentVault <- mainKibbleVault.withdraw(amount: price)

        self.kittyItemsCollection = acct.borrow<&KittyItems.Collection{NonFungibleToken.Receiver}>(
            from: KittyItems.CollectionStoragePath
        ) ?? panic("Cannot borrow KittyItems collection receiver from acct")
    }

    execute {
        self.marketCollection.purchase(
            saleItemID: saleItemID,
            buyerCollection: self.kittyItemsCollection,
            buyerPayment: <- self.paymentVault
        )
    }
}