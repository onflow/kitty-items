import PropTypes from "prop-types"
import {TRANSACTION_STATUS_MAP} from "src/global/constants"

export default function TransactionLoading({status}) {
  return (
    <div className="flex flex-col items-center justify-center bg-white pt-12 pb-11 border border-gray-200 rounded-sm text-gray-lightest text-xs uppercase">
      <img src="/images/loading.svg" alt="Flow" width={70} height={70} />
      <div className="mt-4">
        {TRANSACTION_STATUS_MAP[status] || "Initializing"}
      </div>
    </div>
  )
}

TransactionLoading.propTypes = {
  status: PropTypes.number,
}
