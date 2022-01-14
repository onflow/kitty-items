import {send, decode, script, args, arg, cdc} from "@onflow/fcl"
import {Address} from "@onflow/types"
import raw from "raw.macro"

const script = raw(
  "../../../cadence/scripts/kittyItems/web/is_account_initialized.cdc"
)
const CODE = cdc`${script}`

export function isAccountInitialized(address) {
  if (address == null) return Promise.resolve(false)

  // prettier-ignore
  return send([
    script(CODE),
    args([
      arg(address, Address)
    ])
  ]).then(decode)
}
