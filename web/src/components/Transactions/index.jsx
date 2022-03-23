import {Popover, Transition} from "@headlessui/react"
import PropTypes from "prop-types"
import {Fragment, useEffect, useRef, useState} from "react"
import TransactionsDropdownButton from "./TransactionsDropdownButton"
import TransactionsList from "./TransactionsList"
import useTransactionsContext from "./useTransactionsContext"

const CLEAR_TRANSACTIONS_TIMEOUT = 1000
const HIDE_TRANSACTIONS_TIMEOUT = 10000

const panelStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(50px)",
}

const getTransactionsButtonStyle = showButton => ({
  transition: "600ms ease-in-out",
  transitionProperty: "width, max-width, background-color, opacity",
  maxWidth: showButton ? 200 : 0,
  opacity: showButton ? 100 : 0,
})

function TransactionsContent({open}) {
  const [lastChangedTxFlash, setLastChangedTxFlash] = useState()
  const {pendingTransactions, completeTransactions, removeTransaction} =
    useTransactionsContext()
  const hasPending = pendingTransactions.length > 0

  const hideShowButtonTimeoutRef = useRef()
  const clearTransactionsTimeoutRef = useRef()
  const [showButton, setShowButton] = useState(hasPending)

  useEffect(() => {
    clearTimeout(hideShowButtonTimeoutRef.current)
    clearTimeout(clearTransactionsTimeoutRef.current)

    // Hides the button 10 seconds after pending transactions have been completed
    // Clears transactions 1 second later to allow slide animation
    const hideTransactionsButton = () => {
      hideShowButtonTimeoutRef.current = setTimeout(() => {
        setLastChangedTxFlash(undefined)
        if (!open) {
          setShowButton(false)

          clearTransactionsTimeoutRef.current = setTimeout(() => {
            completeTransactions.forEach(tx => removeTransaction(tx.id))
          }, [CLEAR_TRANSACTIONS_TIMEOUT])
        }
      }, HIDE_TRANSACTIONS_TIMEOUT)
    }

    if (hasPending) {
      setShowButton(true)
    } else {
      hideTransactionsButton()
    }

    return () => {
      clearTimeout(hideShowButtonTimeoutRef.current)
      clearTimeout(clearTransactionsTimeoutRef.current)
    }
  }, [hasPending, completeTransactions, open, removeTransaction])

  return (
    <div
      style={getTransactionsButtonStyle(showButton)}
      className={showButton ? "" : "overflow-hidden"}
    >
      <TransactionsDropdownButton
        open={open}
        lastChangedTxFlash={lastChangedTxFlash}
        setLastChangedTxFlash={setLastChangedTxFlash}
      />
      <Transition
        as={Fragment}
        show={open}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Popover.Panel
          static
          className="absolute right-0 z-50 max-h-80 overflow-y-auto mt-12 origin-top-right bg-white rounded-xl w-80 px-5 py-2 focus:outline-none"
          style={panelStyle}
        >
          <TransactionsList />
        </Popover.Panel>
      </Transition>
    </div>
  )
}

export default function TransactionsIndicator() {
  return (
    <Popover className="relative flex inline-block text-left">
      {({open}) => <TransactionsContent open={open} />}
    </Popover>
  )
}

TransactionsContent.propTypes = {
  open: PropTypes.bool.isRequired,
}
