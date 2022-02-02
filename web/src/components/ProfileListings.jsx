import PropTypes from "prop-types"
import {listItemsRootClasses} from "src/components/ListItems"
import Listing from "src/components/Listing"
import useListings from "src/hooks/useListings"
import EmptyKittyItems from "./EmptyKittyItems"

export default function ProfileListings({address}) {
  const {data: itemIds, isLoading} = useListings(address)

  if (!isLoading && (!itemIds || itemIds?.length === 0)) {
    return <EmptyKittyItems />
  }

  return (
    <div>
      <div className={listItemsRootClasses}>
        {itemIds?.map(id => (
          <Listing key={id} address={address} id={id} showOwnerInfo={true} />
        ))}
      </div>
    </div>
  )
}

ProfileListings.propTypes = {
  address: PropTypes.string.isRequired,
}
