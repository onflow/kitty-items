import {Bar, Label} from "../display/bar.comp"
import {useConfig} from "../hooks/use-config.hook"

const Link = ({address, name}) => {
  const env = useConfig("env")

  return (
    <li>
      {name}:{" "}
      <a href={fvs(env, address, name)} target="_blank" rel="noreferrer">
        {address}
      </a>
    </li>
  )
}

export function ContractsCluster() {
  const kibble = useConfig("0xKibble")
  const items = useConfig("0xKittyItems")
  const market = useConfig("0xKittyItemsMarket")

  return (
    <div>
      <Bar>
        <Label>Contracts</Label>
      </Bar>
      <ul>
        <Link address={kibble} name="Kibble" />
        <Link address={items} name="KittyItems" />
        <Link address={market} name="KittyItemsMarket" />
      </ul>
    </div>
  )
}

export default function WrappedContractsCluster() {
  return <ContractsCluster />
}

function fvs(env, addr, contract) {
  return `https://flow-view-source.com/${env}/account/${addr}/contract/${contract}`
}
