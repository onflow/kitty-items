// Use full class names to avoid auto-purging https://tailwindcss.com/docs/optimizing-for-production#writing-purgeable-html
export function itemGradientClass(typeId) {
  switch (String(typeId)) {
    case "1":
      return "item-gradient-1"
    case "2":
      return "item-gradient-2"
    case "3":
      return "item-gradient-3"
    case "4":
      return "item-gradient-4"
    case "gray":
      return "item-gradient-gray"
    default:
      throw new Error()
  }
}

export function rarityTextColors(rarityId) {
  switch (String(rarityId)) {
    case "1":
      return "text-gold"
    case "2":
      return "text-purple"
    case "3":
      return "text-green-dark"
    case "4":
      return "text-blue"
    default:
      throw new Error()
  }
}
