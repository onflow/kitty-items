import Image from "next/image"
import PropTypes from "prop-types"
import {ITEM_RARITY_MAP, ITEM_TYPE_MAP} from "src/global/constants"

const parameterize = str => str.trim().toLowerCase().replace(" ", "-")

const IMAGE_SIZES = {
  sm: {
    width: 350,
    height: 480,
  },
  md: {
    width: 350,
    height: 480,
  },
  lg: {
    width: 546,
    height: 750,
  },
}

export default function ListItemImage({
  typeId,
  rarityId,
  children,
  size = "sm",
  classes = "",
}) {
  const typeString = ITEM_TYPE_MAP[typeId]
  const rarityString = ITEM_RARITY_MAP[rarityId]
  const name = [rarityString, typeString].join(" ")
  const imageSrc = `/images/kitty-items/${parameterize(
    typeString
  )}-${parameterize(rarityString)}@2x.png`

  return (
    <div
      className={`group relative item-gradient-${rarityId} rounded-3xl relative flex w-full items-center justify-center ${classes}`}
    >
      <Image
        src={imageSrc}
        alt={name}
        width={IMAGE_SIZES[size].width}
        height={IMAGE_SIZES[size].height}
        quality={90}
      />

      {children}
    </div>
  )
}

ListItemImage.propTypes = {
  typeId: PropTypes.string.isRequired,
  rarityId: PropTypes.string.isRequired,
  size: PropTypes.string,
  classes: PropTypes.string,
  children: PropTypes.node,
}
