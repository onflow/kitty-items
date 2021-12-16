import PropTypes from "prop-types"
import Select from "src/components/Select"
import {ITEM_RARITY_MAP, ITEM_TYPE_MAP} from "src/global/constants"

const TYPE_OPTIONS = Object.keys(ITEM_TYPE_MAP).map(key => ({
  label: ITEM_TYPE_MAP[key],
  value: key,
}))

const RARITY_OPTIONS = Object.keys(ITEM_RARITY_MAP)
  .reverse()
  .map(key => ({
    label: ITEM_RARITY_MAP[key],
    value: key,
  }))

export default function MarketplaceFilters({queryState, updateQuery}) {
  const updateFilter = payload => updateQuery({page: 1, ...payload})

  return (
    <div className="grid gap-y-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-5 mb-8">
      <Select
        label="Type"
        options={TYPE_OPTIONS}
        value={queryState.typeId}
        onChange={value => updateFilter({typeId: value})}
      />
      <Select
        label="Rarity"
        options={RARITY_OPTIONS}
        value={queryState.rarityId}
        onChange={value => updateFilter({rarityId: value})}
      />
    </div>
  )
}

MarketplaceFilters.propTypes = {
  queryState: PropTypes.object.isRequired,
  updateQuery: PropTypes.func.isRequired,
}
