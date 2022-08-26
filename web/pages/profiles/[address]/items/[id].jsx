import {useRouter} from "next/dist/client/router"
import ListItemImage from "src/components/ListItemImage"
import ListItemPageButtons from "src/components/ListItemPageButtons"
import ListItemPrice from "src/components/ListItemPrice"
import OwnerInfo from "src/components/OwnerInfo"
import PageTitle from "src/components/PageTitle"
import RarityScale from "src/components/RarityScale"
import SellListItem from "src/components/SellListItem"
import useAccountItem from "src/hooks/useAccountItem"
import useApiListing from "src/hooks/useApiListing"
import useAppContext from "src/hooks/useAppContext"
import AccountItemNotFoundMessage from "src/components/AccountItemNotFoundMessage"

export default function KittyItem() {
  const router = useRouter()
  const {currentUser} = useAppContext()
  const {address, id} = router.query
  const {listing} = useApiListing(id)
  const {item} = useAccountItem(address, id, listing)
  const currentUserIsOwner =
    currentUser && item?.owner && item.owner === currentUser?.addr
  const isSellable = currentUserIsOwner && !listing

  return (
    <div className="main-container pt-12 pb-24 w-full">
      <PageTitle>{["Kitty Item", id].filter(Boolean).join(" ")}</PageTitle>
      <main>
        {!!item ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-x-14">
            <ListItemImage
              name={item?.name}
              rarity={item?.rarity}
              cid={item?.image}
              address={item?.owner}
              id={item?.itemID}
              size="lg"
            />
            <div className="pt-20">
              <OwnerInfo address={item.owner} size="lg" />
              <h1
                className="text-5xl text-gray-darkest mt-10 mb-6"
                data-cy="minted-item-name"
              >
                {item.name}
              </h1>
              {isSellable ? (
                <SellListItem item={item} />
              ) : (
                <>
                  <div className="flex items-center h-6">
                    {!!listing && (
                      <div className="mr-5">
                        <ListItemPrice price={listing.price} />
                      </div>
                    )}
                    <div className="font-mono text-sm">#{id}</div>
                  </div>

                  <div className="mt-8">
                    <RarityScale highlightedRarity={item.rarity} />
                  </div>
                  <ListItemPageButtons item={item} />
                </>
              )}
            </div>
          </div>
        ) : (
          <AccountItemNotFoundMessage itemID={id} accountID={address} />
        )}
      </main>
    </div>
  )
}
