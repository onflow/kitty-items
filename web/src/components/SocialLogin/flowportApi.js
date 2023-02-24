import * as fcl from "@onflow/fcl"
import {request} from "./request"

const FLOWPORT_API_URL =
  "https://hardware-wallet-api-testnet.staging.onflow.org"

const parseFlowportAccountInfoSuccessResponse = accountInfoResponse => ({
  address: fcl.withPrefix(accountInfoResponse.address),
})

const parseFlowportAccountInfoResponse = accountInfoResponse => {
  if ("error" in accountInfoResponse) {
    // https://github.com/onflow/flow-account-api/blob/9762c8f7a38dd64e2603319a57c84e48156ca145/wallet/service.go#L196
    if (accountInfoResponse.error.endsWith("does not exist")) {
      return null
    }
    throw accountInfoResponse.error
  }
  return parseFlowportAccountInfoSuccessResponse(accountInfoResponse)
}

export const getAccountInfo = async publicKey => {
  console.log("getAccountInfo")
  const accountInfoResponse = request({
    url: `${FLOWPORT_API_URL}/accounts?publicKey=${publicKey}`,
  }).catch(e => {
    if (e && e?.httpStatus === 404) {
      return JSON.parse(e.responseText)
    }
    throw e
  })
  return parseFlowportAccountInfoResponse(await accountInfoResponse)
}
