import * as fcl from "@onflow/fcl"
import PURCHASE_LISTING_TRANSACTION from "cadence/transactions/purchase_listing.cdc"
import PURCHASE_LISTING_TRANSACTION_DW from "cadence/transactions/purchase_listing_dw.cdc"
import {useRouter} from "next/dist/client/router"
import {useEffect, useState} from "react"
import useTransactionsContext from "src/components/Transactions/useTransactionsContext"
import {isSealed, isSuccessful} from "src/components/Transactions/utils"
import {paths} from "src/global/constants"
import {useSWRConfig} from "swr"
import useAppContext from "./useAppContext"
import analytics from "src/global/analytics"

export default function useItemPurchase(itemID) {
  const router = useRouter()
  const {currentUser, isDapperWallet} = useAppContext()
  const {addTransaction, transactionsById} = useTransactionsContext()
  const {mutate, cache} = useSWRConfig()
  const [txId, setTxId] = useState()
  const tx = transactionsById[txId]?.data

  const purchase = async (listingResourceID, itemName, ownerAddress) => {
    if (!listingResourceID) throw new Error("Missing listingResourceID")
    if (!ownerAddress) throw new Error("Missing ownerAddress")

    let newTxId

    if (isDapperWallet) {
      newTxId = await fcl.mutate({
        cadence: PURCHASE_LISTING_TRANSACTION_DW,
        args: (arg, t) => [
          arg(ownerAddress, t.Address), // storefrontAddress: the admin account that has the storefront contract
          arg(listingResourceID.toString(), t.UInt64), // listingResourceID: listing ID
          arg("100", t.UFix64) // expectedPrice: price listed on kitty items. Has to match to salesPrice // TODO: get after second DUC listing
        ],
        limit: 1000,
      })
    } else {
      newTxId = await fcl.mutate({
        cadence: PURCHASE_LISTING_TRANSACTION,
        args: (arg, t) => [
          arg(listingResourceID.toString(), t.UInt64),
          arg(ownerAddress, t.Address),
        ],
        limit: 1000,
      })
    }

    setTxId(newTxId)
    addTransaction({
      id: newTxId,
      title: `Purchase ${itemName} #${itemID}`,
    })
  }

  useEffect(() => {
    if (!!currentUser && isSuccessful(tx)) {
      analytics.track("kitty-items-item-sale-primary", {params: {itemID}})
      mutate(currentUser.addr)
      cache.delete(paths.apiListing(itemID))
      router.push(paths.profileItem(currentUser.addr, itemID))
    } else if (isSealed(tx)) {
      setTxId(null)
    }
  }, [cache, currentUser, itemID, mutate, router, tx])

  return [purchase, tx]
}
