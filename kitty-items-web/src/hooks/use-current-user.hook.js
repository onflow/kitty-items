import {useEffect} from "react"
import {atom, useRecoilState} from "recoil"
import * as fcl from "@onflow/fcl"

export const currentUser = atom({
  key: "CURRENT_USER",
  default: {addr: null, loggedIn: null, cid: null},
})

const tools = {
  logIn: fcl.logIn,
  logOut: fcl.unauthenticate,
  signUp: fcl.signUp,
  changeUser: fcl.reauthenticate,
}

export function useCurrentUser() {
  const [user, setUser] = useRecoilState(currentUser)
  useEffect(() => fcl.currentUser().subscribe(setUser), [setUser])
  return [user, user.addr != null, tools]
}
