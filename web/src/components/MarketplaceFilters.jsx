import PropTypes from "prop-types"
import Select from "src/components/Select"
import TextInput from "src/components/TextInput"
import {ITEM_TYPE_MAP} from "src/global/constants"
import {useDebouncedCallback} from "use-debounce"

const TYPE_OPTIONS = Object.keys(ITEM_TYPE_MAP).map(key => ({
  label: ITEM_TYPE_MAP[key],
  value: key,
}))

export default function MarketplaceFilters({queryState, updateQuery}) {
  const updateFilter = payload => updateQuery({page: 1, ...payload})
  const debouncedUpdateFilter = useDebouncedCallback(
    payload => updateFilter(payload),
    300
  )

  return (
    <div className="grid gap-y-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-5 mb-8">
      <Select
        label="Type"
        options={TYPE_OPTIONS}
        value={queryState.typeId}
        onChange={value => updateFilter({typeId: value})}
      />
      <TextInput
        value={queryState.minPrice || ""}
        onChange={value => debouncedUpdateFilter({minPrice: value})}
        type="number"
        min="0.01"
        step="0.01"
        label="Min Price"
      />
      <TextInput
        value={queryState.maxPrice || ""}
        onChange={value => debouncedUpdateFilter({maxPrice: value})}
        type="number"
        min="0.01"
        step="0.01"
        label="Max Price"
      />
    </div>
  )
}

MarketplaceFilters.propTypes = {
  queryState: PropTypes.object.isRequired,
  updateQuery: PropTypes.func.isRequired,
}
