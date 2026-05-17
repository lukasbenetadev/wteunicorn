import { useState, useCallback, useRef } from 'react'
import { Browser } from '@capacitor/browser'
import { MOODS } from '../data'
import ShareCard from './ShareCard'
import './ResultCard.css'

async function openWolt(foodName) {
  const query = encodeURIComponent(foodName)
  const url = `https://wolt.com/en/discovery?q=${query}`
  try {
    await Browser.open({ url, presentationStyle: 'popover' })
  } catch {
    window.open(url, '_blank', 'noopener')
  }
}

async function openRecipe(foodName) {
  const query = encodeURIComponent(`how to cook ${foodName} recipe`)
  const url = `https://www.google.com/search?q=${query}`
  try {
    await Browser.open({ url, presentationStyle: 'popover' })
  } catch {
    window.open(url, '_blank', 'noopener')
  }
}

const MOOD_LABELS = Object.fromEntries(MOODS.map(m => [m.id, m.label]))

function whyLine(food, activeMoods) {
  const matches = food.moods.filter(m => activeMoods.has(m))
  if (matches.length === 0) return null
  const labels = matches.map(m => MOOD_LABELS[m] ?? m).join(' · ')
  return `Matches your vibe: ${labels}`
}

export default function ResultCard({ food, imageUrl, isFaved, onFav, onAgain, onOrder, onCook, onShare, activeMoods = new Set() }) {
  const [copied, setCopied] = useState(false)
  const [sharing, setSharing] = useState(false)
  const shareCardRef = useRef(null)

  const handleShare = useCallback(async () => {
    onShare?.()
    setSharing(true)
    const text = `I'm having ${food.name} ${food.emoji} today — What should YOU eat? → whattoeat.app`
    try {
      const h2c = (await import('html2canvas')).default
      const canvas = await h2c(shareCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      })
      canvas.toBlob(async blob => {
        const file = new File([blob], `whattoeat-${food.name.toLowerCase().replace(/\s+/g, '-')}.png`, { type: 'image/png' })
        try {
          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ files: [file], title: `I'm having ${food.name} today!` })
          } else if (navigator.share) {
            await navigator.share({ title: 'What To Eat?', text })
          } else {
            const a = document.createElement('a')
            a.href = URL.createObjectURL(blob)
            a.download = file.name
            a.click()
          }
        } catch {}
        setSharing(false)
      }, 'image/png')
    } catch {
      setSharing(false)
      try {
        if (navigator.share) {
          await navigator.share({ title: 'What To Eat?', text })
        } else {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }
      } catch {}
    }
  }, [food, onShare])

  if (!food) return null

  const why = whyLine(food, activeMoods)

  return (
    <div className="rcard" key={food.id}>
      <ShareCard ref={shareCardRef} food={food} />
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

        {food.description && (
          <p className="rcard-desc">{food.description}</p>
        )}

        {why && (
          <p className="rcard-why">{why}</p>
        )}

        <div className="rcard-tags">
          {food.moods.map(m => (
            <span key={m} className="rcard-tag">{m}</span>
          ))}
        </div>

        {/* Primary intent buttons */}
        <div className="rcard-intents">
          <button className="rc-btn rc-btn--order" onClick={() => { onOrder?.(); openWolt(food.name) }}>
            📦 I'd order this
          </button>
          <button className="rc-btn rc-btn--cook" onClick={() => { onCook?.(); openRecipe(food.name) }}>
            👨‍🍳 I'd cook this
          </button>
        </div>

        {/* Secondary actions */}
        <div className="rcard-actions">
          <button className={`rc-btn rc-btn--fav ${isFaved ? 'rc-btn--saved' : ''}`} onClick={onFav}>
            {isFaved ? '♥ Saved' : '♡ Save'}
          </button>
          <button className="rc-btn rc-btn--share" onClick={handleShare} disabled={sharing}>
            {sharing ? '⏳' : copied ? '✓ Copied!' : '↗ Share'}
          </button>
          <button className="rc-btn rc-btn--again" onClick={onAgain}>
            ↺ Again
          </button>
        </div>
      </div>
    </div>
  )
}
