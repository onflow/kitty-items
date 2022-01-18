import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {batch} from "src/flow/util/batch"
import {expandAccountItemKey} from "src/hooks/useAccountItem"

const CODE = fcl.cdc`
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import KittyItems from 0xKittyItems

pub struct KittyItem {
  pub let name: String
  pub let description: String
  pub let image: String

  pub let itemID: UInt64
  pub let resourceID: UInt64
  pub let kind: KittyItems.Kind
  pub let rarity: KittyItems.Rarity
  pub let owner: Address

  init(
    name: String,
    description: String,
    image: String,
    itemID: UInt64,
    resourceID: UInt64,
    kind: KittyItems.Kind,
    rarity: KittyItems.Rarity,
    owner: Address,
  ) {
    self.name = name
    self.description = description
    self.image = image

    self.itemID = itemID
    self.resourceID = resourceID
    self.kind = kind
    self.rarity = rarity
    self.owner = owner
  }
}

pub fun fetch(address: Address, itemID: UInt64): KittyItem? {
  if let collection = getAccount(address).getCapability<&KittyItems.Collection{NonFungibleToken.CollectionPublic, KittyItems.KittyItemsCollectionPublic}>(KittyItems.CollectionPublicPath).borrow() {
    
    if let item = collection.borrowKittyItem(id: itemID) {

      if let view = item.resolveView(Type<MetadataViews.Display>()) {

        let display = view as! MetadataViews.Display
        
        let owner: Address = item.owner!.address!

        let ipfsThumbnail = display.thumbnail as! MetadataViews.IPFSFile     

        return KittyItem(
          name: display.name,
          description: display.description,
          image: item.imageCID(),
          itemID: itemID,
          resourceID: item.uuid,
          kind: item.kind, 
          rarity: item.rarity, 
          owner: address,
        )
      }
    }
  }

  return nil
}

pub fun main(keys: [String], addresses: [Address], ids: [UInt64]): {String: KittyItem?} {
  let r: {String: KittyItem?} = {}
  var i = 0
  while i < keys.length {
    let key = keys[i]
    let address = addresses[i]
    let id = ids[i]
    r[key] = fetch(address: address, itemID: id)
    i = i + 1
  }
  return r
}
`

const collate = px => {
  return Object.keys(px).reduce(
    (acc, key) => {
      acc.keys.push(key)
      acc.addresses.push(px[key][0])
      acc.ids.push(px[key][1])
      return acc
    },
    {keys: [], addresses: [], ids: []}
  )
}

const {enqueue} = batch("FETCH_ACCOUNT_ITEM", async px => {
  const {keys, addresses, ids} = collate(px)

  return fcl
    .send([
      fcl.script(CODE),
      fcl.args([
        fcl.arg(keys, t.Array(t.String)),
        fcl.arg(addresses, t.Array(t.Address)),
        fcl.arg(ids.map(Number), t.Array(t.UInt64)),
      ]),
    ])
    .then(fcl.decode)
})

export async function fetchAccountItem(key) {
  const {address, id} = expandAccountItemKey(key)

  if (!address) return Promise.resolve(null)
  if (!Number.isInteger(id)) return Promise.resolve(null)
  return enqueue(address, id)
}
