import * as fcl from "@onflow/fcl"
import PageTitle from "src/components/PageTitle"
import useAppContext from "src/hooks/useAppContext"
import useMinter from "src/hooks/useMinter"

export default function Mint() {
  const {currentUser, isLoggedInAsAdmin, setShowAdminLoginDialog} =
    useAppContext()
  const logIn = () => fcl.logIn()

  const onSuccess = data => {
    console.log(data)
  }

  const [{isLoading}, mint] = useMinter(onSuccess)

  const onAdminLoginClick = () => {
    setShowAdminLoginDialog(true)
  }

  if (!currentUser?.addr) {
    return (
      <div className="flex items-center justify-center mt-14">
        <button onClick={logIn}>Log In to Kitty Items</button>
      </div>
    )
  }

  if (!isLoggedInAsAdmin) {
    return (
      <div className="flex items-center justify-center mt-14">
        <button onClick={onAdminLoginClick}>Log In to Admin View</button>
      </div>
    )
  }

  return (
    <div>
      <PageTitle>Mint</PageTitle>
      <main>
        <h1>Mint</h1>
        <br />
        <button
          className="bg-gray-200 hover:bg-gray-100 rounded-4"
          onClick={mint}
          disabled={isLoading}
        >
          Mint Item
        </button>
      </main>
    </div>
  )
}
