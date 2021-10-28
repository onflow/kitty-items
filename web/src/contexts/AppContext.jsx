import * as fcl from "@onflow/fcl"
import {useRouter} from "next/router"
import PropTypes from "prop-types"
import {createContext, useCallback, useEffect, useState} from "react"
import {LOGGED_IN_ADMIN_ADDRESS_KEY} from "src/components/AdminLogInDialog"
import {isAccountInitialized as isAccountInitializedTx} from "src/flow/script.is-account-initialized"
import {paths} from "src/global/constants"

export const AppContext = createContext({
  currentUser: null,
  isAccountInitialized: null,
  checkIsAccountInitialized: () => null,
  showAdminLoginDialog: false,
  isLoggedInAsAdmin: () => false,
  logInAdmin: () => null,
  logOutAdmin: () => null,
  flashMessage: null,
  setFlashMessage: _message => null,
})

export const AppContextProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAccountInitialized, setIsAccountInitialized] = useState(null)
  const [isLoggedInAsAdmin, setIsLoggedInAsAdmin] = useState(false)
  const [showAdminLoginDialog, setShowAdminLoginDialog] = useState(false)
  const [flashMessage, setFlashMessage] = useState(null)

  const router = useRouter()

  const checkIsAccountInitialized = useCallback(() => {
    if (currentUser?.addr)
      isAccountInitializedTx(currentUser.addr).then(data => {
        setIsAccountInitialized(
          data.FUSD && data.KittyItems && data.KittyItemsMarket
        )
      })
  }, [currentUser?.addr])

  useEffect(() => {
    fcl.currentUser().subscribe(newUser => {
      if (newUser?.loggedIn) {
        setCurrentUser(newUser)
        setFlashMessage(null)
      } else {
        setCurrentUser(null)
        logOutAdmin()
      }
    })
  }, [])

  useEffect(() => {
    checkIsAccountInitialized()
  }, [checkIsAccountInitialized])

  useEffect(() => {
    setIsLoggedInAsAdmin(
      !!currentUser?.addr &&
        currentUser.addr ===
          window?.sessionStorage.getItem(LOGGED_IN_ADMIN_ADDRESS_KEY)
    )
  }, [currentUser?.addr])

  useEffect(() => {
    if (flashMessage !== null) window.scrollTo({top: 0, behavior: "smooth"})
  }, [flashMessage])

  useEffect(() => {
    setFlashMessage(prev => {
      if (prev !== null) return null
      return prev
    })
  }, [router.pathname])

  const logInAdmin = () => {
    window?.sessionStorage.setItem(
      LOGGED_IN_ADMIN_ADDRESS_KEY,
      currentUser?.addr
    )
    router.push(paths.adminMint)
    setShowAdminLoginDialog(false)
    setIsLoggedInAsAdmin(true)
  }

  const logOutAdmin = () => {
    window?.sessionStorage.removeItem(LOGGED_IN_ADMIN_ADDRESS_KEY)
    setIsLoggedInAsAdmin(false)
  }

  const value = {
    currentUser,
    isAccountInitialized,
    checkIsAccountInitialized,
    showAdminLoginDialog,
    setShowAdminLoginDialog,
    isLoggedInAsAdmin,
    setIsLoggedInAsAdmin,
    logInAdmin,
    logOutAdmin,
    flashMessage,
    setFlashMessage,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

AppContextProvider.propTypes = {
  children: PropTypes.node,
}
