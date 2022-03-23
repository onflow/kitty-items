import * as fcl from "@onflow/fcl"
import PropTypes from "prop-types"
import {createContext, useEffect, useRef, useState} from "react"
import {ADD, REMOVE, RESET, UPDATE} from "./transactionsReducer"
import usePersistedTransactionsReducer from "./usePersistedTransactionsReducer"
import {isErrored, isSealed} from "./utils"

export const TransactionsContext = createContext()

export const TransactionsContextProvider = ({children}) => {
  const subscribedTransactionsRef = useRef({})
  const [currentUser, setCurrentUser] = useState(false)

  // Subscribe to transactions on state hydration and when new transactions are added
  const subscribeToTransaction = tx => {
    subscribedTransactionsRef.current[tx.id] = {
      unsub: fcl.tx(tx.id).subscribe(newData =>
        dispatch({
          type: UPDATE,
          payload: {id: tx.id, data: newData},
        })
      ),
    }
  }

  const onHydrate = txs => txs.forEach(subscribeToTransaction)
  const {state, dispatch} = usePersistedTransactionsReducer(
    currentUser,
    onHydrate
  )
  const {addr, transactions} = state

  const transactionsById = Object.fromEntries(
    transactions.map(tx => [tx.id, tx])
  )
  const pendingTransactions = transactions.filter(
    ({data}) => typeof data?.status !== "undefined" && !isSealed(data)
  )
  const completeTransactions = transactions.filter(({data}) => isSealed(data))
  const erroredTransactions = transactions.filter(({data}) => isErrored(data))

  const addTransaction = tx => {
    dispatch({type: ADD, payload: {addr: currentUser.addr, tx}})
    subscribeToTransaction(tx)
  }
  const updateTransaction = tx => dispatch({type: UPDATE, payload: tx})
  const removeTransaction = id => {
    subscribedTransactionsRef.current[id]?.unsub()
    delete subscribedTransactionsRef.current[id]
    dispatch({type: REMOVE, payload: id})
  }

  useEffect(() => fcl.currentUser().subscribe(setCurrentUser), [])

  // Reset transactions if user doesn't match state user
  useEffect(() => {
    const isDifferentUser = !!addr && addr !== currentUser.addr
    if (!currentUser?.loggedIn || isDifferentUser) dispatch({type: RESET})
  }, [currentUser, dispatch, addr])

  const value = {
    state,
    dispatch,
    addTransaction,
    updateTransaction,
    removeTransaction,
    transactions,
    transactionsById,
    pendingTransactions,
    completeTransactions,
    erroredTransactions,
  }

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  )
}

TransactionsContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
