import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function fetchMarketItem(address, id) {
  return fcl
    .send([
      fcl.script`
      import KittyItemsMarket from 0xKittyItemsMarket

      pub struct Item {
        pub let saleItemID: UInt64
        pub let saleItemTypeID: Uint64
        pub let saleItemOwner: Address
        pub let saleItemPrice: UFix64
        

        init(id: UInt64, type: Uint64, owner: Address, price: UFix64, ) {
          self.saleItemID = id
          self.saleItemTypeID = type
          self.saleItemOwner = owner
          self.saleItemPrice = price
        }
      }

      pub fun main(address: Address, id: UInt64): Item? {
        if let collection = getAccount(address).getCapability<&KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}>(KittyItemsMarket.CollectionPublicPath).borrow() {
          if let item = collection.borrowSaleItem(saleItemID: id) {
            return Item(saleItemID: id, saleItemTypeID: item.type, saleItemOwner: address, salePrice: item.salePrice)
          }
        }
        return nil
      }
    `,
      fcl.args([fcl.arg(address, t.Address), fcl.arg(Number(id), t.UInt64)]),
    ])
    .then(fcl.decode)
}
