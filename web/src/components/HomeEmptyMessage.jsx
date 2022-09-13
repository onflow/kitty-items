import {paths} from "src/global/constants"
import useAppContext from "src/hooks/useAppContext"
import Button, {ButtonLink} from "./Button"

export default function HomeEmptyMessage() {
  const {switchToAdminView} = useAppContext()
  return (
    <div
      className="flex justify-center my-12 text-center"
      data-cy="home-common"
    >
      <div className="bg-white border border-gray-200 p-6 w-[32rem] rounded-md inline-flex flex-col justify-center">
        <img
          src="/images/kitty-items-logo.svg"
          alt="Kitty Items"
          width="100"
          className="mx-auto mt-6 mb-4"
        />
        <h1 className="text-3xl font-semibold">Welcome to Kitty Items!</h1>
        <h3 className="text-xl font-semibold mb-6">
          A CryptoKitties Sample App
        </h3>

        <div className="bg-white border border-gray-200 p-6 rounded-md inline-flex flex-col justify-center">
          <b>Your marketplace is currently empty.</b>
          <p className="text-gray-light mb-5 mt-1">
            Get started by minting your first kitty item!
          </p>

          <Button onClick={switchToAdminView}>
            MINT YOUR FIRST KITTY ITEM
          </Button>

          <hr className="mt-8 mb-6" />

          <b>Learn more about Kitty Items</b>
          <p className="text-gray-light mb-5 mt-1 max-w-xs mx-auto">
            Learn more about the key components and services that make Kitty
            Items possible.
          </p>

          <ButtonLink href={paths.githubRepo} target="_blank" color="outline">
            VIEW DOCUMENTATION &amp; RESOURCES
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}
