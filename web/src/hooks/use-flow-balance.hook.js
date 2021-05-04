import {atomFamily, selectorFamily, useRecoilState} from "recoil"
import {fetchFlowBalance} from "../flow/script.get-flow-balance"
import {IDLE, PROCESSING} from "../global/constants"

export const valueAtom = atomFamily({
  key: "flow-balance::state",
  default: selectorFamily({
    key: "flow-balance::default",
    get: address => async () => fetchFlowBalance(address),
  }),
})

export const statusAtom = atomFamily({
  key: "flow-balance::status",
  default: IDLE,
})

export function useFlowBalance(address) {
  const [balance, setBalance] = useRecoilState(valueAtom(address))
  const [status, setStatus] = useRecoilState(statusAtom(address))

  return {
    balance,
    status,
    async refresh() {
      setStatus(PROCESSING)
      await fetchFlowBalance(address).then(setBalance)
      setStatus(IDLE)
    },
  }
}
