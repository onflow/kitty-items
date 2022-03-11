import * as fcl from "@onflow/fcl"
import {useRouter} from "next/router"
import {paths} from "src/global/constants"
import { event } from 'src/global/analytics'

export default function useLogin() {
  const router = useRouter()

  const logIn = async () => {
    const user = await fcl.logIn()
    if (user.addr) {
      event({ action: "kitty-items-user-login", params: { user: user.addr } })
      router.push(paths.profile(user.addr))
    }
  }

  return logIn
}
