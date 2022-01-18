import {cleanObject} from "src/util/object"
import publicConfig from "./publicConfig"

export const LOADING = "LOADING"

// Exposed states of a Flow Transaction
export const IDLE = "IDLE"
export const PROCESSING = "PROCESSING"
export const SUCCESS = "SUCCESS"
export const ERROR = "ERROR"

// How long to pause on a success or error message
// before transitioning back to an IDLE state.
export const IDLE_DELAY = 1000

export const BASE_HTML_TITLE = "Kitty Items"

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
}

export const flashMessages = {
  itemMintedSuccess: {
    type: "notice",
    message: "Kitty item has been minted!",
  },
  itemMintedError: {
    type: "error",
    message: "Minting has failed. Please try again.",
  },
  loggedOutSuccess: {
    type: "success",
    message: "You have logged out.",
  },
  initializeAccountSuccess: {
    type: "success",
    message: "Your account has been initialized!",
  },
  initializeAccountError: {
    type: "success",
    message: "Your account has not been initialized. Please try again.",
  },
  purchaseSuccess: {
    type: "success",
    message: "Your have purchased this Kitty Item!",
  },
  purchaseError: {
    type: "error",
    message: "Item purchase has failed. Please try again.",
  },
  itemRemovalSuccess: {
    type: "success",
    message: "Your item has been removed.",
  },
  itemRemovalError: {
    type: "error",
    message: "Your item was not removed. Please try again.",
  },
  itemSaleSuccess: {
    type: "success",
    message: "Your item is now for sale!",
  },
  itemSaleError: {
    type: "error",
    message: "Your item was not listed. Please try again.",
  },
}

export const ITEM_KIND_MAP = {
  0: "Fishbowl",
  1: "Fish Hat",
  2: "Milkshake",
  3: "TukTuk",
  4: "Skateboard",
  5: "Shades",
}

export const ITEM_RARITY_MAP = {
  0: "Blue",
  1: "Green",
  2: "Purple",
  3: "Gold",
}

export const ITEM_RARITY_PROBABILITIES = {
  0: 80,
  1: 10,
  2: 8,
  3: 2,
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
