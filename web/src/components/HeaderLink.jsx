import {useRouter} from "next/dist/client/router"
import Link from "next/link"
import PropTypes from "prop-types"

export default function HeaderLink({href, children}) {
  const router = useRouter()
  const activeClasses = router.pathname === href ? "border-opacity-100" : ""

  return (
    <Link href={href}>
      <a
        className={`text-sm sm:text-lg md:text-xl font-semibold mx-1.5 sm:mx-3 border-b-2 pt-1 pb-0 border-green border-opacity-0 ${activeClasses} hover:opacity-80`}
      >
        {children}
      </a>
    </Link>
  )
}

HeaderLink.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node,
}
