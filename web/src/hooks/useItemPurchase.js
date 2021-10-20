import PropTypes from "prop-types"
import {useReducer} from "react"
import {buyMarketItem} from "src/flow/tx.buy-market-item"
import {paths} from "src/global/constants"
import {
  ERROR,
  initialState,
  requestReducer,
  START,
  SUCCESS,
} from "src/reducers/requestReducer"
import {useSWRConfig} from "swr"

export default function useItemPurchase(id, ownerAddress) {
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
          dispatch({type: SUCCESS})
          mutate(paths.apiMarketItemsList()) // TODO: Does not mutate (useMarketplaceItems)
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
