import {Suspense} from "react"
import {useMarketItems} from "../hooks/use-market-items.hook"
import {useCurrentUser} from "../hooks/use-current-user.hook"
import Item from "./market-item-cluster.comp"
import {Box, Table, Thead, Tbody, Tr, Th, Text, Spinner} from "@chakra-ui/react"

export function MarketItemsCluster({address}) {
  const items = useMarketItems(address)
  const [cu] = useCurrentUser()

  if (address == null) return null

  if (items.ids.length <= 0)
    return (
      <Box borderWidth="1px" borderRadius="lg" p="4">
        <Text>No Items Listed For Sale</Text>
      </Box>
    )

  return (
    <Box borderWidth="1px" borderRadius="lg">
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Id</Th>
            <Th>Type</Th>
            <Th>Image</Th>
            <Th isNumeric>Price</Th>
            {cu.addr === address ? <Th /> : null}
          </Tr>
        </Thead>
        <Tbody>
          {items.ids.map(id => (
            <Item key={id} id={id} address={address} />
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

export default function WrappedMarketItemsCluster({address}) {
  return (
    <Suspense
      fallback={
        <Box borderWidth="1px" borderRadius="lg" p="4">
          <Spinner />
        </Box>
      }
    >
      <MarketItemsCluster address={address} />
    </Suspense>
  )
}
