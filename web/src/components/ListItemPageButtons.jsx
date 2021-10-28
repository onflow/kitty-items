import {useRouter} from "next/dist/client/router"
import PropTypes from "prop-types"
import Button from "src/components/Button"
import ListItemUninitializedWarning from "src/components/ListItemUninitializedWarning"
import useAppContext from "src/hooks/useAppContext"
import useFUSDBalance from "src/hooks/useFUSDBalance"
import useItemPurchase from "src/hooks/useItemPurchase"
import useItemRemoval from "src/hooks/useItemRemoval"
import useItemSale from "src/hooks/useItemSale"
import ListItemLogInWarning from "./ListItemLogInWarning"
import ListItemMintFusdWarning from "./ListItemMintFusdWarning"

export default function ListItemPageButtons({item, saleOffer}) {
  const router = useRouter()
  const {address, id} = router.query
  const {isAccountInitialized, currentUser} = useAppContext()
  const {data: fusdBalance} = useFUSDBalance(currentUser?.addr)

  const [{isLoading: isBuyLoading}, buy] = useItemPurchase()
  const [{isLoading: isSellLoading}, sell] = useItemSale()
  const [{isLoading: isRemoveLoading}, remove] = useItemRemoval()

  const onPurchaseClick = () => buy(saleOffer?.resourceID, id, address)
  const onSellClick = () => sell(id, item.typeID, item.rarityID)
  const onRemoveClick = () => remove(saleOffer?.resourceID, id)

  const currentUserIsOwner = currentUser && item.owner === currentUser?.addr
  const isSellable = currentUserIsOwner && !saleOffer
  const isBuyable = !currentUser || (!currentUserIsOwner && !!saleOffer)
  const isRemovable = currentUserIsOwner && !!saleOffer

  if (isBuyable) {
    return (
      <div>
        <Button
          onClick={onPurchaseClick}
          disabled={
            isBuyLoading ||
            !isAccountInitialized ||
            fusdBalance === 0 ||
            !currentUser
          }
          roundedFull={true}
        >
          {isBuyLoading ? "Purchasing..." : "Purchase"}
        </Button>
        {!!currentUser ? (
          <>
            {!isAccountInitialized && (
              <ListItemUninitializedWarning action="buy" />
            )}
            {fusdBalance === 0 && <ListItemMintFusdWarning />}
          </>
        ) : (
          <ListItemLogInWarning />
        )}
      </div>
    )
  }

  if (isSellable) {
    return (
      <div>
        <Button
          onClick={onSellClick}
          disabled={isSellLoading || !isAccountInitialized}
          roundedFull={true}
        >
          {isSellLoading ? "Selling..." : "Sell"}
        </Button>
        {!isAccountInitialized && (
          <ListItemUninitializedWarning action="sell" />
        )}
      </div>
    )
  }

  if (isRemovable) {
    return (
      <div>
        <Button
          onClick={onRemoveClick}
          disabled={isRemoveLoading || !isAccountInitialized}
          color="gray"
          roundedFull={true}
        >
          {isRemoveLoading
            ? "Removing From Marketplace..."
            : "Remove From Marketplace"}
        </Button>
        {!isAccountInitialized && (
          <ListItemUninitializedWarning action="remove" />
        )}
      </div>
    )
  }

  return null
}

ListItemPageButtons.propTypes = {
  item: PropTypes.object.isRequired,
  saleOffer: PropTypes.object,
}
