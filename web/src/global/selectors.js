import publicConfig from "src/global/publicConfig"

export const storeItemsSelector = items =>
  items.filter(item => item.owner === publicConfig.flowAddress)

export const publicItemsSelector = items =>
  items.filter(item => item.owner !== publicConfig.flowAddress)
