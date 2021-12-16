import AdminNav from "src/components/AdminNav"
import Minter from "src/components/Minter"
import PageTitle from "src/components/PageTitle"
import useAppContext from "src/hooks/useAppContext"
import useLogin from "src/hooks/useLogin"

export default function Mint() {
  const {currentUser, isLoggedInAsAdmin, setShowAdminLoginDialog} =
    useAppContext()

  const logIn = useLogin()

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
        <div className="main-container py-14">
          <AdminNav />
          <Minter />
        </div>
      </main>
    </div>
  )
}
