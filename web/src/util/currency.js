// Formats string representations of UFix64 numbers. The maximum `UFix64` value is 184467440737.09551615
export function formattedCurrency(amount) {
  if (typeof amount !== "string") throw "expected string amount"
  if (amount.length === 0) return "0"
  const [integer, decimal] = amount.split(".")
  // Format the integer separately to avoid rounding
  const formattedInteger = parseFloat(integer).toLocaleString("en-US")
  return [formattedInteger, decimal?.replace(/0+$/, "")]
    .filter(Boolean)
    .join(".")
}
