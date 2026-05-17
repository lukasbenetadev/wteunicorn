import { useNearbyRestaurants, buildOrderUrl } from '../hooks/useNearbyRestaurants'
import './NearbySection.css'

const PLACES_KEY = import.meta.env.VITE_GOOGLE_PLACES_KEY

export default function NearbySection({ food }) {
  const { restaurants, loading } = useNearbyRestaurants(food)

  if (loading) return null

  return (
    <div className="nearby">
      <div className="nearby-head">
        <span className="nearby-dot" />
        <span className="nearby-title">Available near you</span>
        {!PLACES_KEY && <span className="nearby-badge">Demo data</span>}
      </div>

      <p className="nearby-sub">
        Restaurants serving <strong>{food.name}</strong> in your area
      </p>

      <div className="nearby-list">
        {restaurants.map(r => (
          <div key={r.id} className="nearby-item">
            <div className="nearby-icon">{r.emoji}</div>
            <div className="nearby-info">
              <div className="nearby-name">{r.name}</div>
              <div className="nearby-meta">
                <span>⭐ {r.rating}</span>
                <span className="nearby-sep">·</span>
                <span>{r.distance}</span>
                <span className="nearby-sep">·</span>
                <span>🕐 {r.time}</span>
              </div>
            </div>
            <a
              className="nearby-order"
              href={buildOrderUrl(food.name, r.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order
            </a>
          </div>
        ))}
      </div>

      <div className="nearby-footer">
        Powered by <strong>Wolt</strong> · location-based matching
      </div>
    </div>
  )
}
