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
import useAppContext from "./useAppContext"
import {compSaleOffersKey} from "./useSaleOffers"

export default function useItemSale(itemId, price) {
  const {mutate} = useSWRConfig()
  const {currentUser} = useAppContext()

  const [state, dispatch] = useReducer(requestReducer, initialState)

  const sell = async () => {
    await createSaleOffer(
      {itemID: itemId, price: price},
      {
        onStart() {
          dispatch({type: START})
        },
        async onSuccess() {
          if (!currentUser?.addr) throw "Missing logged in user"
          mutate(compSaleOffersKey(currentUser.addr))
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

useItemSale.propTypes = {
  id: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
}
