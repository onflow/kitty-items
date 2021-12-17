import * as fcl from "@onflow/fcl"

export function fetchFLOWBalance(address) {
  if (address == null) return Promise.resolve(null)
  return fcl.account(address).then(d => {
    return d.balance
  })
}
