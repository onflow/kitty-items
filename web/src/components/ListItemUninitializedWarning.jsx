import PropTypes from "prop-types"
import useAccountInitializer from "src/hooks/useAccountInitializer"

export default function ListItemUninitializedWarning({action}) {
  const [{isLoading: isInitLoading}, initializeAccount] =
    useAccountInitializer()

  return (
    <div className="text-sm text-center mt-2 text-gray-600">
      <button
        onClick={initializeAccount}
        disabled={isInitLoading}
        className="hover:opacity-80 font-bold underline mx-1"
      >
        Initialize your account
      </button>
      to {action} this Kitty Item.
    </div>
  )
}

ListItemUninitializedWarning.propTypes = {
  action: PropTypes.string.isRequired,
}
