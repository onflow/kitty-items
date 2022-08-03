import * as fcl from "@onflow/fcl"
import CREATE_LISTING_TRANSACTION from "cadence/transactions/create_listing.cdc"
import {useEffect, useState} from "react"
import useTransactionsContext from "src/components/Transactions/useTransactionsContext"
import {isSuccessful} from "src/components/Transactions/utils"
import {paths} from "src/global/constants"
import {uFix64String} from "src/util/currency"
import {
  EVENT_LISTING_AVAILABLE,
  getStorefrontEventByType,
} from "src/util/events"
import useApiListing from "./useApiListing"
import analytics from "src/global/analytics"

export function extractApiListingFromEvents(events, item) {
  const event = getStorefrontEventByType(events, EVENT_LISTING_AVAILABLE)
  if (!event) return undefined

  return {
    item_id: event.data.nftID,
    listing_resource_id: event.data.listingResourceID,
    item_kind: item.kind,
    item_rarity: item.rarity,
    owner: item.owner,
    name: item.name,
    image: item.image,
    price: event.data.price,
    transaction_id: event.transactionId,
  }
}

export default function useItemSale(itemID) {
  const {addTransaction, transactionsById} = useTransactionsContext()
  const [txId, setTxId] = useState()
  const tx = transactionsById[txId]?.data

  // Poll for api listing once tx is successful
  const {listing} = useApiListing(
    itemID,
    () => {
      if (isSuccessful(tx)) {
        analytics.track("kitty-items-item-listed", {params: {itemID}})
        return paths.apiListing(itemID)
      }
      return null
    },
    {
      refreshInterval: 1000,
    }
  )

  const sell = async (item, price) => {
    if (!item) throw new Error("Missing item")
    if (!price) throw new Error("Missing price")

    const newTxId = await fcl.mutate({
      cadence: CREATE_LISTING_TRANSACTION,
      args: (arg, t) => [
        arg(item.itemID.toString(), t.UInt64),
        arg(uFix64String(price), t.UFix64),
      ],
      limit: 1000,
    })

    addTransaction({
      id: newTxId,
      url: paths.profileItem(item.owner, item.itemID),
      title: `List ${item.name} #${item.itemID}`,
    })
    setTxId(newTxId)
  }

  useEffect(() => {
    if (!!listing) setTxId(null)
  }, [listing])

  return [sell, tx]
}
