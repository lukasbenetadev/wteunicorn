# WhatToEat

> Decide what to eat in seconds — spin the dice, filter by mood, and find nearby restaurants.

---

## Getting Started

```bash
# Install dependencies
npm install

# Create local env file (copy and fill in your keys)
cp .env.example .env.local

# Run the frontend (dev mode)
npm run dev

# Build for production
npm run build
```

---

## Environment Variables

Create a `.env.local` file in the root (never commit this):

```
VITE_POSTHOG_KEY=your_posthog_project_api_key
VITE_POSTHOG_HOST=https://eu.i.posthog.com
VITE_API_URL=http://localhost:3001
```

---

## Project Structure

```
whattoeat/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── .env.local               ← local secrets, never committed
├── src/
│   ├── main.jsx
│   ├── App.jsx / App.css
│   ├── index.css
│   ├── data.js
│   ├── analytics.js         ← PostHog event tracking
│   ├── components/
│   │   ├── DiceRoller.jsx / .css
│   │   ├── ResultCard.jsx / .css
│   │   ├── FilterBar.jsx / .css
│   │   ├── Favorites.jsx / .css
│   │   ├── NearbySection.jsx / .css
│   │   ├── Confetti.jsx / .css
│   │   └── Orb.jsx / .css
│   └── hooks/
│       ├── useFoodImage.js
│       ├── useNearbyRestaurants.js
│       └── useMealHistory.js
├── server/
│   ├── index.js
│   ├── config.js
│   ├── routes/
│   │   ├── restaurants.js
│   │   └── referral.js
│   └── services/
│       ├── wolt.js
│       └── tracking.js
└── dist/                    ← production build output (auto-generated)
```

---

## File Descriptions

### Root

| File | Description |
|------|-------------|
| `index.html` | HTML entry point. Loads the Inter font and mounts the React app into `#root`. |
| `package.json` | Project metadata, npm scripts (`dev`, `build`, `preview`), and dependencies (React 18, Vite, PostHog). |
| `vite.config.js` | Vite bundler config — enables the React plugin for JSX/Fast Refresh. |
| `.gitignore` | Ignores `node_modules/`, `.claude/`, and `.env.local` so secrets are never committed. |

---

### `src/` — Frontend (React)

| File | Description |
|------|-------------|
| `main.jsx` | App entry point. Renders `<App>` into the DOM inside React StrictMode. |
| `App.jsx` | Root component. Holds global state (mood filters, exclusions, current food, favorites) and wires all analytics callbacks. |
| `App.css` | Global layout and theme styles scoped to the app shell. |
| `index.css` | Base CSS reset and CSS custom properties (colors, fonts, spacing). |
| `data.js` | Static data — 32 food items each with `name`, `emoji`, `tags`, `moods`, and an emotional `description`. Also exports `MOODS` and `EXCLUDES`. |
| `analytics.js` | PostHog integration. Initialises the SDK and exports named tracking functions for every user action. Also stores a local copy of events in `localStorage` (capped at 300). |

#### `src/components/`

| File | Description |
|------|-------------|
| `DiceRoller.jsx` | The main spin button. Randomly picks a food from the filtered list, runs the curtain animation, and calls `onRoll` + `onReveal` callbacks. |
| `ResultCard.jsx` | Displays the picked food — name, emotional description, "why this fits" vibe line, mood tags, **📦 I'd order this**, **👨‍🍳 I'd cook this**, Save, Share, and Roll Again buttons. |
| `FilterBar.jsx` | Mood and exclusion filter controls. Updates active filter state in App on every toggle. |
| `Favorites.jsx` | Renders saved food picks (from localStorage). Shown in sidebar on desktop, below results on mobile. |
| `NearbySection.jsx` | Shows nearby restaurants serving the picked food. Currently uses mock data — will switch to live Wolt/Bolt API. |
| `Confetti.jsx` | Confetti burst animation that fires on every new food reveal. |
| `Orb.jsx` | Animated decorative background orb. |

#### `src/hooks/`

| File | Description |
|------|-------------|
| `useFoodImage.js` | Fetches or maps a food image URL for the current pick. |
| `useNearbyRestaurants.js` | Requests geolocation, calls `/api/restaurants`, and returns nearby restaurant results with a loading state. Also exports `buildOrderUrl` for tracked Wolt redirect links. |
| `useMealHistory.js` | Stores the last 10 rolled dishes in `localStorage` (keyed by `wte_history`). Used to detect patterns and power future "last time you picked X" nudges. |

---

### `server/` — Backend (Node / Express)

| File | Description |
|------|-------------|
| `index.js` | Express server entry point. Registers routes, sets up CORS for local dev, and starts listening. Preserves raw request body for Wolt webhook signature verification. |
| `config.js` | Server config — port, Wolt API key, and other environment-driven settings. |

#### `server/routes/`

| File | Description |
|------|-------------|
| `restaurants.js` | `GET /api/restaurants` — takes a food name and coordinates, proxies the Wolt API, and returns nearby matching restaurants. |
| `referral.js` | `POST /api/referral` — handles Wolt referral/webhook events and click-through redirects. |

#### `server/services/`

| File | Description |
|------|-------------|
| `wolt.js` | Wrapper around the Wolt API — handles auth, request formatting, and response parsing. |
| `tracking.js` | Logs or forwards server-side analytics events (referral clicks, order handoffs). |

---

## Analytics

Analytics is handled by [`src/analytics.js`](src/analytics.js) using **PostHog**.

### Events tracked

| Event | Fired when |
|---|---|
| `page_view` | App mounts |
| `roll_clicked` | User clicks the dice stage |
| `reroll_clicked` | User clicks "Again" on a result |
| `result_shown` | A food is revealed — includes `dish`, `dishId`, `activeFilters`, `hour` |
| `save_clicked` | User saves or unsaves a dish |
| `share_clicked` | User clicks the Share button |
| `delivery_intent_clicked` | User clicks "I'd order this" — **primary partnership metric** |
| `cook_intent_clicked` | User clicks "I'd cook this" |
| `filter_applied` | Any mood or exclusion filter is toggled |
| `location_permission_granted` | Browser grants geolocation |
| `location_permission_denied` | User denies geolocation |

### Key metrics for Wolt/Bolt partnership pitch

- `delivery_intent_clicked` rate (% of results that convert to order intent)
- `reroll_clicked` count per session (engagement depth)
- `result_shown` breakdown by `dish` and `hour` (peak dinner window 18:00–20:00)
- `page_view` breakdown by city/country

### Debug

In dev mode every event is logged to the browser console in orange. To inspect stored events:

```js
// Browser console
JSON.parse(localStorage.getItem('wte_events'))
JSON.parse(sessionStorage.getItem('wte_session'))
```
