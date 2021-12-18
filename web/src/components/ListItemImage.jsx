import PropTypes from "prop-types"
import {ITEM_RARITY_MAP, ITEM_TYPE_MAP} from "src/global/constants"
import {itemGradientClass} from "src/util/classes"
import parameterize from "src/util/parameterize"

const getImageSrc = (typeString, rarityString, size, is2X) => {
  return `/images/kitty-items/${parameterize(typeString)}-${parameterize(
    rarityString
  )}-${size}${is2X ? "@2x" : ""}.png`
}

export default function ListItemImage({
  typeId,
  rarityId,
  size = "sm",
  grayscale,
  classes = "",
  isStoreItem,
  children,
}) {
  const typeString = typeId === 0 ? "question" : ITEM_TYPE_MAP[typeId]
  const rarityString = rarityId === 0 ? "gray" : ITEM_RARITY_MAP[rarityId]
  const name = [rarityString, typeString].join(" ")
  const imageSrc1X = getImageSrc(typeString, rarityString, size, false)
  const imageSrc2X = getImageSrc(typeString, rarityString, size, true)
  const imageSrcSet = `${imageSrc1X}, ${imageSrc2X} 2x`

  return (
    <div
      className={`group relative ${itemGradientClass(
        grayscale ? "gray" : rarityId
      )} rounded-3xl relative flex w-full items-center justify-center ${classes}`}
      style={isStoreItem ? {width: 330, height: 440} : {}}
    >
      <img src={imageSrc1X} srcSet={imageSrcSet} alt={name} />
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
  isStoreItem: PropTypes.bool,
  children: PropTypes.node,
}
