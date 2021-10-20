import PropTypes from "prop-types"
import SaleOffer from "src/components/SaleOffer"
import useSaleOffers from "src/hooks/useSaleOffers"

export default function ProfileSaleOffers({address}) {
  const {data: saleOfferIds, isLoading} = useSaleOffers(address)

  return (
    <div>
      {isLoading && "Loading..."}
      {saleOfferIds?.map(id => (
        <SaleOffer key={id} address={address} id={id} />
      ))}
    </div>
  )
}

ProfileSaleOffers.propTypes = {
  address: PropTypes.string.isRequired,
}
