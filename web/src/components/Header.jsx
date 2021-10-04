import * as fcl from "@onflow/fcl"
import Link from "next/link"
import {paths} from "src/global/constants"
import useAppContext from "src/hooks/useAppContext"

export default function Header() {
  const {currentUser, fusdBalance} = useAppContext()
  const logOut = () => fcl.unauthenticate()
  const logIn = () => fcl.logIn()
  const signUp = () => fcl.signUp()

  return (
    <header>
      <Link href={paths.root}>Drops</Link>
      {" | "}
      <Link href={paths.marketplace}>Marketplace</Link>
      {" | "}
      <Link href={paths.adminMint}>Mint</Link>
      {" | "}

      {currentUser ? (
        <>
          FUSD: {fusdBalance}
          <button onClick={logOut}>Log Out</button>
        </>
      ) : (
        <>
          <button onClick={logIn}>Log In</button>
          <button onClick={signUp}>Sign Up</button>
        </>
      )}
    </header>
  )
}
