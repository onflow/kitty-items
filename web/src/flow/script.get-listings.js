import * as fcl from "@onflow/fcl"
import {Address} from "@onflow/types"
import {expandListingsKey} from "src/hooks/useListings"
import getListingsScript from "cadence/scripts/get_listings.cdc"

const CODE = fcl.cdc`${getListingsScript}`

export function fetchListings(key) {
  const {address} = expandListingsKey(key)
  if (address === null) return Promise.resolve([])

  return fcl
    .send([fcl.script(CODE), fcl.args([fcl.arg(address, Address)])])
    .then(fcl.decode)
}
