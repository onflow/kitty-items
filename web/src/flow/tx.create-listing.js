import CREATE_LISTING_TRANSACTION from "cadence/transactions/create_listing.cdc"
import {tx} from "src/flow/util/tx"
import {uFix64String} from "src/util/currency"

export function createListing({itemID, price}, opts = {}) {
  if (itemID == null)
    throw new Error("createListing(itemID, price) -- itemID required")
  if (price == null)
    throw new Error("createListing(itemID, price) -- price required")
  return tx(
    {
      cadence: CREATE_LISTING_TRANSACTION,
      args: (arg, t) => [
        arg(Number(itemID), t.UInt64),
        arg(uFix64String(price), t.UFix64),
      ],
      limit: 1000,
    },
    opts
  )
}
