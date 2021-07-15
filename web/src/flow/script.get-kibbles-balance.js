import {send, decode, script, args, arg, cdc} from "@onflow/fcl"
import {Address} from "@onflow/types"

// NOTE: Hardcoded vault path! FUSD contract does not define FUSD,BalancePublicPath

const CODE = cdc`
  import FungibleToken from 0xFungibleToken
  import FUSD from 0xFUSD

  pub fun main(address: Address): UFix64? {
    if let vault =  account.getCapability(/public/fusdBalance).borrow<&FUSD.Vault{FungibleToken.Balance}>() {
      return vault.balance
    }
    return nil
  }

`

export function fetchKibblesBalance(address) {
  if (address == null) return Promise.resolve(false)

  // prettier-ignore
  return send([
    script(CODE),
    args([
      arg(address, Address)
    ])
  ]).then(decode)
}
