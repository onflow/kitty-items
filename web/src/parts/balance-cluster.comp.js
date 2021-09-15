import {Suspense} from "react"
import {useFlowBalance} from "../hooks/use-flow-balance.hook"
import {useFUSDBalance} from "../hooks/use-fusd-balance.hook"
import {useCurrentUser} from "../hooks/use-current-user.hook"
import {useConfig} from "../hooks/use-config.hook"
import {IDLE} from "../global/constants"
import {fmtFUSD} from "../util/fmt-fusd"
import {
  Box,
  Button,
  Table,
  Tbody,
  Tr,
  Td,
  Flex,
  Heading,
  Spinner,
  Center,
} from "@chakra-ui/react"
import {useInitialized} from "../hooks/use-initialized.hook"

export function BalanceCluster({address}) {
  const flow = useFlowBalance(address)
  const fusd = useFUSDBalance(address)
  const init = useInitialized(address)
  const testnetFaucet = useConfig("faucet")

  function openFaucet() {
    window.open(testnetFaucet)
  }

  return (
    <Box mb="4">
      <Box mb="2">
        <Flex>
          <Heading size="md" mr="4">
            Balances
          </Heading>
          {(flow.status !== IDLE || fusd.status !== IDLE) && (
            <Center>
              <Spinner size="sm" />
            </Center>
          )}
        </Flex>
      </Box>
      <Box maxW="200px" borderWidth="1px" borderRadius="lg">
        <Table size="sm">
          <Tbody>
            <Tr>
              <Td>FUSD</Td>
              {fusd.status === IDLE ? (
                <Td isNumeric>{fmtFUSD(fusd.balance)}</Td>
              ) : (
                <Td isNumeric>
                  <Spinner size="sm" />
                </Td>
              )}
            </Tr>
          </Tbody>
        </Table>
      </Box>
      <Box mt="2">
        <Flex>
          <Button
            colorScheme="blue"
            disabled={fusd.status !== IDLE || !init.isInitialized}
            onClick={() => (testnetFaucet ? openFaucet() : fusd.mint())}
          >
            Request FUSD
          </Button>
        </Flex>
      </Box>
    </Box>
  )
}

export default function WrappedBalanceCluster(props) {
  const [cu] = useCurrentUser()
  if (cu.addr !== props.address) return null

  return (
    <Suspense
      fallback={
        <Flex>
          <Heading size="md" mr="4">
            Balances
          </Heading>
          <Center>
            <Spinner size="sm" />
          </Center>
        </Flex>
      }
    >
      <BalanceCluster {...props} />
    </Suspense>
  )
}
