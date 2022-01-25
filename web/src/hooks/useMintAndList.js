import * as fcl from "@onflow/fcl"
import PropTypes from "prop-types"
import {useState} from "react"
import {flashMessages} from "src/global/constants"
import publicConfig from "src/global/publicConfig"
import useRequest from "src/hooks/useRequest"
import {
  EVENT_ITEM_MINTED,
  getKittyItemsEventByType,
} from "src/util/events"
import useAppContext from "./useAppContext"

// Mints an item and lists it for sale. The item is minted on the service account.
export default function useMintAndList(onSuccess) {
  const {setFlashMessage, currentUser} = useAppContext()

  const [_mintState, executeMintRequest] = useRequest()

  const [isMintingLoading, setIsMintingLoading] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState(null)
  const transactionAction = isMintingLoading ? "Minting Item" : "Processing"

  const resetLoading = () => {
    setIsMintingLoading(false)
    setTransactionStatus(null)
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
      onSuccess: async data => {
        setIsMintingLoading(true)

        const transactionId = data?.transaction
        if (!transactionId) throw "Missing transactionId"

        const unsub = await fcl
          .tx(transactionId)
          .subscribe(res => setTransactionStatus(res.status))
        const transactionData = await fcl.tx(transactionId).onceSealed()
        unsub()

        const event = getKittyItemsEventByType(
          transactionData.events,
          EVENT_ITEM_MINTED
        )

        if (!Number.isInteger(event?.data?.id))
          throw "Minting error, missing id"
        if (!Number.isInteger(event?.data?.kind))
          throw "Minting error, missing kind"

        onSuccess(event.data.id)
      },
      onError: () => {
        setFlashMessage(flashMessages.itemMintedError)
        resetLoading()
      },
    })
  }

  const isLoading = isMintingLoading
  return [{isLoading, transactionAction, transactionStatus}, mintAndList]
}

useMintAndList.propTypes = {
  onSuccess: PropTypes.func,
}
