import PropTypes from "prop-types"
import {itemGradientClass} from "src/util/classes"

// Fixed aspect ratio prevents content reflow
const getContainerStyle = isStoreItem => ({
  width: "100%",
  height: 0,
  overflow: "hidden",
  paddingBottom: isStoreItem ? "111%" : "125%",
})

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
  if (typeof rarity === "undefined") return <div className="w-full" />
  const imageSrc1X = getImageSrc(cid, size, false)
  const imageSrc2X = getImageSrc(cid, size, true)
  const imageSrcSet = `${imageSrc1X}, ${imageSrc2X} 2x`

  return (
    <div
      className={`group relative ${itemGradientClass(
        grayscale ? "gray" : rarity
      )} item-image-container rounded-3xl relative flex w-full items-center justify-center ${classes}`}
      style={getContainerStyle(isStoreItem)}
    >
      <div className="absolute top-0 h-full flex items-center justify-center">
        <img src={imageSrc1X} srcSet={imageSrcSet} alt={name} />
      </div>
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
