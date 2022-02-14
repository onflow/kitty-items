import {txDataType} from "./types"
import {isErrored, isSealed} from "./utils"

export default function TransactionListStatusIcon({data}) {
  if (isErrored(data)) {
    return (
      <img
        src="/images/transaction-error.svg"
        alt="Transaction Error"
        width={40}
        height={40}
      />
    )
  }

  if (isSealed(data)) {
    return (
      <img
        src="/images/transaction-success.svg"
        alt="Trasaction Sealed"
        width={40}
        height={40}
      />
    )
  }

  return (
    <div className="relative">
      <img
        src="/images/transaction-pending-bg.svg"
        alt="Transaction Pending"
        width={40}
        height={40}
      />
      <div className="absolute w-full h-full top-0 flex items-center justify-center animate-spin transform rotate-180">
        <img
          src="/images/transaction-sync-arrows.svg"
          alt="Transaction Pending"
          width={24}
          height={24}
        />
      </div>
    </div>
  )
}

TransactionListStatusIcon.propTypes = {
  data: txDataType,
}
