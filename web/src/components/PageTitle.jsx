import Head from "next/head"
import PropTypes from "prop-types"
import {BASE_HTML_TITLE} from "src/global/constants"

export default function PageTitle({children}) {
  const title = [children, BASE_HTML_TITLE].filter(Boolean).join(" - ")
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} key="title" />
    </Head>
  )
}

PageTitle.propTypes = {
  children: PropTypes.node,
}
