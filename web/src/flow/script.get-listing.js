import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {expandListingKey} from "src/hooks/useListing"

const CODE = fcl.cdc`
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import NFTStorefront from 0xNFTStorefront
import KittyItems from 0xKittyItems

pub struct ListingItem {
    pub let name: String
    pub let description: String
    pub let image: String

    pub let itemID: UInt64
    pub let resourceID: UInt64
    pub let kind: KittyItems.Kind
    pub let rarity: KittyItems.Rarity
    pub let owner: Address
    pub let price: UFix64

    init(
        name: String,
        description: String,
        image: String,
        itemID: UInt64,
        resourceID: UInt64,
        kind: KittyItems.Kind,
        rarity: KittyItems.Rarity,
        owner: Address,
        price: UFix64
    ) {
        self.name = name
        self.description = description
        self.image = image

        self.itemID = itemID
        self.resourceID = resourceID
        self.kind = kind
        self.rarity = rarity
        self.owner = owner
        self.price = price
    }
}

pub fun main(address: Address, listingResourceID: UInt64): ListingItem? {
    if let storefrontRef = getAccount(address).getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath).borrow() {

        if let listing = storefrontRef.borrowListing(listingResourceID: listingResourceID) {
            
            let details = listing.getDetails()

            let itemID = details.nftID
            let itemPrice = details.salePrice
        
            if let collection = getAccount(address).getCapability<&KittyItems.Collection{NonFungibleToken.CollectionPublic, KittyItems.KittyItemsCollectionPublic}>(KittyItems.CollectionPublicPath).borrow() {
            
                if let item = collection.borrowKittyItem(id: itemID) {

                    if let view = item.resolveView(Type<MetadataViews.Display>()) {

                        let display = view as! MetadataViews.Display
                    
                        let owner: Address = item.owner!.address!

                        let ipfsThumbnail = display.thumbnail as! MetadataViews.IPFSFile     

                        return ListingItem(
                            name: display.name,
                            description: display.description,
                            image: item.imageCID(),
                            itemID: itemID,
                            resourceID: item.uuid,
                            kind: item.kind, 
                            rarity: item.rarity, 
                            owner: address,
                            price: itemPrice
                        )
                    }
                }
            }
        }
    }

    return nil
}
`

export function fetchListing(key) {
  const {address, id} = expandListingKey(key)
  if (address === null) return Promise.resolve([])

  return fcl
    .send([
      fcl.script(CODE),
      fcl.args([fcl.arg(address, t.Address), fcl.arg(Number(id), t.UInt64)]),
    ])
    .then(fcl.decode)
}
