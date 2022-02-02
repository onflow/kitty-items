import PropTypes from "prop-types"
import Select from "src/components/Select"
import {ITEM_KIND_MAP, ITEM_RARITY_MAP} from "src/global/constants"

const KIND_OPTIONS = Object.keys(ITEM_KIND_MAP).map(key => ({
  label: ITEM_KIND_MAP[key],
  value: key,
}))

const RARITY_OPTIONS = Object.keys(ITEM_RARITY_MAP)
  .reverse()
  .map(key => ({
    label: ITEM_RARITY_MAP[key],
    value: key,
  }))

export default function MarketplaceFilters({
  queryState,
  updateQuery,
  children,
}) {
  const updateFilter = payload => updateQuery({page: 1, ...payload})

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 sm:gap-x-5 lg:grid-cols-2 mb-8">
      <div className="grid gap-y-5 grid-cols-1 sm:grid-cols-2 sm:gap-x-5 md:col-span-2 lg:col-span-1">
        <Select
          label="Kind"
          options={KIND_OPTIONS}
          value={queryState.kind}
          onChange={value => updateFilter({kind: value})}
        />
        <Select
          label="Rarity"
          options={RARITY_OPTIONS}
          value={queryState.rarity}
          onChange={value => updateFilter({rarity: value})}
        />
      </div>

      <div className="hidden lg:flex mt-8 justify-end">{children}</div>
    </div>
  )
}

MarketplaceFilters.propTypes = {
  queryState: PropTypes.object.isRequired,
  updateQuery: PropTypes.func.isRequired,
  children: PropTypes.node,
}
