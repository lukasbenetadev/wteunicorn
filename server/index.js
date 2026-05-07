const express = require('express')
const config  = require('./config')

const restaurants = require('./routes/restaurants')
const referral    = require('./routes/referral')

const app = express()

// rawBody needed to verify Wolt webhook signatures
app.use(express.json({
  verify: (req, _res, buf) => { req.rawBody = buf },
}))

// in prod, frontend is served from a CDN — this is only needed locally
if (process.env.NODE_ENV !== 'production') {
  app.use(require('cors')({ origin: 'http://localhost:5173' }))
}

app.use('/api/restaurants', restaurants)
app.use('/api/referral',    referral)

app.listen(config.port, () => {
  const hasKey = !!config.wolt.apiKey
  console.log(`server up on :${config.port} | Wolt API: ${hasKey ? 'live' : 'mocked'}`)
})
