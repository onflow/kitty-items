import {useRouter} from "next/dist/client/router"
import PropTypes from "prop-types"
import Button from "src/components/Button"
import publicConfig from "src/global/publicConfig"
import useAppContext from "src/hooks/useAppContext"
import useFLOWBalance from "src/hooks/useFLOWBalance"
import useItemPurchase from "src/hooks/useItemPurchase"
import useItemRemoval from "src/hooks/useItemRemoval"
import useItemSale from "src/hooks/useItemSale"
import ListItemInsufficientFundsWarning from "./ListItemInsufficientFundsWarning"
import TransactionLoading from "./TransactionLoading"

export default function ListItemPageButtons({item, listing}) {
  const router = useRouter()
  const {address, id} = router.query
  const {currentUser} = useAppContext()
  const {data: flowBalance} = useFLOWBalance(currentUser?.addr)

  const [{isLoading: isBuyLoading}, buy, buyTxStatus] = useItemPurchase()
  const [{isLoading: isSellLoading}, sell, sellTxStatus] = useItemSale()
  const [{isLoading: isRemoveLoading}, remove, removeTxStatus] =
    useItemRemoval()

  const onPurchaseClick = () => buy(listing?.resourceID, id, address)
  const onSellClick = () => sell(id, item.kind.rawValue, item.rarity.rawValue)
  const onRemoveClick = () => remove(listing?.resourceID, id)

  const currentUserIsOwner = currentUser && item.owner === currentUser?.addr
  const isSellable = currentUserIsOwner && !listing
  const isBuyable = !currentUser || (!currentUserIsOwner && !!listing)
  const isRemovable = currentUserIsOwner && !!listing

  // TODO: Use a library that supports UFix64 precision to avoid comparing rounded numbers
  const userHasEnoughFunds =
    !!listing && listing.price <= parseFloat(flowBalance)

  if (isBuyable) {
    return (
      <div>
        {isBuyLoading && buyTxStatus !== null ? (
          <TransactionLoading status={buyTxStatus} />
        ) : (
          <Button
            onClick={onPurchaseClick}
            disabled={isBuyLoading || (!!currentUser && !userHasEnoughFunds)}
            roundedFull={true}
          >
            Purchase
          </Button>
        )}

        {!!currentUser && !userHasEnoughFunds && (
          <ListItemInsufficientFundsWarning />
        )}
      </div>
    )
  }

  if (isSellable) {
    return (
      <div>
        {isSellLoading && sellTxStatus !== null ? (
          <TransactionLoading status={sellTxStatus} />
        ) : (
          <Button
            onClick={onSellClick}
            disabled={isSellLoading}
            roundedFull={true}
          >
            Sell
          </Button>
        )}
      </div>
    )
  }

  if (isRemovable) {
    const location =
      item.owner === publicConfig.flowAddress ? "Store" : "Marketplace"

    return (
      <div>
        {isRemoveLoading && removeTxStatus !== null ? (
          <TransactionLoading status={removeTxStatus} />
        ) : (
          <Button
            onClick={onRemoveClick}
            disabled={isRemoveLoading}
            color="gray"
            roundedFull={true}
          >
            {`Remove From ${location}`}
          </Button>
        )}
      </div>
    )
  }

  return null
}

ListItemPageButtons.propTypes = {
  item: PropTypes.object.isRequired,
  listing: PropTypes.object,
}
