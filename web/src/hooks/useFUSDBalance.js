import PropTypes from "prop-types"
import {fetchFUSDBalance} from "src/flow/script.get-fusd-balance"
import useAppContext from "src/hooks/useAppContext"
import useSWR from "swr"

export function compFUSDBalanceKey(address) {
  return `${address}/fusd-balance`
}

export function expandFUSDBalanceKey(key) {
  return {
    address: key.split("/")[0],
  }
}

export default function useFUSDBalance(address) {
  const {isAccountInitialized} = useAppContext()
  const {data, error} = useSWR(
    isAccountInitialized ? compFUSDBalanceKey(address) : null,
    fetchFUSDBalance
  )

  return {data: parseFloat(data), error, isLoading: !data && !error}
}

useFUSDBalance.propTypes = {
  address: PropTypes.string.isRequired,
}
