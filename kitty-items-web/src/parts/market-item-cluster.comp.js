import {Suspense} from "react"
import {useMarketItem} from "../hooks/use-market-item.hook"
import {useAccountItem} from "../hooks/use-account-item.hook"
import {useCurrentUser} from "../hooks/use-current-user.hook"
import {IDLE} from "../global/constants"
import {fmtKibbles} from "../util/fmt-kibbles"
import {Tr, Td, Button, Spinner, Flex, Center, Text} from "@chakra-ui/react"

export function MarketItemCluster({address, id}) {
  const item = useAccountItem(address, id)
  const list = useMarketItem(address, id)
  const [, loggedIn] = useCurrentUser()

  const BUSY = item.status !== IDLE || list.status !== IDLE

  if (address == null) return null
  if (id == null) return null

  return (
    <Tr>
      <Td maxW="50px">
        <Flex>
          <Text>#{item.id}</Text>
          {BUSY && (
            <Center ml="4">
              <Spinner size="xs" />
            </Center>
          )}
        </Flex>
      </Td>
      <Td>{item.type}</Td>
      <Td isNumeric>{fmtKibbles(list.price, true)}</Td>
      {loggedIn && (
        <>
          {item.owned ? (
            <Td isNumeric maxW="20px">
              <Button
                colorScheme="orange"
                size="sm"
                disabled={BUSY}
                onClick={list.cancelListing}
              >
                Unlist
              </Button>
            </Td>
          ) : (
            <Td isNumeric maxW="15px">
              <Button
                colorScheme="blue"
                size="sm"
                disabled={BUSY}
                onClick={list.buy}
              >
                Buy
              </Button>
            </Td>
          )}
        </>
      )}
    </Tr>
  )
}

export default function WrappedMarketItemCluster(props) {
  return (
    <Suspense
      fallback={
        <Tr>
          <Td maxW="50px">
            <Flex>
              <Text>#{props.id}</Text>
              <Center ml="4">
                <Spinner size="xs" />
              </Center>
            </Flex>
          </Td>
          <Td />
          <Td />
        </Tr>
      }
    >
      <MarketItemCluster {...props} />
    </Suspense>
  )
}
