import useAppContext from "src/hooks/useAppContext"
import publicConfig from "src/global/publicConfig"

export default function ListItemInsufficientFundsWarning() {
  const {currentUser} = useAppContext()

  return (
    <div className="mt-2 text-sm text-center text-gray-600">
      {publicConfig.chainEnv === "emulator" ? (
        <div>TODO: Insufficient FLOW</div>
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
