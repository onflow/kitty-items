import PropTypes from "prop-types"
import ListItems from "src/components/ListItems"
import {publicItemsSelector} from "src/global/selectors"

const ITEMS_LENGTH = 20

export default function LatestMarketplaceItems({items}) {
  const publicItems = publicItemsSelector(items).slice(0, ITEMS_LENGTH)
  if (publicItems.length === 0) return null

  return (
    <div className="bg-white">
      <div className="main-container py-14">
        <h2 className="text-3xl text-gray-darkest mb-10">Marketplace listings</h2>
        <ListItems items={publicItems} />
      </div>
    </div>
  )
}

LatestMarketplaceItems.propTypes = {
  items: PropTypes.array.isRequired,
}
