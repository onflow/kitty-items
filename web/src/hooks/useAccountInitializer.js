import {initializeAccount as initializeAccountTx} from "src/flow/tx.initialize-account"
import {DECLINE_RESPONSE, flashMessages} from "src/global/constants"
import useAppContext from "src/hooks/useAppContext"

export default function useAccountInitializer(onSuccess) {
  const {currentUser, checkIsAccountInitialized, setFlashMessage} =
    useAppContext()

  const initializeAccount = () => {
    if (!currentUser?.addr) throw "Missing signed in user"

    initializeAccountTx(currentUser.addr, {
      onStart() {},
      onSuccess: () => {
        checkIsAccountInitialized()
        if (typeof onSuccess === "function") onSuccess()
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
