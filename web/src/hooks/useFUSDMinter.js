import publicConfig from "src/global/publicConfig"
import useRequest from "src/hooks/useRequest"
import {useSWRConfig} from "swr"
import {compFUSDBalanceKey} from "./useFUSDBalance"

export default function useFUSDMinter(onSuccess) {
  const [state, executeRequest] = useRequest()
  const {mutate} = useSWRConfig()

  const mint = address => {
    executeRequest({
      url: publicConfig.apiFUSDMint,
      method: "POST",
      data: {
        recipient: address,
        amount: 50.0,
      },
      onSuccess: data => {
        mutate(compFUSDBalanceKey(address))
        onSuccess(data)
      },
    })
  }

  return [state, mint]
}
