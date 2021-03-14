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

export function fetchMarketItems(address) {
  if (address == null) return Promise.resolve([])

  // prettier-ignore
  return fcl.send([
    fcl.script(CODE),
    fcl.args([
      fcl.arg(address, t.Address)
    ])
  ]).then(fcl.decode).then(d => d.sort((a, b) => a - b))
}
