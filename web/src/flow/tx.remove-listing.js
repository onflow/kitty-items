import {invariant} from "@onflow/util-invariant"
import {tx} from "src/flow/util/tx"
import REMOVE_LISTING_TRANSACTION from "cadence/transactions/remove_listing.cdc"

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
