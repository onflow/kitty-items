import {invariant} from "@onflow/util-invariant"
import {tx} from "src/flow/util/tx"
import PURCHASE_LISTING_TRANSACTION from "cadence/transactions/purchase_listing.cdc"

// prettier-ignore
export function purchaseListing({itemID, ownerAddress}, opts = {}) {
  invariant(itemID != null, "buyMarketItem({itemID, ownerAddress}) -- itemID required")
  invariant(ownerAddress != null, "buyMarketItem({itemID, ownerAddress}) -- ownerAddress required")

  return tx(
    {
      cadence: PURCHASE_LISTING_TRANSACTION,
      args: (arg, t) => [
        arg(itemID, t.UInt64),
        arg(ownerAddress, t.Address)
      ],
      limit: 1000,
    },
    opts,
  )
}
