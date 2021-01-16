import {Suspense} from "react"
import {useInitialized} from "../hooks/use-initialized.hook"
import {useKibblesBalance} from "../hooks/use-kibbles-balance.hook"
import {Bar, Label, Button} from "../display/bar.comp"
import {IDLE} from "../global/constants"
import {Loading} from "../parts/loading.comp"
import {fmtKibbles} from "../util/fmt-kibbles"

export function KibblesBalanceCluster({address}) {
  const init = useInitialized(address)
  const kibble = useKibblesBalance(address)
  if (address == null || !init.isInitialized) return null

  return (
    <Bar>
      <Label>Kibbles Balance:</Label>
      <Label strong good={kibble.balance > 0} bad={kibble.balance <= 0}>
        {fmtKibbles(kibble.balance)}
      </Label>
      <Button disabled={kibble.status !== IDLE} onClick={kibble.refresh}>
        Refresh
      </Button>
      <Button disabled={kibble.status !== IDLE} onClick={kibble.mint}>
        Mint
      </Button>
      {kibble.status !== IDLE && <Loading label={kibble.status} />}
    </Bar>
  )
}

export default function WrappedKibblesBalanceCluster({address}) {
  return (
    <Suspense
      fallback={
        <Bar>
          <Loading label="Fetching Kibbles Balance" />
        </Bar>
      }
    >
      <KibblesBalanceCluster address={address} />
    </Suspense>
  )
}
