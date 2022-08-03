import PropTypes from "prop-types"
import {fetchAccountItems} from "src/flow/script.get-account-items"
import useSWR from "swr"

export default function useAccountItems(address) {
  const {data, error} = useSWR(address, fetchAccountItems)
  return {data, error, isLoading: !data && !error}
}

useAccountItems.propTypes = {
  address: PropTypes.string,
}
