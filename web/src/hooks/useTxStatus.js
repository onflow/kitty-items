import * as fcl from "@onflow/fcl"
import {useState} from "react"

export default function useTxStatus() {
  const [txStatus, setTxStatus] = useState(null)

  const subscribe = async txId => {
    return await fcl.tx(txId).subscribe(res => {
      if (Number.isInteger(res.status)) setTxStatus(res.status)
    })
  }

  const clearTxStatus = () => setTxStatus(null)
  return [subscribe, txStatus, clearTxStatus]
}
