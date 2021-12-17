import {Menu, Transition} from "@headlessui/react"
import * as fcl from "@onflow/fcl"
import Link from "next/link"
import {Fragment} from "react"
import Avatar from "src/components/Avatar"
import {flashMessages, paths} from "src/global/constants"
import useAppContext from "src/hooks/useAppContext"

const menuItemClasses = active =>
  `${
    active ? "bg-green" : ""
  } hover:bg-green text-sm group flex rounded-md items-center w-full px-2 py-1`

export default function HeaderDropdown() {
  const {currentUser, setFlashMessage, switchToAdminView} = useAppContext()

  const address = currentUser.addr

  if (!address) return null

  const signOut = () => {
    fcl.unauthenticate()
    setFlashMessage(flashMessages.loggedOutSuccess)
  }

  return (
    <div className="flex items-center">
      <Menu as="div" className="relative flex inline-block text-left">
        <Menu.Button className="w-10 h-10 hover:opacity-80">
          <Avatar address={address} />
        </Menu.Button>
        <button
          onClick={switchToAdminView}
          className="flex items-center justify-center h-10 px-5 ml-2 text-sm text-white bg-black rounded-full hover:opacity-80"
        >
          Admin
          <img
            src="/images/sliders.svg"
            alt="Switch to Admin View"
            className="ml-2"
          />
        </button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-50 mt-12 origin-top-right bg-white divide-y divide-gray-200 rounded-md w-44 ring-1 ring-black ring-opacity-10 focus:outline-none">
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
