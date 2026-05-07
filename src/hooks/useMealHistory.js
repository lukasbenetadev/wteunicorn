import { useState, useCallback } from 'react'

const KEY = 'wte_history'
const MAX = 10

export function useMealHistory() {
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) ?? [] }
    catch { return [] }
  })

  const addToHistory = useCallback((food) => {
    setHistory(prev => {
      const entry  = { id: food.id, name: food.name, emoji: food.emoji, ts: Date.now() }
      const next   = [entry, ...prev.filter(h => h.id !== food.id)].slice(0, MAX)
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { history, addToHistory }
}
