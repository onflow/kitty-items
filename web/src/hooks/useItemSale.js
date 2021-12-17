import {useReducer, useState} from "react"
import {createItemListing} from "src/flow/tx.create-item-listing"
import {
  DECLINE_RESPONSE,
  flashMessages,
  IDLE,
  ITEM_RARITY_PRICE_MAP,
  paths,
  SUCCESS,
} from "src/global/constants"
import {
  ERROR,
  initialState,
  requestReducer,
  START,
} from "src/reducers/requestReducer"
import {useSWRConfig} from "swr"
import {extractApiSaleOfferFromEvents} from "./useApiSaleOffer"
import useAppContext from "./useAppContext"

export default function useItemSale() {
  const {mutate} = useSWRConfig()
  const {currentUser, setFlashMessage} = useAppContext()

  const [state, dispatch] = useReducer(requestReducer, initialState)
  const [txStatus, setTxStatus] = useState(null)

  const sell = (itemId, itemType, itemRarityId) => {
    if (!itemId) throw "Missing itemId"
    if (!itemRarityId) throw "Missing itemRarityId"

    createItemListing(
      {itemID: itemId, price: ITEM_RARITY_PRICE_MAP[itemRarityId]},
      {
        onStart() {
          dispatch({type: START})
        },
        onUpdate(t) {
          setTxStatus(t.status)
        },
        async onSuccess(data) {
          const newSaleOffer = extractApiSaleOfferFromEvents(
            data.events,
            itemType,
            currentUser.addr
          )
          if (!newSaleOffer) throw "Missing saleOffer"
          mutate(paths.apiSaleOffer(itemId), [newSaleOffer], false)
          dispatch({type: SUCCESS})
          setFlashMessage(flashMessages.itemSaleSuccess)
        },
        async onError(e) {
          if (e === DECLINE_RESPONSE) {
            dispatch({type: IDLE})
          } else {
            dispatch({type: ERROR})
            setFlashMessage(flashMessages.itemSaleError)
          }
        },
        onComplete() {
          setTxStatus(null)
        },
      }
    )
  }

  return [state, sell, txStatus]
}
