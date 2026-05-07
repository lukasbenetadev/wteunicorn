// TODO: swap mock data for real data once the backend is wired up:
//   import { useNearbyRestaurants, buildOrderUrl } from '../hooks/useNearbyRestaurants'
//   const { restaurants, loading } = useNearbyRestaurants(food)
//   replace MOCK_RESTAURANTS with `restaurants` and the Order href with buildOrderUrl(...)
import './NearbySection.css'

const MOCK_RESTAURANTS = [
  { id: '1', name: 'Golden Bites',   slug: 'golden-bites',   emoji: '🏠', rating: '4.8', distance: '0.4 km', time: '14 min' },
  { id: '2', name: 'The Fork & Co.', slug: 'the-fork-and-co', emoji: '🍴', rating: '4.6', distance: '0.9 km', time: '22 min' },
  { id: '3', name: 'Street Kitchen', slug: 'street-kitchen',  emoji: '🏪', rating: '4.5', distance: '1.3 km', time: '30 min' },
]

export default function NearbySection({ food }) {
  return (
    <div className="nearby">
      <div className="nearby-head">
        <span className="nearby-dot" />
        <span className="nearby-title">Available near you</span>
        <span className="nearby-badge">Coming soon</span>
      </div>

      <p className="nearby-sub">
        Restaurants serving <strong>{food.name}</strong> in your area
      </p>

      <div className="nearby-list">
        {MOCK_RESTAURANTS.map(r => (
          <div key={r.name} className="nearby-item">
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
            {/* href will become buildOrderUrl(r.slug, r.id, food.id, sessionId) */}
            <a className="nearby-order" href={`https://wolt.com`} target="_blank" rel="noopener noreferrer">
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
