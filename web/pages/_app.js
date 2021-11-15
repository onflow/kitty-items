import PropTypes from "prop-types"
import AdminLogInDialog from "src/components/AdminLogInDialog"
import AppContainer from "src/components/AppContainer"
import {AppContextProvider} from "src/contexts/AppContext"
import "styles/fonts.css"
import "styles/globals.css"
import {SWRConfig} from "swr"

export default function MyApp({Component}) {
  return (
    <div>
      <SWRConfig value={{provider: () => new Map()}}>
        <AppContextProvider>
          <AppContainer>
            <Component />
            <AdminLogInDialog />
          </AppContainer>
        </AppContextProvider>
      </SWRConfig>
    </div>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType,
}
