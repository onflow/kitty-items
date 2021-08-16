import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {tx} from "./util/tx"
import {invariant} from "@onflow/util-invariant"

const CODE = fcl.cdc`
  import NFTStorefront from 0xNFTStorefront

  transaction(saleOfferResourceID: UInt64) {
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontManager}

    prepare(acct: AuthAccount) {
      self.storefront = acct.borrow<&NFTStorefront.Storefront{NFTStorefront.StorefrontManager}>(from: NFTStorefront.StorefrontStoragePath)
        ?? panic("Missing or mis-typed NFTStorefront.Storefront")
    }

    execute {
      self.storefront.removeSaleOffer(saleOfferResourceID: saleOfferResourceID)
    }
  }
`

// prettier-ignore
export function cancelMarketListing({saleOfferResourceID}, opts = {}) {
  invariant(
    saleOfferResourceID != null,
    "cancelMarketListing({saleOfferResourceID}) -- saleOfferResourceID required"
  )

  return tx(
    [
      fcl.transaction(CODE),
      fcl.args([fcl.arg(Number(saleOfferResourceID), t.UInt64)]),
      fcl.proposer(fcl.authz),
      fcl.payer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(1000),
    ],
    opts
  )
}
