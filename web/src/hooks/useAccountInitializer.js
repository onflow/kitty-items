import {initializeAccount as initializeAccountTx} from "src/flow/tx.initialize-account"
import {flashMessages} from "src/global/constants"
import useAppContext from "src/hooks/useAppContext"

const DECLINE_RESPONSE = "Declined: Externally Halted"
export default function useAccountInitializer() {
  const {currentUser, checkIsAccountInitialized, setFlashMessage} =
    useAppContext()

  const initializeAccount = () => {
    if (!currentUser?.addr) throw "Missing signed in user"

    initializeAccountTx(currentUser.addr, {
      onStart() {},
      onSuccess: () => {
        checkIsAccountInitialized()
        setFlashMessage(flashMessages.initializeAccountSuccess)
      },
      onError(e) {
        if (e !== DECLINE_RESPONSE) {
          setFlashMessage(flashMessages.initializeAccountError)
        }
      },
    })
  }

  return {initializeAccount}
}
