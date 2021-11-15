import {useReducer} from "react"
import {createSaleOffer} from "src/flow/tx.create-sale-offer"
import {
  flashMessages,
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

  const sell = async (itemId, itemType, itemRarityId) => {
    if (!itemId) throw "Missing itemId"
    if (!itemRarityId) throw "Missing itemRarityId"

    await createSaleOffer(
      {itemID: itemId, price: ITEM_RARITY_PRICE_MAP[itemRarityId]},
      {
        onStart() {
          dispatch({type: START})
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
        async onError() {
          dispatch({type: ERROR})
          setFlashMessage(flashMessages.itemSaleError)
        },
      }
    )
  }

  return [state, sell]
}
