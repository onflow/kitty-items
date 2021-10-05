import PropTypes from "prop-types"
import {useReducer} from "react"
import {createSaleOffer} from "src/flow/tx.create-sale-offer"
import {paths} from "src/global/constants"
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
          if (!currentUser?.addr) throw "Missing logged in user"

          mutate(paths.apiMarketItemsList(currentUser.addr)) // TODO: Does not mutate (useMarketplaceItems)
          mutate(compSaleOffersKey(currentUser.addr))
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
