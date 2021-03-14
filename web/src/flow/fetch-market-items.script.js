import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

const CODE = fcl.cdc`
  import KittyItemsMarket from 0xKittyItemsMarket

  pub fun main(address: Address): [UInt64] {
    if let col = getAccount(address).getCapability<&KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}>(KittyItemsMarket.CollectionPublicPath).borrow() {
      return col.getSaleOfferIDs()
    } 
    
    return []
  }
`

export function fetchMarketItems(url) {
  return fetch(url).then(res => res.json())
}
