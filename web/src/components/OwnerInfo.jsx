import Link from "next/link"
import PropTypes from "prop-types"
import {paths} from "src/global/constants"
import useAppContext from "src/hooks/useAppContext"
import Avatar from "./Avatar"

export default function OwnerInfo({address, size = "sm"}) {
  const {currentUser} = useAppContext()
  return (
    <Link href={paths.profile(address)} passHref>
      <a className="inline-flex items-center mt-6 -mb-1 hover:opacity-80">
        <div className={`relative ${size === "lg" ? "w-16 h-16" : "w-8 h-8"}`}>
          <Avatar address={address} />
        </div>
        <div
          className={`ml-4 font-mono text-xs ${
            currentUser?.addr === address
              ? "text-green-dark"
              : "text-gray-darkest"
          }`}
        >
          {address}
        </div>
      </a>
    </Link>
  )
}

OwnerInfo.propTypes = {
  address: PropTypes.string.isRequired,
  size: PropTypes.string,
}
