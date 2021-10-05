import PropTypes from "prop-types"
import {useMemo} from "react"
import {paths} from "src/global/constants"
import fetcher from "src/util/fetcher"
import normalizeItem from "src/util/normalize-item"
import useSWR from "swr"

export default function useMarketplaceItems(address) {
  const {data, error} = useSWR(paths.apiMarketItemsList(address), fetcher)
  const items = useMemo(() => data?.map(item => normalizeItem(item)), [data])
  return {items, error, isLoading: !data && !error}
}

useMarketplaceItems.propTypes = {
  address: PropTypes.string,
}
