import PropTypes from "prop-types"
import {paths} from "src/global/constants"
import fetcher from "src/util/fetcher"
import normalizeItem from "src/util/normalize-item"
import useSWR from "swr"

export default function useApiSaleOffer(id) {
  const {data, error} = useSWR(!!id ? paths.apiSaleOffer(id) : null, fetcher)
  const saleOffer =
    Array.isArray(data) && data.length > 0 ? normalizeItem(data[0]) : undefined
  return {saleOffer, error, isLoading: !data && !error}
}

useApiSaleOffer.propTypes = {
  id: PropTypes.string,
}
