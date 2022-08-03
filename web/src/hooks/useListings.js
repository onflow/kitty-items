import PropTypes from "prop-types"
import {fetchListings} from "src/flow/script.get-listings"
import useSWR from "swr"

function compListingsKey(address) {
  if (typeof address === "undefined") return null
  return `${address}/listings`
}

export function expandListingsKey(key) {
  return {
    address: key.split("/")[0],
  }
}

export default function useListings(address) {
  const {data, error} = useSWR(compListingsKey(address), fetchListings)
  return {data, error, isLoading: !data && !error}
}

useListings.propTypes = {
  address: PropTypes.string,
}
