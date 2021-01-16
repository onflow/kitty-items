import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {tx} from "./util/tx"
import {invariant} from "@onflow/util-invariant"

const CODE = fcl.cdc`
  import KittyItemsMarket from 0xKittyItemsMarket

  transaction(saleItemID: UInt64) {
      prepare(account: AuthAccount) {
          let listing <- account
            .borrow<&KittyItemsMarket.Collection>(from: KittyItemsMarket.CollectionStoragePath)!
            .remove(saleItemID: saleItemID)
          destroy listing
      }
  }
`

// prettier-ignore
export function cancelMarketListing({ itemId }, opts = {}) {
  invariant(itemId != null, "cancelMarketListing({itemId}) -- itemId required")

  return tx([
    fcl.transaction(CODE),
    fcl.args([
      fcl.arg(Number(itemId), t.UInt64),
    ]),
    fcl.proposer(fcl.authz),
    fcl.payer(fcl.authz),
    fcl.authorizations([fcl.authz]),
    fcl.limit(1000),
  ], opts)
}
