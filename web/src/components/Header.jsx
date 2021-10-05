import * as fcl from "@onflow/fcl"
import Link from "next/link"
import {paths} from "src/global/constants"
import publicConfig from "src/global/publicConfig"
import useAppContext from "src/hooks/useAppContext"
import useFUSDMinter from "src/hooks/useFUSDMinter"

export default function Header() {
  const {currentUser, fusdBalance} = useAppContext()
  const [{isLoading: isFUSDMinterLoading}, mintFUSD] = useFUSDMinter()
  const mint = () => mintFUSD(currentUser.addr)
  const logOut = () => fcl.unauthenticate()
  const logIn = () => fcl.logIn()
  const signUp = () => fcl.signUp()

  return (
    <header>
      <Link href={paths.root}>Drops</Link>
      {" | "}
      <Link href={paths.marketplace}>Marketplace</Link>
      {" | "}
      {currentUser?.addr === publicConfig.flowAddress && (
        <>
          <Link href={paths.adminMint}>Mint Item</Link>
          {" | "}
        </>
      )}

      {currentUser ? (
        <>
          <Link href={paths.profile(currentUser.addr)}>{currentUser.addr}</Link>
          {" | "}
          <div>
            FUSD: {fusdBalance}
            <button onClick={mint} disabled={isFUSDMinterLoading}>
              Mint FUSD
            </button>
            <button onClick={logOut}>Log Out</button>
          </div>
        </>
      ) : (
        <>
          <button onClick={logIn}>Log In</button>
          <button onClick={signUp}>Sign Up</button>
        </>
      )}
      <br />
    </header>
  )
}
