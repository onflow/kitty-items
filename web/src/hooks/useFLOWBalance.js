import PropTypes from "prop-types"
import {fetchFLOWBalance} from "src/flow/script.get-flow-balance"
import {fmtFlow} from "src/util/fmt-flow"
import useSWR from "swr"

export default function useFLOWBalance(address) {
  const {data, error} = useSWR(address, fetchFLOWBalance)
  return {
    data: typeof data === "undefined" ? undefined : fmtFlow(data),
    error,
    isLoading: typeof data === "undefined" && !error,
  }
}

useFLOWBalance.propTypes = {
  address: PropTypes.string,
}
