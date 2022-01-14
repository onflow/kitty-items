import * as fcl from "@onflow/fcl"
import {Address} from "@onflow/types"
import {expandAccountItemsKey} from "src/hooks/useAccountItems"
import raw from "raw.macro"

const FETCH_ACCOUNT_ITEMS_SCRIPT = raw(
  "../../../cadence/scripts/kittyItems/web/get_account_items.cdc"
)

export function fetchAccountItems(key) {
  const {address} = expandAccountItemsKey(key)
  if (address == null) return Promise.resolve([])

  // prettier-ignore
  return fcl.query({
    cadence: FETCH_ACCOUNT_ITEMS_SCRIPT,
    args: (arg, t) => [
      fcl.arg(address, Address),
    ],
  })
}
