import PropTypes from "prop-types"
import {paths} from "src/global/constants"
import fetcher from "src/util/fetcher"
import {normalizeApiListing} from "src/util/normalize-item"
import useSWR from "swr"

export default function useApiListing(itemID, path, options = {}) {
  path ||= typeof itemID !== "undefined" ? paths.apiListing(itemID) : null
  const {data, error} = useSWR(path, fetcher, options)
  const listing =
    Array.isArray(data) && data.length > 0
      ? normalizeApiListing(data[0])
      : undefined
  return {listing, error, isLoading: !data && !error}
}

useApiListing.propTypes = {
  id: PropTypes.string,
}
