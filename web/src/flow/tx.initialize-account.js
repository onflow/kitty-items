// prettier-ignore
import {invariant} from "@onflow/util-invariant"
import {tx} from "src/flow/util/tx"
import INITIALIZE_ACCOUNT_TRANSACTION from "cadence/transactions/initialize_account.cdc"

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
