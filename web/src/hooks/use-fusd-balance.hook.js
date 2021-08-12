import {atomFamily, selectorFamily, useRecoilState} from "recoil"
import {fetchFUSDBalance} from "../flow/script.get-fusd-balance"
import {IDLE, PROCESSING} from "../global/constants"

export const valueAtom = atomFamily({
  key: "fusd-balance::state",
  default: selectorFamily({
    key: "fusd-balance::default",
    get: address => async () => fetchFUSDBalance(address),
  }),
})

export const statusAtom = atomFamily({
  key: "fusd-balance::status",
  default: IDLE,
})

export function useFUSDBalance(address) {
  const [balance, setBalance] = useRecoilState(valueAtom(address))
  const [status, setStatus] = useRecoilState(statusAtom(address))

  async function refresh() {
    setStatus(PROCESSING)
    await fetchFUSDBalance(address).then(setBalance)
    setStatus(IDLE)
  }

  return {
    balance,
    status,
    refresh,
    async mint() {
      setStatus(PROCESSING)
      await fetch(process.env.REACT_APP_API_FUSD_MINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: address,
          amount: 50.0,
        }),
      })
      await fetchFUSDBalance(address).then(setBalance)
      setStatus(IDLE)
    },
  }
}
