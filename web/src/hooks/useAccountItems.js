import PropTypes from "prop-types"
import {fetchAccountItems} from "src/flow/script.get-account-items"
import useSWR from "swr"

export function compAccountItemsKey(address) {
  return `${address}/account-items`
}

export function expandAccountItemsKey(key) {
  return {
    address: key.split("/")[0],
  }
}

export default function useAccountItems(address) {
  const {data, error} = useSWR(compAccountItemsKey(address), fetchAccountItems)
  return {data, error, isLoading: !data && !error}
}

useAccountItems.propTypes = {
  address: PropTypes.string.isRequired,
}
