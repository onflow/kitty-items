import {atomFamily, selectorFamily, useRecoilState} from "recoil"
import {fetchAccountItems} from "../flow/fetch-account-items.script"
import {IDLE, PROCESSING} from "../global/constants"

export const $state = atomFamily({
  key: "account-items::state",
  default: selectorFamily({
    key: "account-items::default",
    get: address => async () => fetchAccountItems(address),
  }),
})

export const $status = atomFamily({
  key: "account-items::status",
  default: IDLE,
})

export function useAccountItems(address) {
  const [items, setItems] = useRecoilState($state(address))
  const [status, setStatus] = useRecoilState($status(address))

  return {
    ids: items,
    status,

    async mint() {
      setStatus(PROCESSING)
      await fetch(process.env.REACT_APP_API_KITTY_ITEM_MINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: address,
          // Random typeID between 1 - 5
          typeID: Math.floor(Math.random() * (5 - 1)) + 1,
        }),
      })
      await fetchAccountItems(address).then(setItems)
      setStatus(IDLE)
    },
    async refresh() {
      setStatus(PROCESSING)
      await fetchAccountItems(address).then(setItems)
      setStatus(IDLE)
    },
  }
}
