import {CHAIN_ENV_EMULATOR} from "src/global/constants"
import publicConfig from "src/global/publicConfig"

export default function ListItemInsufficientFundsWarning() {
  return (
    <div className="mt-2 text-sm text-center text-gray-600">
      {publicConfig.chainEnv === CHAIN_ENV_EMULATOR ? (
        <div>
          Insufficient funds, add some FLOW from the dev wallet account page
        </div>
      ) : (
        <a
          href="https://testnet-faucet.onflow.org/fund-account"
          className="mx-1 font-bold underline hover:opacity-80"
          rel="noreferrer"
          target="_blank"
        >
          Get some FLOW
        </a>
      )}
      to purchase this Kitty Item.
    </div>
  )
}
