import Head from "next/head"
import PropTypes from "prop-types"
import AccountInit from "src/components/AccountInit"
import Header from "src/components/Header"
import {BASE_HTML_TITLE} from "src/global/constants"
import "src/global/fclConfig"
import useAppContext from "src/hooks/useAppContext"

export default function AppContainer({children}) {
  const {isAccountInitialized} = useAppContext()

  return (
    <div>
      <Head>
        <title>{BASE_HTML_TITLE}</title>
      </Head>
      <Header />
      {isAccountInitialized === false && <AccountInit />}
      <main>{children}</main>
      <footer></footer>
    </div>
  )
}

AppContainer.propTypes = {
  children: PropTypes.node,
}
