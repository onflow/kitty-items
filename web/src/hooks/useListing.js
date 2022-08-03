import PropTypes from "prop-types"
import {fetchListing} from "src/flow/script.get-listing"
import {normalizeListing} from "src/util/normalize-item"
import useSWR from "swr"

export default function useListing(address, listingResourceID) {
  const {data, error} = useSWR(
    [address, listingResourceID],
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
