import {invariant} from "@onflow/util-invariant"
import {tx} from "src/flow/util/tx"

const REMOVE_LISTING_TRANSACTION = `
  import NFTStorefront from 0xNFTStorefront

  transaction(listingResourceID: UInt64) {
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontManager}

    prepare(acct: AuthAccount) {
      self.storefront = acct.borrow<&NFTStorefront.Storefront{NFTStorefront.StorefrontManager}>(from: NFTStorefront.StorefrontStoragePath)
        ?? panic("Missing or mis-typed NFTStorefront.Storefront")
    }

    execute {
      self.storefront.removeListing(listingResourceID: listingResourceID)
    }
  }
`

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
