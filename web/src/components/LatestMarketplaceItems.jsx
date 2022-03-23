import Link from "next/link"
import PropTypes from "prop-types"
import ListItems from "src/components/ListItems"
import {paths} from "src/global/constants"
import {publicItemsSelector} from "src/global/selectors"
import {normalizedItemType} from "src/global/types"

const ITEMS_LENGTH = 20

export default function LatestMarketplaceItems({items}) {
  const publicItems = publicItemsSelector(items).slice(0, ITEMS_LENGTH)
  if (publicItems.length === 0) return null

  return (
    <div className="bg-white">
      <div className="main-container py-14">
        <h2 className="text-3xl text-gray mb-1">Marketplace listings</h2>
        <div className="text-xl text-gray-light mb-7">
          Kitty Items resold by other users.
        </div>
        <ListItems items={publicItems} />
      </div>

      <div className="flex items-center justify-center pt-5 pb-20">
        <Link href={paths.marketplace}>
          <a className="rounded uppercase font-bold text-sm rounded-full bg-green hover:opacity-80 py-2.5 px-5">
            Explore the marketplace
          </a>
        </Link>
      </div>
    </div>
  )
}

LatestMarketplaceItems.propTypes = {
  items: PropTypes.arrayOf(normalizedItemType).isRequired,
}
