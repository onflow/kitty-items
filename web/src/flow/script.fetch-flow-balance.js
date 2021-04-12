import * as fcl from "@onflow/fcl"

export function fetchFlowBalance(address) {
  if (address == null) return Promise.resolve(null)
  return fcl.account(address).then(d => d.balance)
}
