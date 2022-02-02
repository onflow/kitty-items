import {send, decode, script, args, arg, cdc} from "@onflow/fcl"
import {Address} from "@onflow/types"
import IS_ACCOUNT_INITIALIZED_SCRIPT from "cadence/scripts/is_account_initialized.cdc"

export function isAccountInitialized(address) {
  if (address == null) return Promise.resolve(false)

  // prettier-ignore
  return send([
    script(IS_ACCOUNT_INITIALIZED_SCRIPT),
    args([
      arg(address, Address)
    ])
  ]).then(decode)
}
