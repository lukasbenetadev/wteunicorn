import { forwardRef } from 'react'
import './ShareCard.css'

const ShareCard = forwardRef(function ShareCard({ food }, ref) {
  const shortDesc = food.description?.split('.')[0] ?? ''

  return (
    <div ref={ref} className="share-card" aria-hidden="true">
      <div className="share-card__glow" />
      <div className="share-card__body">
        <div className="share-card__emoji">{food.emoji}</div>
        <div className="share-card__name">{food.name}</div>
        {shortDesc && (
          <div className="share-card__desc">{shortDesc}.</div>
        )}
        <div className="share-card__tags">
          {food.moods.slice(0, 3).map(m => (
            <span key={m} className="share-card__tag">{m}</span>
          ))}
        </div>
      </div>
      <div className="share-card__footer">
        <span className="share-card__logo">🍽️ WhatToEat</span>
        <span className="share-card__url">whattoeat.app</span>
      </div>
    </div>
  )
})

export default ShareCard
