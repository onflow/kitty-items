import {arg, args, cdc, decode, script, send} from "@onflow/fcl"
import {Address} from "@onflow/types"
import {expandFUSDBalanceKey} from "src/hooks/useFUSDBalance"

const CODE = cdc`
  import FungibleToken from 0xFungibleToken

  pub fun main(addr: Address): UFix64 {
    return getAccount(addr)
      .getCapability<&{FungibleToken.Balance}>(/public/fusdBalance)
      .borrow()?.balance ?? 0.0
  }

`

export function fetchFUSDBalance(key) {
  const {address} = expandFUSDBalanceKey(key)
  if (address == null) return Promise.resolve(false)

  // prettier-ignore
  return send([
    script(CODE),
    args([
      arg(address, Address)
    ])
  ]).then(decode)
}
