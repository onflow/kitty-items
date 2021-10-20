import useAccountInitializer from "src/hooks/useAccountInitializer"
import useAppContext from "src/hooks/useAppContext"
import useFUSDBalance from "src/hooks/useFUSDBalance"
import {currency} from "src/util/currency"

export default function HeaderFUSDAmount() {
  const {isAccountInitialized, currentUser} = useAppContext()
  const {initializeAccount} = useAccountInitializer()
  const {data: fusdBalance} = useFUSDBalance(currentUser?.addr)

  return (
    <div className="text-sm bg-gray-50 border-1 border-gray-200 border rounded-3xl h-10 flex items-center content-center justify-between px-4">
      <div className="mr-10 text-gray">FUSD</div>
      {isAccountInitialized ? (
        <div className="font-mono">{currency(fusdBalance)}</div>
      ) : (
        <button onClick={initializeAccount} className="hover:opacity-80">
          Initialize
        </button>
      )}
    </div>
  )
}
