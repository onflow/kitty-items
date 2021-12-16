import {Listbox, Transition} from "@headlessui/react"
import PropTypes from "prop-types"
import {Fragment} from "react"

export default function Select({options, label, value, onChange}) {
  const selectedOption = options.find(o => o.value === value)
  const placeholder = `Select ${label}`

  return (
    <Listbox
      value={value}
      onChange={value => {
        onChange(value)
      }}
    >
      <div>
        <Listbox.Label className="block text-md text-gray-light mb-2">
          {label}
        </Listbox.Label>

        <div className="relative">
          <div className="relative">
            <Listbox.Button className="relative w-full py-2.5 pl-3 pr-10 text-left bg-white rounded-md border border-gray-200 cursor-default sm:text-sm">
              <span
                className={`block truncate ${
                  !!selectedOption ? "text-gray-darkest" : "text-gray-lightest"
                }`}
              >
                {selectedOption?.label || placeholder}
              </span>
              <span className="absolute inset-y-0 right-2 flex items-center pr-2">
                <img
                  src="/images/caret.svg"
                  alt={placeholder}
                  width={10}
                  height={7}
                />
              </span>
            </Listbox.Button>

            {selectedOption && (
              <button
                onClick={e => {
                  e.stopPropagation()
                  onChange(undefined)
                }}
                className="absolute right-6 text-gray-300 text-lg p-2 pt-2 mr-2 z-10 hover:opacity-80"
              >
                ×
              </button>
            )}
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute w-full pt-1 z-10 max-h-60">
              <Listbox.Options className="py-1 overflow-auto text-base bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((option, index) => (
                  <Listbox.Option
                    key={index}
                    className={({selected, active}) =>
                      `${selected ? "bg-gray-100" : ""} ${
                        active ? "font-bold" : ""
                      } cursor-default select-none relative py-2 px-3 `
                    }
                    value={option.value}
                  >
                    <span className="block truncate">{option.label}</span>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Transition>
        </div>
      </div>
    </Listbox>
  )
}

Select.propTypes = {
  options: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}
