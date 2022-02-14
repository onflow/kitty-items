import {useReducer} from "react"
import {initializeAccount as initializeAccountTx} from "src/flow/tx.initialize-account"
import {DECLINE_RESPONSE} from "src/global/constants"
import useAppContext from "src/hooks/useAppContext"
import {
  ERROR,
  IDLE,
  initialState,
  requestReducer,
  START,
  SUCCESS,
} from "src/reducers/requestReducer"

export default function useAccountInitializer(onSuccess) {
  const {currentUser, checkIsAccountInitialized} = useAppContext()
  const [state, dispatch] = useReducer(requestReducer, initialState)

  const initializeAccount = () => {
    if (!currentUser?.addr) throw new Error("Missing signed in user")

    initializeAccountTx(currentUser.addr, {
      onStart() {
        dispatch({type: START})
      },
      onSuccess: () => {
        checkIsAccountInitialized()
        if (typeof onSuccess === "function") onSuccess()
        dispatch({type: SUCCESS})
      },
      onError(e) {
        if (e === DECLINE_RESPONSE) {
          dispatch({type: IDLE})
        } else {
          dispatch({type: ERROR})
        }
      },
    })
  }

  return [state, initializeAccount]
}
