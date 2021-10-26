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
  children,
}) {
  return (
    <button
      className={`${COLOR_CLASS[color]} ${
        roundedFull ? "rounded-full" : "rounded-md"
      } font-bold text-sm uppercase py-4 w-full disabled:cursor-default disabled:opacity-50 hover:opacity-80`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  color: PropTypes.string,
  roundedFull: PropTypes.bool,
  children: PropTypes.node.isRequired,
}
