import * as fcl from "@onflow/fcl"
import REMOVE_LISTING_TRANSACTION from "cadence/transactions/remove_listing.cdc"
import {useEffect, useState} from "react"
import useTransactionsContext from "src/components/Transactions/useTransactionsContext"
import {isSuccessful} from "src/components/Transactions/utils"
import {paths} from "src/global/constants"
import useApiListing from "./useApiListing"

export default function useItemRemoval(itemID) {
  const {addTransaction, transactionsById} = useTransactionsContext()
  const [txId, setTxId] = useState()
  const tx = transactionsById[txId]?.data

  // Poll for removed api listing once tx is successful
  const {listing} = useApiListing(
    itemID,
    () => (!!isSuccessful(tx) ? paths.apiListing(itemID) : null),
    {
      refreshInterval: 1000,
    }
  )

  const remove = async ({listingResourceID, owner, name}) => {
    if (!listingResourceID) throw new Error("Missing listingResourceID")

    const newTxId = await fcl.mutate({
      cadence: REMOVE_LISTING_TRANSACTION,
      args: (arg, t) => [arg(listingResourceID, t.UInt64)],
      limit: 1000,
    })

    setTxId(newTxId)
    addTransaction({
      id: newTxId,
      url: paths.profileItem(owner, itemID),
      title: `Remove ${name} #${itemID}`,
    })
  }

  useEffect(() => {
    if (!listing) setTxId(null)
  }, [listing])

  return [remove, tx]
}
