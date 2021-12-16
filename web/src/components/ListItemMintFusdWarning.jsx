import useAppContext from "src/hooks/useAppContext"
import useFUSDMinter from "src/hooks/useFUSDMinter"
import publicConfig from "src/global/publicConfig"

export default function ListItemMintFusdWarning() {
  const [{isLoading}, mintFUSD] = useFUSDMinter()
  const {currentUser} = useAppContext()
  const mint = () => mintFUSD(currentUser.addr)

  return (
    <div className="mt-2 text-sm text-center text-gray-600">
      {publicConfig.chainEnv === "emulator" ? (
        <button
          onClick={mint}
          disabled={isLoading}
          className="mx-1 font-bold underline hover:opacity-80"
        >
          Mint some FUSD
        </button>
      ) : (
        <a
          href="https://testnet-faucet.onflow.org/fund-account"
          className="mx-1 font-bold underline hover:opacity-80"
          rel="noreferrer"
          target="_blank"
        >
          Get some FUSD
        </a>
      )}
      to purchase this Kitty Item.
    </div>
  )
}
