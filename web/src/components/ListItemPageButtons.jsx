import {useRouter} from "next/dist/client/router"
import PropTypes from "prop-types"
import Button from "src/components/Button"
import ListItemUninitializedWarning from "src/components/ListItemUninitializedWarning"
import publicConfig from "src/global/publicConfig"
import useAppContext from "src/hooks/useAppContext"
import useFUSDBalance from "src/hooks/useFUSDBalance"
import useItemPurchase from "src/hooks/useItemPurchase"
import useItemRemoval from "src/hooks/useItemRemoval"
import useItemSale from "src/hooks/useItemSale"
import ListItemMintFusdWarning from "./ListItemMintFusdWarning"
import TransactionLoading from "./TransactionLoading"

export default function ListItemPageButtons({item, saleOffer}) {
  const router = useRouter()
  const {address, id} = router.query
  const {isAccountInitialized, currentUser} = useAppContext()
  const {data: fusdBalance} = useFUSDBalance(currentUser?.addr)

  const [{isLoading: isBuyLoading}, buy, buyTxStatus] = useItemPurchase()
  const [{isLoading: isSellLoading}, sell, sellTxStatus] = useItemSale()
  const [{isLoading: isRemoveLoading}, remove, removeTxStatus] =
    useItemRemoval()

  const onPurchaseClick = () => buy(saleOffer?.resourceID, id, address)
  const onSellClick = () => sell(id, item.typeID, item.rarityID)
  const onRemoveClick = () => remove(saleOffer?.resourceID, id)

  const currentUserIsOwner = currentUser && item.owner === currentUser?.addr
  const isSellable = currentUserIsOwner && !saleOffer
  const isBuyable = !currentUser || (!currentUserIsOwner && !!saleOffer)
  const isRemovable = currentUserIsOwner && !!saleOffer
  const userHasEnoughFunds = !!saleOffer && saleOffer.price <= fusdBalance

  if (isBuyable) {
    return (
      <div>
        {isBuyLoading && buyTxStatus !== null ? (
          <TransactionLoading status={buyTxStatus} />
        ) : (
          <Button
            onClick={onPurchaseClick}
            disabled={
              isBuyLoading ||
              (!!currentUser && (!isAccountInitialized || !userHasEnoughFunds))
            }
            roundedFull={true}
          >
            Purchase
          </Button>
        )}

        {!!currentUser && (
          <>
            {!isAccountInitialized && (
              <ListItemUninitializedWarning action="buy" />
            )}
            {isAccountInitialized && !userHasEnoughFunds && (
              <ListItemMintFusdWarning />
            )}
          </>
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
            disabled={isSellLoading || !isAccountInitialized}
            roundedFull={true}
          >
            Sell
          </Button>
        )}
        {!isAccountInitialized && (
          <ListItemUninitializedWarning action="sell" />
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
            disabled={
              isRemoveLoading || isRemoveLoading || !isAccountInitialized
            }
            color="gray"
            roundedFull={true}
          >
            {`Remove From ${location}`}
          </Button>
        )}

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
