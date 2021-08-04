export function fmtFUSD(balance, cur = false) {
  if (balance == null) return null
  return [String(balance).replace(/0+$/, "").replace(/\.$/, ""), cur && "FUSD"]
    .filter(Boolean)
    .join(" ")
}
