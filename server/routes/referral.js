const { Router } = require('express')
const { generateSessionId, buildWoltUrl, recordClick, markConverted, verifyWebhookSignature, getStats } = require('../services/tracking')

const router = Router()

// GET /api/referral/link?restaurantSlug=golden-bites&restaurantId=abc&food=pizza
// frontend calls this to get a tracked Wolt URL before the user clicks "Order"
router.get('/link', (req, res) => {
  const { restaurantSlug, restaurantId, food } = req.query
  if (!restaurantSlug || !food) {
    return res.status(400).json({ error: 'restaurantSlug and food are required' })
  }

  const sessionId = generateSessionId()
  const url = buildWoltUrl(restaurantSlug, food, sessionId)

  // hand the sessionId back to the frontend — it'll pass it in the redirect call
  res.json({ url, sessionId })
})

// GET /api/referral/go?sessionId=xxx&restaurantSlug=yyy&restaurantId=zzz&food=pizza
// the actual "Order" button points here — we log the click then send the user to Wolt
// doing it server-side means the click is recorded even if the user has ad blockers
router.get('/go', (req, res) => {
  const { sessionId, restaurantSlug, restaurantId, food } = req.query
  if (!sessionId || !restaurantSlug || !food) {
    return res.status(400).redirect('https://wolt.com')
  }

  recordClick({
    sessionId,
    restaurantId,
    foodId: food,
    ip: req.ip,
  })

  const url = buildWoltUrl(restaurantSlug, food, sessionId)
  res.redirect(302, url)
})

// POST /api/referral/webhook
// Wolt calls this when an order is placed — tells us the click converted
// requires a signed webhook secret set up in the Wolt partner portal
router.post('/webhook', (req, res) => {
  const signature = req.headers['x-wolt-signature']
  if (!verifyWebhookSignature(req.rawBody, signature)) {
    return res.status(401).json({ error: 'bad signature' })
  }

  const { ref: sessionId } = req.body
  if (sessionId) markConverted(sessionId)

  res.json({ ok: true })
})

// GET /api/referral/stats — rough numbers for us, not exposed to users
router.get('/stats', (req, res) => {
  res.json(getStats())
})

module.exports = router
