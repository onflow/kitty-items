import {atom, selector, useRecoilState, useRecoilValue} from "recoil"
import useSWR from "swr"
import {IDLE, LOADING} from "../global/constants"
import fetcher from "../util/fetcher"
import normalizeItem from "../util/normalize-item"

export const $marketItemsState = atom({
  key: "market-items::state",
  default: [],
})

export const $marketItemsStatus = atom({
  key: "market-items::status",
  default: IDLE,
})

const $normalizedItems = selector({
  key: "market-items::normalized",
  get: ({get}) => {
    const items = get($marketItemsState)
    return items.map(item => normalizeItem(item))
  },
})

export function useMarketItems() {
  const url = process.env.REACT_APP_API_MARKET_ITEMS_LIST
  const [status, setStatus] = useRecoilState($marketItemsStatus)
  const [items, setItems] = useRecoilState($marketItemsState)
  const normalizedItems = useRecoilValue($normalizedItems)

  useSWR(url, fetcher, {
    initialData: items,
    refreshInterval: 10,
    errorRetryCount: 10,
    onLoadingSlow: () => {
      setStatus(LOADING)
    },
    onSuccess: ({latestSaleOffers}) => {
      setStatus(IDLE)
      setItems(latestSaleOffers)
    },
    onError: error => {
      console.log("Failed to fetch market items.", error)
    },
  })

  const asMap = new Map(normalizedItems.map(item => [item.itemID, item]))

  return {
    status,
    items: normalizedItems,
    has(item) {
      return asMap.has(item.itemID)
    },
  }
}
