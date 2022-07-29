import * as fcl from "@onflow/fcl"
import {useRouter} from "next/router"
import {useEffect, useRef, useState} from "react"
import useTransactionsContext from "src/components/Transactions/useTransactionsContext"
import {paths} from "src/global/constants"
import publicConfig from "src/global/publicConfig"
import useRequest from "src/hooks/useRequest"
import {EVENT_ITEM_MINTED, getKittyItemsEventByType} from "src/util/events"
import {useSWRConfig} from "swr"
import analytics from "src/global/analytics"

// Mints an item and lists it for sale. The item is minted on the service account.
export default function useMintAndList() {
  const {addTransaction} = useTransactionsContext()
  const [_mintState, executeMintRequest] = useRequest()
  const txStateSubscribeRef = useRef()
  const txSealedTimeout = useRef()

  const router = useRouter()
  const {mutate} = useSWRConfig()

  const [isMintingLoading, setIsMintingLoading] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState(null)
  const transactionAction = isMintingLoading ? "Minting Item" : "Processing"

  const resetLoading = () => {
    setIsMintingLoading(false)
    setTransactionStatus(null)
  }

  const onTransactionSealed = tx => {
    if (!!tx.errorMessage?.length) {
      resetLoading()
      return
    }

    const event = getKittyItemsEventByType(tx.events, EVENT_ITEM_MINTED)

    if (!event?.data?.id)
      throw new Error("Minting error, missing itemID")
    if (!event?.data?.kind)
      throw new Error("Minting error, missing kind")

    // TODO: Poll api for listing presence before mutating the apiMarketItemsList
    txSealedTimeout.current = setTimeout(() => {
      mutate(paths.apiMarketItemsList())
      router.push({
        pathname: paths.profileItem(publicConfig.flowAddress, event.data.id),
      })
    }, 1000)
  }

  const mintAndList = () => {
    setIsMintingLoading(true)
    const recipient = publicConfig.flowAddress

    executeMintRequest({
      url: publicConfig.apiKittyItemMintAndList,
      method: "POST",
      data: {
        recipient,
      },
      onSuccess: data => {
        setIsMintingLoading(true)

        const transactionId = data?.transaction
        if (!transactionId) throw new Error("Missing transactionId")
        addTransaction({id: transactionId, title: "Minting new item"})

        txStateSubscribeRef.current = fcl.tx(transactionId).subscribe(tx => {
          setTransactionStatus(tx.status)
          if (fcl.tx.isSealed(tx)) onTransactionSealed(tx)
        })

        analytics.track("kitty-items-item-minted", {params: {mint: data}})
      },
      onError: () => {
        resetLoading()
      },
    })
  }

  useEffect(() => {
    return () => {
      if (!!txStateSubscribeRef.current) txStateSubscribeRef.current()
      clearTimeout(txSealedTimeout.current)
    }
  }, [])

  const isLoading = isMintingLoading
  return [{isLoading, transactionAction, transactionStatus}, mintAndList]
}
