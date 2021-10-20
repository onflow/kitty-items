import PropTypes from "prop-types"
import useSaleOffer from "src/hooks/useSaleOffer"
import ListItem from "./ListItem"

export default function SaleOffer({address, id}) {
  const {data: saleOffer, isLoading} = useSaleOffer(address, id)

  if (isLoading || !saleOffer.itemID) return <div>...</div>

  return (
    <ListItem
      address={address}
      id={saleOffer.itemID}
      saleOfferId={id}
      price={saleOffer.price}
    />
  )
}

SaleOffer.propTypes = {
  address: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  price: PropTypes.number,
}
