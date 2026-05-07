import { MOODS, EXCLUDES } from '../data'
import './FilterBar.css'

function splitEmoji(label) {
  const front = label.match(/^([\p{Emoji}‍]+)\s*(.*)/u)
  if (front) return { text: front[2], emoji: front[1] }
  const back = label.match(/^(.*?)\s*([\p{Emoji}‍]+)$/u)
  if (back)  return { text: back[1],  emoji: back[2] }
  return { text: label, emoji: '' }
}

export default function FilterBar({ moods, toggleMood, excluded, toggleExclude }) {
  const allActive = moods.size === 0

  return (
    <div className="filter-bar">

      {/* ── Vibe ── */}
      <div className="filter-group">
        <span className="filter-label">Vibe</span>
        <div className="filter-list">
          <button
            className={`frow ${allActive ? 'frow--active' : ''}`}
            onClick={() => toggleMood('all')}
          >
            <span className="frow-emoji">✦</span>
            <span className="frow-text">All</span>
            {/* always reserve icon space */}
            <span className="frow-check" style={{ opacity: allActive ? 1 : 0 }}>✓</span>
          </button>

          {MOODS.filter(m => m.id !== 'all').map(m => {
            const active = moods.has(m.id)
            return (
              <button
                key={m.id}
                className={`frow ${active ? 'frow--active' : ''}`}
                onClick={() => toggleMood(m.id)}
              >
                <span className="frow-emoji">{m.emoji}</span>
                <span className="frow-text">{m.label}</span>
                <span className="frow-check" style={{ opacity: active ? 1 : 0 }}>✓</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Skip ── */}
      <div className="filter-group">
        <span className="filter-label">Skip</span>
        <div className="filter-list">
          {EXCLUDES.map(e => {
            const { text, emoji } = splitEmoji(e.label)
            const excl = excluded.has(e.tag)
            return (
              <button
                key={e.tag}
                className={`frow ${excl ? 'frow--excluded' : ''}`}
                onClick={() => toggleExclude(e.tag)}
              >
                <span className="frow-emoji">{emoji || '—'}</span>
                <span className="frow-text">{text}</span>
                <span className="frow-x" style={{ opacity: excl ? 1 : 0 }}>✕</span>
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}
