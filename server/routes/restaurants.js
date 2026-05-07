const { Router } = require('express')
const { fetchNearbyRestaurants } = require('../services/wolt')

const router = Router()

// GET /api/restaurants?food=pizza&lat=60.169&lon=24.935
// lat/lon come from the browser's Geolocation API — we never store them
router.get('/', async (req, res) => {
  const { food, lat, lon } = req.query

  if (!food)       return res.status(400).json({ error: 'food is required' })
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon are required' })

  const parsedLat = parseFloat(lat)
  const parsedLon = parseFloat(lon)
  if (isNaN(parsedLat) || isNaN(parsedLon)) {
    return res.status(400).json({ error: 'lat/lon must be numbers' })
  }

  try {
    const restaurants = await fetchNearbyRestaurants({ lat: parsedLat, lon: parsedLon, foodId: food })
    res.json({ restaurants })
  } catch (err) {
    console.error('Wolt fetch failed:', err.message)
    res.status(502).json({ error: 'Could not reach Wolt right now' })
  }
})

module.exports = router
