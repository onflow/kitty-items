import PropTypes from "prop-types"
import {fetchAccountItem} from "src/flow/script.get-account-item"
import useSWR from "swr"

export function compAccountItemKey(address, id) {
  if (typeof address === "undefined" || typeof id === "undefined") return null
  return `${address}/account-item/${id}`
}

export function expandAccountItemKey(key) {
  const paths = key.split("/")
  return {address: paths[0], id: Number(paths[paths.length - 1])}
}

export default function useAccountItem(address, id) {
  const {data, error} = useSWR(
    compAccountItemKey(address, id),
    fetchAccountItem
  )
  
  return {data, error, isLoading: !data && !error}
}

useAccountItem.propTypes = {
  address: PropTypes.string,
  id: PropTypes.number,
}
