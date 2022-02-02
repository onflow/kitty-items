import PropTypes from "prop-types"
import {paths} from "src/global/constants"
import fetcher from "src/util/fetcher"
import normalizeItem from "src/util/normalize-item"
import {
  EVENT_LISTING_AVAILABLE,
  getStorefrontEventByType,
} from "src/util/events"
import useSWR from "swr"

export function extractApiListingFromEvents(
  events,
  itemType,
  itemRarity,
  owner
) {
  const event = getStorefrontEventByType(events, EVENT_LISTING_AVAILABLE)

  if (!event) return undefined
  return {
    item_id: event.data.nftID,
    listing_id: event.data.listingResourceID,
    item_type: itemType,
    item_rarity: itemRarity,
    owner: owner,
    price: event.data.price,
    transaction_id: event.transactionId,
  }
}

export default function useApiListing(id) {
  const {data, error} = useSWR(!!id ? paths.apiListing(id) : null, fetcher)

  const listing =
    Array.isArray(data) && data.length > 0 ? normalizeItem(data[0]) : undefined
  return {listing, error, isLoading: !data && !error}
}

useApiListing.propTypes = {
  id: PropTypes.string,
}
