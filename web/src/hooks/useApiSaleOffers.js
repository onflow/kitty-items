import PropTypes from "prop-types"
import {useMemo} from "react"
import {paths} from "src/global/constants"
import fetcher from "src/util/fetcher"
import laggy from "src/util/laggy"
import normalizeItem from "src/util/normalize-item"
import useSWR from "swr"

export default function useApiSaleOffers(params) {
  const {data, error} = useSWR(paths.apiMarketItemsList(params), fetcher, {
    use: [laggy],
  })

  const saleOffers = useMemo(() => {
    // Paginated queries return an object
    const saleOffersArray = Array.isArray(data) ? data : data?.results
    return saleOffersArray?.map(item => normalizeItem(item))
  }, [data])

  return {saleOffers, data, error, isLoading: !data && !error}
}

useApiSaleOffers.propTypes = {
  address: PropTypes.string,
}
