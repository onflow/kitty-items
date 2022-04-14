import {cleanObject} from "src/util/object"
import publicConfig from "./publicConfig"

export const CHAIN_ENV_TESTNET = "testnet"
export const CHAIN_ENV_EMULATOR = "emulator"
export const LOADING = "LOADING"

// Exposed states of a Flow Transaction
export const IDLE = "IDLE"
export const PROCESSING = "PROCESSING"
export const SUCCESS = "SUCCESS"
export const ERROR = "ERROR"

// How long to pause on a success or error message
// before transitioning back to an IDLE state.
export const IDLE_DELAY = 1000

export const BASE_HTML_TITLE =
  "A CryptoKitties Sample App, learn how to create an NFT Marketplace"

export const getParamsString = params => {
  if (typeof params !== "object") return ""
  return Object.keys(params).length === 0
    ? ""
    : `?${new URLSearchParams(cleanObject(params)).toString()}`
}

export const paths = {
  root: "/",
  marketplace: "/marketplace",
  adminMint: "/admin/mint",
  profile: address => `/profiles/${address}`,
  profileItem: (address, id) => `/profiles/${address}/items/${id}`,
  apiMarketItemsList: params =>
    `${publicConfig.apiMarketItemsList}${getParamsString(params)}`,
  apiListing: id => `${publicConfig.apiUrl}/v1/market/${id}`,
  apiSell: `${publicConfig.apiUrl}/v1/market/sell`,
  flowscanTx: txId => {
    if (publicConfig.chainEnv === CHAIN_ENV_EMULATOR) return null
    return `https://${
      publicConfig.chainEnv === CHAIN_ENV_TESTNET ? "testnet." : ""
    }flowscan.org/transaction/${txId}`
  },
  flowscanAcct: address => {
    if (publicConfig.chainEnv === CHAIN_ENV_EMULATOR) return null
    return `https://${
      publicConfig.chainEnv === CHAIN_ENV_TESTNET ? "testnet." : ""
    }flowscan.org/account/${address}`
  },
  githubRepo: "https://github.com/onflow/kitty-items",
}

export const flashMessages = {
  loggedOutSuccess: {
    type: "success",
    message: "You have logged out.",
  },
}

export const ITEM_KIND_MAP = {
  0: "Fishbowl",
  1: "Fish Hat",
  2: "Milkshake",
  3: "TukTuk",
  4: "Skateboard",
}

export const ITEM_RARITY_MAP = {
  0: "Blue",
  1: "Green",
  2: "Purple",
  3: "Gold",
}

export const ITEM_RARITY_PROBABILITIES = {
  0: 40,
  1: 30,
  2: 20,
  3: 10,
}

export const ITEM_RARITY_PRICE_MAP = {
  0: 1,
  1: 5,
  2: 25,
  3: 125,
}

export const TRANSACTION_STATUS_MAP = {
  1: "Awaiting Finalization",
  2: "Awaiting Execution",
  3: "Awaiting Sealing",
  4: "Transaction Sealed",
  5: "Transaction Expired",
}

export const DECLINE_RESPONSE = "Declined: Externally Halted"
