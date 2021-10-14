import * as fcl from "@onflow/fcl"
import Image from "next/image"
import Link from "next/link"
import HeaderDropdown from "src/components/HeaderDropdown"
import HeaderFUSDAmount from "src/components/HeaderFUSDAmount"
import HeaderLink from "src/components/HeaderLink"
import {paths} from "src/global/constants"
import useAppContext from "src/hooks/useAppContext"

export default function Header() {
  const {currentUser} = useAppContext()
  const logIn = () => fcl.logIn()

  return (
    <header className="border-b border-gray-200">
      <div className="bg-green-dark text-white text-sm sm:text-lg font-bold text-center py-4 px-2">
        <span className="mr-3 text-sm">💻</span>Kitty Items is a demo
        application running on the{" "}
        <a
          className="border-b border-white"
          href="https://docs.onflow.org/concepts/accessing-testnet/"
          target="_blank"
          rel="noreferrer"
        >
          Flow test network
        </a>
        .
      </div>
      <div className="main-container py-4 max-w-2 flex justify-between">
        <Link href={paths.root} passHref>
          <a className="flex items-center">
            <div className="w-12 sm:w-auto flex">
              <Image
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
      </div>
    </header>
  )
}
