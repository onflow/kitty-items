import {Menu, Transition} from "@headlessui/react"
import * as fcl from "@onflow/fcl"
import Link from "next/link"
import {useRouter} from "next/router"
import {Fragment} from "react"
import Avatar from "src/components/Avatar"
import {flashMessages, paths} from "src/global/constants"
import useAppContext from "src/hooks/useAppContext"
import useFUSDMinter from "src/hooks/useFUSDMinter"

const menuItemClasses = active =>
  `${
    active ? "bg-green" : ""
  } hover:bg-green text-sm group flex rounded-md items-center w-full px-2 py-1`

export default function HeaderDropdown() {
  const {
    currentUser,
    isAccountInitialized,
    isLoggedInAsAdmin,
    setShowAdminLoginDialog,
    setFlashMessage,
  } = useAppContext()
  const router = useRouter()
  const address = currentUser.addr
  const [{isLoading: isFUSDMinterLoading}, mintFUSD] = useFUSDMinter()

  if (!address) return null

  const signOut = () => {
    fcl.unauthenticate()
    setFlashMessage(flashMessages.loggedOutSuccess)
  }
  const mint = () => mintFUSD(currentUser.addr)

  const switchToAdminView = () => {
    if (isLoggedInAsAdmin) {
      router.push(paths.adminMint)
    } else {
      setShowAdminLoginDialog(true)
    }
  }

  return (
    <div className="flex items-center flex">
      <Menu as="div" className="relative inline-block flex text-left">
        <Menu.Button className="h-10 w-10 hover:opacity-80">
          <Avatar address={address} />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 w-44 mt-12 origin-top-right bg-white divide-y divide-gray-200 rounded-md ring-1 ring-black ring-opacity-10 focus:outline-none z-50">
            <div className="font-mono text-xs text-center font-bold text-gray-darkest p-1.5">
              {address}
            </div>
            <div className="px-1 py-2">
              <Menu.Item>
                {({active}) => (
                  <Link href={paths.profile(currentUser.addr)}>
                    <a className={menuItemClasses(active)}>Profile</a>
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({active}) => (
                  <button
                    onClick={switchToAdminView}
                    className={menuItemClasses(active)}
                  >
                    Switch to Admin View
                  </button>
                )}
              </Menu.Item>
              {isAccountInitialized && (
                <Menu.Item>
                  {({active}) => (
                    <button
                      onClick={mint}
                      disabled={isFUSDMinterLoading}
                      className={menuItemClasses(active)}
                    >
                      Mint FUSD
                    </button>
                  )}
                </Menu.Item>
              )}
              <Menu.Item>
                {({active}) => (
                  <button onClick={signOut} className={menuItemClasses(active)}>
                    Sign Out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
