import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {expandListingKey} from "src/hooks/useListing"
import raw from "raw.macro"

const script = raw("../../../cadence/scripts/kittyItems/web/get_listing.cdc")
const CODE = fcl.cdc`${script}`

export function fetchListing(key) {
  const {address, id} = expandListingKey(key)
  if (address === null) return Promise.resolve([])

  return fcl
    .send([
      fcl.script(CODE),
      fcl.args([fcl.arg(address, t.Address), fcl.arg(Number(id), t.UInt64)]),
    ])
    .then(fcl.decode)
}
