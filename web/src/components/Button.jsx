import Link from "next/link"
import PropTypes from "prop-types"

const COLOR_CLASS = {
  green: "bg-green",
  gray: "bg-gray-300",
  outline: "bg-gray-50 border border-gray-200",
}

const getButtonClasses = (color, roundedFull, className) => {
  return `${COLOR_CLASS[color]} ${
    roundedFull ? "rounded-full" : "rounded-md"
  } font-bold text-sm text-center uppercase py-4 px-2 w-full disabled:cursor-default disabled:opacity-50 hover:opacity-80 ${
    className ?? ""
  }`
}

export function ButtonLink({
  href,
  color = "green",
  roundedFull,
  className,
  target,
  children,
}) {
  return (
    <Link href={href} passHref>
      <a
        className={getButtonClasses(color, roundedFull, className)}
        target={target}
        rel={target === "_blank" ? "noreferrer" : undefined}
      >
        {children}
      </a>
    </Link>
  )
}

ButtonLink.propTypes = {
  href: PropTypes.string.isRequired,
  color: PropTypes.string,
  roundedFull: PropTypes.bool,
  className: PropTypes.string,
  target: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default function Button({
  onClick,
  disabled,
  color = "green",
  roundedFull,
  type,
  className,
  children,
}) {
  return (
    <button
      className={getButtonClasses(color, roundedFull, className)}
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
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}
