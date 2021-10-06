import {useMemo} from "react"
import publicConfig from "src/global/publicConfig"
import fetcher from "src/util/fetcher"
import normalizeItem from "src/util/normalize-item"
import useSWR from "swr"

export default function useMarketplaceItems() {
  const {data, error} = useSWR(publicConfig.apiMarketItemsList, fetcher)
  const items = useMemo(
    () => data?.latestSaleOffers.map(item => normalizeItem(item)),
    [data]
  )
  return {items, error, isLoading: !data && !error}
}
