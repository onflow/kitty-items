import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {expandListingKey} from "src/hooks/useListing"

const CODE = fcl.cdc`
  import NonFungibleToken from 0xNonFungibleToken
  import NFTStorefront from 0xNFTStorefront
  import KittyItems from 0xKittyItems

  pub struct SaleItem {
    pub let itemID: UInt64
    pub let typeID: UInt64
    pub let owner: Address
    pub let price: UFix64

    init(itemID: UInt64, typeID: UInt64, owner: Address, price: UFix64) {
      self.itemID = itemID
      self.typeID = typeID
      self.owner = owner
      self.price = price
    }
  }

  pub fun main(address: Address, listingResourceID: UInt64): SaleItem? {
    let account = getAccount(address)
    if let storefrontRef = account.getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath).borrow() {
      if let listing = storefrontRef.borrowListing(listingResourceID: listingResourceID) {
        let details = listing.getDetails()

        let itemID = details.nftID
        let itemPrice = details.salePrice

        if let collection = account.getCapability<&KittyItems.Collection{NonFungibleToken.CollectionPublic, KittyItems.KittyItemsCollectionPublic}>(KittyItems.CollectionPublicPath).borrow() {
          if let item = collection.borrowKittyItem(id: itemID) {
            return SaleItem(itemID: itemID, typeID: item.typeID, owner: address, price: itemPrice)
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
