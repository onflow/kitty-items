import {initializeAccount as initializeAccountTx} from "src/flow/tx.initialize-account"
import useAppContext from "src/hooks/useAppContext"

const DECLINE_RESPONSE = "Declined: Externally Halted"
export default function useAccountInitializer() {
  const {currentUser, checkIsAccountInitialized} = useAppContext()

  const initializeAccount = () => {
    if (!currentUser?.addr) throw "Missing signed in user"

    initializeAccountTx(currentUser.addr, {
      onStart() {},
      onSuccess: () => {
        checkIsAccountInitialized()
      },
      onError(e) {
        if (e !== DECLINE_RESPONSE) {
          alert("Account initialization has failed, please try again.")
        }
      },
    })
  }

  return {initializeAccount}
}
