import PropTypes from "prop-types"
import {fetchListing} from "src/flow/script.get-listing"
import {normalizeListing} from "src/util/normalize-item"
import useSWR from "swr"

function compListingKey(address, id) {
  if (typeof address === "undefined" || typeof id === "undefined") return null
  return `${address}/listings/${id}`
}

export function expandListingKey(key) {
  const paths = key.split("/")
  return {address: paths[0], id: Number(paths[paths.length - 1])}
}

export default function useListing(address, listingResourceID) {
  const {data, error} = useSWR(
    compListingKey(address, listingResourceID),
    fetchListing
  )
  return {
    listing: data ? normalizeListing(data) : undefined,
    error,
    isLoading: !data && !error,
  }
}

useListing.propTypes = {
  address: PropTypes.string,
  listingResourceID: PropTypes.number,
}
