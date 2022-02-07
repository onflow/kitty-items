import PropTypes from "prop-types"
import {useMemo} from "react"
import {paths} from "src/global/constants"
import fetcher from "src/util/fetcher"
import laggy from "src/util/laggy"
import {normalizeApiListing} from "src/util/normalize-item"
import useSWR from "swr"

export default function useApiListings(params) {
  const {data, error} = useSWR(paths.apiMarketItemsList(params), fetcher, {
    use: [laggy],
  })

  const listings = useMemo(() => {
    // Paginated queries return an object
    const listingsArray = Array.isArray(data) ? data : data?.results
    return listingsArray?.map(item => normalizeApiListing(item))
  }, [data])

  return {listings, data, error, isLoading: !data && !error}
}

useApiListings.propTypes = {
  params: PropTypes.object,
}
