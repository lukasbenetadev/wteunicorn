import posthog from 'posthog-js'

const SESSION_KEY = 'wte_session'
const EVENTS_KEY  = 'wte_events'
const MAX_EVENTS  = 300

// initialise PostHog once
posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
  api_host:              import.meta.env.VITE_POSTHOG_HOST ?? 'https://eu.i.posthog.com',
  capture_pageview:      false,   // we fire page_view manually
  capture_pageleave:     true,
  persistence:           'localStorage',
})

function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (raw) return JSON.parse(raw)
    const session = {
      id:    crypto.randomUUID(),
      start: Date.now(),
      rolls:   0,
      rerolls: 0,
      isNew: !localStorage.getItem('wte_returning'),
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
    localStorage.setItem('wte_returning', '1')
    return session
  } catch {
    return { id: 'unknown', start: Date.now(), rolls: 0, rerolls: 0, isNew: true }
  }
}

function patchSession(patch) {
  try {
    const updated = { ...getSession(), ...patch }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated))
  } catch {}
}

function push(event, props = {}) {
  const session = getSession()
  const payload = {
    event,
    ts:        Date.now(),
    hour:      new Date().getHours(),
    sessionId: session.id,
    isNew:     session.isNew,
    ...props,
  }

  if (import.meta.env.DEV) {
    console.log('%c[analytics]', 'color:#ff7a1a;font-weight:700', payload)
  }

  // send to PostHog
  posthog.capture(event, payload)

  // also keep local copy
  try {
    const stored = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]')
    stored.push(payload)
    if (stored.length > MAX_EVENTS) stored.splice(0, stored.length - MAX_EVENTS)
    localStorage.setItem(EVENTS_KEY, JSON.stringify(stored))
  } catch {}
}

export const analytics = {
  pageView() {
    push('page_view', { referrer: document.referrer })
  },

  rollClicked(activeFilters) {
    const s = getSession()
    const rolls = s.rolls + 1
    patchSession({ rolls })
    push('roll_clicked', { activeFilters, rollNumber: rolls })
  },

  rerollClicked(activeFilters) {
    const s = getSession()
    const rerolls = s.rerolls + 1
    patchSession({ rerolls })
    push('reroll_clicked', { activeFilters, rerollNumber: rerolls })
  },

  resultShown(food, activeFilters) {
    push('result_shown', {
      dishId:       food.id,
      dish:         food.name,
      activeFilters,
    })
  },

  saveClicked(food, isSaving) {
    push('save_clicked', { dishId: food.id, dish: food.name, action: isSaving ? 'save' : 'unsave' })
  },

  shareClicked(food) {
    push('share_clicked', { dishId: food.id, dish: food.name })
  },

  deliveryIntentClicked(food) {
    push('delivery_intent_clicked', { dishId: food.id, dish: food.name })
  },

  cookIntentClicked(food) {
    push('cook_intent_clicked', { dishId: food.id, dish: food.name })
  },

  filterApplied(filterType, value, active) {
    push('filter_applied', { filterType, value, active })
  },

  locationGranted() {
    push('location_permission_granted')
  },

  locationDenied() {
    push('location_permission_denied')
  },

  dump() {
    try { return JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]') }
    catch { return [] }
  },
}
