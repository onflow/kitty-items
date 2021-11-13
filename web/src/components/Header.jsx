import Link from "next/link"
import {useRouter} from "next/router"
import HeaderDropdown from "src/components/HeaderDropdown"
import HeaderFUSDAmount from "src/components/HeaderFUSDAmount"
import HeaderLink from "src/components/HeaderLink"
import {paths} from "src/global/constants"
import useAppContext from "src/hooks/useAppContext"
import useLogin from "src/hooks/useLogin"
import HeaderMessage from "./HeaderMessage"

export default function Header() {
  const {currentUser} = useAppContext()
  const router = useRouter()
  const logIn = useLogin()
  const isAdminPath = router.pathname === paths.adminMint

  return (
    <header className="border-b bg-white border-gray-200">
      <HeaderMessage />
      <div className="main-container py-4 max-w-2 flex justify-between">
        <Link href={paths.root} passHref>
          <a className="flex items-center hover:opacity-80">
            <div className="w-12 sm:w-auto flex">
              <img
                src="/images/kitty-items-logo.svg"
                alt="Kitty Items"
                width="60"
                height="60"
              />
            </div>
            <div className="flex text-sm sm:text-2xl lg:text-3xl font-bold ml-2 sm:ml-3 text-gray-darkest">
              Kitty Items
            </div>
          </a>
        </Link>
        {!isAdminPath && (
          <div className="flex items-center">
            <div className="mr-2 md:mr-4">
              <HeaderLink href={paths.root}>Drops</HeaderLink>
              <HeaderLink href={paths.marketplace}>Marketplace</HeaderLink>
            </div>
            {!!currentUser && (
              <div className="mr-2 hidden md:flex">
                <HeaderFUSDAmount />
              </div>
            )}
            {currentUser ? (
              <HeaderDropdown />
            ) : (
              <button
                onClick={logIn}
                className="text-sm sm:text-lg md:text-xl text-gray-700 mr-2"
              >
                Log In
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
