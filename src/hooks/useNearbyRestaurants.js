import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

// asks the browser for coordinates — returns null if denied
function useGeolocation() {
  const [coords, setCoords] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      pos => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      ()  => setCoords(null),   // user said no, or browser blocked it
      { timeout: 6000 }
    )
  }, [])

  return coords
}

// fetches nearby restaurants for a given food from our backend
// returns { restaurants, loading, error }
export function useNearbyRestaurants(food) {
  const coords = useGeolocation()
  const [state, setState] = useState({ restaurants: [], loading: true, error: null })

  useEffect(() => {
    if (!food) return
    if (!coords) {
      // no location yet — either still asking or user denied; either way show nothing
      setState({ restaurants: [], loading: !!coords === false, error: null })
      return
    }

    setState(s => ({ ...s, loading: true }))

    const params = new URLSearchParams({ food: food.id, lat: coords.lat, lon: coords.lon })
    fetch(`${API}/api/restaurants?${params}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => setState({ restaurants: data.restaurants, loading: false, error: null }))
      .catch(err  => setState({ restaurants: [], loading: false, error: err }))
  }, [food?.id, coords?.lat, coords?.lon])

  return state
}

// builds a server-side redirect URL so our backend can log the click before
// handing the user off to Wolt — works even if the user has an ad blocker
export function buildOrderUrl(restaurantSlug, restaurantId, foodId, sessionId) {
  const params = new URLSearchParams({ sessionId, restaurantSlug, restaurantId, food: foodId })
  return `${API}/api/referral/go?${params}`
}
