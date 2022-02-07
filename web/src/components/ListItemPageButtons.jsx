import {useRouter} from "next/dist/client/router"
import Button from "src/components/Button"
import publicConfig from "src/global/publicConfig"
import {normalizedItemType} from "src/global/types"
import useAppContext from "src/hooks/useAppContext"
import useFLOWBalance from "src/hooks/useFLOWBalance"
import useItemPurchase from "src/hooks/useItemPurchase"
import useItemRemoval from "src/hooks/useItemRemoval"
import ListItemInsufficientFundsWarning from "./ListItemInsufficientFundsWarning"
import TransactionLoading from "./TransactionLoading"

export default function ListItemPageButtons({item}) {
  const router = useRouter()
  const {address, id} = router.query
  const {currentUser} = useAppContext()
  const {data: flowBalance} = useFLOWBalance(currentUser?.addr)

  const [{isLoading: isBuyLoading}, buy, buyTxStatus] = useItemPurchase()
  const [{isLoading: isRemoveLoading}, remove, removeTxStatus] =
    useItemRemoval()

  const onPurchaseClick = () => buy(item.listingResourceID, id, address)
  const onRemoveClick = () => remove(item.listingResourceID, id)

  const hasListing = Number.isInteger(item.listingResourceID)
  const currentUserIsOwner = currentUser && item.owner === currentUser?.addr
  const isBuyable = !currentUser || (!currentUserIsOwner && hasListing)
  const isRemovable = currentUserIsOwner && hasListing

  // TODO: Use a library that supports UFix64 precision to avoid comparing rounded numbers
  const userHasEnoughFunds =
    hasListing && parseFloat(item.price) <= parseFloat(flowBalance)

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
  item: normalizedItemType,
}
