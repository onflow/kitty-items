import PropTypes from "prop-types"
import * as React from "react"

const LoadingXsIcon = ({green}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{
      margin: "auto",
      display: "block",
      shapeRendering: "auto",
      width: 18,
      height: 18,
    }}
    width={74}
    height={74}
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
  >
    <circle
      cx={50}
      cy={50}
      fill="none"
      stroke={green ? "#26ed8d" : "#ffffff"}
      strokeWidth={12}
      r={40}
      strokeDasharray="188.49555921538757 64.83185307179586"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        repeatCount="indefinite"
        dur="1s"
        values="0 50 50;360 50 50"
        keyTimes="0;1"
      />
    </circle>
  </svg>
)

export default LoadingXsIcon

LoadingXsIcon.propTypes = {
  green: PropTypes.bool,
}
