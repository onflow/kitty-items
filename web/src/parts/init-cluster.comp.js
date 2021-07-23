import {Suspense} from "react"
import {useInitialized} from "../hooks/use-initialized.hook"
import {useCurrentUser} from "../hooks/use-current-user.hook"
import {IDLE} from "../global/constants"
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
import {CheckIcon, CloseIcon} from "@chakra-ui/icons"

const fmtBool = bool =>
  bool ? <CheckIcon color="green.500" /> : <CloseIcon color="red.500" />

export function InitCluster({address}) {
  const init = useInitialized(address)
  const [cu] = useCurrentUser()
  if (address == null) return null

  return (
    <Box mb="4">
      <Box mb="2">
        <Flex>
          <Heading size="md" mr="4">
            Account Initialized?
          </Heading>
          {init.status !== IDLE && (
            <Center>
              <Spinner />
            </Center>
          )}
        </Flex>
      </Box>
      <Box maxW="200px" borderWidth="1px" borderRadius="lg">
        <Table size="sm">
          <Tbody>
            <Tr>
              <Td>Kibble</Td>
              <Td>{fmtBool(init.Kibble)}</Td>
            </Tr>
            <Tr>
              <Td>Kitty Items</Td>
              <Td>{fmtBool(init.KittyItems)}</Td>
            </Tr>
            <Tr>
              <Td>Kitty Items Market</Td>
              <Td>{fmtBool(init.KittyItemsMarket)}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
      {!init.isInitialized && address === cu.addr && (
        <Box mt="2">
          <Flex>
            <Button
              colorScheme="blue"
              disabled={init.status !== IDLE}
              onClick={init.initialize}
            >
              Initialize Account
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  )
}

export default function WrappedInitCluster(props) {
  const [cu] = useCurrentUser()
  if (cu.addr !== props.address) return null

  return (
    <Suspense
      fallback={
        <Box mb="2">
          <Flex>
            <Heading size="md" mr="4">
              Account Initialized?
            </Heading>
            <Center>
              <Spinner size="sm" />
            </Center>
          </Flex>
        </Box>
      }
    >
      <InitCluster {...props} />
    </Suspense>
  )
}
