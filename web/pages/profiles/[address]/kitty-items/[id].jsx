import {useRouter} from "next/dist/client/router"
import {listItemName} from "src/components/ListItem"
import ListItemImage from "src/components/ListItemImage"
import ListItemPageButtons from "src/components/ListItemPageButtons"
import ListItemPrice from "src/components/ListItemPrice"
import OwnerInfo from "src/components/OwnerInfo"
import PageTitle from "src/components/PageTitle"
import useAccountItem from "src/hooks/useAccountItem"
import useApiSaleOffer from "src/hooks/useApiSaleOffer"

export default function KittyItem() {
  const router = useRouter()
  const {address, id} = router.query
  const {data: item, isLoading: isAccountItemLoading} = useAccountItem(
    address,
    id
  )
  const {saleOffer} = useApiSaleOffer(id)
  if (isAccountItemLoading) return null
  const name = listItemName(item.typeID, item.rarityID)

  return (
    <div className="main-container pt-12 pb-24">
      <PageTitle>{`Kitty Item ${id}`}</PageTitle>
      <main>
        <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-x-14">
          <ListItemImage
            typeId={item.typeID}
            rarityId={item.rarityID}
            address={item.owner}
            id={item.itemID}
            size="lg"
          />
          <div className="pt-20">
            <OwnerInfo address={item.owner} size="lg" />
            <h1 className="text-5xl text-gray-darkest mt-10 mb-6">{name}</h1>

            <div className="flex items-center h-6">
              {!!saleOffer && (
                <div className="mr-5">
                  <ListItemPrice price={parseFloat(saleOffer.price)} />
                </div>
              )}
              <div className="font-mono text-sm">#{id}</div>
            </div>

            <div className="lg:max-w-lg">
              <ListItemPageButtons item={item} saleOffer={saleOffer} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
