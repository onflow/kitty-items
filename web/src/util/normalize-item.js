export default function normalizeItem(item) {
  return Object.assign(
    {},
    {
      itemID: Number(item.item_id),
      resourceID: Number(item.listing_id),
      kind: Number(item.item_type),
      rarity: Number(item.item_rarity),
      owner: item.owner,
      price: item.price,
      txID: item.transaction_id,
    }
  )
}
