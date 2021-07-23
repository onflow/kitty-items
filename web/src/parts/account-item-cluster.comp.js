import React, {useEffect, useState, Suspense} from "react"
import {useAccountItem} from "../hooks/use-account-item.hook"
import {useMarketItem} from "../hooks/use-market-item.hook"
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
  Image,
  HStack,
} from "@chakra-ui/react"

export const ItemImage = ({typeID}) => {
  // Lazy load SVG images for the kitty items.
  let [item, setItemImage] = useState("")

  useEffect(() => {
    async function getImage() {
      let importedIcon = await import(`../svg/Items/item0${typeID}.svg`)
      setItemImage(importedIcon.default)
    }
    if (typeID) getImage()
  }, [typeID])

  return <Image maxW="64px" src={item} />
}

export function AccountItemCluster({address, id}) {
  const item = useAccountItem(address, id)
  const listing = useMarketItem(address, id)
  const [cu] = useCurrentUser()

  const BUSY = item.status !== IDLE || listing.status !== IDLE

  if (address == null) return null
  if (id == null) return null

  return (
    <Tr>
      <Td maxW="50px">
        <Flex>
          <Text as={item.forSale && "del"}>#{item.itemID}</Text>
        </Flex>
      </Td>
      <Td>({item.typeID})</Td>
      <Td>
        <ItemImage typeID={item.typeID} />
      </Td>
      {cu.addr === address && (
        <>
          {!item.forSale ? (
            <Td isNumeric>
              <Button
                colorScheme="blue"
                size="sm"
                disabled={BUSY}
                onClick={() => item.sell("10.0")}
              >
                <HStack>
                  {BUSY && <Spinner mr="2" size="xs" />}{" "}
                  <Text>List for 10 KIBBLE</Text>
                </HStack>
              </Button>
            </Td>
          ) : (
            <Td isNumeric>
              <Button
                size="sm"
                colorScheme="orange"
                disabled={BUSY}
                onClick={listing.cancelListing}
              >
                <HStack>
                  {BUSY && <Spinner mr="2" size="xs" />} <Text>Unlist</Text>
                </HStack>
              </Button>
            </Td>
          )}
        </>
      )}
    </Tr>
  )
}

export default function WrappedAccountItemCluster(props) {
  return (
    <Suspense
      fallback={
        <Tr>
          <Td>
            <Flex>
              <Text>#{props.id}</Text>
              <Center ml="4">
                <Spinner size="xs" />
              </Center>
            </Flex>
          </Td>
          <Td />
          <Td />
          <Td />
        </Tr>
      }
    >
      <AccountItemCluster {...props} />
    </Suspense>
  )
}
