// Use full class names to avoid auto-purging https://tailwindcss.com/docs/optimizing-for-production#writing-purgeable-html
export function itemGradientClass(rarity) {
  switch (String(rarity)) {
    case "0":
      return "item-gradient-0"
    case "1":
      return "item-gradient-1"
    case "2":
      return "item-gradient-2"
    case "3":
      return "item-gradient-3"
    case "gray":
      return "item-gradient-gray"
    default:
      throw new Error()
  }
}

export function rarityTextColors(rarity) {
  switch (String(rarity)) {
    case "0":
      return "text-blue"
    case "1":
      return "text-green-dark"
    case "2":
      return "text-purple"
    case "3":
      return "text-gold"
    default:
      throw new Error()
  }
}
