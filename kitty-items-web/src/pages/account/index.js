import {Suspense} from "react"
import {Base} from "../../parts/base.comp"
import {IDLE} from "../../global/constants"
import {useAddress} from "../../hooks/use-url-address.hook"
import {useCurrentUser} from "../../hooks/use-current-user.hook"
import {useMarketItems} from "../../hooks/use-market-items.hook"
import {useAccountItems} from "../../hooks/use-account-items.hook"
import AuthCluster from "../../parts/auth-cluster.comp"
import InitCluster from "../../parts/init-cluster.comp"
import BalanceCluster from "../../parts/balance-cluster.comp"
import MarketItemsCluster from "../../parts/market-items-cluster.comp"
import AccountItemsCluster from "../../parts/account-items-cluster.comp"
import {
  Box,
  Flex,
  Center,
  Heading,
  Tag,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Spinner,
  Button,
  HStack,
  Image,
} from "@chakra-ui/react"

import Cookie from "../../svg/cookie.svg"
import BackPack from "../../svg/backpack.svg"

const STORE_ADDRESS = process.env.REACT_APP_STORE_ADDRESS

export function MarketItemsCount({address}) {
  const items = useMarketItems(address)
  if (items.status !== IDLE) return <Spinner size="xs" ml="1" />
  const l = items?.ids?.length ?? 0
  return l > 0 ? <Tag ml="1">{l}</Tag> : null
}

export function AccountItemsCount({address}) {
  const items = useAccountItems(address)
  if (items.status !== IDLE) return <Spinner size="xs" ml="1" />
  const l = items?.ids?.length ?? 0
  return l > 0 ? <Tag ml="1">{l}</Tag> : null
}

export function StoreItemsCount() {
  const items = useMarketItems(STORE_ADDRESS)
  if (items.status !== IDLE) return <Spinner size="xs" ml="1" />
  const l = items?.ids?.length ?? 0
  return l > 0 ? <Tag ml="1">{l}</Tag> : null
}

export function MintButton({address}) {
  const items = useAccountItems(address)

  return (
    <Button disabled={items.status !== IDLE} onClick={items.mint}>
      Mint Item
    </Button>
  )
}

export function Page() {
  const address = useAddress()
  const [cu] = useCurrentUser()
  if (address == null) return <div>Not Found</div>

  return (
    <Base>
      <Box p="4">
        <AuthCluster />
        <Flex mb="4">
          <Center>
            <Text mr="4" fontSize="2xl" color="purple.500">
              Account:
            </Text>
          </Center>
          <Heading>{address}</Heading>
          {address === cu.addr && (
            <Center>
              <Tag ml="4" variant="outline" colorScheme="orange">
                You
              </Tag>
            </Center>
          )}
        </Flex>
        <Flex>
          <Box>
            <InitCluster address={address} />
          </Box>
          <Box ml="4">
            <BalanceCluster address={address} />
          </Box>
          {cu.addr === address && cu.addr === STORE_ADDRESS && (
            <Box ml="4">
              <Suspense fallback={null}>
                <MintButton address={address} />
              </Suspense>
            </Box>
          )}
        </Flex>
        <Tabs colorScheme="pink">
          <TabList>
            <Tab fontSize="2xl">
              <HStack>
                <Image src={Cookie} />
                <Box>Items Shop</Box>
              </HStack>
              <Suspense fallback={null}>
                <MarketItemsCount address={address} />
              </Suspense>
            </Tab>
            <Tab fontSize="2xl">
              <HStack>
                <Image src={BackPack} />
                <Box>My Items</Box>
              </HStack>
              <Suspense fallback={null}>
                <AccountItemsCount address={address} />
              </Suspense>
            </Tab>
            {cu.addr === address && (
              <Tab fontSize="2xl">
                <HStack>
                  <Image src={BackPack} />
                  <Box>Store</Box>
                </HStack>
                <Suspense fallback={null}>
                  <StoreItemsCount address={address} />
                </Suspense>
              </Tab>
            )}
          </TabList>

          <TabPanels>
            <TabPanel>
              <MarketItemsCluster address={address} />
            </TabPanel>
            <TabPanel>
              <AccountItemsCluster address={address} />
            </TabPanel>
            {cu.addr === address && (
              <TabPanel>
                <MarketItemsCluster address={STORE_ADDRESS} />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Box>
    </Base>
  )
}
