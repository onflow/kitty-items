import PropTypes from "prop-types"
import ListItemSellButton from "src/components/ListItemSellButton"
import {ITEM_RARITY_MAP, ITEM_TYPE_MAP} from "src/global/constants"
import useAccountItem from "src/hooks/useAccountItem"

export default function ListItem({address, id, price, saleOfferId}) {
  const {data: item, isLoading} = useAccountItem(address, id)

  const isForSale = !!price && !!saleOfferId

  if (isLoading || !item) return <div>...</div>

  return (
    <div>
      {id}
      <div>
        {[ITEM_RARITY_MAP[item.rarityID], ITEM_TYPE_MAP[item.typeID]].join(" ")}
      </div>
      <div>owner: {item.owner}</div>
      <div>price: {price}</div>
      <div>saleOfferId: {saleOfferId}</div>
      {isForSale && <ListItemSellButton id={id} />}
    </div>
  )
}

ListItem.propTypes = {
  address: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  price: PropTypes.number,
  saleOfferId: PropTypes.number,
}
