import {useReducer, useState} from "react"
import {removeListing} from "src/flow/tx.remove-listing"
import {
  DECLINE_RESPONSE,
  flashMessages,
  IDLE,
  paths,
  SUCCESS,
} from "src/global/constants"
import {
  ERROR,
  initialState,
  requestReducer,
  START,
} from "src/reducers/requestReducer"
import {useSWRConfig} from "swr"
import useAppContext from "./useAppContext"

export default function useItemRemoval() {
  const {mutate} = useSWRConfig()

  const [state, dispatch] = useReducer(requestReducer, initialState)
  const {setFlashMessage} = useAppContext()
  const [txStatus, setTxStatus] = useState(null)

  const remove = (listingId, itemId) => {
    if (!listingId) throw "Missing listingId"

    removeListing(
      {listingResourceID: listingId},
      {
        onStart() {
          dispatch({type: START})
        },
        onUpdate(t) {
          setTxStatus(t.status)
        },
        async onSuccess() {
          // TODO: Poll for removed API listing instead of setTimeout
          setTimeout(() => {
            mutate(paths.apiListing(itemId))
            dispatch({type: SUCCESS})

            setFlashMessage(flashMessages.itemRemovalSuccess)
          }, 1000)
        },
        async onError(e) {
          if (e === DECLINE_RESPONSE) {
            dispatch({type: IDLE})
          } else {
            dispatch({type: ERROR})
            setFlashMessage(flashMessages.itemRemovalError)
          }
        },
        onComplete() {
          setTxStatus(null)
        },
      }
    )
  }

  return [state, remove, txStatus]
}
