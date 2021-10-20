import PropTypes from "prop-types"
import ListItem from "src/components/ListItem"
import useAccountItems from "src/hooks/useAccountItems"
import useMarketplaceItems from "src/hooks/useMarketplaceItems"

export default function ProfileAccountItems({address}) {
  const {items: saleOffers, isLoading: isSalesOffersLoading} =
    useMarketplaceItems(address)
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
      {itemIdsNotForSale?.map(id => (
        <ListItem key={id} address={address} id={id} />
      ))}
    </div>
  )
}

ProfileAccountItems.propTypes = {
  address: PropTypes.string.isRequired,
}
