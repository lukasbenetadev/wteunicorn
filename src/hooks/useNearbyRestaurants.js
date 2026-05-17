import { useState, useEffect } from 'react'

const PLACES_KEY = import.meta.env.VITE_GOOGLE_PLACES_KEY

const MOCK_RESTAURANTS = [
  { id: '1', name: 'Golden Bites',   emoji: '🏠', rating: '4.8', distance: '0.4 km', time: '14 min', placeId: null },
  { id: '2', name: 'The Fork & Co.', emoji: '🍴', rating: '4.6', distance: '0.9 km', time: '22 min', placeId: null },
  { id: '3', name: 'Street Kitchen', emoji: '🏪', rating: '4.5', distance: '1.3 km', time: '30 min', placeId: null },
]

function useGeolocation() {
  const [coords, setCoords] = useState(null)
  const [asked,  setAsked]  = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) { setAsked(true); return }
    navigator.geolocation.getCurrentPosition(
      pos => { setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setAsked(true) },
      ()  => { setAsked(true) },
      { timeout: 8000 }
    )
  }, [])

  return { coords, asked }
}

function metersToDisplay(meters) {
  return meters >= 1000
    ? `${(meters / 1000).toFixed(1)} km`
    : `${Math.round(meters)} m`
}

async function fetchPlaces(foodName, lat, lng) {
  const params = new URLSearchParams({
    location: `${lat},${lng}`,
    radius: 2000,
    keyword: foodName,
    type: 'restaurant',
    key: PLACES_KEY,
  })
  const res = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`)
  if (!res.ok) throw new Error(res.status)
  const data = await res.json()
  return (data.results ?? []).slice(0, 3).map(p => ({
    id:       p.place_id,
    name:     p.name,
    emoji:    '📍',
    rating:   p.rating?.toFixed(1) ?? '—',
    distance: metersToDisplay(p.distance ?? 0),
    time:     '~20 min',
    placeId:  p.place_id,
  }))
}

export function useNearbyRestaurants(food) {
  const { coords, asked } = useGeolocation()
  const [state, setState] = useState({ restaurants: [], loading: true, locationAsked: false })

  useEffect(() => {
    if (!food) return
    setState({ restaurants: [], loading: true, locationAsked: asked })

    if (!PLACES_KEY || !coords) {
      setState({ restaurants: MOCK_RESTAURANTS, loading: false, locationAsked: asked })
      return
    }

    fetchPlaces(food.name, coords.lat, coords.lng)
      .then(restaurants => setState({ restaurants, loading: false, locationAsked: true }))
      .catch(()          => setState({ restaurants: MOCK_RESTAURANTS, loading: false, locationAsked: true }))
  }, [food?.id, coords?.lat, coords?.lng, asked])

  return state
}

export function buildOrderUrl(foodName, restaurantName) {
  const q = encodeURIComponent(`${restaurantName} ${foodName}`)
  const ref = import.meta.env.VITE_WOLT_REF ? `&ref=${import.meta.env.VITE_WOLT_REF}` : ''
  return `https://wolt.com/en/discovery?q=${q}${ref}`
}
