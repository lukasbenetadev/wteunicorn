import './ResultCard.css'

export default function ResultCard({ food, imageUrl, isFaved, onFav, onAgain }) {
  if (!food) return null

  return (
    <div className="rcard" key={food.id}>
      {/* Hero image or emoji fallback */}
      <div className="rcard-media">
        {imageUrl
          ? <img src={imageUrl} alt={food.name} className="rcard-img" />
          : <span className="rcard-emoji">{food.emoji}</span>
        }
        <div className="rcard-media-fade" />
      </div>

      <div className="rcard-body">
        <h2 className="rcard-name">{food.name}</h2>

        <div className="rcard-tags">
          {food.moods.map(m => (
            <span key={m} className="rcard-tag">{m}</span>
          ))}
        </div>

        <div className="rcard-actions">
          <button className={`rc-btn rc-btn--fav ${isFaved ? 'rc-btn--saved' : ''}`} onClick={onFav}>
            {isFaved ? '♥ Saved' : '♡ Save'}
          </button>
          <button className="rc-btn rc-btn--again" onClick={onAgain}>
            ↺ Again
          </button>
        </div>
      </div>
    </div>
  )
}
