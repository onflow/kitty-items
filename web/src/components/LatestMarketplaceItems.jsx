import PropTypes from "prop-types"
import ListItem from "src/components/ListItem"
import {publicItemsSelector} from "src/global/selectors"

const ITEMS_LENGTH = 20

export default function LatestMarketplaceItems({items}) {
  const publicItems = publicItemsSelector(items).slice(0, ITEMS_LENGTH)
  return (
    <div>
      <h2>Marketplace Listings</h2>

      {publicItems.map(item => (
        <ListItem
          key={item.itemID}
          address={item.owner}
          id={item.itemID}
          price={item.price ? Number(item.price).toFixed(2) : undefined}
          saleOfferId={item.resourceID}
        />
      ))}
    </div>
  )
}

LatestMarketplaceItems.propTypes = {
  items: PropTypes.array.isRequired,
}
