import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {batch} from "src/flow/util/batch"
import {expandAccountItemKey} from "src/hooks/useAccountItem"
import GET_ACCOUNT_ITEM_SCRIPT from "cadence/scripts/get_account_item.cdc"

const collate = px => {
  return Object.keys(px).reduce(
    (acc, key) => {
      acc.keys.push(key)
      acc.addresses.push(px[key][0])
      acc.ids.push(px[key][1])
      return acc
    },
    {keys: [], addresses: [], ids: []}
  )
}

const {enqueue} = batch("FETCH_ACCOUNT_ITEM", async px => {
  const {keys, addresses, ids} = collate(px)

  return fcl
    .send([
      fcl.script(GET_ACCOUNT_ITEM_SCRIPT),
      fcl.args([
        fcl.arg(keys, t.Array(t.String)),
        fcl.arg(addresses, t.Array(t.Address)),
        fcl.arg(ids, t.Array(t.UInt64)),
      ]),
    ])
    .then(fcl.decode)
})

export async function fetchAccountItem(key) {
  const {address, id} = expandAccountItemKey(key)

  // t.UInt64 fcl arg must be passed as string
  let stringID = id.toString();

  if (!address) return Promise.resolve(null)
  if (!stringID) return Promise.resolve(null)
  return enqueue(address, stringID)
}
