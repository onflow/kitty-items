import {Suspense} from "react"
import {useMarketItem} from "../hooks/use-market-item.hook"
import {useAccountItem} from "../hooks/use-account-item.hook"
import {useCurrentUser} from "../hooks/use-current-user.hook"
import {IDLE} from "../global/constants"
import {
  Tr,
  Td,
  Button,
  Spinner,
  Flex,
  Center,
  Text,
  HStack,
} from "@chakra-ui/react"

import {ItemImage} from "./account-item-cluster.comp"

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
        </Flex>
      </Td>
      <Td>({item.type})</Td>
      <Td>
        <ItemImage type={item.type} />
      </Td>
      <Td isNumeric>{item.price || 10}</Td>
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
                <HStack>
                  {BUSY && <Spinner mr="2" size="xs" />}
                  <Text>Unlist</Text>
                </HStack>
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
                <HStack>
                  {BUSY && <Spinner mr="2" size="xs" />}
                  <Text>Buy</Text>
                </HStack>
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
