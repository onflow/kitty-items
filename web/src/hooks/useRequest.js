import PropTypes from "prop-types"
import {useReducer} from "react"
import {
  ERROR,
  initialState,
  requestReducer,
  START,
  SUCCESS,
} from "src/reducers/requestReducer"

export default function useRequest() {
  const [state, dispatch] = useReducer(requestReducer, initialState)

  const executeRequest = ({url, method, data, onSuccess, onError}) => {
    dispatch({type: START})
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        dispatch({type: SUCCESS, payload: data})
        if (typeof onSuccess === "function") onSuccess(data)
      })
      .catch(error => {
        dispatch({type: ERROR})
        if (typeof onError === "function") onError(error)
      })
  }

  executeRequest.propTypes = {
    address: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }

  return [state, executeRequest]
}
