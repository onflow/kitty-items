import PropTypes from "prop-types"
import AdminLogInDialog from "src/components/AdminLogInDialog"
import AppContainer from "src/components/AppContainer"
import {TransactionsContextProvider} from "src/components/Transactions/TransactionsContext"
import {AppContextProvider} from "src/contexts/AppContext"
import "styles/fonts.css"
import "styles/globals.css"
import {SWRConfig} from "swr"
import Router from "next/router"
import analytics from "src/global/analytics"
import {config} from "fcl-web3auth-plugin"
import {useEffect} from "react"

Router.events.on("routeChangeComplete", () => analytics.page())
export default function MyApp({Component, pageProps}) {
  useEffect(() => {
    config({
      clientId:
        "BHpC64aYDiYE-KmGQG4oKqHNhW7aA_jBJzIWrPgSfwV-YMUBPVqKdBnyjLMt2IeG85hV3kv32DE3DzYRmSl6nqs",
      networkType: "testnet",
    })
  }, [])
  return (
    <div>
      <SWRConfig value={{provider: () => new Map()}}>
        <TransactionsContextProvider>
          <AppContextProvider>
            <AppContainer>
              <Component {...pageProps} />
              <AdminLogInDialog />
            </AppContainer>
          </AppContextProvider>
        </TransactionsContextProvider>
      </SWRConfig>
    </div>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType,
  pageProps: PropTypes.any,
}
