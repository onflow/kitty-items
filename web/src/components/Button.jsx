import PropTypes from "prop-types"

const COLOR_CLASS = {
  green: "bg-green",
  gray: "bg-gray-300",
}

export default function Button({
  onClick,
  disabled,
  color = "green",
  roundedFull,
  type,
  children,
}) {
  return (
    <button
      className={`${COLOR_CLASS[color]} ${
        roundedFull ? "rounded-full" : "rounded-md"
      } font-bold text-sm uppercase py-4 w-full disabled:cursor-default disabled:opacity-50 hover:opacity-80`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  color: PropTypes.string,
  roundedFull: PropTypes.bool,
  type: PropTypes.string,
  children: PropTypes.node.isRequired,
}
