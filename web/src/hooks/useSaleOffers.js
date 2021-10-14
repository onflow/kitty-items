import PropTypes from "prop-types"
import {fetchSaleOffers} from "src/flow/script.get-sale-offers"
import useSWR from "swr"

export function compSaleOffersKey(address) {
  return `${address}/sale-offers`
}

export function expandSaleOffersKey(key) {
  return {
    address: key.split("/")[0],
  }
}

export default function useSaleOffers(address) {
  const {data, error} = useSWR(compSaleOffersKey(address), fetchSaleOffers)
  return {data, error, isLoading: !data && !error}
}

useSaleOffers.propTypes = {
  address: PropTypes.string.isRequired,
}
