export function fmtKibbles(balance, cur = false) {
  if (balance == null) return null
  return [
    String(balance).replace(/0+$/, "").replace(/\.$/, ""),
    cur && "KIBBLE",
  ]
    .filter(Boolean)
    .join(" ")
}
