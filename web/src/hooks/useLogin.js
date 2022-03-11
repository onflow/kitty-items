import * as fcl from "@onflow/fcl"
import {useRouter} from "next/router"
import {paths} from "src/global/constants"

export default function useLogin() {
  const router = useRouter()

  const logIn = async (redirect = true) => {
    const user = await fcl.logIn()
    if (redirect && user.addr) {
      router.push(paths.profile(user.addr))
    }
  }

  return logIn
}
