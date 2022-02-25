import PropTypes from "prop-types"
import {formattedCurrency} from "src/util/currency"

export default function ListItemPrice({price}) {
  return (
    <div className="border-2 border-green text-sm text-green font-mono rounded py-1 px-2 inline break-all">
      {formattedCurrency(price)} FLOW
    </div>
  )
}

ListItemPrice.propTypes = {
  price: PropTypes.string,
}
