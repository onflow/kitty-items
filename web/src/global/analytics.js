import publicConfig from "src/global/publicConfig"

export const pageview = (url) => {
  window.gtag('config', publicConfig.gaTrackingId, {
    page_path: url,
  })
}

export const event = ({ action, params }) => {
   window.gtag('event', action, params)
}