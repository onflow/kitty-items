// Formats string representations of UFix64 numbers. The maximum `UFix64` value is 184467440737.09551615
export function formattedCurrency(amount = "0") {
  if (typeof amount !== "string" && typeof amount !== "undefined")
    throw new Error("expected string amount, got")
  if (amount.length === 0) return "0"
  const [integer, decimal] = amount.split(".")
  // Format the integer separately to avoid rounding
  const formattedInteger = parseFloat(integer).toLocaleString("en-US")
  return [formattedInteger, decimal?.replace(/0+$/, "")]
    .filter(Boolean)
    .join(".")
}

// Formats a string representation of a UFix64 number
export function uFix64String(numStr) {
  if (typeof numStr !== "string")
    throw new Error("uFix64String expected a string")
  if (!numStr.includes(".")) return `${numStr}.0` // Add decimal if missing
  return numStr
}
