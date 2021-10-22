import * as fcl from "@onflow/fcl"
import publicConfig from "src/global/publicConfig"

export const EVENT_SALE_OFFER_AVAILABLE = "SaleOfferAvailable"
export const EVENT_SALE_OFFER_COMPLETED = "SaleOfferCompleted"

export const getStorefrontEventByType = (events, type) => {
  return events.find(
    event =>
      event.type ===
      `A.${fcl.sansPrefix(
        publicConfig.contractNftStorefront
      )}.NFTStorefront.${type}`
  )
}
