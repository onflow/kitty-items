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

  const [purchase, purchaseTx] = useItemPurchase(id)
  const [remove, removeTx] = useItemRemoval(id)
  const onPurchaseClick = () =>
    purchase(item.listingResourceID, item.name, address)
  const onRemoveClick = () => remove(item)

  const hasListing = Number.isInteger(item.listingResourceID)
  const currentUserIsOwner = !!currentUser && item.owner === currentUser?.addr
  const isBuyable = hasListing && !currentUserIsOwner
  const isRemovable = currentUserIsOwner && hasListing

  // TODO: Use a library that supports UFix64 precision to avoid comparing rounded numbers
  const userHasEnoughFunds =
    hasListing && parseFloat(item.price) <= parseFloat(flowBalance)

  if (isBuyable) {
    return (
      <div>
        {!!purchaseTx ? (
          <TransactionLoading status={purchaseTx.status} />
        ) : (
          <Button
            onClick={onPurchaseClick}
            disabled={!!currentUser && !userHasEnoughFunds}
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
        {!!removeTx ? (
          <TransactionLoading status={removeTx.status} />
        ) : (
          <Button onClick={onRemoveClick} color="gray" roundedFull={true}>
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
