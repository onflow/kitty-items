import PropTypes from "prop-types"
import useListing from "src/hooks/useListing"
import ListItem from "./ListItem"

export default function Listing({address, id, showOwnerInfo}) {
  const {data: listing, isLoading} = useListing(address, id)

  if (isLoading) return null

  return (
    <ListItem
      address={address}
      id={listing.itemID}
      listingId={id}
      price={parseFloat(listing.price)}
      showOwnerInfo={showOwnerInfo}
    />
  )
}

Listing.propTypes = {
  address: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  showOwnerInfo: PropTypes.bool,
}
