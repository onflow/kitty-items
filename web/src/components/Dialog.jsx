import {Dialog as HUIDialog, Transition} from "@headlessui/react"
import PropTypes from "prop-types"
import {Fragment, useRef} from "react"

export default function Dialog({title, isOpen, close, children}) {
  const closeButtonRef = useRef(null)

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <HUIDialog
        open={isOpen}
        onClose={close}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div>
            <HUIDialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          </div>
        </Transition.Child>
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative bg-white rounded-lg max-w-lg mx-auto">
            <div className="flex items-center justify-between h-12 pl-3 pr-1 border-b border-b-gray-200">
              <div className="flex items-center">
                <img
                  src="/images/flow-logo-full.svg"
                  alt="Flow"
                  width={58}
                  height={24}
                />
                <span className="ml-1 text-sm text-gray-light mt-0.5">
                  {title}
                </span>
              </div>
              <button
                onClick={close}
                className="w-10 h-10 flex items-center justify-center opacity-50 hover:opacity-100"
                ref={closeButtonRef}
              >
                <img
                  src="/images/x-icon.svg"
                  alt="Flow"
                  width={10}
                  height={10}
                />
              </button>
            </div>

            <div className="p-12">{children}</div>
          </div>
        </div>
      </HUIDialog>
    </Transition>
  )
}

Dialog.propTypes = {
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}
