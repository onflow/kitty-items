import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function fetchMarketItem(address, id) {
  return fcl
    .send([
      fcl.script`
      import KittyItemsMarket from 0xKittyItemsMarket

      pub struct SaleItem {
        pub let itemID: UInt64
        pub let typeID: UInt64
        pub let owner: Address
        pub let price: UFix64
        

        init(itemID: UInt64, typeID: UInt64, owner: Address, price: UFix64, ) {
          self.itemID = itemID
          self.typeID = typeID
          self.owner = owner
          self.price = price
        }
      }

      pub fun main(address: Address, id: UInt64): SaleItem? {
        if let collection = getAccount(address).getCapability<&KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}>(KittyItemsMarket.CollectionPublicPath).borrow() {
          if let item = collection.borrowSaleItem(itemID: id) {
            return SaleItem(itemID: id, typeID: item.typeID, owner: address, price: item.price)
          }
        }
        return nil
      }
    `,
      fcl.args([fcl.arg(address, t.Address), fcl.arg(Number(id), t.UInt64)]),
    ])
    .then(fcl.decode)
}
