import {invariant} from "@onflow/util-invariant"
import {tx} from "src/flow/util/tx"
import raw from "raw.macro"

const REMOVE_LISTING_TRANSACTION = raw(
  "../../../cadence/transactions/kittyItems/web/remove_listing.cdc"
)

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
