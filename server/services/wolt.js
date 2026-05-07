const config = require('../config')

// maps our food IDs to Wolt's category slugs
// needs verifying against Wolt's actual taxonomy once we have API access
const CATEGORY_MAP = {
  pizza:   'pizza',
  sushi:   'sushi',
  burger:  'burgers',
  tacos:   'mexican',
  ramen:   'asian',
  salad:   'salads',
  steak:   'grill',
  pasta:   'italian',
  indian:  'indian',
  thai:    'thai',
}

// returns mocked data when there's no API key — keeps frontend dev unblocked
function getMockRestaurants(foodId) {
  return [
    { id: 'mock-1', name: 'Golden Bites',   slug: 'golden-bites',   rating: 4.8, distance: 400,  eta: 14, emoji: '🏠' },
    { id: 'mock-2', name: 'The Fork & Co.', slug: 'the-fork-and-co', rating: 4.6, distance: 900,  eta: 22, emoji: '🍴' },
    { id: 'mock-3', name: 'Street Kitchen', slug: 'street-kitchen',  rating: 4.5, distance: 1300, eta: 30, emoji: '🏪' },
  ]
}

async function fetchNearbyRestaurants({ lat, lon, foodId }) {
  // fall back to mocks until we're a Wolt partner
  if (!config.wolt.apiKey) {
    return getMockRestaurants(foodId)
  }

  const category = CATEGORY_MAP[foodId] ?? foodId
  const url = `${config.wolt.baseUrl}/v1/pages/restaurants?lat=${lat}&lon=${lon}&category=${category}`

  const res = await fetch(url, {
    headers: {
      'W-Token':      config.wolt.apiKey,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) throw new Error(`Wolt API responded ${res.status}`)

  const data = await res.json()

  // Wolt wraps results in sections — flatten and normalise to our shape
  return (data.sections ?? [])
    .flatMap(s => s.items ?? [])
    .map(item => ({
      id:       item.venue?.id,
      name:     item.venue?.name,
      slug:     item.venue?.slug,
      rating:   item.venue?.rating?.score,
      distance: item.venue?.distance,   // metres
      eta:      item.venue?.estimate,   // minutes
      emoji:    '🍽️',
    }))
}

module.exports = { fetchNearbyRestaurants }
