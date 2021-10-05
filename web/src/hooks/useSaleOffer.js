import PropTypes from "prop-types"
import {fetchSaleOffer} from "src/flow/script.get-sale-offer"
import useSWR from "swr"

export function compSaleOfferKey(address, id) {
  return `${address}/sale-offers/${id}`
}

export function expandSaleOfferKey(key) {
  const paths = key.split("/")
  return {address: paths[0], id: Number(paths[paths.length - 1])}
}

export default function useSaleOffer(address, id) {
  const {data, error} = useSWR(compSaleOfferKey(address, id), fetchSaleOffer)
  return {data, error, isLoading: !data && !error}
}

useSaleOffer.propTypes = {
  address: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
}
