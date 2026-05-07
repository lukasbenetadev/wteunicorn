import { useState, useRef, useCallback, useEffect } from 'react'
import './DiceRoller.css'

// constants

const IDLE_EMOJIS = ['🍔', '🍕', '🌮', '🍣', '🍜', '🥙']

export default function DiceRoller({ filteredFoods, onReveal, onRoll }) {
  const [phase,      setPhase]      = useState('idle')
  const [winner,     setWinner]     = useState(null)
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

    // Fast phase (0 → 1.5 s)
    reelRef.current = setInterval(tick, 75)

    // Slow phase (1.5 s → curtains close at 2.3 s)
    const slowId = setTimeout(() => {
      clearInterval(reelRef.current)
      reelRef.current = setInterval(tick, 240)
    }, 1500)

    return () => {
      clearInterval(reelRef.current)
      clearTimeout(slowId)
      reelRef.current = null
    }
  }, [phase, filteredFoods])

  const schedule = (fn, ms) => {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
  }

  const roll = useCallback(() => {
    if (!filteredFoods.length)                              return
    if (['rolling', 'closing', 'opening'].includes(phase)) return

    timers.current.forEach(clearTimeout)
    timers.current = []

    const w = filteredFoods[Math.floor(Math.random() * filteredFoods.length)]

    onRoll?.()
    setWinner(w)
    setCurtainsIn(false)
    setPhase('rolling')
    onReveal(null)

    schedule(() => { setPhase('closing'); setCurtainsIn(true)  }, 2300)
    schedule(() => { setPhase('opening'); setCurtainsIn(false) }, 3050)
    schedule(() => { setPhase('revealed'); onReveal(w)         }, 3750)
  }, [filteredFoods, phase, onReveal])

  const canClick = phase === 'idle'

  return (
    <div className="roller-wrap">

      {/* Theater stage */}
      <div
        className={`stage stage--${phase} ${canClick ? 'stage--clickable' : ''}`}
        onClick={canClick ? roll : undefined}
        role={canClick ? 'button' : undefined}
        tabIndex={canClick ? 0 : undefined}
        aria-label="Roll a dish"
        onKeyDown={canClick ? (e => e.key === 'Enter' && roll()) : undefined}
      >

        {/* Idle: floating emoji grid */}
        {phase === 'idle' && (
          <div className="stage-idle">
            <div className="emoji-grid">
              {IDLE_EMOJIS.map((em, i) => (
                <span key={i} className="emoji-bubble" style={{ '--i': i }}>{em}</span>
              ))}
            </div>
            <p className="stage-label">Roll a dish</p>
            <p className="stage-hint">Tap to decide</p>
          </div>
        )}

        {/* Rolling + Closing: slot machine reel */}
        {(phase === 'rolling' || phase === 'closing') && (
          <div className="stage-rolling">
            <div className="reel-window">
              <span key={reelKey} className="reel-emoji">{reelEmoji}</span>
            </div>
          </div>
        )}

        {/* Opening + Revealed: food shown behind opening curtains */}
        {(phase === 'opening' || phase === 'revealed') && winner && (
          <div className={`stage-reveal ${phase === 'revealed' ? 'stage-reveal--in' : ''}`}>
            <span className="stage-reveal-emoji">{winner.emoji}</span>
            <span className="stage-reveal-eyebrow">Tonight you're having</span>
            <span className="stage-reveal-name">{winner.name}</span>
          </div>
        )}

        {/* Curtains — always in DOM; CSS transition handles open/close */}
        <div className={`curtain curtain--left  ${curtainsIn ? 'curtain--in' : ''}`} />
        <div className={`curtain curtain--right ${curtainsIn ? 'curtain--in' : ''}`} />
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
