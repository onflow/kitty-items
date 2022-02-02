import PropTypes from "prop-types"
import {itemGradientClass} from "src/util/classes"

const getImageSrc = (cid, size, is2X) => {
  return `https://${cid}.ipfs.dweb.link/${size}${is2X ? "@2x" : ""}.png`
}

export default function ListItemImage({
  name,
  rarity,
  cid,
  size = "sm",
  grayscale,
  classes = "",
  isStoreItem,
  children,
}) {
  
  const imageSrc1X = getImageSrc(cid, size, false)
  const imageSrc2X = getImageSrc(cid, size, true)
  const imageSrcSet = `${imageSrc1X}, ${imageSrc2X} 2x`

  return (
    <div
      className={`group relative ${itemGradientClass(
        grayscale ? "gray" : rarity
      )} rounded-3xl relative flex w-full items-center justify-center ${classes}`}
      style={isStoreItem ? {width: 330, height: 440} : {}}
    >
      <img src={imageSrc1X} srcSet={imageSrcSet} alt={name} />
      {children}
    </div>
  )
}

ListItemImage.propTypes = {
  name: PropTypes.string,
  rarity: PropTypes.number,
  cid: PropTypes.string,
  size: PropTypes.string,
  classes: PropTypes.string,
  grayscale: PropTypes.bool,
  isStoreItem: PropTypes.bool,
  children: PropTypes.node,
}
