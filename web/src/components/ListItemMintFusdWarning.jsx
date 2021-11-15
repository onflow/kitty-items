import useAppContext from "src/hooks/useAppContext"
import useFUSDMinter from "src/hooks/useFUSDMinter"

export default function ListItemMintFusdWarning() {
  const [{isLoading}, mintFUSD] = useFUSDMinter()
  const {currentUser} = useAppContext()
  const mint = () => mintFUSD(currentUser.addr)

  return (
    <div className="text-sm text-center mt-2 text-gray-600">
      <button
        onClick={mint}
        disabled={isLoading}
        className="hover:opacity-80 font-bold underline mx-1"
      >
        Mint some FUSD
      </button>
      to purchase this Kitty Item.
    </div>
  )
}
