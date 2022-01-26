import Link from "next/link"
import PropTypes from "prop-types"
import {paths} from "src/global/constants"
import useAccountItem from "src/hooks/useAccountItem"
import useAppContext from "src/hooks/useAppContext"
import {rarityTextColors} from "src/util/classes"
import ListItemImage from "./ListItemImage"
import ListItemPrice from "./ListItemPrice"
import OwnerInfo from "./OwnerInfo"

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

  const profileUrl = paths.profileItem(address, id)
  const rarityTextColor = rarityTextColors(item.rarity.rawValue)
  return (
    <div className="w-full">
      <Link href={profileUrl} passHref>
        <a className="w-full">
          <ListItemImage
            name={item.name}
            rarity={item.rarity.rawValue}
            cid={item.image}
            address={item.owner}
            id={item.itemID}
            size={size}
            isStoreItem={isStoreItem}
            classes="item-image-container-hover"
          >
            {isStoreItem && (
              <div className="absolute top-3 left-3">
                <div
                  className={`bg-white py-1 px-4 font-bold text-sm rounded-full uppercase ${rarityTextColor}`}
                >
                  New
                </div>
              </div>
            )}
            {isBuyable && (
              <div className="absolute bottom-7">
                <div
                  className={`bg-white ${
                    isStoreItem ? "py-3 px-9 text-lg" : "py-2 px-6 text-md"
                  } font-bold rounded-full shadow-md uppercase ${rarityTextColor}`}
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
            <Link href={profileUrl}>
              <a className="text-lg font-semibold">{item.name}</a>
            </Link>
            <Link href={profileUrl}>
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
