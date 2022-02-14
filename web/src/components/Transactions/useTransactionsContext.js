import {useContext} from "react"
import {TransactionsContext} from "src/components/Transactions/TransactionsContext"

export default function useTransactionsContext() {
  return useContext(TransactionsContext)
}
