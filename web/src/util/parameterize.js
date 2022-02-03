export default function parameterize(str) {
  return str?.trim().toLowerCase().replace(" ", "-")
}
