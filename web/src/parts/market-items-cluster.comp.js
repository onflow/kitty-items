import {Suspense} from "react"
import {useMarketItems} from "../hooks/use-market-items.hook"
import Item from "./market-item-cluster.comp"
import {Box, Table, Thead, Tbody, Tr, Th, Text, Spinner} from "@chakra-ui/react"

export function MarketItemsCluster() {
  const {items, status} = useMarketItems()

  if (items.length <= 0)
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
            <Th>Price</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map(item => (
            <Item
              key={item.itemID}
              id={item.itemID}
              address={item.owner}
              status={status}
            />
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

export default function WrappedMarketItemsCluster() {
  return (
    <Suspense
      fallback={
        <Box borderWidth="1px" borderRadius="lg" p="4">
          <Spinner />
        </Box>
      }
    >
      <MarketItemsCluster />
    </Suspense>
  )
}
