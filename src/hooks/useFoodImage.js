import { useState, useEffect } from 'react'

// Only include foods where TheMealDB has a confirmed, accurate match.
// If a food isn't listed here it gracefully falls back to the emoji — no wrong photos.
const MEAL_DB_TERMS = {
  'Burger':         'Big Mac',
  'Pizza':          'Pizza Express Margherita',
  'Pasta':          'Spaghetti Carbonara',
  'Steak':          'Beef Wellington',
  'Indian Curry':   'Chicken Tikka Masala',
  'Pad Thai':       'Pad Thai',
  'Pancakes':       'Pancakes',
  'Falafel':        'Falafel',
  'Dim Sum':        'Pork Dumplings',
  'Dumplings':      'Pork Dumplings',
  'Grilled Salmon': 'Teriyaki Salmon Fillets',
  'Crepes':         'French Crepes',
  'Pho':            'Pho',
  'Fish & Chips':   'Fish and Chips',
  'Waffles':        'Waffles',
}

const imageCache = new Map()

async function fetchImage(foodName) {
  const term = MEAL_DB_TERMS[foodName]
  if (!term) return null          // no known mapping → show emoji

  try {
    const res  = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(term)}`)
    const data = await res.json()
    if (data.meals?.length) return data.meals[0].strMealThumb
  } catch { /* network error */ }

  return null                     // API failed → show emoji, no fallback guessing
}

export function useFoodImage(food) {
  const [imageUrl, setImageUrl] = useState(null)
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    if (!food) { setImageUrl(null); return }

    const key = food.id
    if (imageCache.has(key)) {
      setImageUrl(imageCache.get(key))
      return
    }

    let cancelled = false
    setLoading(true)

    fetchImage(food.name).then(url => {
      if (cancelled) return
      imageCache.set(key, url)   // cache null too, so we don't re-fetch
      setImageUrl(url)
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [food])

  return { imageUrl, loading }
}
