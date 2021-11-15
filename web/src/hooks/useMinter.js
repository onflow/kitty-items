import {useRouter} from "next/router"
import PropTypes from "prop-types"
import {useState} from "react"
import {flashMessages, paths} from "src/global/constants"
import publicConfig from "src/global/publicConfig"
import useRequest from "src/hooks/useRequest"
import {
  EVENT_ITEM_MINTED,
  getStorefrontEventByType,
} from "src/util/storefrontEvents"
import useAppContext from "./useAppContext"

export default function useMinter(onSuccess) {
  const {setFlashMessage} = useAppContext()
  const router = useRouter()

  const [isArtificiallyLoading, setIsArtificiallyLoading] = useState(false)
  const [mintState, executeMintRequest] = useRequest()
  const [sellState, executeSaleRequest] = useRequest()

  const listForSale = itemId => {
    executeSaleRequest({
      url: paths.apiSell,
      method: "POST",
      data: {
        itemID: itemId,
        price: 10,
      },
      onSuccess: data => {
        onSuccess(data)
      },
      onError: error => {
        console.log(error)
      },
    })
  }

  const mint = () => {
    setIsArtificiallyLoading(true)
    const recipient = publicConfig.contractNftStorefront

    executeMintRequest({
      url: publicConfig.apiKittyItemMint,
      method: "POST",
      data: {
        recipient,
      },
      onSuccess: data => {
        const event = getStorefrontEventByType(
          data.transaction.events,
          EVENT_ITEM_MINTED
        )

        if (!event?.data?.id) throw "Minting error, missing id"
        if (!event?.data?.typeID) throw "Minting error, missing typeID"
        listForSale(event.data.typeID)

        setTimeout(() => {
          setIsArtificiallyLoading(false)
          router.push({
            pathname: paths.profileItem(
              publicConfig.flowAddress,
              event.data.id
            ),
            query: {flash: "itemMintedSuccess"},
          })
        }, 4000)
      },
      onError: error => {
        console.log(error)
        setFlashMessage(flashMessages.itemMintedError)
        setIsArtificiallyLoading(false)
      },
    })
  }

  const isLoading =
    isArtificiallyLoading || mintState.isLoading || sellState.isLoading

  return [{isLoading}, mint]
}

useMinter.propTypes = {
  onSuccess: PropTypes.func,
}
