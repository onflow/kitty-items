import PropTypes from "prop-types"
import useAppContext from "src/hooks/useAppContext"
import useItemPurchase from "src/hooks/useItemPurchase"

export default function ListItemBuyButton({saleOfferId, owner}) {
  const {currentUser} = useAppContext()
  const [{isLoading}, buy] = useItemPurchase(saleOfferId, owner)

  return (
    <button onClick={buy} disabled={isLoading}>
      Buy
    </button>
  )
}

ListItemBuyButton.propTypes = {
  saleOfferId: PropTypes.number.isRequired,
  owner: PropTypes.string.isRequired,
}
