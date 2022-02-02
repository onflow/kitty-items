export function cleanObject(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value === undefined || value === null || value.length === 0) {
      return acc
    }

    return (acc[key] = value), acc
  }, {})
}
