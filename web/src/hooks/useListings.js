import PropTypes from "prop-types"
import {fetchListings} from "src/flow/script.get-listings"
import useSWR from "swr"

export default function useListings(address) {
  const {data, error} = useSWR(address, fetchListings)
  return {data, error, isLoading: !data && !error}
}

useListings.propTypes = {
  address: PropTypes.string,
}
