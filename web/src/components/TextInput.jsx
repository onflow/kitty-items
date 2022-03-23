import PropTypes from "prop-types"
import {useState} from "react"
import parameterize from "src/util/parameterize"

export default function TextInput({
  value,
  onChange,
  label,
  placeholder,
  type,
  min,
  step,
  required,
  labelClasses,
  inputClassName,
}) {
  const [internalValue, setInternalValue] = useState(value)
  const id = parameterize(label)
  return (
    <div>
      <label
        htmlFor={id}
        className={labelClasses || "block text-md text-gray-light mb-2"}
      >
        {label}
      </label>
      <input
        onChange={e => {
          setInternalValue(e.target.value)
          onChange(e.target.value)
        }}
        value={internalValue}
        placeholder={placeholder || `Enter ${label}`}
        className={`w-full py-2.5 px-3 text-left bg-white rounded-md border border-gray-200 sm:text-sm ${
          inputClassName ?? ""
        }`}
        type={type}
        min={min}
        step={step}
        required={required}
        id={id}
        name={id}
      />
    </div>
  )
}

TextInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  min: PropTypes.string,
  step: PropTypes.string,
  required: PropTypes.bool,
  labelClasses: PropTypes.string,
  inputClassName: PropTypes.string,
}
