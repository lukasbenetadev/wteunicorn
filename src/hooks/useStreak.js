import { useState, useCallback } from 'react'

const KEY = 'wte_streak'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayStr() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

function loadStreak() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? { count: 0, lastDate: null }
  } catch {
    return { count: 0, lastDate: null }
  }
}

export function useStreak() {
  const [streak, setStreak] = useState(() => loadStreak().count)

  const incrementStreak = useCallback(() => {
    const today = todayStr()
    const data  = loadStreak()

    if (data.lastDate === today) return

    const next = data.lastDate === yesterdayStr()
      ? data.count + 1
      : 1

    localStorage.setItem(KEY, JSON.stringify({ count: next, lastDate: today }))
    setStreak(next)
  }, [])

  return { streak, incrementStreak }
}
