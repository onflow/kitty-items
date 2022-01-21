import {useRouter} from "next/dist/client/router"
import ListItemImage from "src/components/ListItemImage"
import ListItemPageButtons from "src/components/ListItemPageButtons"
import ListItemPrice from "src/components/ListItemPrice"
import OwnerInfo from "src/components/OwnerInfo"
import PageTitle from "src/components/PageTitle"
import RarityScale from "src/components/RarityScale"
import useAccountItem from "src/hooks/useAccountItem"
import useApiListing from "src/hooks/useApiListing"

export default function KittyItem() {
  const router = useRouter()
  const {address, id} = router.query
  const {data: item, isLoading: isAccountItemLoading} = useAccountItem(
    address,
    id
  )
  const {listing} = useApiListing(id)
  if (isAccountItemLoading) return null

  return (
    <div className="main-container pt-12 pb-24">
      <PageTitle>{`Kitty Item ${id}`}</PageTitle>
      <main>
        <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-x-14">
          <ListItemImage
            name={item.name}
            rarity={item.rarity.rawValue}
            cid={item.image}
            address={item.owner}
            id={item.itemID}
            size="lg"
          />

          <div className="pt-20">
            <OwnerInfo address={item.owner} size="lg" />
            <h1 className="text-5xl text-gray-darkest mt-10 mb-6">{item.name}</h1>

            <div className="flex items-center h-6">
              {!!listing && (
                <div className="mr-5">
                  <ListItemPrice price={parseFloat(listing.price)} />
                </div>
              )}
              <div className="font-mono text-sm">#{id}</div>
            </div>

            <div className="lg:max-w-lg">
              <div className="mt-8">
                <RarityScale highlightedRarity={item.rarity.rawValue} />
              </div>
              <ListItemPageButtons item={item} listing={listing} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
