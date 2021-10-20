import PropTypes from "prop-types"
import useItemPurchase from "src/hooks/useItemPurchase"
import {currency} from "src/util/currency"

export default function ListItemBuyButton({saleOfferId, price, owner}) {
  const [{isLoading}, buy] = useItemPurchase(saleOfferId, owner)
  return (
    <button
      onClick={buy}
      disabled={isLoading}
      className="border-2 border-green text-sm text-green font-mono rounded py-1 px-2 hover:opacity-70"
    >
      {currency(price)} FUSD
    </button>
  )
}

ListItemBuyButton.propTypes = {
  saleOfferId: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  owner: PropTypes.string.isRequired,
}
