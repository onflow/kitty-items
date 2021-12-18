import PropTypes from "prop-types"
import {useEffect, useState} from "react"
import {isAccountInitialized as isAccountInitializedTx} from "src/flow/script.is-account-initialized"
import publicConfig from "src/global/publicConfig"
import useAccountInitializer from "src/hooks/useAccountInitializer"
import useApiListings from "src/hooks/useApiListings"
import useAppContext from "src/hooks/useAppContext"
import useLogin from "src/hooks/useLogin"

const HeaderContainer = ({children}) => {
  return (
    <div className="bg-green-dark text-white text-sm sm:text-lg font-bold text-center py-4 px-2">
      {children}
    </div>
  )
}

const HEADER_MESSAGE_BUTTON_CLASSES = "font-bold underline hover:opacity-80"

export default function HeaderMessage() {
  const [isServiceAccountInitialized, setIsServiceAccountInitialized] =
    useState(null)

  const {currentUser, switchToAdminView} = useAppContext()
  const {listings} = useApiListings()
  const logIn = useLogin()

  const isServiceAccountLoggedIn =
    currentUser?.addr && currentUser?.addr === publicConfig.flowAddress

  const checkIsServiceAccountInitialized = () => {
    isAccountInitializedTx(publicConfig.flowAddress).then(data => {
      setIsServiceAccountInitialized(data.KittyItems && data.KittyItemsMarket)
    })
  }

  const [{isLoading: isInitLoading}, initializeAccount] = useAccountInitializer(
    checkIsServiceAccountInitialized
  )

  useEffect(() => {
    if (publicConfig.isDev) checkIsServiceAccountInitialized()
  }, [])

  if (publicConfig.isDev && isServiceAccountInitialized !== true) {
    if (isServiceAccountInitialized === null) return null

    return (
      <HeaderContainer>
        {isServiceAccountLoggedIn ? (
          <>
            <button
              onClick={initializeAccount}
              className={`${HEADER_MESSAGE_BUTTON_CLASSES} mr-1`}
              disabled={isInitLoading}
            >
              {isInitLoading ? "Initializing..." : "Initialize"}
            </button>
            the Service Account to mint Kitty Items.
          </>
        ) : (
          <>
            {currentUser ? (
              "Log in"
            ) : (
              <button onClick={logIn} className={HEADER_MESSAGE_BUTTON_CLASSES}>
                Log in
              </button>
            )}{" "}
            to the Service Account and initialize it to get started.
          </>
        )}
      </HeaderContainer>
    )
  }

  if (publicConfig.isDev && (!listings || listings.length === 0)) {
    return (
      <HeaderContainer>
        <button
          onClick={switchToAdminView}
          className="font-bold underline hover:opacity-80"
        >
          Mint some Kitty Items
        </button>
      </HeaderContainer>
    )
  }

  return (
    <HeaderContainer>
      <span className="mr-3 text-sm">💻</span>Kitty Items is a demo application
      running on the Flow test network.{" "}
      <a
        className="border-b border-white"
        href="https://github.com/onflow/kitty-items"
        target="_blank"
        rel="noreferrer"
      >
        Learn more
      </a>
      .
    </HeaderContainer>
  )
}

HeaderContainer.propTypes = {
  children: PropTypes.node.isRequired,
}
