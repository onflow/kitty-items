import publicConfig from "src/global/publicConfig"

export const dropsItemsSelector = items =>
  items.filter(item => item.owner === publicConfig.flowAddress)

export const publicItemsSelector = items =>
  items.filter(item => item.owner !== publicConfig.flowAddress)
