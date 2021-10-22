import PropTypes from "prop-types"
import {listItemsRootClasses} from "src/components/ListItems"
import SaleOffer from "src/components/SaleOffer"
import useSaleOffers from "src/hooks/useSaleOffers"

export default function ProfileSaleOffers({address}) {
  const {data: itemIds} = useSaleOffers(address)
  return (
    <div>
      <div className={listItemsRootClasses}>
        {itemIds?.map(id => (
          <SaleOffer key={id} address={address} id={id} showOwnerInfo={true} />
        ))}
      </div>
    </div>
  )
}

ProfileSaleOffers.propTypes = {
  address: PropTypes.string.isRequired,
}
