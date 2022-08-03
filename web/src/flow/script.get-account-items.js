import * as fcl from "@onflow/fcl"
import {Address} from "@onflow/types"
import FETCH_ACCOUNT_ITEMS_SCRIPT from "cadence/scripts/get_account_items.cdc"

export function fetchAccountItems(address) {
  if (address == null) return Promise.resolve([])

  // prettier-ignore
  return fcl.query({
    cadence: FETCH_ACCOUNT_ITEMS_SCRIPT,
    args: (arg, t) => [
      fcl.arg(address, Address),
    ],
  })
}
