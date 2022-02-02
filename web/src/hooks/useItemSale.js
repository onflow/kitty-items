import {useReducer, useState} from "react"
import {createListing} from "src/flow/tx.create-listing"
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
import {extractApiListingFromEvents} from "./useApiListing"
import useAppContext from "./useAppContext"

export default function useItemSale() {
  const {mutate} = useSWRConfig()
  const {currentUser, setFlashMessage} = useAppContext()

  const [state, dispatch] = useReducer(requestReducer, initialState)
  const [txStatus, setTxStatus] = useState(null)

  const sell = (itemId, itemKind, itemRarity) => {
    const price = ITEM_RARITY_PRICE_MAP[itemRarity]

    createListing(
      {itemID: itemId, price},
      {
        onStart() {
          dispatch({type: START})
        },
        onUpdate(t) {
          setTxStatus(t.status)
        },
        async onSuccess(data) {
          const newListing = extractApiListingFromEvents(
            data.events,
            itemKind,
            currentUser.addr
          )
          if (!newListing) throw "Missing listing"
          mutate(paths.apiListing(itemId), [newListing], false)
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
