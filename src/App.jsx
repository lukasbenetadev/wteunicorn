import { useState, useCallback, useMemo, useEffect } from 'react'

import { FOODS, MOODS }          from './data'
import { analytics }             from './analytics'
import { useFoodImage }          from './hooks/useFoodImage'
import { useMealHistory }        from './hooks/useMealHistory'
import DiceRoller                from './components/DiceRoller'
import ResultCard                from './components/ResultCard'
import NearbySection             from './components/NearbySection'
import FilterBar                 from './components/FilterBar'
import Favorites                 from './components/Favorites'
import Confetti                  from './components/Confetti'
import './App.css'

const INDIVIDUAL_MOOD_IDS = MOODS.filter(m => m.id !== 'all').map(m => m.id)

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try   { return JSON.parse(localStorage.getItem(key)) ?? initial }
    catch { return initial }
  })
  const set = useCallback(v => {
    setValue(v)
    localStorage.setItem(key, JSON.stringify(v))
  }, [key])
  return [value, set]
}

export default function App() {
  const [moods,       setMoods]       = useState(new Set())
  const [excluded,    setExcluded]    = useState(new Set())
  const [currentFood, setCurrentFood] = useState(null)
  const [confettiKey, setConfettiKey] = useState(0)
  const [favorites,   setFavorites]   = useLocalStorage('wte_favorites', [])
  const { addToHistory }              = useMealHistory()

  const { imageUrl } = useFoodImage(currentFood)

  // fire page_view once on mount
  useEffect(() => { analytics.pageView() }, [])

  const activeFilters = useMemo(() => ({
    moods:    [...moods],
    excluded: [...excluded],
  }), [moods, excluded])

  const filteredFoods = useMemo(() => FOODS.filter(f => {
    if (f.tags.some(t => excluded.has(t)))                      return false
    if (moods.size > 0 && !f.moods.some(m => moods.has(m)))    return false
    return true
  }), [moods, excluded])

  const toggleMood = useCallback(id => {
    if (id === 'all') { setMoods(new Set()); analytics.filterApplied('mood', 'all', true); return }
    setMoods(prev => {
      const next = new Set(prev)
      const adding = !next.has(id)
      next.has(id) ? next.delete(id) : next.add(id)
      if (INDIVIDUAL_MOOD_IDS.every(m => next.has(m))) { analytics.filterApplied('mood', id, false); return new Set() }
      analytics.filterApplied('mood', id, adding)
      return next
    })
  }, [])

  const toggleExclude = useCallback(tag => {
    setExcluded(prev => {
      const next   = new Set(prev)
      const adding = !next.has(tag)
      next.has(tag) ? next.delete(tag) : next.add(tag)
      analytics.filterApplied('exclude', tag, adding)
      return next
    })
  }, [])

  const handleReveal = useCallback(food => {
    setCurrentFood(food)
    if (food) {
      setConfettiKey(k => k + 1)
      addToHistory(food)
      analytics.resultShown(food, activeFilters)
    }
  }, [activeFilters, addToHistory])

  const handleRoll = useCallback(() => {
    analytics.rollClicked(activeFilters)
  }, [activeFilters])

  const handleAgain = useCallback(() => {
    analytics.rerollClicked(activeFilters)
    setCurrentFood(null)
  }, [activeFilters])

  const isFaved = currentFood ? favorites.some(f => f.id === currentFood.id) : false

  const toggleFav = useCallback(() => {
    if (!currentFood) return
    analytics.saveClicked(currentFood, !isFaved)
    setFavorites(isFaved
      ? favorites.filter(f => f.id !== currentFood.id)
      : [...favorites, { id: currentFood.id, name: currentFood.name, emoji: currentFood.emoji }]
    )
  }, [currentFood, favorites, isFaved, setFavorites])

  const removeFav = useCallback(id =>
    setFavorites(favorites.filter(f => f.id !== id))
  , [favorites, setFavorites])

  const handleOrder = useCallback(() => {
    if (currentFood) analytics.deliveryIntentClicked(currentFood)
  }, [currentFood])

  const handleCook = useCallback(() => {
    if (currentFood) analytics.cookIntentClicked(currentFood)
  }, [currentFood])

  const handleShare = useCallback(() => {
    if (currentFood) analytics.shareClicked(currentFood)
  }, [currentFood])

  return (
    <div className="app">
      <div className="app-glow" aria-hidden />

      {confettiKey > 0 && <Confetti key={confettiKey} />}

      {/* ── Header ── */}
      <header className="hdr">
        <div className="hdr-inner">
          <div className="logo">
            <span className="logo-icon">🍽️</span>
            <span className="logo-text">What<em>To</em>Eat</span>
          </div>
        </div>
      </header>

      {/* ── Body: sidebar + content ── */}
      <div className="app-body">

        {/* Left sidebar — filters + saved favourites */}
        <aside className="app-sidebar">
          <FilterBar
            moods={moods}
            toggleMood={toggleMood}
            excluded={excluded}
            toggleExclude={toggleExclude}
          />
          {favorites.length > 0 && (
            <>
              <div className="sidebar-divider" />
              <Favorites favorites={favorites} onRemove={removeFav} />
            </>
          )}
        </aside>

        {/* Main content */}
        <div className="app-content">

          <section className="hero">
            <h1 className="hero-h1">
              Not sure what<br />to eat <em>today?</em>
            </h1>
            <p className="hero-sub">Tap the stage and let us pick a dish for you.</p>
          </section>

          {!currentFood ? (
            <DiceRoller
              filteredFoods={filteredFoods}
              onReveal={handleReveal}
              onRoll={handleRoll}
            />
          ) : (
            <>
              <div className="result-col">
                <ResultCard
                  food={currentFood}
                  imageUrl={imageUrl}
                  isFaved={isFaved}
                  onFav={toggleFav}
                  onAgain={handleAgain}
                  onOrder={handleOrder}
                  onCook={handleCook}
                  onShare={handleShare}
                  activeMoods={moods}
                />
              </div>
              <NearbySection food={currentFood} />
            </>
          )}

          {favorites.length > 0 && (
            <div className="mobile-favorites">
              <div className="divider" />
              <Favorites favorites={favorites} onRemove={removeFav} />
            </div>
          )}

        </div>
      </div>

      <footer className="app-footer">
        <span className="footer-heart">♥</span>
        WhatToEat — for the chronically hungry and indecisive
      </footer>
    </div>
  )
}
