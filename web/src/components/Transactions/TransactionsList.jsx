import {TRANSACTION_STATUS_MAP} from "src/global/constants"
import TransactionListStatusIcon from "./TransactionListStatusIcon"
import TransactionListUrl from "./TransactionListUrl"
import {txType} from "./types"
import useTransactionsContext from "./useTransactionsContext"
import {isErrored} from "./utils"

function Transaction({tx}) {
  const {id, data, title} = tx
  const {removeTransaction} = useTransactionsContext()

  const name = title || `Transaction ${id.substring(0, 5)}...`
  const status = isErrored(data)
    ? "Failed"
    : TRANSACTION_STATUS_MAP[data?.status] || "Initializing"

  return (
    <div
      key={id}
      className="relative flex bg-white border p-4 my-3 border-gray-200 rounded-lg text-sm group"
    >
      <button
        onClick={() => removeTransaction(id)}
        className="hidden group-hover:flex absolute -top-3 -left-3"
      >
        <img
          src="/images/transaction-remove.svg"
          alt="Remove transaction"
          width={24}
          height={24}
        />
      </button>
      <div className="mr-3">
        <TransactionListStatusIcon data={data} />
      </div>
      <div className="flex flex-col">
        {name}
        <div className="text-gray-lightest text-xs mt-0.5">{status}</div>
      </div>
      <TransactionListUrl tx={tx} />
    </div>
  )
}

Transaction.propTypes = {
  tx: txType,
}

export default function TransactionsList() {
  const {transactions} = useTransactionsContext()
  const sortedTransactions = [...transactions].reverse()
  return (
    <>
      {sortedTransactions.map(tx => (
        <Transaction tx={tx} key={tx.id} />
      ))}
    </>
  )
}
