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

export const ITEM_TYPE_MAP = {
  1: "Fishbowl",
  2: "Fish Hat",
  3: "Milkshake",
  4: "TukTuk",
  5: "Skateboard",
  6: "Shades",
}

export const ITEM_RARITY_MAP = {
  1: "Gold",
  2: "Purple",
  3: "Green",
  4: "Blue",
}

export const ITEM_RARITY_PROBABILITIES = {
  1: 2,
  2: 8,
  3: 10,
  4: 80,
}

export const ITEM_RARITY_PRICE_MAP = {
  1: 125,
  2: 25,
  3: 5,
  4: 1,
}

export const TRANSACTION_STATUS_MAP = {
  1: "Awaiting Finalization",
  2: "Awaiting Execution",
  3: "Awaiting Sealing",
  4: "Transaction Sealed",
  5: "Transaction Expired",
}

export const DECLINE_RESPONSE = "Declined: Externally Halted"
