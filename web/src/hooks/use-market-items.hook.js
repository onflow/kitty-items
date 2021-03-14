import {atomFamily, selectorFamily, useRecoilState} from "recoil"
import useSWR from "swr"
import {fetchMarketItems} from "../flow/fetch-market-items.script"
import {IDLE, PROCESSING} from "../global/constants"
import {StoreItemsCount} from "../pages/account"

const fetcher = url => fetch(url).then(res => res.json())

export const $state = atomFamily({
  key: "market-items::state",
  default: [],
})

export const $status = atomFamily({
  key: "market-items::status",
  default: IDLE,
})

export function useMarketItems() {
  const url = "http://localhost:3000/v1/market/latest"
  const [status, setStatus] = useRecoilState($status(IDLE))
  const [items, setItems] = useRecoilState($state([]))

  useSWR(url, fetcher, {
    initialData: items,
    refreshInterval: 10,
    errorRetryCount: 10,
    onSuccess: ({latestSaleOffers}) => {
      setItems(latestSaleOffers)
    },
    onError: error => {
      console.log("Failed to fetch market items.", error)
    },
  })

  const asSet = new Set(items)

  return {
    items,
    status,
    has(item) {
      return asSet.has(item)
    },
  }
}
