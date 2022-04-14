import NonFungibleToken from "./NonFungibleToken.cdc"
import MetadataViews from "./MetadataViews.cdc"

pub contract KittyItems: NonFungibleToken {

    // Events
    //
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event Minted(id: UInt64, kind: UInt8, rarity: UInt8)
    pub event ImagesAddedForNewKind(kind: UInt8)

    // Named Paths
    //
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    // totalSupply
    // The total number of KittyItems that have been minted
    //
    pub var totalSupply: UInt64

    pub enum Rarity: UInt8 {
        pub case blue
        pub case green
        pub case purple
        pub case gold
    }

    pub fun rarityToString(_ rarity: Rarity): String {
        switch rarity {
            case Rarity.blue:
                return "Blue"
            case Rarity.green:
                return "Green"
            case Rarity.purple:
                return "Purple"
            case Rarity.gold:
                return "Gold"
        }

        return ""
    }

    pub enum Kind: UInt8 {
        pub case fishbowl
        pub case fishhat
        pub case milkshake
        pub case tuktuk
        pub case skateboard
    }

    pub fun kindToString(_ kind: Kind): String {
        switch kind {
            case Kind.fishbowl:
                return "Fishbowl"
            case Kind.fishhat:
                return "Fish Hat"
            case Kind.milkshake:
                return "Milkshake"
            case Kind.tuktuk:
                return "Tuk-Tuk"
            case Kind.skateboard:
                return "Skateboard"
        }

        return ""
    }

    // Mapping from item (kind, rarity) -> IPFS image CID
    //
    access(self) var images: {Kind: {Rarity: String}}

    // Mapping from rarity -> price
    //
    access(self) var itemRarityPriceMap: {Rarity: UFix64}

    // Return the initial sale price for an item of this rarity.
    //
    pub fun getItemPrice(rarity: Rarity): UFix64 {
        return self.itemRarityPriceMap[rarity]!
    }
    
    // A Kitty Item as an NFT
    //
    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {

        pub let id: UInt64

        // The token kind (e.g. Fishbowl)
        pub let kind: Kind

        // The token rarity (e.g. Gold)
        pub let rarity: Rarity

        init(id: UInt64, kind: Kind, rarity: Rarity) {
            self.id = id
            self.kind = kind
            self.rarity = rarity
        }

        pub fun name(): String {
            return KittyItems.rarityToString(self.rarity)
                .concat(" ")
                .concat(KittyItems.kindToString(self.kind))
        }

        pub fun description(): String {
            return "A "
                .concat(KittyItems.rarityToString(self.rarity).toLower())
                .concat(" ")
                .concat(KittyItems.kindToString(self.kind).toLower())
                .concat(" with serial number ")
                .concat(self.id.toString())
        }

        pub fun imageCID(): String {
            return KittyItems.images[self.kind]![self.rarity]!
        }

        pub fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>()
            ]
        }

        pub fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.name(),
                        description: self.description(),
                        thumbnail: MetadataViews.IPFSFile(
                            cid: self.imageCID(), 
                            path: "sm.png"
                        )
                    )
            }

            return nil
        }
    }

    // This is the interface that users can cast their KittyItems Collection as
    // to allow others to deposit KittyItems into their Collection. It also allows for reading
    // the details of KittyItems in the Collection.
    pub resource interface KittyItemsCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowKittyItem(id: UInt64): &KittyItems.NFT? {
            // If the result isn't nil, the id of the returned reference
            // should be the same as the argument to the function
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow KittyItem reference: The ID of the returned reference is incorrect"
            }
        }
    }

    // Collection
    // A collection of KittyItem NFTs owned by an account
    //
    pub resource Collection: KittyItemsCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an `UInt64` ID field
        //
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        // withdraw
        // Removes an NFT from the collection and moves it to the caller
        //
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        // deposit
        // Takes a NFT and adds it to the collections dictionary
        // and adds the ID to the id array
        //
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @KittyItems.NFT

            let id: UInt64 = token.id

            // add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        // getIDs
        // Returns an array of the IDs that are in the collection
        //
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        // borrowNFT
        // Gets a reference to an NFT in the collection
        // so that the caller can read its metadata and call its methods
        //
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return &self.ownedNFTs[id] as &NonFungibleToken.NFT
        }

        // borrowKittyItem
        // Gets a reference to an NFT in the collection as a KittyItem,
        // exposing all of its fields (including the typeID & rarityID).
        // This is safe as there are no functions that can be called on the KittyItem.
        //
        pub fun borrowKittyItem(id: UInt64): &KittyItems.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT
                return ref as! &KittyItems.NFT
            } else {
                return nil
            }
        }

        // destructor
        destroy() {
            destroy self.ownedNFTs
        }

        // initializer
        //
        init () {
            self.ownedNFTs <- {}
        }
    }

    // createEmptyCollection
    // public function that anyone can call to create a new empty collection
    //
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    // NFTMinter
    // Resource that an admin or something similar would own to be
    // able to mint new NFTs
    //
    pub resource NFTMinter {

        // mintNFT
        // Mints a new NFT with a new ID
        // and deposit it in the recipients collection using their collection reference
        //
        pub fun mintNFT(
            recipient: &{NonFungibleToken.CollectionPublic}, 
            kind: Kind, 
            rarity: Rarity,
        ) {
            // deposit it in the recipient's account using their reference
            recipient.deposit(token: <-create KittyItems.NFT(id: KittyItems.totalSupply, kind: kind, rarity: rarity))

            emit Minted(
                id: KittyItems.totalSupply,
                kind: kind.rawValue,
                rarity: rarity.rawValue,
            )

            KittyItems.totalSupply = KittyItems.totalSupply + (1 as UInt64)
        }

        // Update NFT images for new type
        pub fun addNewImagesForKind(from: AuthAccount, newImages: {Kind: {Rarity: String}}) {
            let kindValue = KittyItems.images.containsKey(newImages.keys[0]) 
            if(!kindValue) {
                KittyItems.images.insert(key: newImages.keys[0], newImages.values[0])
                emit ImagesAddedForNewKind(
                    kind: newImages.keys[0].rawValue,
                )
            } else {
                panic("No Rugs... Can't update existing NFT images.")
            }
        }
    }

    // fetch
    // Get a reference to a KittyItem from an account's Collection, if available.
    // If an account does not have a KittyItems.Collection, panic.
    // If it has a collection but does not contain the itemID, return nil.
    // If it has a collection and that collection contains the itemID, return a reference to that.
    //
    pub fun fetch(_ from: Address, itemID: UInt64): &KittyItems.NFT? {
        let collection = getAccount(from)
            .getCapability(KittyItems.CollectionPublicPath)!
            .borrow<&KittyItems.Collection{KittyItems.KittyItemsCollectionPublic}>()
            ?? panic("Couldn't get collection")
        // We trust KittyItems.Collection.borowKittyItem to get the correct itemID
        // (it checks it before returning it).
        return collection.borrowKittyItem(id: itemID)
    }

    // initializer
    //
    init() {
        // set rarity price mapping
        self.itemRarityPriceMap = {
            Rarity.gold: 125.0,
            Rarity.purple: 25.0,
            Rarity.green: 5.0,
            Rarity.blue: 1.0
        }

        self.images = {
            Kind.fishbowl: {
                Rarity.blue: "bafybeibuqzhuoj6ychlckjn6cgfb5zfurggs2x7pvvzjtdcmvizu2fg6ga",
                Rarity.green: "bafybeihbminj62owneu3fjhtqm7ghs7q2rastna6srqtysqmjcsicmn7oa",
                Rarity.purple: "bafybeiaoja3gyoot4f5yxs4b7tucgaoj3kutu7sxupacddxeibod5hkw7m",
                Rarity.gold: "bafybeid73gt3qduwn2hhyy4wzhsvt6ahzmutiwosfd3f6t5el6yjqqxd3u"
            },
            Kind.fishhat: {
                Rarity.blue: "bafybeigu4ihzm7ujgpjfn24zut6ldrn7buzwqem27ncqupdovm3uv4h4oy",
                Rarity.green: "bafybeih6eaczohx3ibv22bh2fsdalc46qaqty6qapums6zhelxet2gfc24",
                Rarity.purple: "bafybeifbhcez3v5dj5qgndrx73twqleajz7r2mog4exd7abs3aof7w3hhe",
                Rarity.gold: "bafybeid2r5q3vfrsluv7iaelqobkihfopw5t4sv4z2llxsoe3xqfynl73u"
            },
            Kind.milkshake: {
                Rarity.blue: "bafybeialhf5ga6owaygebp6xt4vdybc7aowatrscwlwmxd444fvwyhcskq",
                Rarity.green: "bafybeihjy4rcbvnw6bcz3zbirq5u454aagnyzjhlrffgkc25wgdcw4csoe",
                Rarity.purple: "bafybeidbua4rigbcpwutpkqvd7spppvxemwn6o2ifhq6xam4sqlngzrfiq",
                Rarity.gold: "bafybeigdrwjq4kge3bym2rbnek2olibdt5uvdbtnuwto36jb36cr3c4p5y"
            },
            Kind.tuktuk: {
                Rarity.blue: "bafybeidjalsqnhj2jnisxucv6chlrfwtcrqyu2n6lpx3zpuuv2o3d3nwce",
                Rarity.green: "bafybeiaeixpd4htnngycs7ebktdt6crztvhyiu2js4nwvuot35gzvszchi",
                Rarity.purple: "bafybeihfcumxiobjullha23ov77wgd5cv5uqrebkik6y33ctr5tkt4eh2e",
                Rarity.gold: "bafybeigdi6ableh5mvvrqdil233ucxip7cm3z4kpnpxhutfdncwhyl22my"
            },
            Kind.skateboard: {
                Rarity.blue: "bafybeic55lpwfvucmgibbvaury3rpeoxmcgyqra3vdhjwp74wqzj6oqvpq",
                Rarity.green: "bafybeic55lpwfvucmgibbvaury3rpeoxmcgyqra3vdhjwp74wqzj6oqvpq",
                Rarity.purple: "bafybeiepqu75oknv2vertl5nbq7gqyac5tbpekqcfy73lyk2rcjgz7irpu",
                Rarity.gold: "bafybeic5ehqovuhix4lyspxfawlegkrkp6aaloszyscmjvmjzsbxqm6s2i"
            }
        }

        // Set our named paths
        self.CollectionStoragePath = /storage/kittyItemsCollectionV10
        self.CollectionPublicPath = /public/kittyItemsCollectionV10
        self.MinterStoragePath = /storage/kittyItemsMinterV10

        // Initialize the total supply
        self.totalSupply = 0

        // Create a Minter resource and save it to storage
        let minter <- create NFTMinter()
        self.account.save(<-minter, to: self.MinterStoragePath)

        emit ContractInitialized()
    }
}
