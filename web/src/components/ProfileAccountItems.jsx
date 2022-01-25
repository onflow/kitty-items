import PropTypes from "prop-types"
import ListItems from "src/components/ListItems"
import useAccountItems from "src/hooks/useAccountItems"
import useApiListings from "src/hooks/useApiListings"

export default function ProfileAccountItems({address}) {
  // The Storefront only returns listing IDs, so we need to fetch
  // the listing objects from the API.
  const {listings, isLoading: isListingsLoading} = useApiListings({
    owner: address,
  })
  const {data: itemIds, isAccountItemsLoading} = useAccountItems(address)
  const isLoading =
    isListingsLoading || isAccountItemsLoading || !listings || !itemIds

  if (isLoading) return null

  const listingItemIds = listings.map(listing => listing.itemID)
  const itemIdsNotForSale = itemIds?.filter(id => !listingItemIds.includes(id))

  return (
    <div>
      <ListItems
        items={itemIdsNotForSale.map(id => ({itemID: id, owner: address}))}
      />
    </div>
  )
}

ProfileAccountItems.propTypes = {
  address: PropTypes.string.isRequired,
}
