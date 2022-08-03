import PropTypes from "prop-types"
import {fetchAccountItem} from "src/flow/script.get-account-item"
import {apiListingType} from "src/global/types"
import {normalizeItem} from "src/util/normalize-item"
import useSWR from "swr"

export default function useAccountItem(address, id, listing) {
  const {data, error} = useSWR(
    [address, id],
    fetchAccountItem
  )
  const item = data ? normalizeItem(data, listing) : undefined
  return {item, error, isLoading: !data && !error}
}

useAccountItem.propTypes = {
  address: PropTypes.string,
  id: PropTypes.number,
  listing: apiListingType,
}
