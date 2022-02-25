import {invariant} from "@onflow/util-invariant"
import REMOVE_LISTING_TRANSACTION from "cadence/transactions/remove_listing.cdc"
import {tx} from "src/flow/util/tx"

// prettier-ignore
export function removeListing({listingResourceID}, opts = {}) {
  invariant(
    listingResourceID != null,
    "cancelMarketListing({listingResourceID}) -- listingResourceID required"
  )
  return tx(
    {
      cadence: REMOVE_LISTING_TRANSACTION,
      args: (arg, t) => [
        arg(listingResourceID, t.UInt64),
      ],
      limit: 1000,
    },
    opts,
  )
}
