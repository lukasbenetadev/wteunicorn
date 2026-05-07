import './Favorites.css'

export default function Favorites({ favorites, onRemove }) {
  return (
    <div className="favorites">
      <span className="favorites-label">Saved</span>
      {favorites.length === 0
        ? <p className="favorites-empty">Nothing saved yet — tap ♡ after a pick.</p>
        : (
          <div className="favorites-grid">
            {favorites.map(f => (
              <div key={f.id} className="fav-pill">
                <span className="fav-pill-emoji">{f.emoji}</span>
                <span className="fav-pill-name">{f.name}</span>
                <button className="fav-pill-remove" onClick={() => onRemove(f.id)} aria-label="Remove">✕</button>
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}
