import {Popover} from "@headlessui/react"
import PropTypes from "prop-types"
import {useEffect, useRef} from "react"
import {
  TX_COMPLETE_STATUS,
  TX_ERROR_STATUS,
  TX_PENDING_STATUS,
} from "./constants"
import TransactionsButtonIcon from "./TransactionsButtonIcon"
import useTransactionsContext from "./useTransactionsContext"
import {isErrored, isSealed} from "./utils"

const TRANSACTION_FLASH_TIMEOUT = 5000
const txStatusTextStyle = {textOverflow: "ellipsis"}

const getLastChangedTxStatus = lastTx => {
  if (isErrored(lastTx?.data)) {
    return TX_ERROR_STATUS
  } else if (isSealed(lastTx?.data)) {
    return TX_COMPLETE_STATUS
  }

  return TX_PENDING_STATUS
}

const getButtonStatusClasses = (status, open) => {
  switch (status) {
    case TX_ERROR_STATUS:
      return `bg-red border-red text-white ${open ? "opacity-80" : ""}`
    case TX_COMPLETE_STATUS:
      return `bg-green border-green text-white ${open ? "opacity-80" : ""}`
    case TX_PENDING_STATUS:
      return open
        ? "text-white bg-black border-black"
        : "bg-gray-50 border-gray-200"
    default:
      throw new Error(`Incorrect button status ${status}`)
  }
}

const getButtonStatus = (
  hasPending,
  lastChangedTxFlash,
  erroredTransactions
) => {
  if (!!lastChangedTxFlash) return getLastChangedTxStatus(lastChangedTxFlash)
  if (hasPending) return TX_PENDING_STATUS
  if (erroredTransactions.length > 0) return TX_ERROR_STATUS
  return TX_COMPLETE_STATUS
}

export default function TransactionsDropdownButton({
  open,
  lastChangedTxFlash,
  setLastChangedTxFlash,
}) {
  const {
    state: {lastChangedTx},
    transactions,
    pendingTransactions,
    completeTransactions,
    erroredTransactions,
  } = useTransactionsContext()

  const hasPending = pendingTransactions.length > 0
  const lastStatusTimeoutRef = useRef()

  // Adds a green/red flash to the button depending on the state
  // of the last updated transaction. If all transactions are complete,
  // the flash color remains
  useEffect(() => {
    if (lastChangedTx?.data) {
      setLastChangedTxFlash(lastChangedTx)
      clearTimeout(lastStatusTimeoutRef.current)
      lastStatusTimeoutRef.current = setTimeout(() => {
        if (hasPending) setLastChangedTxFlash(undefined)
      }, TRANSACTION_FLASH_TIMEOUT)
    }

    return () => {
      clearTimeout(lastStatusTimeoutRef.current)
    }
  }, [hasPending, lastChangedTx, setLastChangedTxFlash])

  const status = getButtonStatus(
    hasPending,
    lastChangedTxFlash,
    erroredTransactions
  )
  const count = hasPending
    ? `${pendingTransactions.length} pending`
    : `${completeTransactions.length} complete`

  return (
    <Popover.Button
      className={[
        transactions.length === 0 ? "hidden" : "flex",
        "items-center justify-center h-10 w-10 ml-2 text-sm rounded-full border border-1 transition-colors duration-500 ease-out md:px-4 md:w-auto hover:opacity-90",
        getButtonStatusClasses(status, open),
      ].join(" ")}
    >
      <div
        className={`hidden overflow-hidden md:flex ${hasPending ? "mr-2" : ""}`}
      >
        <div
          className="text-ellipsis whitespace-nowrap text-center overflow-hidden"
          style={txStatusTextStyle}
        >
          {count}
        </div>
      </div>
      <TransactionsButtonIcon hasPending={hasPending} status={status} />
    </Popover.Button>
  )
}

TransactionsDropdownButton.propTypes = {
  open: PropTypes.bool,
  lastChangedTxFlash: PropTypes.object,
  setLastChangedTxFlash: PropTypes.func,
}
