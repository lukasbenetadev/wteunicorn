import { useState, useRef, useCallback, useEffect } from 'react'
import './Orb.css'

/* Static faces shown on the idle dice */
const IDLE_EMOJIS = ['🍔', '🍕', '🌮', '🍣', '🍜', '🥙']
const FACE_NAMES  = ['front', 'back', 'right', 'left', 'top', 'bottom']

function buildFaces(filteredFoods, winner) {
  const pool = filteredFoods.filter(f => f.id !== winner.id)
    .sort(() => Math.random() - 0.5)
  const others = pool.slice(0, 5)
  while (others.length < 5) others.push(winner)
  return [winner, ...others] // winner always on front face
}

export default function Orb({ filteredFoods, onReveal }) {
  // phases: idle → rolling → closing → opening → revealed
  const [phase,      setPhase]      = useState('idle')
  const [winner,     setWinner]     = useState(null)
  const [faceFoods,  setFaceFoods]  = useState([])
  const [curtainsIn, setCurtainsIn] = useState(false)
  const [diceKey,    setDiceKey]    = useState(0)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const at = (fn, ms) => {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
  }

  const roll = useCallback(() => {
    if (!filteredFoods.length) return
    if (['rolling', 'closing', 'opening'].includes(phase)) return

    timers.current.forEach(clearTimeout)
    timers.current = []

    const w     = filteredFoods[Math.floor(Math.random() * filteredFoods.length)]
    const faces = buildFaces(filteredFoods, w)

    setFaceFoods(faces)
    setWinner(w)
    setCurtainsIn(false)
    setDiceKey(k => k + 1)
    setPhase('rolling')
    onReveal(null)

    at(() => { setPhase('closing'); setCurtainsIn(true)  }, 2300)
    at(() => { setPhase('opening'); setCurtainsIn(false) }, 3050)
    at(() => { setPhase('revealed'); onReveal(w)         }, 3750)
  }, [filteredFoods, phase, onReveal])

  const reset = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setPhase('idle')
    setWinner(null)
    setCurtainsIn(false)
    onReveal(null)
  }, [onReveal])

  const canClick = phase === 'idle' || phase === 'revealed'

  return (
    <div className="roller-wrap">

      {/* ── Theater stage ── */}
      <div
        className={`stage ${canClick ? 'stage--clickable' : ''} stage--${phase}`}
        onClick={canClick ? roll : undefined}
        role={canClick ? 'button' : undefined}
        tabIndex={canClick ? 0 : undefined}
        aria-label="Roll a dish"
        onKeyDown={canClick ? (e => e.key === 'Enter' && roll()) : undefined}
      >

        {/* ── Idle: static dice ── */}
        {phase === 'idle' && (
          <div className="stage-idle">
            <div className="dice-scene">
              <div className="dice dice--idle">
                {IDLE_EMOJIS.map((em, i) => (
                  <div key={i} className={`face face--${FACE_NAMES[i]}`}>{em}</div>
                ))}
              </div>
            </div>
            <p className="stage-idle-label">Roll a dish</p>
            <p className="stage-idle-hint">Tap to decide</p>
          </div>
        )}

        {/* ── Rolling + Closing: animated dice ── */}
        {(phase === 'rolling' || phase === 'closing') && (
          <div className="stage-rolling">
            <div className="dice-scene">
              <div key={diceKey} className="dice dice--rolling">
                {faceFoods.map((food, i) => (
                  <div key={i} className={`face face--${FACE_NAMES[i]}`}>
                    {food?.emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Opening + Revealed: food reveal ── */}
        {(phase === 'opening' || phase === 'revealed') && winner && (
          <div className={`stage-reveal ${phase === 'revealed' ? 'stage-reveal--in' : ''}`}>
            <span className="stage-reveal-emoji">{winner.emoji}</span>
            <span className="stage-reveal-eyebrow">Tonight you're having</span>
            <span className="stage-reveal-name">{winner.name}</span>
          </div>
        )}

        {/* ── Curtains (always rendered, toggled via class) ── */}
        <div className={`curtain curtain--left  ${curtainsIn ? 'curtain--in' : ''}`} />
        <div className={`curtain curtain--right ${curtainsIn ? 'curtain--in' : ''}`} />

      </div>

      {/* ── Below-stage controls ── */}
      <div className="roller-footer">
        {phase === 'revealed' && (
          <button className="roll-again-btn" onClick={reset}>
            ↺ Roll again
          </button>
        )}
        {(phase === 'rolling' || phase === 'closing' || phase === 'opening') && (
          <div className="roller-dots">
            <span /><span /><span />
          </div>
        )}
        {phase === 'idle' && (
          <p className="roller-hint">Tap the stage to decide</p>
        )}
      </div>

    </div>
  )
}
