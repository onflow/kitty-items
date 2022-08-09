export function normalizeApiListing(item) {
  return {
    itemID: item.item_id,
    kind: Number(item.item_kind),
    rarity: Number(item.item_rarity),
    owner: item.owner,
    name: item.name,
    image: item.image,
    listingResourceID: item.listing_resource_id,
    price: item.price.toString(),
    txID: item.transaction_id,
  }
}

export function normalizeListing(listing) {
  return {
    itemID: Number(listing.itemID),
    kind: Number(listing.kind.rawValue),
    rarity: Number(listing.rarity.rawValue),
    owner: listing.owner,
    name: listing.name,
    image: listing.image,
    listingResourceID: listing.listingResourceID,
    price: listing.price,
    txID: "",
  }
}

export function normalizeItem(accountItem, apiListing) {
  return {
    itemID: Number(accountItem.itemID),
    kind: Number(accountItem.kind.rawValue),
    rarity: Number(accountItem.rarity.rawValue),
    owner: accountItem.owner,
    name: accountItem.name,
    image: accountItem.image,
    owner: accountItem.owner,
    listingResourceID: apiListing?.listingResourceID,
    price: apiListing?.price,
    txID: apiListing?.txID,
  }
}
