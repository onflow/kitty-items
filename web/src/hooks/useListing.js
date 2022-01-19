import PropTypes from "prop-types"
import {fetchListing} from "src/flow/script.get-listing"
import useSWR from "swr"

function compListingKey(address, id) {
  if (typeof address === "undefined" || typeof id === "undefined") return null
  return `${address}/listings/${id}`
}

export function expandListingKey(key) {
  const paths = key.split("/")
  return {address: paths[0], id: Number(paths[paths.length - 1])}
}

export default function useListing(address, id) {
  const {data, error} = useSWR(compListingKey(address, id), fetchListing)
  return {data, error, isLoading: !data && !error}
}

useListing.propTypes = {
  address: PropTypes.string,
  id: PropTypes.number,
}
