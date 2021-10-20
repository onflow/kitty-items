import PropTypes from "prop-types"
import {useReducer} from "react"
import {buyMarketItem} from "src/flow/tx.buy-market-item"
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

export default function useItemPurchase(id, ownerAddress) {
  const {currentUser} = useAppContext()
  const [state, dispatch] = useReducer(requestReducer, initialState)
  const {mutate} = useSWRConfig()

  const buy = async () => {
    await buyMarketItem(
      {itemID: id, ownerAddress},
      {
        onStart() {
          dispatch({type: START})
        },
        async onSuccess() {
          mutate(compFUSDBalanceKey(currentUser?.addr))
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

useItemPurchase.propTypes = {
  id: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
}
