import PropTypes from "prop-types"
import {useCallback, useEffect, useRef, useState} from "react"
import {ITEM_KIND_MAP} from "src/global/constants"
import {itemGradientClass} from "src/util/classes"
import parameterize from "src/util/parameterize"

const ITEM_TYPE_COUNT = Object.keys(ITEM_KIND_MAP).length

export default function MinterLoader({isLoading}) {
  return (
    <>
      {!isLoading && <MinterLoaderPlaceholderImage />}
      <MinterLoaderRandomImages isLoading={isLoading} />
    </>
  )
}

MinterLoader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
}

function MinterLoaderRandomImages({isLoading}) {
  const loadingIntervalRef = useRef()

  const getRandId = () => Math.floor(Math.random() * ITEM_TYPE_COUNT)

  const [loadingKind, setLoadingKind] = useState(1)

  const updateLoadingImage = useCallback(() => {
    setLoadingKind(prev => {
      let newKind = getRandId()

      while (newKind === prev) {
        newKind = getRandId()
      }

      return newKind
    })
  }, [])

  useEffect(() => {
    if (isLoading) {
      loadingIntervalRef.current = setInterval(updateLoadingImage, 350)
    } else if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current)
    }

    return () => {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current)
    }
  }, [isLoading, updateLoadingImage])

  const kinds = Array(ITEM_TYPE_COUNT)
    .fill(0)
    .map((_, index) => index)

  return (
    <>
      {kinds.map((kind, index) => (
        <MinterLoaderImage
          key={index}
          index={index}
          kind={kind}
          isHidden={!isLoading || kind !== loadingKind}
        />
      ))}
    </>
  )
}

MinterLoaderRandomImages.propTypes = {
  isLoading: PropTypes.bool.isRequired,
}

function MinterLoaderPlaceholderImage() {
  const imageSrc1X = "/images/kitty-items/question-gray-lg.png"
  const imageSrc2X = "/images/kitty-items/question-gray-lg@2x.png"
  const imageSrcSet = `${imageSrc1X}, ${imageSrc2X} 2x`

  return (
    <div
      className={`group relative ${itemGradientClass(
        "gray"
      )} rounded-3xl relative flex w-full items-center justify-center`}
    >
      <img src={imageSrc1X} srcSet={imageSrcSet} alt="Mint a Kitty Item" />
    </div>
  )
}

function getImageSrc(kind, is2X) {
  const kindName = ITEM_KIND_MAP[kind]
  return `/images/kitty-items/${parameterize(kindName)}-blue-lg${
    is2X ? "@2x" : ""
  }.png`
}

getImageSrc.propTypes = {
  kind: PropTypes.number.isRequired,
  is2X: PropTypes.bool.isRequired,
}

function MinterLoaderImage({kind, isHidden}) {
  const imageSrc1X = getImageSrc(kind, false)
  const imageSrc2X = getImageSrc(kind, true)
  const imageSrcSet = `${imageSrc1X}, ${imageSrc2X} 2x`

  const classes = `group relative ${itemGradientClass(0)} ${
    isHidden ? "hidden" : ""
  } rounded-3xl relative flex w-full items-center justify-center`

  return (
    <div className={classes}>
      <img src={imageSrc1X} srcSet={imageSrcSet} alt="Mint a Kitty Item" />
    </div>
  )
}

MinterLoaderImage.propTypes = {
  kind: PropTypes.number.isRequired,
  isHidden: PropTypes.bool.isRequired,
}
