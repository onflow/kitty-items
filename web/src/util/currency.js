export function currency(amount) {
  return parseFloat(amount || 0)
    .toFixed(2)
    .toLocaleString("en-US")
}
