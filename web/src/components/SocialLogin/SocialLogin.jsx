import {useEffect} from "react"
import {web3AuthConnection} from "./Web3Auth.js"
import {request} from "./request.js"
import {getAccountData} from "./flowAccount.js"

const ENDPOINT = "ext:RandWeb3AuthUniqueString"
const VERSION = "1.0.0"

const messageTypes = [
  "FCL:VIEW:READY",
  "FCL:VIEW:READY:RESPONSE",
  "FCL:VIEW:RESPONSE",
  "FCL:VIEW:CLOSE",
]

const service = {
  f_type: "Service",
  f_vsn: VERSION,
  type: "authn",
  uid: "web3#authn",
  endpoint: ENDPOINT,
  method: "EXT/RPC",
  id: "0x0",
  identity: {
    f_type: "Identity",
    f_vsn: VERSION,
    address: "0x0",
    keyId: 0,
  },
  provider: {
    f_type: "ServiceProvider",
    f_vsn: VERSION,
    address: "0x0",
    name: "Google ",
    icon: "data:image/webp;base64,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",
    description: "Sign in with Google via Web3 auth",
    website: "",
  },
}

const isObject = msg =>
  typeof msg === "object" &&
  msg.f_vsn === VERSION &&
  typeof msg.f_type === "string"

const isExtensionServiceInitiationMessage = msg => {
  if (typeof msg !== "object") return false
  const service = msg.service
  if (!isObject(service)) return false
  return "f_type" in service && service.f_type === "Service"
}

const isMessage = msg => messageTypes.includes(msg?.type)

export default function SocialLogin() {
  useEffect(() => {
    if (Array.isArray(window.fcl_extensions)) {
      window.fcl_extensions.push(service)
    } else {
      window.fcl_extensions = [service]
    }

    window.addEventListener("message", async e => {
      const msg = e.data
      const response = await (async () => {
        if (isExtensionServiceInitiationMessage(msg)) {
          try {
            const {privateKey, userInfo, mnemonic} =
              await web3AuthConnection.login("google")
            console.log({privateKey})
            console.log({userInfo})
            // const mnemonic =
            //   "attitude state code amount spirit walnut legend pet window abstract swift basket tissue today topic"

            console.log({mnemonic})

            const accountData = await getAccountData(mnemonic)

            console.log({accountData})

            return {
              type: "FCL:VIEW:RESPONSE",
              f_type: "PollingResponse",
              f_vsn: VERSION,
              status: "APPROVED",
              reason: null,
              data: {
                f_type: "AuthnResponse",
                f_vsn: VERSION,
                addr: accountData.address,
                services: [
                  ...window.fcl_extensions.filter(s => s.endpoint === ENDPOINT),
                  {
                    ...service,
                    id: accountData.address,
                    identity: {
                      ...service.identity,
                      address: accountData.address,
                    },
                  },
                ],
              },
            }
          } catch (e) {
            console.log("Error", e)
            return null
          }
        } else if (isMessage(msg) && msg.type === "FCL:VIEW:READY:RESPONSE") {
          return null
        }
        return null
      })()
      if (response != null) {
        window.postMessage(response)
      }
    })

    console.log(window.fcl_extensions)
  }, [])

  return null
}
