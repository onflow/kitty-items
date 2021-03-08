import {Suspense} from "react"
import {useFlowBalance} from "../hooks/use-flow-balance.hook"
import {Bar, Label, Button} from "../display/bar.comp"
import {IDLE} from "../global/constants"
import {Loading} from "../parts/loading.comp"
import {fmtFlow} from "../util/fmt-flow"

export function FlowBalanceCluster({address}) {
  const flow = useFlowBalance(address)
  if (address == null) return null

  return (
    <Bar>
      <Label>Flow Balance:</Label>
      <Label strong good={flow.balance > 0} bad={flow.balance <= 0}>
        {fmtFlow(flow.balance)}
      </Label>
      <Button disabled={flow.status !== IDLE} onClick={flow.refresh}>
        Refresh
      </Button>
      {flow.status !== IDLE && <Loading label={flow.status} />}
    </Bar>
  )
}

export default function WrappedFlowBalanceCluster({address}) {
  return (
    <Suspense
      fallback={
        <Bar>
          <Loading label="Fetching Flow Balance" />
        </Bar>
      }
    >
      <FlowBalanceCluster address={address} />
    </Suspense>
  )
}
