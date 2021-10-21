import PropTypes from "prop-types"

export const IDLE = "IDLE"
export const START = "START"
export const SUCCESS = "SUCCESS"
export const ERROR = "ERROR"

export const initialState = {
  data: undefined,
  isLoading: false,
  isError: false,
}

export const requestReducer = (state, action) => {
  switch (action.type) {
    case IDLE:
      return initialState
    case START:
      return {
        ...state,
        isLoading: true,
        isError: false,
      }
    case SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      }
    case ERROR:
      return {
        ...state,
        isLoading: false,
        isError: true,
      }
    default:
      throw new Error()
  }
}

requestReducer.propTypes = {
  state: PropTypes.string.isRequired,
  action: PropTypes.shape({
    payload: PropTypes.object,
  }),
}
