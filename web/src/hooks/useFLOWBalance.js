import PropTypes from "prop-types"
import {fetchFLOWBalance} from "src/flow/script.get-flow-balance"
import useAppContext from "src/hooks/useAppContext"
import useSWR from "swr"

export function compFLOWBalanceKey(address) {
  return `${address}/flow-balance`
}

export function expandFLOWBalanceKey(key) {
  return {
    address: key.split("/")[0],
  }
}

export default function useFLOWBalance(address) {
  const {data, error} = useSWR(
    compFLOWBalanceKey(address),
    fetchFLOWBalance
  )

  return {data: parseFloat(data), error, isLoading: !data && !error}
}

useFLOWBalance.propTypes = {
  address: PropTypes.string.isRequired,
}
