import Image from "next/image"
import PropTypes from "prop-types"
import {ITEM_RARITY_MAP, ITEM_TYPE_MAP} from "src/global/constants"
import parameterize from "src/util/parameterize"

const IMAGE_SIZES = {
  sm: {
    width: 291,
    height: 400,
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
  grayscale,
  priority,
  classes = "",
}) {
  const typeString = typeId === 0 ? "question" : ITEM_TYPE_MAP[typeId]
  const rarityString = rarityId === 0 ? "gray" : ITEM_RARITY_MAP[rarityId]
  const name = [rarityString, typeString].join(" ")
  const imageSrc = `/images/kitty-items/${parameterize(
    typeString
  )}-${parameterize(rarityString)}@2x.png`

  return (
    <div
      className={`group relative item-gradient-${
        grayscale ? "gray" : rarityId
      } rounded-3xl relative flex w-full items-center justify-center ${classes}`}
    >
      <Image
        src={imageSrc}
        alt={name}
        width={IMAGE_SIZES[size].width}
        height={IMAGE_SIZES[size].height}
        quality={90}
        priority={priority}
      />

      {children}
    </div>
  )
}

ListItemImage.propTypes = {
  typeId: PropTypes.number.isRequired,
  rarityId: PropTypes.number.isRequired,
  size: PropTypes.string,
  classes: PropTypes.string,
  grayscale: PropTypes.bool,
  priority: PropTypes.bool,
  children: PropTypes.node,
}
