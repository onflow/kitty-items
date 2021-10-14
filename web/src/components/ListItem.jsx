import Image from "next/image"
import Link from "next/link"
import PropTypes from "prop-types"
import ListItemBuyButton from "src/components/ListItemBuyButton"
import ListItemPurchaseButton from "src/components/ListItemPurchaseButton"
import ListItemSellButton from "src/components/ListItemSellButton"
import {ITEM_RARITY_MAP, ITEM_TYPE_MAP, paths} from "src/global/constants"
import useAccountItem from "src/hooks/useAccountItem"
import useAppContext from "src/hooks/useAppContext"

const parameterize = str => str.trim().toLowerCase().replace(" ", "-")

export default function ListItem({
  address,
  id,
  price,
  saleOfferId,
  showOwnerInfo,
  size = "sm",
}) {
  const {currentUser} = useAppContext()
  const {data: item, isLoading} = useAccountItem(address, id)

  if (isLoading || !item) return <div>...</div>

  const currentUserIsOwner = currentUser && item.owner === currentUser?.addr
  const isSellable = currentUserIsOwner && !saleOfferId
  const isBuyable = !currentUserIsOwner && !!saleOfferId
  const isRemovable = currentUserIsOwner && !!saleOfferId
  const typeString = ITEM_TYPE_MAP[item.typeID]
  const rarityString = ITEM_RARITY_MAP[item.rarityID]
  const name = [rarityString, typeString].join(" ")
  const imageSrc = `/images/kitty-items/${parameterize(
    typeString
  )}-md-${parameterize(rarityString)}@2x.png`

  return (
    <div>
      <div
        className={`group item-gradient-${item.rarityID} item-size-${size} rounded-3xl relative flex items-center justify-center hover:shadow-2xl`}
      >
        <Link href={paths.profile(item.owner)} passHref>
          <a>
            <Image
              src={imageSrc}
              alt={name}
              width={350}
              height={480}
              quality={90}
            />
          </a>
        </Link>
        {isBuyable && (
          <div className="hidden group-hover:block absolute bottom-6">
            <ListItemPurchaseButton
              saleOfferId={saleOfferId}
              rarityID={item.rarityID}
              owner={item.owner}
            />
          </div>
        )}
      </div>
      <div>
        {showOwnerInfo && (
          <Link href={paths.profile(item.owner)} passHref>
            <a className="flex items-center mt-6 -mb-1 hover:opacity-80">
              <Image
                src="/images/flow-logo.svg"
                alt="Kitty Items"
                width="32"
                height="32"
                className="mr-2"
              />
              <div className="ml-2 font-mono text-xs text-gray-darkest">
                {item.owner}
              </div>
            </a>
          </Link>
        )}

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
            {isBuyable && (
              <ListItemBuyButton
                saleOfferId={saleOfferId}
                price={price}
                owner={item.owner}
              />
            )}
            {isSellable && <ListItemSellButton id={id} />}
            {isRemovable && "<remove-item>"}
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
  saleOfferId: PropTypes.number,
  showOwnerInfo: PropTypes.boolean,
  size: PropTypes.string,
}
