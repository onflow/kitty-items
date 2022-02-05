module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  productionBrowserSourceMaps: true,
  webpack: (config, _options) => {
    config.module.rules.push({
      test: /\.cdc/,
      type: "asset/source",
    })
    return config
  },
}
