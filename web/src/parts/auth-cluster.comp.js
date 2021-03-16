import {Suspense} from "react"
import {useCurrentUser} from "../hooks/use-current-user.hook"
import {Link as A} from "react-router-dom"
import {
  Flex,
  Box,
  Spacer,
  Link,
  Center,
  HStack,
  Heading,
  Button,
  Divider,
  Image,
} from "@chakra-ui/react"

import Logo from "../svg/logo-kv.svg"

export function AuthCluster() {
  const [user, loggedIn, {signUp, logIn, logOut}] = useCurrentUser()

  return loggedIn ? (
    <Box mb="4">
      <Flex>
        <HStack>
          <Image src={Logo} />
          <Heading size="lg">Kitty Items</Heading>
        </HStack>
        <Spacer />
        <Center>
          <Link as={A} mr="4" to={"/" + user.addr}>
            {user.addr}
          </Link>
        </Center>
        <Box>
          <Button mr="4" colorScheme="blue" onClick={logOut}>
            Log Out
          </Button>
        </Box>
      </Flex>
    </Box>
  ) : (
    <Box>
      <Flex>
        <Box p="2">
          <HStack>
            <Image src={Logo} />
            <Heading size="lg">Kitty Items</Heading>
          </HStack>
        </Box>
        <Spacer />
        <Box>
          <Button mr="4" colorScheme="blue" onClick={logIn}>
            Log In
          </Button>
          <Button mr="4" colorScheme="blue" onClick={signUp}>
            Sign Up
          </Button>
        </Box>
      </Flex>
      <Divider mb="4" />
    </Box>
  )
}

export default function WrappedAuthCluster() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCluster />
    </Suspense>
  )
}
