import {send, decode, script, args, arg, cdc} from "@onflow/fcl"
import {Address} from "@onflow/types"

const CODE = cdc`
  import FungibleToken from 0xFungibleToken

  pub fun main(addr: Address): UFix64 {
    return getAccount(addr)
      .getCapability<&{FungibleToken.Balance}>(/public/fusdBalance)
      .borrow()?.balance ?? 0.0
  }

`

export function fetchFUSDBalance(address) {
  if (address == null) return Promise.resolve(false)

  // prettier-ignore
  return send([
    script(CODE),
    args([
      arg(address, Address)
    ])
  ]).then(decode)
}
