import * as fcl from "@onflow/fcl"
import publicConfig from "src/global/publicConfig"

export const EVENT_ITEM_MINTED = "KittyItems.Minted"
export const EVENT_SALE_OFFER_AVAILABLE = "NFTStorefront.SaleOfferAvailable"
export const EVENT_SALE_OFFER_COMPLETED = "NFTStorefront.SaleOfferCompleted"

export const getStorefrontEventByType = (events, type) => {
  return events.find(
    event =>
      event.type ===
      `A.${fcl.sansPrefix(publicConfig.contractNftStorefront)}.${type}`
  )
}
