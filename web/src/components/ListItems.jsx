import PropTypes from "prop-types"
import ListItem from "src/components/ListItem"

export const listItemsRootClasses =
  "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-16"

export default function ListItems({items, Component = ListItem}) {
  return (
    <div className={listItemsRootClasses}>
      {items.map(item => (
        <Component
          key={item.itemID}
          address={item.owner}
          id={item.itemID}
          price={item.price ? Number(item.price).toFixed(2) : undefined}
          saleOfferId={item.resourceID}
          showOwnerInfo={true}
        />
      ))}
    </div>
  )
}

ListItems.propTypes = {
  items: PropTypes.array.isRequired,
  Component: PropTypes.elementType,
}
