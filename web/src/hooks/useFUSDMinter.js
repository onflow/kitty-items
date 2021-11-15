import {flashMessages, FUSD_MINT_AMOUNT} from "src/global/constants"
import publicConfig from "src/global/publicConfig"
import useRequest from "src/hooks/useRequest"
import {useSWRConfig} from "swr"
import useAppContext from "./useAppContext"
import {compFUSDBalanceKey} from "./useFUSDBalance"

export default function useFUSDMinter(onSuccess) {
  const [state, executeRequest] = useRequest()
  const {mutate} = useSWRConfig()
  const {setFlashMessage} = useAppContext()

  const mint = address => {
    executeRequest({
      url: publicConfig.apiFUSDMint,
      method: "POST",
      data: {
        recipient: address,
        amount: FUSD_MINT_AMOUNT,
      },
      onSuccess: data => {
        mutate(compFUSDBalanceKey(address))
        if (typeof onSuccess === "function") onSuccess(data)
        setFlashMessage(flashMessages.mintedFUSDSuccess)
      },
      onError: () => {
        setFlashMessage(flashMessages.mintedFUSDError)
      },
    })
  }

  return [state, mint]
}
