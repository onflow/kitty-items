import Analytics from "analytics"
import googleAnalytics from "@analytics/google-analytics"
import mixpanelPlugin from "@analytics/mixpanel"
import publicConfig from "src/global/publicConfig"

const analytics = Analytics({
  app: "kitty-items",
  plugins: [
    googleAnalytics({
      trackingId: publicConfig.gaTrackingId,
    }),
    mixpanelPlugin({
      token: publicConfig.mixpanelToken,
    }),
  ],
})

export default analytics
