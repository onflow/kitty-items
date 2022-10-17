import MetadataViews from "./MetadataViews.cdc"

// NFTCatalog
//
// A general purpose NFT registry for Flow NonFungibleTokens.
//
// Each catalog entry stores data about the NFT including
// its collection identifier, nft type, storage and public paths, etc.
//
// To make an addition to the catalog you can propose an NFT and provide its metadata.
// An Admin can approve a proposal which would add the NFT to the catalog
pub contract NFTCatalog {
    // EntryAdded
    // An NFT collection has been added to the catalog
    pub event EntryAdded(
        collectionIdentifier : String,
        contractName : String,
        contractAddress : Address,
        nftType : Type,
        storagePath: StoragePath,
        publicPath: PublicPath,
        privatePath: PrivatePath,
        publicLinkedType : Type,
        privateLinkedType : Type,
        displayName : String,
        description: String,
        externalURL : String
    )

    // EntryUpdated
    // An NFT Collection has been updated in the catalog
    pub event EntryUpdated(
        collectionIdentifier : String,
        contractName : String,
        contractAddress : Address,
        nftType : Type,
        storagePath: StoragePath,
        publicPath: PublicPath,
        privatePath: PrivatePath,
        publicLinkedType : Type,
        privateLinkedType : Type,
        displayName : String,
        description: String,
        externalURL : String
    )

    // EntryRemoved
    // An NFT Collection has been removed from the catalog
    pub event EntryRemoved(collectionIdentifier : String)

    // ProposalEntryAdded
    // A new proposal to make an addtion to the catalog has been made
    pub event ProposalEntryAdded(proposalID : UInt64, collectionIdentifier : String, message: String, status: String, proposer : Address)

    // ProposalEntryUpdated
    // A proposal has been updated
    pub event ProposalEntryUpdated(proposalID : UInt64, collectionIdentifier : String, message: String, status: String, proposer : Address)

    // ProposalEntryRemoved
    // A proposal has been removed from storage
    pub event ProposalEntryRemoved(proposalID : UInt64)

    pub let ProposalManagerStoragePath: StoragePath

    pub let ProposalManagerPublicPath: PublicPath

    access(self) let catalog: {String : NFTCatalog.NFTCatalogMetadata} // { collectionIdentifier -> Metadata }
    access(self) let catalogTypeData: {String : {String : Bool}} // Additional view to go from { NFT Type Identifier -> {Collection Identifier : Bool } }
    access(self) let catalogProposals : {UInt64 : NFTCatalogProposal} // { ProposalID : Metadata }
    access(self) var totalProposals : UInt64

    // NFTCatalogProposalManager
    // Used to authenticate proposals made to the catalog
    pub resource interface NFTCatalogProposalManagerPublic {
        pub fun getCurrentProposalEntry(): String?
    }
    pub resource NFTCatalogProposalManager : NFTCatalogProposalManagerPublic {
            access(self) var currentProposalEntry: String?

            pub fun getCurrentProposalEntry(): String? {
                return self.currentProposalEntry
            }

            pub fun setCurrentProposalEntry(identifier: String?) {
                self.currentProposalEntry = identifier
            }

            init () {
                self.currentProposalEntry = nil
            }
    }

    // NFTCollectionData
    // Represents information about an NFT collection resource
    // Note: Not suing the struct from Metadata standard due to
    // inability to store functions
    pub struct NFTCollectionData {

        pub let storagePath : StoragePath
        pub let publicPath : PublicPath
        pub let privatePath: PrivatePath
        pub let publicLinkedType: Type
        pub let privateLinkedType: Type

        init(
            storagePath : StoragePath,
            publicPath : PublicPath,
            privatePath : PrivatePath,
            publicLinkedType : Type,
            privateLinkedType : Type
        ) {
            self.storagePath = storagePath
            self.publicPath = publicPath
            self.privatePath = privatePath
            self.publicLinkedType = publicLinkedType
            self.privateLinkedType = privateLinkedType
        }
    }

    // NFTCatalogMetadata
    // Represents data about an NFT
    pub struct NFTCatalogMetadata {
        pub let contractName : String
        pub let contractAddress : Address
        pub let nftType: Type
        pub let collectionData: NFTCollectionData
        pub let collectionDisplay: MetadataViews.NFTCollectionDisplay

        init (contractName : String, contractAddress : Address, nftType: Type, collectionData : NFTCollectionData, collectionDisplay : MetadataViews.NFTCollectionDisplay) {
            self.contractName = contractName
            self.contractAddress = contractAddress
            self.nftType = nftType
            self.collectionData = collectionData
            self.collectionDisplay = collectionDisplay
        }
    }

    // NFTCatalogProposal
    // Represents a proposal to the catalog
    // Includes data about an NFT
    pub struct NFTCatalogProposal {
        pub let collectionIdentifier : String
        pub let metadata : NFTCatalogMetadata
        pub let message : String
        pub let status : String
        pub let proposer : Address
        pub let createdTime : UFix64

        init(collectionIdentifier : String, metadata : NFTCatalogMetadata, message : String, status : String, proposer : Address) {
            self.collectionIdentifier = collectionIdentifier
            self.metadata = metadata
            self.message = message
            self.status = status
            self.proposer = proposer
            self.createdTime = getCurrentBlock().timestamp
        }
    }

    pub fun getCatalog() : {String : NFTCatalogMetadata} {
        return self.catalog
    }

    pub fun getCatalogEntry(collectionIdentifier : String) : NFTCatalogMetadata? {
        return self.catalog[collectionIdentifier]
    }

    pub fun getCollectionsForType(nftTypeIdentifier: String) : {String : Bool}? {
        return self.catalogTypeData[nftTypeIdentifier]
    }

    pub fun getCatalogTypeData() : {String : {String : Bool}} {
        return self.catalogTypeData
    }

    // Propose an NFT collection to the catalog
    // @param collectionIdentifier: The unique name assinged to this nft collection
    // @param metadata: The Metadata for the NFT collection that will be stored in the catalog
    // @param message: A message to the catalog owners
    // @param proposer: Who is making the proposition(the address needs to be verified)
    pub fun proposeNFTMetadata(collectionIdentifier : String, metadata : NFTCatalogMetadata, message : String, proposer : Address) : UInt64 {
        let proposerManagerCap = getAccount(proposer).getCapability<&NFTCatalogProposalManager{NFTCatalog.NFTCatalogProposalManagerPublic}>(NFTCatalog.ProposalManagerPublicPath)

        assert(proposerManagerCap.check(), message : "Proposer needs to set up a manager")

        let proposerManagerRef = proposerManagerCap.borrow()!

        assert(proposerManagerRef.getCurrentProposalEntry()! == collectionIdentifier, message: "Expected proposal entry does not match entry for the proposer")

        let catalogProposal = NFTCatalogProposal(collectionIdentifier : collectionIdentifier, metadata : metadata, message : message, status: "IN_REVIEW", proposer: proposer)
        self.totalProposals = self.totalProposals + 1
        self.catalogProposals[self.totalProposals] = catalogProposal

        emit ProposalEntryAdded(proposalID : self.totalProposals, collectionIdentifier : collectionIdentifier, message: catalogProposal.message, status: catalogProposal.status, proposer: catalogProposal.proposer)
        return self.totalProposals
    }

    // Withdraw a proposal from the catalog
    // @param proposalID: The ID of proposal you want to withdraw
    pub fun withdrawNFTProposal(proposalID : UInt64) {
        pre {
            self.catalogProposals[proposalID] != nil : "Invalid Proposal ID"
        }
        let proposal = self.catalogProposals[proposalID]!
        let proposer = proposal.proposer

        let proposerManagerCap = getAccount(proposer).getCapability<&NFTCatalogProposalManager{NFTCatalog.NFTCatalogProposalManagerPublic}>(NFTCatalog.ProposalManagerPublicPath)

        assert(proposerManagerCap.check(), message : "Proposer needs to set up a manager")

        let proposerManagerRef = proposerManagerCap.borrow()!

        assert(proposerManagerRef.getCurrentProposalEntry()! == proposal.collectionIdentifier, message: "Expected proposal entry does not match entry for the proposer")

        self.removeCatalogProposal(proposalID : proposalID)
    }

    pub fun getCatalogProposals() : {UInt64 : NFTCatalogProposal} {
        return self.catalogProposals
    }

    pub fun getCatalogProposalEntry(proposalID : UInt64) : NFTCatalogProposal? {
        return self.catalogProposals[proposalID]
    }

    pub fun createNFTCatalogProposalManager(): @NFTCatalogProposalManager {
        return <-create NFTCatalogProposalManager()
    }

    // NOTE: Made pub for testing.
    pub fun addCatalogEntry(collectionIdentifier : String, metadata: NFTCatalogMetadata) {
        pre {
            self.catalog[collectionIdentifier] == nil : "The nft name has already been added to the catalog"
        }

        self.addCatalogTypeEntry(collectionIdentifier : collectionIdentifier , metadata: metadata)

        self.catalog[collectionIdentifier] = metadata

        emit EntryAdded(
            collectionIdentifier : collectionIdentifier,
            contractName : metadata.contractName,
            contractAddress : metadata.contractAddress,
            nftType: metadata.nftType,
            storagePath: metadata.collectionData.storagePath,
            publicPath: metadata.collectionData.publicPath,
            privatePath: metadata.collectionData.privatePath,
            publicLinkedType : metadata.collectionData.publicLinkedType,
            privateLinkedType : metadata.collectionData.privateLinkedType,
            displayName : metadata.collectionDisplay.name,
            description: metadata.collectionDisplay.description,
            externalURL : metadata.collectionDisplay.externalURL.url
        )
    }

    access(account) fun updateCatalogEntry(collectionIdentifier : String , metadata: NFTCatalogMetadata) {
        pre {
            self.catalog[collectionIdentifier] != nil : "Invalid collection identifier"
        }
        // remove previous nft type entry
        self.removeCatalogTypeEntry(collectionIdentifier : collectionIdentifier , metadata: metadata)
        // add updated nft type entry
        self.addCatalogTypeEntry(collectionIdentifier : collectionIdentifier , metadata: metadata)

        self.catalog[collectionIdentifier] = metadata

        let nftType = metadata.nftType

        emit EntryUpdated(
            collectionIdentifier : collectionIdentifier,
            contractName : metadata.contractName,
            contractAddress : metadata.contractAddress,
            nftType: metadata.nftType,
            storagePath: metadata.collectionData.storagePath,
            publicPath: metadata.collectionData.publicPath,
            privatePath: metadata.collectionData.privatePath,
            publicLinkedType : metadata.collectionData.publicLinkedType,
            privateLinkedType : metadata.collectionData.privateLinkedType,
            displayName : metadata.collectionDisplay.name,
            description: metadata.collectionDisplay.description,
            externalURL : metadata.collectionDisplay.externalURL.url
        )
    }

    access(account) fun removeCatalogEntry(collectionIdentifier : String) {
        pre {
            self.catalog[collectionIdentifier] != nil : "Invalid collection identifier"
        }

        self.removeCatalogTypeEntry(collectionIdentifier : collectionIdentifier , metadata: self.catalog[collectionIdentifier]!)
        self.catalog.remove(key: collectionIdentifier)

        emit EntryRemoved(collectionIdentifier : collectionIdentifier)
    }

    access(account) fun updateCatalogProposal(proposalID: UInt64, proposalMetadata : NFTCatalogProposal) {
        self.catalogProposals[proposalID] = proposalMetadata

        emit ProposalEntryUpdated(proposalID : proposalID, collectionIdentifier : proposalMetadata.collectionIdentifier, message: proposalMetadata.message, status: proposalMetadata.status, proposer: proposalMetadata.proposer)
    }

    access(account) fun removeCatalogProposal(proposalID : UInt64) {
        self.catalogProposals.remove(key : proposalID)

        emit ProposalEntryRemoved(proposalID : proposalID)
    }

    access(contract) fun addCatalogTypeEntry(collectionIdentifier : String , metadata: NFTCatalogMetadata) {
        if self.catalogTypeData[metadata.nftType.identifier] != nil {
            let typeData : {String : Bool} = self.catalogTypeData[metadata.nftType.identifier]!
            assert(self.catalogTypeData[metadata.nftType.identifier]![collectionIdentifier] == nil, message : "The nft name has already been added to the catalog")
            typeData[collectionIdentifier] = true
            self.catalogTypeData[metadata.nftType.identifier] = typeData
        } else {
            let typeData : {String : Bool} = {}
            typeData[collectionIdentifier] = true
            self.catalogTypeData[metadata.nftType.identifier] = typeData
        }
    }

    access(contract) fun removeCatalogTypeEntry(collectionIdentifier : String , metadata: NFTCatalogMetadata) {
        let prevMetadata = self.catalog[collectionIdentifier]!
        let prevCollectionsForType = self.catalogTypeData[prevMetadata.nftType.identifier]!
        prevCollectionsForType.remove(key : collectionIdentifier)
        if prevCollectionsForType.length == 0 {
            self.catalogTypeData.remove(key: prevMetadata.nftType.identifier)
        } else {
            self.catalogTypeData[prevMetadata.nftType.identifier] = prevCollectionsForType
        }
    }

    init() {
        self.ProposalManagerStoragePath = /storage/nftCatalogProposalManager
        self.ProposalManagerPublicPath = /public/nftCatalogProposalManager

        self.totalProposals = 0
        self.catalog = {}
        self.catalogTypeData = {}

        self.catalogProposals = {}
    }

}