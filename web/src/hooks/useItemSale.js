import {useReducer} from "react"
import {createSaleOffer} from "src/flow/tx.create-sale-offer"
import {paths, SUCCESS} from "src/global/constants"
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
  const currentUser = useAppContext()

  const [state, dispatch] = useReducer(requestReducer, initialState)

  const sell = async (itemId, itemType, price) => {
    if (!itemId) throw "Missing itemId"
    if (!price) throw "Missing price"

    await createSaleOffer(
      {itemID: itemId, price: price},
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
        },
        async onError() {
          dispatch({type: ERROR})
        },
      }
    )
  }

  return [state, sell]
}
