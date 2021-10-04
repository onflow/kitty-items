module.exports = {
  reactStrictMode: true,
  exportPathMap: async function () {
    return {
      "/": {page: "/"},
      "/marketplace": {page: "/marketplace"},
      "/admin/mint": {page: "/admin/mint"},
    }
  },
}
