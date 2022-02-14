import {useCallback, useEffect, useReducer, useState} from "react"
import publicConfig from "src/global/publicConfig"
import {useDebouncedCallback} from "use-debounce"
import {HYDRATE, initialState, transactionsReducer} from "./transactionsReducer"
import {isSealed} from "./utils"

const STORAGE_KEY = `${publicConfig.appTitle}-transactions`

export default function usePersistedTransactionsReducer(
  currentUser,
  onHydrate
) {
  const [state, dispatch] = useReducer(transactionsReducer, initialState)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load persisted state persisted user matches currentUser
  const hydrate = useCallback(() => {
    if (!isHydrated) {
      const persistedState =
        JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || initialState
      const userMatchesPersistedState =
        !!persistedState.addr && currentUser.addr === persistedState.addr
      if (userMatchesPersistedState) {
        dispatch({type: HYDRATE, payload: persistedState})
        onHydrate(persistedState.transactions)
      }
    }
    setIsHydrated(true)
  }, [currentUser.addr, isHydrated, onHydrate])

  useEffect(() => {
    if (currentUser?.loggedIn) hydrate()
  }, [currentUser?.loggedIn, hydrate])

  // Save new state
  const onDebouncedStateUpdate = useDebouncedCallback(state => {
    const saveableState = {
      ...state,
      transactions: state.transactions.filter(({data}) => !isSealed(data)),
      lastChangedTx: undefined,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saveableState))
  }, 200)

  useEffect(() => {
    onDebouncedStateUpdate(state)
  }, [state, onDebouncedStateUpdate])

  return {state, dispatch}
}
