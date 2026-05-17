import { useState, useRef, useCallback, useEffect } from 'react'
import './DiceRoller.css'
import ThreeDiceStage from './ThreeDiceStage'

// constants

const IDLE_EMOJIS = ['🍔', '🍕', '🌮', '🍣', '🍜', '🥙']

function buildFaces(filteredFoods, winner) {
  const pool = filteredFoods.filter(f => f.id !== winner.id)
    .sort(() => Math.random() - 0.5)
  const others = pool.slice(0, 5)
  while (others.length < 5) others.push(winner)
  return [winner, ...others] // winner always on front face
}

export default function DiceRoller({ filteredFoods, onReveal, onRoll }) {
  const [phase,      setPhase]      = useState('idle')
  const [winner,     setWinner]     = useState(null)
  const [faceFoods,  setFaceFoods]  = useState([])
  const [curtainsIn, setCurtainsIn] = useState(false)
  const [reelEmoji,  setReelEmoji]  = useState('🍔')
  const [reelKey,    setReelKey]    = useState(0)

  const timers      = useRef([])
  const reelRef     = useRef(null)

  useEffect(() => () => {
    timers.current.forEach(clearTimeout)
    if (reelRef.current) clearInterval(reelRef.current)
  }, [])

  useEffect(() => {
    if (phase !== 'rolling') {
      if (reelRef.current) { clearInterval(reelRef.current); reelRef.current = null }
      return
    }

    const tick = () => {
      const food = filteredFoods[Math.floor(Math.random() * filteredFoods.length)]
      setReelEmoji(food.emoji)
      setReelKey(k => k + 1)
    }

    reelRef.current = setInterval(tick, 120)

    return () => {
      clearInterval(reelRef.current)
      reelRef.current = null
    }
  }, [phase, filteredFoods])

  const isOverlay = phase !== 'idle'

  useEffect(() => {
    if (!isOverlay) return

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOverlay])

  const schedule = (fn, ms) => {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
  }

  const roll = useCallback(() => {
    if (!filteredFoods.length)                              return
    if (['rolling', 'opening'].includes(phase)) return

    timers.current.forEach(clearTimeout)
    timers.current = []

    const w = filteredFoods[Math.floor(Math.random() * filteredFoods.length)]
    const faces = buildFaces(filteredFoods, w)

    onRoll?.()
    setWinner(w)
    setFaceFoods(faces)
    setCurtainsIn(false)
    setPhase('rolling')
    onReveal(null)

    schedule(() => { setCurtainsIn(true)                        }, 1700)
    schedule(() => { setPhase('opening'); setCurtainsIn(false)  }, 2700)
    schedule(() => { setPhase('revealed')                       }, 3500)
    schedule(() => { onReveal(w)                                }, 5500)
  }, [filteredFoods, phase, onReveal])

  const canClick = phase === 'idle'

  return (
    <div className="roller-wrap roller-wrap--fullscreen">

      {/* Theater stage */}
      <div
        className={`stage stage--fullscreen ${isOverlay ? 'stage--overlay' : ''} stage--${phase} ${canClick ? 'stage--clickable' : ''}`}
        onClick={canClick ? roll : undefined}
        role={canClick ? 'button' : undefined}
        tabIndex={canClick ? 0 : undefined}
        aria-label="Roll a dish"
        onKeyDown={canClick ? (e => e.key === 'Enter' && roll()) : undefined}
      >

        <ThreeDiceStage
          phase={phase}
          faceEmojis={faceFoods.length ? faceFoods.map(f => f?.emoji) : IDLE_EMOJIS}
        />

        {/* Theater valance — always visible during overlay */}
        {isOverlay && <div className="theater-valance" />}

        {/* CSS fabric curtains — slide over the 3D canvas */}
        {isOverlay && (
          <>
            <div className={`curtain curtain--left  ${curtainsIn ? 'curtain--in' : ''}`} />
            <div className={`curtain curtain--right ${curtainsIn ? 'curtain--in' : ''}`} />
          </>
        )}

        {/* Idle: floating emoji grid */}
        {phase === 'idle' && (
          <div className="stage-idle stage-idle--overlay">
            <div className="emoji-grid">
              {IDLE_EMOJIS.map((em, i) => (
                <span key={i} className="emoji-bubble" style={{ '--i': i }}>{em}</span>
              ))}
            </div>
            <p className="stage-label">Roll a dish</p>
            <p className="stage-hint">Tap to decide</p>
          </div>
        )}

        {/* Opening + Revealed: food shown behind opening curtains */}
        {(phase === 'opening' || phase === 'revealed') && winner && (
          <div className={`stage-reveal stage-reveal--overlay ${phase === 'revealed' ? 'stage-reveal--in' : ''}`}>
            <span className="stage-reveal-emoji">{winner.emoji}</span>
            <span className="stage-reveal-eyebrow">Tonight you're having</span>
            <span className="stage-reveal-name">{winner.name}</span>
          </div>
        )}

      </div>

      {/* Below-stage status */}
      <div className="roller-footer">
        {phase === 'idle' && (
          <p className="roller-hint">Tap the stage to decide</p>
        )}
        {['rolling', 'closing', 'opening'].includes(phase) && (
          <div className="roller-dots">
            <span /><span /><span />
          </div>
        )}
      </div>

    </div>
  )
}
