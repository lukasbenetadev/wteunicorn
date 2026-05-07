const config = require('../config')
const crypto = require('crypto')

// in-memory for now — swap for postgres/redis when traffic gets real
// shape: sessionId → { restaurantId, foodId, clickedAt, converted }
const clicks = new Map()

function generateSessionId() {
  return crypto.randomBytes(12).toString('hex')
}

// builds the URL the user actually lands on in Wolt
// UTM params let Wolt analytics show traffic from us,
// `ref` carries our sessionId so we can match a conversion webhook back to a click
function buildWoltUrl(restaurantSlug, foodId, sessionId) {
  const params = new URLSearchParams({
    utm_source:   'whattoeat',
    utm_medium:   'referral',
    utm_campaign: foodId,
    ref:          sessionId,
  })

  // affiliate ID goes in once Wolt sets us up in their partner programme
  if (config.wolt.affiliateId) {
    params.set('affiliate_id', config.wolt.affiliateId)
  }

  return `https://wolt.com/en/restaurant/${restaurantSlug}?${params}`
}

function recordClick({ sessionId, restaurantId, foodId, ip }) {
  clicks.set(sessionId, {
    restaurantId,
    foodId,
    ip,             // rough sanity check — not used for anything sensitive
    clickedAt: Date.now(),
    converted: false,
  })
}

// called when Wolt sends us an order webhook (needs partner agreement)
// Wolt will include our `ref` value in the webhook payload
function markConverted(sessionId) {
  const click = clicks.get(sessionId)
  if (!click) return false
  click.converted = true
  click.convertedAt = Date.now()
  return true
}

// basic sanity check — Wolt signs webhooks with HMAC-SHA256
function verifyWebhookSignature(rawBody, signature) {
  if (!config.webhookSecret) return false
  const expected = crypto
    .createHmac('sha256', config.webhookSecret)
    .update(rawBody)
    .digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

// rough conversion stats — replace with a real query once we have a db
function getStats() {
  const all = [...clicks.values()]
  return {
    clicks:      all.length,
    conversions: all.filter(c => c.converted).length,
  }
}

module.exports = { generateSessionId, buildWoltUrl, recordClick, markConverted, verifyWebhookSignature, getStats }
