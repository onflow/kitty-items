export function fmtFlow(balance) {
  if (balance == null) return null
  return String(Number(balance) / 100000000)
}
