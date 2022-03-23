import Link from "next/link"
import {paths} from "src/global/constants"
import {txType} from "./types"
import {isSuccessful} from "./utils"

export default function TransactionListUrl({tx}) {
  const useCustomUrl = !!tx.url && isSuccessful(tx.data)
  const txUrl = useCustomUrl ? tx.url : paths.flowscanTx(tx.id)

  return (
    <div className="flex invisible group-hover:visible ml-auto flex justify-center w-10 -mr-3">
      <Link href={txUrl} passHref>
        <a
          className="flex justify-center cursor-pointer hover:opacity-60 p-3"
          target={useCustomUrl ? undefined : "_blank"}
        >
          {useCustomUrl ? (
            <img
              src="/images/angle-right.svg"
              alt="View Transaction"
              width={6}
              height={10}
            />
          ) : (
            <img
              src="/images/external-link.svg"
              alt="View Transaction"
              width={15}
              height={15}
            />
          )}
        </a>
      </Link>
    </div>
  )
}

TransactionListUrl.propTypes = {
  tx: txType,
}
