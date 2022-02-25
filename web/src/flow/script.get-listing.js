import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import GET_LISTING_SCRIPT from "cadence/scripts/get_listing.cdc"
import {expandListingKey} from "src/hooks/useListing"

export function fetchListing(key) {
  const {address, id} = expandListingKey(key)
  if (address === null) return Promise.resolve([])

  return fcl
    .send([
      fcl.script(GET_LISTING_SCRIPT),
      fcl.args([fcl.arg(address, t.Address), fcl.arg(Number(id), t.UInt64)]),
    ])
    .then(fcl.decode)
}
