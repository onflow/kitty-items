import PropTypes from "prop-types"
import {listItemsRootClasses} from "src/components/ListItems"
import SaleOffer from "src/components/SaleOffer"
import useSaleOffers from "src/hooks/useSaleOffers"

export default function ProfileSaleOffers({address}) {
  const {data: itemIds, isLoading} = useSaleOffers(address)
  return (
    <div>
      {isLoading && "Loading..."}
      <div className={listItemsRootClasses}>
        {itemIds?.map(id => (
          <SaleOffer key={id} address={address} id={id} />
        ))}
      </div>
    </div>
  )
}

ProfileSaleOffers.propTypes = {
  address: PropTypes.string.isRequired,
}
