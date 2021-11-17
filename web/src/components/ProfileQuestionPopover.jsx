import {Popover} from "@headlessui/react"

export default function ProfileQuestionPopover() {
  return (
    <Popover className="relative w-80 flex flex-row-reverse">
      <Popover.Button className="border border-gray-200 h-10 w-10 rounded-full flex items-center justify-center hover:opacity-80">
        <img
          src="/images/question.svg"
          alt="Questions?"
          width="10"
          height="12"
        />
      </Popover.Button>

      <Popover.Panel className="absolute z-10 w-full mt-14 bg-white p-4 shadow-lg rounded-lg border border-gray-100">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.{" "}
        </p>
      </Popover.Panel>
    </Popover>
  )
}
