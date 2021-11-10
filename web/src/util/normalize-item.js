export default function normalizeItem(item) {
  return Object.assign(
    {},
    {
      itemID: Number(item.sale_item_id),
      resourceID: Number(item.sale_item_resource_id),
      typeID: Number(item.sale_item_type),
      rarityId: Number(item.sale_item_rarity),
      owner: item.sale_item_owner,
      price: parseFloat(item.sale_price),
      txID: item.transaction_id,
    }
  )
}
