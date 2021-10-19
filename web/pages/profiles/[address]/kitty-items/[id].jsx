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
  const {saleOffer, isLoading: isApiSaleOfferLoading} = useApiSaleOffer(id)

  if (isAccountItemLoading || isApiSaleOfferLoading) return null

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
                  <ListItemPrice price={saleOffer.price} />
                </div>
              )}
              <div className="font-mono text-sm">#{id}</div>
            </div>

            <div className="lg:max-w-lg">
              <p className="text-gray mt-8 mb-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse sed maximus leo, sed pretium dui. Nullam eu
                consectetur nulla. Fusce faucibus magna odio, cursus convallis
                lectus condimentum at. Maecenas nec pharetra felis. Phasellus
                tincidunt luctus laoreet. Integer ornare libero sed massa
                egestas, et eleifend ipsum efficitur. Donec ornare nisi vitae
                rhoncus tincidunt. Phasellus dui sapien, posuere ut pharetra a,
                lacinia in leo. Fusce viverra elit vitae sagittis lobortis.
                Vivamus eu ante posuere, iaculis eros nec, mattis erat.
              </p>

              <ListItemPageButtons item={item} saleOffer={saleOffer} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
