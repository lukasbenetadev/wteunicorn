// central place for env vars so nothing is scattered across files
const config = {
  port: process.env.PORT || 3001,

  wolt: {
    // request partner API access at: https://developer.wolt.com
    apiKey:      process.env.WOLT_API_KEY,
    affiliateId: process.env.WOLT_AFFILIATE_ID,  // needed for commission tracking
    baseUrl:     'https://restaurant-api.wolt.com',
  },

  // if Wolt ever gives us an order webhook, we verify it against this
  webhookSecret: process.env.WOLT_WEBHOOK_SECRET,
}

module.exports = config
