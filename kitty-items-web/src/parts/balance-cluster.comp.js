import {Suspense} from "react"
import {useFlowBalance} from "../hooks/use-flow-balance.hook"
import {useKibblesBalance} from "../hooks/use-kibbles-balance.hook"
import {useCurrentUser} from "../hooks/use-current-user.hook"
import {IDLE} from "../global/constants"
import {fmtFlow} from "../util/fmt-flow"
import {fmtKibbles} from "../util/fmt-kibbles"
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

export function BalanceCluster({address}) {
  const flow = useFlowBalance(address)
  const kibbles = useKibblesBalance(address)

  return (
    <Box mb="4">
      <Box mb="2">
        <Flex>
          <Heading size="md" mr="4">
            Balances
          </Heading>
          {(flow.status !== IDLE || kibbles.status !== IDLE) && (
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
              <Td>FLOW</Td>
              {flow.status === IDLE ? (
                <Td isNumeric>{fmtFlow(flow.balance)}</Td>
              ) : (
                <Td isNumeric>
                  <Spinner size="sm" />
                </Td>
              )}
            </Tr>
            <Tr>
              <Td>KIBBLE</Td>
              {kibbles.status === IDLE ? (
                <Td isNumeric>{fmtKibbles(kibbles.balance)}</Td>
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
            disabled={kibbles.status !== IDLE}
            onClick={kibbles.mint}
          >
            Request Meowr Kibbles
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
