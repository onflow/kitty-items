import PropTypes from "prop-types"
import {useMemo} from "react"
import {paths} from "src/global/constants"
import fetcher from "src/util/fetcher"
import normalizeItem from "src/util/normalize-item"
import useSWR from "swr"

export default function useApiSaleOffers(address) {
  const {data, error} = useSWR(paths.apiMarketItemsList(address), fetcher)
  const saleOffers = useMemo(
    () => data?.map(item => normalizeItem(item)),
    [data]
  )
  return {saleOffers, error, isLoading: !data && !error}
}

useApiSaleOffers.propTypes = {
  address: PropTypes.string,
}
