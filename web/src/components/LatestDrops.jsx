import PropTypes from "prop-types"
import ListItem from "src/components/ListItem"
import publicConfig from "src/global/publicConfig"
import {dropsItemsSelector} from "src/global/selectors"

const DROPS_LENGTH = 10

export default function LatestDrops({items}) {
  const drops = dropsItemsSelector(items).slice(0, DROPS_LENGTH)
  return (
    <div>
      <h1>Latest Kitty Items</h1>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis
        gravida nunc, luctus sodales erat. Ut sit amet lectus tempor dipiscing.
        Curabitur quis gravida nunc, lelit scelerisque ornare ut non lectus.{" "}
      </div>

      {drops.map(item => (
        <ListItem
          key={item.itemID}
          address={publicConfig.flowAddress}
          id={item.itemID}
          price={item.price}
          saleOfferId={item.resourceID}
        />
      ))}
    </div>
  )
}

LatestDrops.propTypes = {
  items: PropTypes.array.isRequired,
}
