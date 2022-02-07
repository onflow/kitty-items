import PropTypes from "prop-types"

export const normalizedItemType = PropTypes.exact({
  itemID: PropTypes.number.isRequired,
  kind: PropTypes.number.isRequired,
  rarity: PropTypes.number.isRequired,
  owner: PropTypes.string.isRequired,
  name: PropTypes.string,
  image: PropTypes.string,
  listingResourceID: PropTypes.number,
  price: PropTypes.string,
  txID: PropTypes.string,
})

export const apiListingType = PropTypes.exact({
  item_id: PropTypes.number.isRequired,
  listing_resource_id: PropTypes.number.isRequired,
  item_kind: PropTypes.number.isRequired, // todo: rename to kind
  item_rarity: PropTypes.number.isRequired,
  owner: PropTypes.string.isRequired,
  price: PropTypes.string,
  name: PropTypes.string,
  image: PropTypes.string,
  txID: PropTypes.string,
})
