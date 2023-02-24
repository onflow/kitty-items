import {useEffect} from "react"
import {web3AuthConnection} from "./Web3Auth.js"
import {getAccountData} from "./flowAccount.js"

const messageTypes = [
  "FCL:VIEW:READY",
  "FCL:VIEW:READY:RESPONSE",
  "FCL:VIEW:RESPONSE",
  "FCL:VIEW:CLOSE",
]

const VERSION = "1.0.0"

const getServices = () => {
  const ENDPOINT = "ext:RandWeb3AuthUniqueString"
  const providers = [
    {
      id: "google",
      f_type: "ServiceProvider",
      f_vsn: VERSION,
      address: "0x0",
      name: "Google ",
      icon: "data:image/webp;base64,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",
      description: "Sign in with Google via Web3 auth",
      website: "",
    },
    {
      id: "facebook",
      f_type: "ServiceProvider",
      f_vsn: VERSION,
      address: "0x1",
      name: "Facebook ",
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAmJJREFUaEPtmj9oFEEUxr9v7nIpzkIRLQQVFLUSBBs7IbfGwkrhtNHbvYiiRTqbNKIRbGwD/iFkd88uISmsEtwErRQsLEVUiGIbsDAK8W6e3IESkuzt3eVucwMz7b5hvt/73rwZluHwtcr+Wrb6BMJhgnkYMASyKlotDGZqt1goT81R1EUDdG+SqDXnWPD8n6ZkfiNB3Qk6XiAmZv+fZguw0+5ZBzp3QITAOw1EiupDrYYVZvFHaZ0DkNfCHCn7ILwAwolbZ0ccEMgCtRqLKu77pAQ45eAOBI/6CID3oqA0DrCl7tdfAIKJKPRGk7K+/nsfAci3Pav5YzMzl9fMBCBHI9+daEd8PbZvHKhmswdfTV79biSACD4tht7xOPHF4nTux65fD7RIEcIDJAZbBU2ljYrm0mLFLcSJKpSD+xTcbVX0+rhUADT19JI/ciUWwAveEDjTtwAAn0eBW4oT6LjBFxBHzAUohctQctgCdJKB1uYklJB1oLU0JkYJMZ7ReLExUFFW5oPycuwm9vyTSli/Rm8aNWKSwKmUbqNyPQrKU4mkbQQ4nv8V4CEjAU7ffDqwey33m2DGSIAhNziqiM/NDOvySdzdEiqMhA61vDQWwPH8GwCfGQtwzg0eCjGWGoCGvFbkxy0WfBv5nh8npCFUYe8WPfQslJxIDSB+IXsSx+amy10otls3v07bu1AbR3tnoXYP2D3QWeX8n2VLyJaQLaGm/4XsQbbNAkmebrtQfBdK56lBbxxoPDUYKoWzSsml5DLYTkRvAADMsv7cpkp5TKXP9+7RR3cBGpkH5weob/8FwaStQs990hUAAAAASUVORK5CYII=",
      description: "Sign in with Facebook via Web3 auth",
      website: "",
    },
    {
      id: "discord",
      f_type: "ServiceProvider",
      f_vsn: VERSION,
      address: "0x2",
      name: "Discord ",
      icon: "data:image/png;base64,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",
      description: "Sign in with Discord via Web3 auth",
      website: "",
    },
    {
      id: "twitter",
      f_type: "ServiceProvider",
      f_vsn: VERSION,
      address: "0x3",
      name: "Twitter ",
      icon: "data:image/png;base64,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",
      description: "Sign in with Twitter via Web3 auth",
      website: "",
    },
    // Avoid more that 4 as the default UI is by default not scrollable
    /*{
      id: "github",
      f_type: "ServiceProvider",
      f_vsn: VERSION,
      address: "0x4",
      name: "Github ",
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABStJREFUaEPtmWXINUUUx3+vhd1d2I3dgYUKImJjB3aLiIqBIgboBwtFsRALRcVA/SAqimIXdisqtmKLze9x7nXvvDOzu/e5+8AL7/m4uyf+O2fO+c+ZSUzhMmkKj5+pAMIKTg+sB2wJrAqsACwEzAr8A/wMfAa8CbwMPAQ8Dfw53gwY7wqsCBwG7AnM2zKYr4CbgSsCsJbq/30+LIBlgHOBnYFphvL8v9LfwG3AqcD7bW21BTAtcDJwGjBjW2c13/8KnAVcAPzV1HYbAAsAtwCbNzU+5HfuD1Pyyyb6TQEsATwImDoTIR8AWwPv1jlrAsDgHwcWqTM24vefAhsBH5Xs1gGYB3gCWH7EwTU19wawMfBtTqEEwHf3ANtFytb1L4D5ADf1KMR+8DWwYMLY3cCOoZ9M9roE4AjgsoTBF4C1gDmBnYCjgdWHRPE8cClwF/A98BqwUsKWvebKlI8cgPmBt0KQsd75wEmVh67CwcDZobQa1CvAN8B34bu5QqOzS68B/AKcAlwL2Ad6ckn4IbFP7SwXVmngXQ6Af94VSMmBwXH8bhbgtwY1fDpghgAitnFUWJGUX8EdG79IAbDeW8ZmygDYG7hpyJSpUzsIuCrzkatmRZSC9CUFwJZuOuTE9DGNupAzgDMLhk278+oAvA5I0nJyA7BvF9EHTrRrwbabfJUSAGmwtTcnP4YK9E5HAKxAzwIzF+y7mfv+4xQ6HLi8oCzZcpm7FMncCQUHh1T3SQzgOmD/jLLlbuHQxLoEsHgNfbD0WgnHJAYgbdgwE92LwJpdRl6xbRqbzimRl22SAyCB8i+n5HagtMFGie3eBIXp2f8EWCwH4AdgtkwkA0s3ymgTtm4E9sr4sJDMngPwB2CnTMmd4QjZcexj5u8Dts04kvg5RBiTeA/ICKXQKXkU2GwiogeeAdbJ+LITy9WSABx75Li/+2PRCQDgkEC6nptyGGO/0cYr4A73FJSTlQE7dZciVX+u4OAxYNPcClxdrbEJI/Ikxyldis3y9IIDyZ7NLJlCNjGbWU7k5UtXeP6ogZg271WrTMLBPoBVKglgqWCgFNj1wAG5I944EJn7jm12q7GxJPBhDoDP3waWrTFyIXDiKGabwY9l8WJALlYST4kDHTp1HpBISaiqYoPrN4/w4inguDCkHcePH6MFFzWkKccD/ry+pADYBz6unMgeBrYK5dWDdZ+HBCtOmW399gn5eu8cnANlDZfTW0m2bzEQ8ERmGR+wnzsTOzE+tBKBPGg/wE7t6C8G0ftULm8Z9ruUOE8V6LpDLJk0/8hYLwfAamC+zV1RuBXYPZA9Z/ypRmP3LNVwzTlbdVXbiAzB3HfSMSCluZC1Np7FbAE8Eii33MgBQE+8wMgx2apTxzBO2uI9VQLk2MYeNZmUAFjW7ge2qWgZvCAUb1/MYfeMNMPUcjjVRF4F7OpN5IFAravzo75e3Wx0DuDJ6JC/C3BHE8+Fb0pkrapmUfCAZRVMSh0Aley8gnAWqji8Oga4JpqqtcHkZl+7RuHzELwzqqw0AaCy9wIuZfV+wJORaSNzNJ1+ikaOJb9udElbTiwgngdqr5yaAtCRK+CkeIOMVxtb7l2s4vw0d76WEe+Qqjgpv20AqO9pzVp8DuAstCo2tPUb5pEDgnii7R2ZEz/Z7u8N7Qx9SylXsqW7zL2fYF43bVAvAauFIK0udnJpQm3KxMDarkCsb3NxQ3vdKkuV4DURwe8B2By9H6i9C8sZHS+AJsF2+s1UAJ3+3gbG/wXfK+QxRGX0UQAAAABJRU5ErkJggg==",
      description: "Sign in with Github via Web3 auth",
      website: "",
    },*/
  ]

  const services = []

  for (const provider of providers) {
    services.push({
      f_type: "Service",
      f_vsn: VERSION,
      type: "authn",
      uid: "web3#authn" + provider.id,
      endpoint: ENDPOINT + provider.id,
      method: "EXT/RPC",
      id: provider.id,
      identity: {
        f_type: "Identity",
        f_vsn: VERSION,
        address: "0x0",
        keyId: 0,
      },
      provider,
    })
  }
  return services
}

