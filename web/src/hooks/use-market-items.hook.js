import {atomFamily, selectorFamily, useRecoilState} from "recoil"
import {fetchMarketItems} from "../flow/fetch-market-items.script"
import {IDLE, PROCESSING} from "../global/constants"

export const $state = atomFamily({
  key: "market-items::state",
  default: selectorFamily({
    key: "market-items::default",
    get: address => async () => fetchMarketItems(address),
  }),
})

export const $status = atomFamily({
  key: "market-items::status",
  default: IDLE,
})

export function useMarketItems(address) {
  const [items, setItems] = useRecoilState($state(address))
  const [status, setStatus] = useRecoilState($status(address))

  const asSet = new Set(items)

  return {
    ids: items,
    status,
    async refresh() {
      setStatus(PROCESSING)
      await fetchMarketItems(address).then(setItems)
      setStatus(IDLE)
    },
    has(id) {
      return asSet.has(id)
    },
  }
}
