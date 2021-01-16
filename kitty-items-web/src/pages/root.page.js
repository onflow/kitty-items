import {Base} from "../parts/base.comp"
import {useCurrentUser} from "../hooks/use-current-user.hook"
import {Redirect} from "react-router-dom"
import {Box, Button, Flex, Center, Heading, Spacer} from "@chakra-ui/react"

export function Page() {
  const [user, loggedIn, {signUp, logIn}] = useCurrentUser()

  if (loggedIn) return <Redirect to={"/" + user.addr} />

  return (
    <Base>
      <Box p="4">
        <Flex>
          <Center mr="4">
            <Heading size="md">Kitty Items</Heading>
          </Center>
          <Spacer />
          <Button mr="4" colorScheme="blue" onClick={logIn}>
            Log In
          </Button>
          <Button mr="4" colorScheme="blue" onClick={signUp}>
            Sign Up
          </Button>
        </Flex>
      </Box>
    </Base>
  )
}
