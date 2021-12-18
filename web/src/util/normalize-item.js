export default function normalizeItem(item) {
  return Object.assign(
    {},
    {
      itemID: Number(item.item_id),
      resourceID: Number(item.listing_id),
      typeID: Number(item.item_type),
      rarityId: Number(item.item_rarity),
      owner: item.owner,
      price: parseFloat(item.price),
      txID: item.transaction_id,
    }
  )
}
