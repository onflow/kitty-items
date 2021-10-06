import PropTypes from "prop-types"
import publicConfig from "src/global/publicConfig"
import useRequest from "src/hooks/useRequest"

export default function useMinter(onSuccess) {
  const [state, executeRequest] = useRequest()

  const mint = () => {
    const recipient = publicConfig.contractNftStorefront

    executeRequest({
      url: publicConfig.apiKittyItemMint,
      method: "POST",
      data: {
        recipient,
      },
      onSuccess: data => {
        onSuccess(data)
      },
    })
  }

  return [state, mint]
}

useMinter.propTypes = {
  onSuccess: PropTypes.func,
}
