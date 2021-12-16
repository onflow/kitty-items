import Link from "next/link"
import {paths} from "src/global/constants"

export default function AdminNav() {
  return (
    <div
      className="flex justify-between items-center text-white text-sm bg-gray rounded-md
    h-10 py-2 px-5 -mt-4 mb-12"
    >
      <div className="uppercase">Administrator View</div>
      <Link href={paths.root} passHref>
        <a className="flex items-center hover:opacity-80">
          <span className="mr-3">Back to user view</span>
          <img
            src="/images/arrow-right-b.svg"
            alt="Flow"
            width={15}
            height={15}
          />
        </a>
      </Link>
    </div>
  )
}
