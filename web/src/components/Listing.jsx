import PropTypes from "prop-types"
import useListing from "src/hooks/useListing"
import ListItem from "./ListItem"

export default function Listing({address, listingResourceID, showOwnerInfo}) {
  const {listing, isLoading} = useListing(address, listingResourceID)
  if (isLoading || !listing) return null
  return <ListItem item={listing} showOwnerInfo={showOwnerInfo} />
}

Listing.propTypes = {
  address: PropTypes.string.isRequired,
  listingResourceID: PropTypes.number.isRequired,
  showOwnerInfo: PropTypes.bool,
}
