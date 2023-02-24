import * as fcl from "@onflow/fcl"
import {HttpRequestError, request} from "./request"

const FLOWPORT_API_URL =
  "https://hardware-wallet-api-testnet.staging.onflow.org"

const parseFlowportAccountInfoSuccessResponse = accountInfoResponse =>
  fcl.withPrefix(accountInfoResponse.address)

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

export const getAccountAddress = async publicKey => {
  console.log("Getting Account Address")
  const accountInfoResponse = request({
    url: `${FLOWPORT_API_URL}/accounts?publicKey=${publicKey}`,
  }).catch(e => {
    if (e instanceof HttpRequestError && e?.httpStatus === 404) {
      return JSON.parse(e.responseText)
    }
    throw e
  })
  return parseFlowportAccountInfoResponse(await accountInfoResponse)
}

// TODO, this is very slow, without any
// feedback for the user.
const createAccount = async publicKey => {
  console.log("Creating Account")
  const accountInfoResponse = await request({
    url: `${FLOWPORT_API_URL}/accounts`,
    method: "POST",
    body: JSON.stringify({
      publicKey,
      signatureAlgorithm: "ECDSA_secp256k1",
      hashAlgorithm: "SHA2_256",
    }),
    headers: {"Content-Type": "application/json"},
  })
  console.log("Creating Account: response", accountInfoResponse)
  return parseFlowportAccountInfoSuccessResponse(accountInfoResponse)
}

export const ensureAccountIsCreatedOnChain = async publicKey => {
  console.log("Ensuring Account Is Created On Chain")
  const address = await getAccountAddress(publicKey)
  console.log("Account Address: ", address)
  if (!address) {
    await createAccount(publicKey)
  }
}
