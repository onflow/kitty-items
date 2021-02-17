import React from "react"
import {RecoilRoot} from "recoil"
import {HashRouter as Router} from "react-router-dom"
import {ChakraProvider} from "@chakra-ui/react"
import theme from "../theme.js"

export function Providers({children}) {
  return (
    <React.StrictMode>
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <Router>{children}</Router>
        </ChakraProvider>
      </RecoilRoot>
    </React.StrictMode>
  )
}
