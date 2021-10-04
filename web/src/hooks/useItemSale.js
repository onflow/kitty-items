import PropTypes from "prop-types"
import {useReducer} from "react"
import {createSaleOffer} from "src/flow/tx.create-sale-offer"
import {
  ERROR,
  initialState,
  requestReducer,
  START,
  SUCCESS,
} from "src/reducers/requestReducer"
import {useSWRConfig} from "swr"
import {compAccountItemsKey} from "./useAccountItems"
import useAppContext from "./useAppContext"

export default function useItemSale(saleOfferId, price) {
  const {mutate} = useSWRConfig()
  const {currentUser} = useAppContext()

  const [state, dispatch] = useReducer(requestReducer, initialState)

  const sell = async () => {
    await createSaleOffer(
      {itemID: saleOfferId, price: price},
      {
        onStart() {
          dispatch({type: START})
        },
        async onSuccess() {
          dispatch({type: SUCCESS})
          mutate(compAccountItemsKey(currentUser))
        },
        async onError() {
          dispatch({type: ERROR})
        },
      }
    )
  }

  return [state, sell]
}

useItemSale.propTypes = {
  id: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
}
