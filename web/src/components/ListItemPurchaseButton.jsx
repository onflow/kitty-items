import PropTypes from "prop-types"
import {RARITY_COLORS} from "src/global/constants"
import useItemPurchase from "src/hooks/useItemPurchase"

export default function ListItemPurchaseButton({saleOfferId, owner, rarityID}) {
  const [{isLoading}, buy] = useItemPurchase(saleOfferId, owner)

  return (
    <button
      onClick={buy}
      disabled={isLoading}
      className={`bg-white py-3 px-6 font-bold text-sm rounded-3xl shadow-md uppercase hover:bg-gray-100 text-${RARITY_COLORS[rarityID]}`}
    >
      Purchase
    </button>
  )
}

ListItemPurchaseButton.propTypes = {
  saleOfferId: PropTypes.number.isRequired,
  owner: PropTypes.string.isRequired,
  rarityID: PropTypes.number.isRequired,
}
