import {send, decode, script, args, arg, cdc} from "@onflow/fcl"
import {Address} from "@onflow/types"

const CODE = cdc`
  import FungibleToken from 0xFungibleToken
  import FUSD from 0xFUSD

  pub fun main(address: Address): UFix64? {
    if let vault = getAccount(address).getCapability<&{FungibleToken.Balance}>(/public/fusdBalance).borrow() {
      return vault.balance
    }
    return nil
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
