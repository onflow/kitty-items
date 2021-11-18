import {useRouter} from "next/dist/client/router"
import {useReducer, useState} from "react"
import {buyMarketItem} from "src/flow/tx.buy-market-item"
import {
  DECLINE_RESPONSE,
  flashMessages,
  IDLE,
  paths,
} from "src/global/constants"
import {
  ERROR,
  initialState,
  requestReducer,
  START,
  SUCCESS,
} from "src/reducers/requestReducer"
import {useSWRConfig} from "swr"
import useAppContext from "./useAppContext"
import {compFUSDBalanceKey} from "./useFUSDBalance"

export default function useItemPurchase() {
  const router = useRouter()
  const {currentUser, setFlashMessage} = useAppContext()
  const [state, dispatch] = useReducer(requestReducer, initialState)
  const {mutate, cache} = useSWRConfig()
  const [txStatus, setTxStatus] = useState(null)

  const buy = (saleOfferId, itemId, ownerAddress) => {
    if (!saleOfferId) throw "Missing saleOffer id"
    if (!ownerAddress) throw "Missing ownerAddress"

    buyMarketItem(
      {itemID: saleOfferId, ownerAddress},
      {
        onStart() {
          dispatch({type: START})
        },
        onUpdate(t) {
          setTxStatus(t.status)
        },
        async onSuccess() {
          mutate(compFUSDBalanceKey(currentUser?.addr))
          cache.delete(paths.apiSaleOffer(itemId))
          router.push(paths.profileItem(currentUser.addr, itemId))
          dispatch({type: SUCCESS})
          setFlashMessage(flashMessages.purchaseSuccess)
        },
        async onError(e) {
          if (e === DECLINE_RESPONSE) {
            dispatch({type: IDLE})
          } else {
            dispatch({type: ERROR})
            setFlashMessage(flashMessages.purchaseError)
          }
        },
        onComplete() {
          setTxStatus(null)
        },
      }
    )
  }

  return [state, buy, txStatus]
}
