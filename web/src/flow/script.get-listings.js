import * as fcl from "@onflow/fcl"
import {Address} from "@onflow/types"
import {expandListingsKey} from "src/hooks/useListings"
import raw from "raw.macro"

const script = raw("../../../cadence/scripts/kittyItems/web/get_listings.cdc")
const CODE = fcl.cdc`${script}`

export function fetchListings(key) {
  const {address} = expandListingsKey(key)
  if (address === null) return Promise.resolve([])

  return fcl
    .send([fcl.script(CODE), fcl.args([fcl.arg(address, Address)])])
    .then(fcl.decode)
}
