import {useRouter} from "next/dist/client/router"
import {useReducer} from "react"
import {buyMarketItem} from "src/flow/tx.buy-market-item"
import {paths} from "src/global/constants"
import {
  ERROR,
  initialState,
  requestReducer,
  START,
} from "src/reducers/requestReducer"
import {useSWRConfig} from "swr"
import useAppContext from "./useAppContext"
import {compFUSDBalanceKey} from "./useFUSDBalance"

export default function useItemPurchase() {
  const router = useRouter()
  const {currentUser} = useAppContext()
  const [state, dispatch] = useReducer(requestReducer, initialState)
  const {mutate} = useSWRConfig()

  const buy = async (saleOfferId, itemId, ownerAddress) => {
    if (!saleOfferId) throw "Missing saleOffer id"
    if (!ownerAddress) throw "Missing ownerAddress"

    await buyMarketItem(
      {itemID: saleOfferId, ownerAddress},
      {
        onStart() {
          dispatch({type: START})
        },
        async onSuccess() {
          mutate(compFUSDBalanceKey(currentUser?.addr))
          router.push(paths.profileItem(currentUser.addr, itemId))
          dispatch({type: SUCCESS})
        },
        async onError() {
          dispatch({type: ERROR})
        },
      }
    )
  }

  return [state, buy]
}
