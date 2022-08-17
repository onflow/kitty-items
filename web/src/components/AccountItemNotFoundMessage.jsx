import {paths} from "src/global/constants"
import {ButtonLink} from "./Button"

export default function AccountItemNotFoundMessage(args) {
  const message = `Unable to find Kitty Item: #${args.itemID} for account ${args.accountID}`;

  return (
    <div className="flex justify-center my-12 text-center">
      <div className="bg-white border border-gray-200 p-6 w-[32rem] rounded-md inline-flex flex-col justify-center">

        <div className="bg-white border border-gray-200 p-6 rounded-md inline-flex flex-col justify-center">
          <b>{message}</b>

          <p className="text-gray-light mt-1">
            The Kitty Item you are looking for may be owned by a different account or not yet minted!
          </p>

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