const services = getServices()

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
      window.fcl_extensions.push(...services)
    } else {
      window.fcl_extensions = services
    }

    window.addEventListener("message", async e => {
      const msg = e.data
      const response = await (async () => {
        if (isExtensionServiceInitiationMessage(msg)) {
          console.log("received message:", msg)

          const provider = msg?.service?.provider?.id

          if (provider) {
            try {
              const web3AuthResponse = await web3AuthConnection.login(provider)
              console.log("web3AuthResponse", web3AuthResponse)

              // const mnemonic =
              //   "attitude state code amount spirit walnut legend pet window abstract swift basket tissue today topic"
              const {mnemonic} = web3AuthResponse

              const accountData = await getAccountData(mnemonic)
              console.log("getAccountData", {accountData})

              const selectedService = services.find(
                s => s.provider.id === provider
              )
              console.log("selectedService", selectedService)

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
                    // TODO: discuss & clarify
                    ...window.fcl_extensions.filter(
                      s => s.endpoint === selectedService.endpoint
                    ),
                    {
                      ...selectedService,
                      id: accountData.address,
                      identity: {
                        ...selectedService.identity,
                        address: accountData.address,
                      },
                    },
                  ],
                },
              }
            } catch (e) {
              console.error("Error during Web3Auth", e)
              return null
            }
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

    console.log("window.fcl_extensions", window.fcl_extensions)
  }, [])

  return null
}
