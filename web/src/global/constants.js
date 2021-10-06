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

export const paths = {
  root: "/",
  marketplace: "/marketplace",
  adminMint: "/admin/mint",
}

export const ITEM_TYPE_MAP = {
  1: "Fishbowl",
  2: "Fish Hat",
  3: "Milkshake",
  4: "TukTuk",
  5: "Skateboard",
}

export const ITEM_RARITY_MAP = {
  1: "Gold",
  2: "Purple",
  3: "Green",
  4: "Blue",
}
