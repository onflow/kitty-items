import PropTypes from "prop-types"
import {paths} from "src/global/constants"
import fetcher from "src/util/fetcher"
import normalizeItem from "src/util/normalize-item"
import {
  EVENT_SALE_OFFER_AVAILABLE,
  getStorefrontEventByType,
} from "src/util/storefrontEvents"
import useSWR from "swr"

export function extractApiSaleOfferFromEvents(
  events,
  itemType,
  itemRarity,
  owner
) {
  const event = getStorefrontEventByType(events, EVENT_SALE_OFFER_AVAILABLE)

  if (!event) return undefined
  return {
    sale_item_id: event.data.nftID,
    sale_item_resource_id: event.data.saleOfferResourceID,
    sale_item_type: itemType,
    sale_item_rarity: itemRarity,
    sale_item_owner: owner,
    sale_price: event.data.price,
    transaction_id: event.transactionId,
  }
}

export default function useApiSaleOffer(id) {
  const {data, error} = useSWR(!!id ? paths.apiSaleOffer(id) : null, fetcher)

  const saleOffer =
    Array.isArray(data) && data.length > 0 ? normalizeItem(data[0]) : undefined
  return {saleOffer, error, isLoading: !data && !error}
}

useApiSaleOffer.propTypes = {
  id: PropTypes.string,
}
