import * as fcl from "@onflow/fcl"
import PropTypes from "prop-types"
import {createContext, useCallback, useEffect, useState} from "react"
import {isAccountInitialized as isAccountInitializedTx} from "src/flow/script.is-account-initialized"

export const AppContext = createContext({
  currentUser: null,
  isAccountInitialized: null,
  checkIsAccountInitialized: () => null,
})

export const AppContextProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAccountInitialized, setIsAccountInitialized] = useState(null)

  const checkIsAccountInitialized = useCallback(() => {
    if (currentUser?.addr)
      isAccountInitializedTx(currentUser.addr).then(data => {
        setIsAccountInitialized(
          data.FUSD && data.KittyItems && data.KittyItemsMarket
        )
      })
  }, [currentUser?.addr])

  useEffect(
    () =>
      fcl.currentUser().subscribe(newUser => {
        setCurrentUser(newUser?.loggedIn ? newUser : null)
      }),
    []
  )

  useEffect(() => {
    checkIsAccountInitialized()
  }, [checkIsAccountInitialized])

  const value = {
    currentUser,
    isAccountInitialized,
    checkIsAccountInitialized,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

AppContextProvider.propTypes = {
  children: PropTypes.node,
}
