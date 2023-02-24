import {Web3AuthCore} from "@web3auth/core"
import {OpenloginAdapter} from "@web3auth/openLogin-adapter"
import {CHAIN_NAMESPACES, WALLET_ADAPTERS} from "@web3auth/base"
import {entropyToMnemonic} from "bip39"

const WEB3_AUTH_NETWORK = "testnet"
const WEB3_AUTH_CLIENT_ID =
  "BHQV_pgWWKO9nt7dszzomCSev5bnSoWAPmZvV-50a5Gwl6v19Jkwl9Co5aEnwtyD_YfjQVLXVNPhbZuWxuaKw6s"

class Web3AuthConnection {
  constructor(network, clientId) {
    this.network = network
    this.clientId = clientId
  }

  login = async loginProvider => {
    const web3auth = new Web3AuthCore({
      clientId: this.clientId,
      web3AuthNetwork: this.network,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.OTHER,
      },
    })
    const openLoginAdapter = new OpenloginAdapter({
      adapterSettings: {
        clientId: this.clientId,
        network: this.network,
        uxMode: "popup",
      },
    })
    web3auth.configureAdapter(openLoginAdapter)

    await web3auth.init()
    if (web3auth.provider) {
      await web3auth.logout()
    }

    const provider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      mfaLevel: "default", // Pass on the mfa level of your choice: default, optional, mandatory, none
      loginProvider,
    })

    const privateKey = Buffer.from(
      await provider.request({
        method: "private_key",
      }),
      "hex"
    )
    const userInfo = await web3auth.getUserInfo()
    const mnemonic = entropyToMnemonic(privateKey)

    return {
      privateKey,
      userInfo,
      mnemonic,
    }
  }
}

export const web3AuthConnection = new Web3AuthConnection(
  WEB3_AUTH_NETWORK,
  WEB3_AUTH_CLIENT_ID
)
