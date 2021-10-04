import PropTypes from "prop-types"
import useItemSale from "src/hooks/useItemSale"

export default function ListItemSellButton({id}) {
  const [{isLoading}, sell] = useItemSale(id, Number(10).toFixed(2))
  return (
    <button onClick={sell} disabled={isLoading}>
      Sell
    </button>
  )
}

ListItemSellButton.propTypes = {
  id: PropTypes.number.isRequired,
}
