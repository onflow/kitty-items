import PropTypes from "prop-types"
import useSaleOffer from "src/hooks/useSaleOffer"
import ListItem from "./ListItem"

export default function SaleOffer({address, id, showOwnerInfo}) {
  const {data: saleOffer, isLoading} = useSaleOffer(address, id)

  if (isLoading || !saleOffer.itemID) return null

  return (
    <ListItem
      address={address}
      id={saleOffer.itemID}
      saleOfferId={id}
      price={parseFloat(saleOffer.price)}
      showOwnerInfo={showOwnerInfo}
    />
  )
}

SaleOffer.propTypes = {
  address: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  showOwnerInfo: PropTypes.bool,
}
