import {useState} from "react"
import Button from "src/components/Button"
import {ITEM_RARITY_PRICE_MAP} from "src/global/constants"
import {normalizedItemType} from "src/global/types"
import useItemSale from "src/hooks/useItemSale"
import {formattedCurrency} from "src/util/currency"
import TextInput from "./TextInput"
import TransactionLoading from "./TransactionLoading"

export default function SellListItem({item}) {
  const [sell, tx] = useItemSale(item.itemID)
  const [price, setPrice] = useState("")

  const onSubmit = e => {
    e.preventDefault()
    sell(item, price)
  }

  return (
    <div data-cy="sell-list-item">
      <div className="text-gray mb-5">
        <div className="font-bold">
          Items of this rarity usually sell for{" "}
          {formattedCurrency(ITEM_RARITY_PRICE_MAP[item.rarity].toString())}{" "}
          FLOW.
        </div>
        Please specify the price you want to sell your Kitty Item for.
      </div>

      {!!tx ? (
        <TransactionLoading status={tx.status} />
      ) : (
        <div className="bg-white border border-gray-200 rounded px-8 pt-5 pb-7">
          <form onSubmit={onSubmit}>
            <TextInput
              value={price}
              onChange={setPrice}
              type="number"
              min="0"
              required={true}
              placeholder="0.00"
              label="Price"
              inputClassName="text-right pr-4"
              step="any"
            />
            <Button
              type="submit"
              disabled={!price}
              roundedFull={true}
              className="mt-5"
            >
              List My Kitty Kitem
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}

SellListItem.propTypes = {
  item: normalizedItemType,
}
