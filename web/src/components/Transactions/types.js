import PropTypes from "prop-types"

export const txDataType = PropTypes.exact({
  errorMessage: PropTypes.string.isRequired,
  events: PropTypes.array.isRequired,
  status: PropTypes.number.isRequired,
  statusCode: PropTypes.number.isRequired,
  statusString: PropTypes.string.isRequired,
})

export const txType = PropTypes.exact({
  id: PropTypes.string.isRequired,
  url: PropTypes.string,
  title: PropTypes.string.isRequired,
  data: txDataType,
})
