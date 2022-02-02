import {tx} from "src/flow/util/tx"
import CREATE_LISTING_TRANSACTION from "cadence/transactions/create_listing.cdc"

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
        arg(String(price.toFixed(2)), t.UFix64),
      ],
      limit: 1000,
    },
    opts
  )
}
