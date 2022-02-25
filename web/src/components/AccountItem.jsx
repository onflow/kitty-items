import PropTypes from "prop-types"
import useAccountItem from "src/hooks/useAccountItem"
import ListItem from "./ListItem"

export default function AccountItem({address, itemID, showOwnerInfo}) {
  const {item, isLoading} = useAccountItem(address, itemID)
  if (isLoading || !item) return null
  return <ListItem item={item} showOwnerInfo={showOwnerInfo} />
}

AccountItem.propTypes = {
  address: PropTypes.string.isRequired,
  itemID: PropTypes.number.isRequired,
  showOwnerInfo: PropTypes.bool,
}
