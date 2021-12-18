import * as fcl from "@onflow/fcl"
import publicConfig from "src/global/publicConfig"

export const EVENT_ITEM_MINTED = "KittyItems.Minted"
export const EVENT_KITTY_ITEM_DEPOSIT = "KittyItems.Deposit"

export const EVENT_LISTING_AVAILABLE = "NFTStorefront.ListingAvailable"
export const EVENT_LISTING_COMPLETED = "NFTStorefront.ListingCompleted"

export const getKittyItemsEventByType = (events, type) => {
  return events.find(
    event =>
      event.type ===
      `A.${fcl.sansPrefix(publicConfig.contractKittyItems)}.${type}`
  )
}

export const getStorefrontEventByType = (events, type) => {
  return events.find(
    event =>
      event.type ===
      `A.${fcl.sansPrefix(publicConfig.contractNftStorefront)}.${type}`
  )
}
