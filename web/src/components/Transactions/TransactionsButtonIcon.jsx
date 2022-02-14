import PropTypes from "prop-types"
import {TX_PENDING_STATUS} from "./constants"
import LoadingXsIcon from "./Icons/LoadingXsIcon"

export default function TransactionsButtonIcon({hasPending, status}) {
  return (
    <>
      {hasPending ? (
        <LoadingXsIcon green={status === TX_PENDING_STATUS} />
      ) : (
        <img
          src="/images/check.svg"
          alt="Complete"
          width={18}
          height={14}
          className="flex md:hidden"
        />
      )}
    </>
  )
}

TransactionsButtonIcon.propTypes = {
  hasPending: PropTypes.bool,
  status: PropTypes.string,
}
