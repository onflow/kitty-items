// prettier-ignore
import {invariant} from "@onflow/util-invariant"
import {tx} from "src/flow/util/tx"
import raw from "raw.macro"

const INITIALIZE_ACCOUNT_TRANSACTION = raw(
  "../../../cadence/transactions/kittyItems/web/initialize_account.cdc"
)

export async function initializeAccount(address, opts = {}) {
  // prettier-ignore
  invariant(address != null, "Tried to initialize an account but no address was supplied")
  return tx(
    {
      cadence: INITIALIZE_ACCOUNT_TRANSACTION,
      limit: 70,
    },
    opts
  )
}
