export default function SaleOffer(saleItem) {
  return Object.assign(
    {},
    {
      id: saleItem.saleItemID,
      type: saleItem.saleItemTypeID,
      owner: saleItem.saleItemOwner,
      price: saleItem.salePrice,
    }
  )
}
