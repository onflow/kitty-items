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
import {useEffect} from "react"
import {initFclWc} from "@onflow/fcl-wc"
import {config} from "@onflow/fcl"

Router.events.on("routeChangeComplete", () => analytics.page())
export default function MyApp({Component, pageProps}) {
  useEffect(() => {
    const initWc = async () => {
      const wcAdapter = await initFclWc({
        projectId: "a94f744d745459d99b7e0f371663bce0",
      })
      console.log(wcAdapter)
      config.put("wc.adapter", wcAdapter)
    }
    initWc()
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
