import {useRouter} from "next/router"
import {useCallback, useEffect, useRef, useState} from "react"
import Button from "src/components/Button"
import {ITEM_TYPE_MAP, paths} from "src/global/constants"
import publicConfig from "src/global/publicConfig"
import useMinter from "src/hooks/useMinter"
import ListItemImage from "./ListItemImage"
import RarityScale from "./RarityScale"

const ITEM_TYPE_COUNT = Object.keys(ITEM_TYPE_MAP).length

export default function Minter() {
  const loadingIntervalRef = useRef()
  const router = useRouter()

  const onSuccess = itemId => {
    // Wait for new SaleOffer to be created by the API
    // Mutations don't work because they get overwritten when the new page is loaded
    setTimeout(() => {
      router.push({
        pathname: paths.profileItem(publicConfig.flowAddress, itemId),
        query: {flash: "itemMintedSuccess"},
      })
    }, 1000)
  }

  const [loadingTypeId, setLoadingTypeId] = useState(1)
  const [{isLoading, transactionStatus}, mint] = useMinter(onSuccess)

  const onClickMint = () => mint()

  const getRandId = () => Math.ceil(Math.random() * ITEM_TYPE_COUNT)

  const updateLoadingImage = useCallback(() => {
    setLoadingTypeId(prev => {
      let newTypeId = getRandId()

      while (newTypeId === prev) {
        newTypeId = getRandId()
      }

      return newTypeId
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      {!isLoading && (
        <ListItemImage typeId={0} rarityId={0} size="lg" grayscale={true} />
      )}

      {Array(ITEM_TYPE_COUNT)
        .fill(0)
        .map((_i, index) => (
          <div
            key={index}
            className={isLoading && index + 1 === loadingTypeId ? "" : "hidden"}
          >
            <ListItemImage
              typeId={index + 1}
              rarityId={1}
              size="lg"
              grayscale={true}
            />
          </div>
        ))}

      <div className="flex flex-col mt-14 pr-4 lg:mt-24 lg:pt-20 lg:pl-14">
        <h1 className="text-5xl text-gray-darkest mb-10">Mint a New Item</h1>
        <RarityScale />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center bg-white pt-12 pb-11 border border-gray-200 rounded-sm text-gray-lightest text-xs uppercase">
            <img src="/images/loading.svg" alt="Flow" width={70} height={70} />
            <div className="mt-4">{transactionStatus}</div>
          </div>
        ) : (
          <Button onClick={onClickMint} disabled={isLoading} roundedFull={true}>
            Mint Item
          </Button>
        )}
      </div>
    </div>
  )
}
