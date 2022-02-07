import {useReducer, useState} from "react"
import {createListing} from "src/flow/tx.create-listing"
import {
  DECLINE_RESPONSE,
  flashMessages,
  IDLE,
  paths,
  SUCCESS,
} from "src/global/constants"
import {
  ERROR,
  initialState,
  requestReducer,
  START,
} from "src/reducers/requestReducer"
import {
  EVENT_LISTING_AVAILABLE,
  getStorefrontEventByType,
} from "src/util/events"
import {useSWRConfig} from "swr"
import useAppContext from "./useAppContext"

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

export default function useItemSale() {
  const {mutate} = useSWRConfig()
  const {setFlashMessage} = useAppContext()

  const [state, dispatch] = useReducer(requestReducer, initialState)
  const [txStatus, setTxStatus] = useState(null)

  const sell = (item, price) => {
    createListing(
      {itemID: item.itemID, price},
      {
        onStart() {
          dispatch({type: START})
        },
        onUpdate(t) {
          setTxStatus(t.status)
        },
        async onSuccess(data) {
          const newListing = extractApiListingFromEvents(data.events, item)
          if (!newListing) throw "Missing listing"
          dispatch({type: SUCCESS})
          setFlashMessage(flashMessages.itemSaleSuccess)
          setTxStatus(null)
          mutate(paths.apiListing(item.itemID), [newListing], false)
        },
        async onError(e) {
          if (e === DECLINE_RESPONSE) {
            dispatch({type: IDLE})
          } else {
            console.error(e)
            dispatch({type: ERROR})
            setFlashMessage(flashMessages.itemSaleError)
          }
          setTxStatus(null)
        },
      }
    )
  }

  return [state, sell, txStatus]
}
