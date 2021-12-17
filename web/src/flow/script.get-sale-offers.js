import * as fcl from "@onflow/fcl"
import {Address} from "@onflow/types"
import {expandListingsKey} from "src/hooks/useListings"

const CODE = fcl.cdc`
  import NFTStorefront from 0xNFTStorefront

  pub fun main(address: Address): [UInt64] {
    let storefrontRef = getAccount(address)
      .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
          NFTStorefront.StorefrontPublicPath
      )
      .borrow()
      ?? panic("Could not borrow public storefront from address")

  return storefrontRef.getListingIDs()
}
`

export function fetchListings(key) {
  const {address} = expandListingsKey(key)
  if (address === null) return Promise.resolve([])

  return fcl
    .send([fcl.script(CODE), fcl.args([fcl.arg(address, Address)])])
    .then(fcl.decode)
}
