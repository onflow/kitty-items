import useAppContext from "src/hooks/useAppContext"
import useFLOWBalance from "src/hooks/useFLOWBalance"
import {formattedCurrency} from "src/util/currency"

export default function HeaderFLOWBalance() {
  const {currentUser} = useAppContext()

  const {data: flowBalance, isLoading} = useFLOWBalance(currentUser?.addr)

  return (
    <div className="text-sm bg-gray-50 border-1 border-gray-200 border rounded-3xl h-10 flex items-center content-center justify-between px-4">
      <div className="mr-10 text-gray">FLOW</div>
      <div className="font-mono">
        {!isLoading && formattedCurrency(flowBalance)}
      </div>
    </div>
  )
}
