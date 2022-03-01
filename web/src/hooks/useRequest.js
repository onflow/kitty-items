import {useEffect, useReducer, useRef} from "react"
import {
  ERROR,
  initialState,
  requestReducer,
  SUCCESS,
} from "src/reducers/requestReducer"

export default function useRequest() {
  const [state, dispatch] = useReducer(requestReducer, initialState)
  const abortControllerRef = useRef()

  const executeRequest = ({url, method, data, onSuccess, onError}) => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: abortControllerRef.current.signal,
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        abortControllerRef.current = undefined
        dispatch({type: SUCCESS, payload: data})
        if (typeof onSuccess === "function") onSuccess(data)
      })
      .catch(error => {
        dispatch({type: ERROR})
        if (typeof onError === "function") onError(error)
      })
  }

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  return [state, executeRequest]
}
