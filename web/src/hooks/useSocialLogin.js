import {useRouter} from "next/router"

export default function useSocialLogin() {
  const router = useRouter()

  const socialLogIn = async () => {
    console.log("Using social log in")
  }

  return socialLogIn
}
