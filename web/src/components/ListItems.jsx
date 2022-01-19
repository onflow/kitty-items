import PropTypes from "prop-types"
import ListItem from "src/components/ListItem"
import EmptyKittyItems from "./EmptyKittyItems"

export const listItemsRootClasses =
  "grid gap-y-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-5 minh-50"
const listItemsStyle = {
  minHeight: 520,
}

export default function ListItems({items, Component = ListItem}) {
  if (items.length === 0) {
    return <EmptyKittyItems />
  }

  return (
    <div className={listItemsRootClasses} style={listItemsStyle}>
      {items.map(item => (
        <Component
          key={`${item.itemID}-${item.resourceID}`}
          address={item.owner}
          id={item.itemID}
          price={item.price ? parseFloat(item.price) : undefined}
          listingId={item.resourceID}
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
