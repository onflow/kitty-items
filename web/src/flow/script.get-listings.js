import * as fcl from "@onflow/fcl"
import {Address} from "@onflow/types"
import {expandListingsKey} from "src/hooks/useListings"
import GET_LISTINGS_SCRIPT from "cadence/scripts/get_listings.cdc"

export function fetchListings(key) {
  const {address} = expandListingsKey(key)
  if (address === null) return Promise.resolve([])

  return fcl
    .send([
      fcl.script(GET_LISTINGS_SCRIPT),
      fcl.args([fcl.arg(address, Address)]),
    ])
    .then(fcl.decode)
}
