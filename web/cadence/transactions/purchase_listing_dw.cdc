import KittyItems from 0xKittyItems
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0x631e88ae7f1d7c20
import DapperUtilityCoin from 0xDapperUtilityCoin
import FungibleToken from 0xFungibleToken
import NFTStorefront from 0xNFTStorefront
import FungibleToken from 0xFungibleToken
transaction(storefrontAddress: Address, listingResourceID: UInt64,  expectedPrice: UFix64, commissionRecipient: Address?) {
    let paymentVault: @FungibleToken.Vault
    let nftCollection: &KittyItems.Collection{KittyItems.KittyItemsCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}
    let storefront: &NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}
    let listing: &NFTStorefrontV2.Listing{NFTStorefrontV2.ListingPublic}
    let salePrice: UFix64
    let balanceBeforeTransfer: UFix64
    let mainUtilityCoinVault: &DapperUtilityCoin.Vault
    var commissionRecipientCap: Capability<&{FungibleToken.Receiver}>?

    prepare(dapper: AuthAccount, buyer: AuthAccount) {
        self.commissionRecipientCap = nil
        
        // Initialize the buyer's collection if they do not already have one
        if buyer.borrow<&KittyItems.Collection>(from: /storage/kittyItemsCollectionV14) == nil {
            let collection <- KittyItems.createEmptyCollection() as! @KittyItems.Collection
            buyer.save(<-collection, to: /storage/kittyItemsCollectionV14)
        }

        if (buyer.getCapability<&KittyItems.Collection{KittyItems.KittyItemsCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(/public/KittyItemsCollection).borrow() == nil) {
            buyer.unlink(/public/KittyItemsCollection)
            buyer.link<&KittyItems.Collection{KittyItems.KittyItemsCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(/public/KittyItemsCollection, target: /storage/kittyItemsCollectionV14)
        }

        if (buyer.getCapability<&KittyItems.Collection{ufcInt_NFT.ufcInt_NFTCollectionPublic,NonFungibleToken.Provider,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(/private/kittyItemsCollectionProviderV14).borrow() == nil) {
            buyer.unlink(/private/kittyItemsCollectionProviderV14)
            buyer.link<&ufcInt_NFT.Collection{KittyItems.KittyItemsCollectionPublic,NonFungibleToken.Provider,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(/private/kittyItemsCollectionProviderV14, target: /storage/kittyItemsCollectionV14)
        }

        // Get the storefront reference from the seller
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(
                NFTStorefrontV2.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")

        // Get the listing by ID from the storefront
        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID)
            ?? panic("No Offer with that ID in Storefront")
        self.salePrice = self.listing.getDetails().salePrice

        // Get a vault from Dapper's account
        self.mainUtilityCoinVault = dapper.borrow<&DapperUtilityCoin.Vault>(from: /storage/dapperUtilityCoinVault)
            ?? panic("Cannot borrow UtilityCoin vault from account storage")
        self.balanceBeforeTransfer = self.mainUtilityCoinVault.balance
        self.paymentVault <- self.mainUtilityCoinVault.withdraw(amount: self.salePrice)

        // Get the collection from the buyer so the NFT can be deposited into it
        self.nftCollection = buyer.borrow<&KittyItems.Collection{KittyItems.KittyItemsCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(
            from: /storage/kittyItemsCollectionV14
        ) ?? panic("Cannot borrow NFT collection receiver from account")

         // Fetch the commission amt.
        let commissionAmount = self.listing.getDetails().commissionAmount

        if commissionRecipient != nil && commissionAmount != 0.0 {
            // Access the capability to receive the commission.
            let _commissionRecipientCap = getAccount(commissionRecipient!).getCapability<&{FungibleToken.Receiver}>(/public/dapperUtilityCoinReceiver)
            assert(_commissionRecipientCap.check(), message: "Commission Recipient doesn't have flowtoken receiving capability")
            self.commissionRecipientCap = _commissionRecipientCap
        } else if commissionAmount == 0.0 {
            self.commissionRecipientCap = nil
        } else {
            panic("Commission recipient can not be empty when commission amount is non zero")
        }
    }

    // Check that the price is right
    pre {
        self.salePrice == expectedPrice: "unexpected price"
    }

    execute {
        let item <- self.listing.purchase(
            payment: <-self.paymentVault,
            commissionRecipient: self.commissionRecipientCap
        )

        self.nftCollection.deposit(token: <-item)
    }

    // Check that all utilityCoin was routed back to Dapper
    post {
        self.mainUtilityCoinVault.balance == self.balanceBeforeTransfer: "UtilityCoin leakage"
    }
}
