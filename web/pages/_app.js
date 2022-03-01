import PropTypes from "prop-types"
import AdminLogInDialog from "src/components/AdminLogInDialog"
import AppContainer from "src/components/AppContainer"
import {TransactionsContextProvider} from "src/components/Transactions/TransactionsContext"
import {AppContextProvider} from "src/contexts/AppContext"
import "styles/fonts.css"
import "styles/globals.css"
import {SWRConfig} from "swr"

export default function MyApp({Component}) {
  return (
    <div>
      <SWRConfig value={{provider: () => new Map()}}>
        <TransactionsContextProvider>
          <AppContextProvider>
            <AppContainer>
              <Component />
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
}
