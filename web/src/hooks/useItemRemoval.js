import {useReducer} from "react"
import {cancelMarketListing} from "src/flow/tx.remove-sale-offer"
import {paths, SUCCESS} from "src/global/constants"
import {
  ERROR,
  initialState,
  requestReducer,
  START,
} from "src/reducers/requestReducer"
import {useSWRConfig} from "swr"

export default function useItemRemoval() {
  const {mutate} = useSWRConfig()

  const [state, dispatch] = useReducer(requestReducer, initialState)

  const remove = async (saleOfferId, itemId) => {
    if (!saleOfferId) throw "Missing saleOfferId"

    await cancelMarketListing(
      {saleOfferResourceID: saleOfferId},
      {
        onStart() {
          dispatch({type: START})
        },
        async onSuccess() {
          // TODO: Poll for removed API offer instead of setTimeout
          setTimeout(() => {
            mutate(paths.apiSaleOffer(itemId))
            dispatch({type: SUCCESS})
          }, 1000)
        },
        async onError() {
          dispatch({type: ERROR})
        },
      }
    )
  }

  return [state, remove]
}
