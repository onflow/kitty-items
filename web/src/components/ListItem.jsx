import Link from "next/link"
import PropTypes from "prop-types"
import ListItemBuyButton from "src/components/ListItemBuyButton"
import ListItemSellButton from "src/components/ListItemSellButton"
import {ITEM_RARITY_MAP, ITEM_TYPE_MAP, paths} from "src/global/constants"
import useAccountItem from "src/hooks/useAccountItem"
import useAppContext from "src/hooks/useAppContext"

export default function ListItem({address, id, price, saleOfferId}) {
  const {currentUser} = useAppContext()
  const {data: item, isLoading} = useAccountItem(address, id)

  if (isLoading || !item) return <div>...</div>

  const currentUserIsOwner = currentUser && item.owner === currentUser?.addr
  const isSellable = currentUserIsOwner && !saleOfferId
  const isBuyable = !currentUserIsOwner && !!saleOfferId
  const isRemovable = currentUserIsOwner && !!saleOfferId

  return (
    <div>
      {id}
      <div>
        {[ITEM_RARITY_MAP[item.rarityID], ITEM_TYPE_MAP[item.typeID]].join(" ")}
      </div>
      <div>
        owner:
        <Link href={paths.profile(item.owner)}>{item.owner}</Link>
      </div>
      <div>price: {price}</div>
      <div>saleOfferId: {saleOfferId}</div>
      {isSellable && <ListItemSellButton id={id} />}
      {isBuyable && (
        <ListItemBuyButton saleOfferId={saleOfferId} owner={item.owner} />
      )}
      {isRemovable && "Remove (todo)"}
    </div>
  )
}

ListItem.propTypes = {
  address: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  price: PropTypes.number,
  saleOfferId: PropTypes.number,
}
