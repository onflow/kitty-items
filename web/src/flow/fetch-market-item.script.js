import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

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
          if let item = collection.borrowSaleItem(saleItemId: id) {
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
