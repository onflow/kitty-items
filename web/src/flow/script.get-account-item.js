import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {batch} from "src/flow/util/batch"
import {expandAccountItemKey} from "src/hooks/useAccountItem"

const CODE = fcl.cdc`
import NonFungibleToken from 0xNonFungibleToken
import KittyItems from 0xKittyItems

pub struct AccountItem {
  pub let itemID: UInt64
  pub let kind: KittyItems.Kind
  pub let rarity: KittyItems.Rarity
  pub let owner: Address

  init(
    itemID: UInt64,
    kind: KittyItems.Kind,
    rarity: KittyItems.Rarity,
    owner: Address,
  ) {
    self.itemID = itemID
    self.kind = kind
    self.rarity = rarity
    self.owner = owner
  }
}

pub fun fetch(address: Address, id: UInt64): AccountItem? {
  if let col = getAccount(address).getCapability<&KittyItems.Collection{NonFungibleToken.CollectionPublic, KittyItems.KittyItemsCollectionPublic}>(KittyItems.CollectionPublicPath).borrow() {
    if let item = col.borrowKittyItem(id: id) {
      return AccountItem(
        itemID: id,
        kind: item.kind,
        rarity: item.rarity,
        owner: address,
      )
    }
  }

  return nil
}

pub fun main(keys: [String], addresses: [Address], ids: [UInt64]): {String: AccountItem?} {
  let r: {String: AccountItem?} = {}
  var i = 0
  while i < keys.length {
    let key = keys[i]
    let address = addresses[i]
    let id = ids[i]
    r[key] = fetch(address: address, id: id)
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
