import PropTypes from "prop-types"
import ListItems from "src/components/ListItems"
import {publicItemsSelector} from "src/global/selectors"

const ITEMS_LENGTH = 20

export default function LatestMarketplaceItems({items}) {
  const publicItems = publicItemsSelector(items).slice(0, ITEMS_LENGTH)
  return (
    <div>
      <div className="main-container py-14">
        <h2 className="text-3xl text-gray-light mb-10">Marketplace Listings</h2>
        <ListItems items={publicItems} />
      </div>
    </div>
  )
}

LatestMarketplaceItems.propTypes = {
  items: PropTypes.array.isRequired,
}
