import PropTypes from "prop-types"
import {useState} from "react"

export default function TextInput({value, onChange, label, type, min, step}) {
  const [internalValue, setInternalValue] = useState(value)
  return (
    <div>
      <label className="block text-md text-gray-light mb-2">{label}</label>
      <input
        onChange={e => {
          setInternalValue(e.target.value)
          onChange(e.target.value)
        }}
        value={internalValue}
        placeholder={`Enter ${label}`}
        className="w-full py-2.5 px-3 text-left bg-white rounded-md border border-gray-200 sm:text-sm"
        type={type}
        min={min}
        step={step}
      />
    </div>
  )
}

TextInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  min: PropTypes.string,
  step: PropTypes.string,
}
