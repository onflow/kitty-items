import Link from "next/link"
import PropTypes from "prop-types"
import {ITEM_RARITY_MAP, ITEM_TYPE_MAP, paths} from "src/global/constants"
import useAccountItem from "src/hooks/useAccountItem"
import useAppContext from "src/hooks/useAppContext"
import {rarityTextColors} from "src/util/classes"
import ListItemImage from "./ListItemImage"
import ListItemPrice from "./ListItemPrice"
import OwnerInfo from "./OwnerInfo"

export const listItemName = (typeId, rarityId) => {
  const typeString = ITEM_TYPE_MAP[typeId]
  const rarityString = ITEM_RARITY_MAP[rarityId]
  return [rarityString, typeString].join(" ")
}

export default function ListItem({
  address,
  id,
  price,
  listingId,
  showOwnerInfo,
  size = "sm",
  isStoreItem,
}) {
  const {currentUser} = useAppContext()
  const {data: item, isLoading} = useAccountItem(address, id)

  if (isLoading || !item) return null

  const currentUserIsOwner = currentUser && item.owner === currentUser?.addr
  const isBuyable = !currentUserIsOwner && !!listingId
  const name = listItemName(item.typeID, item.rarityID)

  return (
    <div>
      <Link href={paths.profileItem(address, id)} passHref>
        <a>
          <ListItemImage
            typeId={item.typeID}
            rarityId={item.rarityID}
            address={item.owner}
            id={item.itemID}
            size={size}
            isStoreItem={isStoreItem}
          >
            {isBuyable && (
              <div className="hidden group-hover:block absolute bottom-7">
                <div
                  className={`bg-white py-3 px-9 font-bold text-md rounded-full shadow-md uppercase ${rarityTextColors(
                    item.rarityID
                  )}`}
                >
                  Purchase
                </div>
              </div>
            )}
          </ListItemImage>
        </a>
      </Link>

      <div>
        {showOwnerInfo && <OwnerInfo address={item.owner} />}

        <div className="flex justify-between items-center mt-5">
          <div className="flex flex-col">
            <Link href={paths.profile(item.owner)}>
              <a className="text-lg font-semibold">{name}</a>
            </Link>
            <Link href={paths.profile(item.owner)}>
              <a className="text-sm font text-gray-light">#{id}</a>
            </Link>
          </div>
          <div className="flex items-center">
            {!!listingId && <ListItemPrice price={parseFloat(price)} />}
          </div>
        </div>
      </div>
    </div>
  )
}

ListItem.propTypes = {
  address: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  price: PropTypes.number,
  listingId: PropTypes.number,
  showOwnerInfo: PropTypes.bool,
  size: PropTypes.string,
  isStoreItem: PropTypes.bool,
}
