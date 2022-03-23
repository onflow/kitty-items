import * as fcl from "@onflow/fcl"
import PURCHASE_LISTING_TRANSACTION from "cadence/transactions/purchase_listing.cdc"
import {useRouter} from "next/dist/client/router"
import {useEffect, useState} from "react"
import useTransactionsContext from "src/components/Transactions/useTransactionsContext"
import {isSealed, isSuccessful} from "src/components/Transactions/utils"
import {paths} from "src/global/constants"
import {useSWRConfig} from "swr"
import useAppContext from "./useAppContext"
import {compFLOWBalanceKey} from "./useFLOWBalance"
import analytics from "src/global/analytics"

export default function useItemPurchase(itemID) {
  const router = useRouter()
  const {currentUser} = useAppContext()
  const {addTransaction, transactionsById} = useTransactionsContext()
  const {mutate, cache} = useSWRConfig()
  const [txId, setTxId] = useState()
  const tx = transactionsById[txId]?.data

  const purchase = async (listingResourceID, itemName, ownerAddress) => {
    if (!listingResourceID) throw new Error("Missing listingResourceID")
    if (!ownerAddress) throw new Error("Missing ownerAddress")

    const newTxId = await fcl.mutate({
      cadence: PURCHASE_LISTING_TRANSACTION,
      args: (arg, t) => [
        arg(listingResourceID, t.UInt64),
        arg(ownerAddress, t.Address),
      ],
      limit: 1000,
    })
    setTxId(newTxId)
    addTransaction({
      id: newTxId,
      title: `Purchase ${itemName} #${itemID}`,
    })
  }

  useEffect(() => {
    if (!!currentUser && isSuccessful(tx)) {
      analytics.track("kitty-items-item-sale-primary", {params: {itemID}})
      mutate(compFLOWBalanceKey(currentUser.addr))
      cache.delete(paths.apiListing(itemID))
      router.push(paths.profileItem(currentUser.addr, itemID))
    } else if (isSealed(tx)) {
      setTxId(null)
    }
  }, [cache, currentUser, itemID, mutate, router, tx])

  return [purchase, tx]
}
