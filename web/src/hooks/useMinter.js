import * as fcl from "@onflow/fcl"
import PropTypes from "prop-types"
import {useState} from "react"
import {
  flashMessages,
  ITEM_RARITY_PRICE_MAP,
  paths,
  TRANSACTION_STATUS_MAP,
} from "src/global/constants"
import publicConfig from "src/global/publicConfig"
import useRequest from "src/hooks/useRequest"
import {
  EVENT_ITEM_MINTED,
  getStorefrontEventByType,
} from "src/util/storefrontEvents"
import {useSWRConfig} from "swr"
import {extractApiSaleOfferFromEvents} from "./useApiSaleOffer"
import useAppContext from "./useAppContext"

// Mints an item and lists it for sale. The item is minted on the service account.
export default function useMinter(onSuccess) {
  const {setFlashMessage, currentUser} = useAppContext()
  const {mutate} = useSWRConfig()

  const [_mintState, executeMintRequest] = useRequest()
  const [_sellState, executeSaleRequest] = useRequest()

  const [isMintingLoading, setIsMintingLoading] = useState(false)
  const [isSaleLoading, setIsSaleLoading] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState()

  const fullTransactionStatus =
    transactionStatus === null
      ? "Minting Item"
      : `${isSaleLoading ? "Listing Item" : "Minting Item"}: ${
          TRANSACTION_STATUS_MAP[transactionStatus]
        }`

  const resetLoading = () => {
    setIsMintingLoading(false)
    setIsSaleLoading(false)
    setTransactionStatus(null)
  }

  const listForSale = (itemId, typeId, rarityId) => {
    setIsSaleLoading(true)
    executeSaleRequest({
      url: paths.apiSell,
      method: "POST",
      data: {
        itemID: itemId,
        price: ITEM_RARITY_PRICE_MAP[rarityId],
      },
      onSuccess: async data => {
        const transactionId = data?.transactionId?.transactionId
        if (!transactionId) throw "Missing transactionId"

        fcl.tx(transactionId).subscribe(res => setTransactionStatus(res.status))

        const transactionData = await fcl.tx(transactionId).onceSealed()
        const newSaleOffer = extractApiSaleOfferFromEvents(
          transactionData.events,
          typeId,
          currentUser.addr
        )
        if (!newSaleOffer) throw "Missing saleOffer"

        mutate(paths.apiSaleOffer(itemId), [newSaleOffer], false)

        resetLoading()
        onSuccess(itemId)
      },
      onError: () => {
        resetLoading()
        setFlashMessage(flashMessages.itemMintedError)
      },
    })
  }

  const mint = () => {
    setIsMintingLoading(true)
    const recipient = publicConfig.contractNftStorefront

    executeMintRequest({
      url: publicConfig.apiKittyItemMint,
      method: "POST",
      data: {
        recipient,
      },
      onSuccess: async data => {
        setIsMintingLoading(true)

        const transactionId = data?.transaction?.transactionId
        if (!transactionId) throw "Missing transactionId"

        fcl.tx(transactionId).subscribe(res => setTransactionStatus(res.status))

        const transactionData = await fcl.tx(transactionId).onceSealed()

        const event = getStorefrontEventByType(
          transactionData.events,
          EVENT_ITEM_MINTED
        )
        if (!event?.data?.id) throw "Minting error, missing id"
        if (!event?.data?.typeID) throw "Minting error, missing typeID"
        listForSale(event.data.id, event.data.typeID, event.data.rarityID)
      },
      onError: () => {
        setFlashMessage(flashMessages.itemMintedError)
        resetLoading()
      },
    })
  }

  const isLoading = isMintingLoading || isSaleLoading
  return [{isLoading, transactionStatus: fullTransactionStatus}, mint]
}

useMinter.propTypes = {
  onSuccess: PropTypes.func,
}
