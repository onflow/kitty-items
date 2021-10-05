import * as fcl from "@onflow/fcl"
import {Address} from "@onflow/types"
import {expandSaleOffersKey} from "src/hooks/useSaleOffers"

const CODE = fcl.cdc`
  import NFTStorefront from 0xNFTStorefront

  pub fun main(address: Address): [UInt64] {
    let storefrontRef = getAccount(address)
      .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
          NFTStorefront.StorefrontPublicPath
      )
      .borrow()
      ?? panic("Could not borrow public storefront from address")

  return storefrontRef.getSaleOfferIDs()
}
`

export function fetchSaleOffers(key) {
  const {address} = expandSaleOffersKey(key)
  if (address === null) return Promise.resolve([])

  return fcl
    .send([fcl.script(CODE), fcl.args([fcl.arg(address, Address)])])
    .then(fcl.decode)
}
