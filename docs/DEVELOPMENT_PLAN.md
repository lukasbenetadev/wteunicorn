# Development Plan — WhatToEat

> Last updated: May 2026
> Status: MVP complete, V2 in progress

---

## What We Have (Built ✅)

### Core product
- 3D dice roll animation under theater curtains (Three.js + React Three Fiber)
- Mood/vibe filters — collapsible via ⚙ button on mobile
- Exclusion filters (vegetarian, no spicy, no meat, etc.)
- Weighted random selection based on active filters
- Result card with hand-written emotional copy per dish (35 dishes)
- "I'd order this" → opens Wolt with dish pre-searched (`@capacitor/browser`)
- "I'd cook this" → opens Google recipe search for the dish
- Save to favourites (localStorage)
- Share via Web Share API / clipboard fallback
- Meal history (last 10 rolls, localStorage)
- Meal streak counter — 🔥 N day streak badge, consecutive-day logic (localStorage)
- Returning user message — "Back again? Last time you picked 🍜 Ramen"
- PostHog analytics — 11 events tracked (page_view, roll, result, delivery intent, etc.)

### Mobile app
- Native iOS app via Capacitor
- Fixed header with safe area (Dynamic Island / notch handled)
- Scroll-to-top on reveal and "Again"
- Android project ready (colleague can build on Windows)

### Build / performance
- Three.js split into `vendor-three` chunk — main app bundle: **74 KB gzipped** (was 376 KB)
- DiceRoller lazy-loaded with `React.lazy()` — non-blocking initial paint
- Nearby restaurants section — real hook wired up, falls back to demo data until API key added
- `.env.example` committed — colleague adds API keys to `.env.local`, no code changes needed
- Shareable image card — branded 600×600 PNG generated on Share tap (`html2canvas`, lazy-loaded)

### Docs
- `docs/DEVELOPMENT.md` — dev workflow for Mac/iOS and Windows/Android
- `docs/PRODUCT_STRATEGY.md` — full PM strategy doc
- `ROADMAP.md` — feature + auth + i18n roadmap
- `MONETIZATION.md` — Wolt, Google Places, TheFork, AdMob breakdown

---

## What We're Missing (⚠️ action required)

### 1. Wolt Affiliate Code — MISSING
**This is blocking monetization.**
- The "I'd order this" button opens Wolt but has **no affiliate ref code**
- Without it you send users to Wolt for free
- **Action:** Apply at [wolt.com/en/business](https://wolt.com/en/business) → Partners section
  - Or search "Wolt affiliate Impact" (Impact.com network, often faster approval)
- Once you have the code, open `src/components/ResultCard.jsx` and change:
  ```js
  const url = `https://wolt.com/en/discovery?q=${query}`
  ```
  to:
  ```js
  const url = `https://wolt.com/en/discovery?q=${query}&ref=YOUR_CODE`
  ```
- **Revenue:** ~€3–10 per new user's first order

### 2. Google Places API Key — MISSING (colleague handling)
- Nearby restaurants section is fully built and wired up
- Falls back to demo data until the key arrives
- Once ready, add to `.env.local`: `VITE_GOOGLE_PLACES_KEY=AIza...`
- Real restaurants appear automatically — no code changes needed

### 3. App Store / Play Store Listing — NOT DONE
- App is built and runs on iOS but not submitted to App Store
- Needs: app icon, launch screen, App Store screenshots, description
- **Effort:** 1 day of assets + Apple Developer account ($99/yr)

---

## What's Next — Priority Order

```
[x] 1. Apply for Wolt affiliate program (colleague handling)
[x] 2. Wire "I'd cook this" to Google recipe search
[x] 3. Add returning user "Back again?" message
[x] 4. Build Google Places hook with mock fallback
[x] 5. Split chunks + lazy-load DiceRoller (performance)
[x] 6. Shareable branded image card (html2canvas, lazy-loaded, native share sheet)
[ ] 7. Add Wolt ref + Google Places key once colleague delivers → .env.local
[ ] 8. Commit & push, sync Xcode, test on real device
[ ] 9. App Store prep — icon, screenshots, description
[ ] 10. Deploy web version publicly (Vercel / Netlify)
```

---

## V3 / Later (don't build yet — wait for users)

- Weekly recap shareable card
- City-based "most popular this week" widget
- "Try something different" nudge after 3 similar picks
- UTM tracking on all Wolt links per dish per city
- User accounts (Supabase — Google, Apple, Email/Password)
- Favourites + history synced to cloud
- i18n: Lithuanian + Polish, German, French, Spanish, Latvian, Estonian

---

## Partnership Readiness

Target numbers before contacting Wolt/Bolt directly:

| Metric | Target |
|--------|--------|
| Monthly active users | 5,000+ |
| Delivery intent click rate | 15%+ of results shown |
| D7 retention | 20%+ |
| Total rolls | 50,000+ |
| Top city (Vilnius) sessions | 1,000+ |

All of these are tracked in PostHog right now. Check the dashboard regularly.

---

## Tech Debt / Notes

- `dist/` is now in `.gitignore` — don't commit build output
- iOS minimum deployment target must be set to **16.0** in Xcode manually (Capacitor requirement)
- Three.js bundle is large (~1.3 MB gzip: 376 KB) — acceptable for now, revisit if load time becomes a complaint
- `ROADMAP.md` and `MONETIZATION.md` are in the project root (not `docs/`) — consider moving later
