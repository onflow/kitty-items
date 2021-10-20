import PropTypes from "prop-types"
import ListItems from "src/components/ListItems"
import useAccountItems from "src/hooks/useAccountItems"
import useApiSaleOffers from "src/hooks/useApiSaleOffers"

export default function ProfileAccountItems({address}) {
  // The Storefront only returns sale offer ids, so we need to fetch
  // the sale offer objects from the API.
  const {saleOffers, isLoading: isSalesOffersLoading} =
    useApiSaleOffers(address)
  const {data: itemIds, isAccountItemsLoading} = useAccountItems(address)

  const isLoading =
    isSalesOffersLoading || isAccountItemsLoading || !saleOffers || !itemIds

  if (isLoading) return <div>Loading...</div>

  const saleOfferItemIds = saleOffers.map(offer => offer.itemID)
  const itemIdsNotForSale = itemIds?.filter(
    id => !saleOfferItemIds.includes(id)
  )

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
