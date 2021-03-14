import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
// import {batch} from "./util/batch"

// const CODE = fcl.cdc`
//   import KittyItemsMarket from 0xKittyItemsMarket

//   pub struct Item {
//     pub let id: UInt64
//     pub let isCompleted: Bool
//     pub let price: UFix64
//     pub let owner: Address

//     init(id: UInt64, isCompleted: Bool, price: UFix64, owner: Address) {
//       self.id = id
//       self.isCompleted = isCompleted
//       self.price = price
//       self.owner = owner
//     }
//   }

//   pub fun fetch(address: Address, id: UInt64): Item? {
//     if let collection = getAccount(address).getCapability<&KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}>(KittyItemsMarket.CollectionPublicPath).borrow() {
//       if let item = collection.borrowSaleItem(saleItemID: id) {
//         return Item(id: id, isCompleted: item.saleCompleted, price: item.salePrice, owner: address)
//       }
//     }
//     return nil
//   }

//   pub fun main(keys: [String], addresses: [Address], ids: [UInt64]): {String: Item?} {
//     let r: {String: Item?} = {}
//     var i = 0
//     while i < keys.length {
//       let key = keys[i]
//       let address = addresses[i]
//       let id = ids[i]
//       r[key] = fetch(address: address, id: id)
//       i = i + i
//     }
//     return r
//   }
// `

// const collate = px => {
//   return Object.keys(px).reduce(
//     (acc, key) => {
//       acc.keys.push(key)
//       acc.addresses.push(px[key][0])
//       acc.ids.push(px[key][1])
//       return acc
//     },
//     {keys: [], addresses: [], ids: []}
//   )
// }

// const {enqueue} = batch("FETCH_MARKET_ITEM", async px => {
//   const {keys, addresses, ids} = collate(px)

//   // prettier-ignore
//   return fcl.send([
//         fcl.script(CODE),
//         fcl.args([
//           fcl.arg(keys, t.Array(t.String)),
//           fcl.arg(addresses, t.Array(t.Address)),
//           fcl.arg(ids.map(Number), t.Array(t.UInt64)),
//         ]),
//         fcl.limit(1000)
//     ]).then(fcl.decode)
// })

// export async function fetchMarketItem(address, id) {
//   if (address == null) return Promise.resolve(null)
//   if (id == null) return Promise.resolve(null)
//   return enqueue(address, id)
// }

export async function fetchMarketItem(address, id) {
  return fcl
    .send([
      fcl.script`
      import KittyItemsMarket from 0xKittyItemsMarket

      pub struct Item {
        pub let id: UInt64
        pub let isCompleted: Bool
        pub let price: UFix64
        pub let owner: Address

        init(id: UInt64, isCompleted: Bool, price: UFix64, owner: Address) {
          self.id = id
          self.isCompleted = isCompleted
          self.price = price
          self.owner = owner
        }
      }

      pub fun main(address: Address, id: UInt64): Item? {
        if let collection = getAccount(address).getCapability<&KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}>(KittyItemsMarket.CollectionPublicPath).borrow() {
          if let item = collection.borrowSaleItem(saleItemID: id) {
            return Item(id: id, isCompleted: item.saleCompleted, price: item.salePrice, owner: address)
          }
        }
        return nil
      }
    `,
      fcl.args([fcl.arg(address, t.Address), fcl.arg(Number(id), t.UInt64)]),
    ])
    .then(fcl.decode)
}
