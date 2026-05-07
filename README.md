# WhatToEat

> Decide what to eat in seconds — spin the dice, filter by mood, and find nearby restaurants.

---

## Project Structure

```
whattoeat/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── src/
│   ├── main.jsx
│   ├── App.jsx / App.css
│   ├── index.css
│   ├── data.js
│   ├── config.js
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
│       └── useNearbyRestaurants.js
├── server/
│   ├── index.js
│   ├── config.js
│   ├── routes/
│   │   ├── restaurants.js
│   │   └── referral.js
│   └── services/
│       ├── wolt.js
│       └── tracking.js
└── dist/          ← production build output (auto-generated)
```

---

## File Descriptions

### Root

| File | Description |
|------|-------------|
| `index.html` | HTML entry point. Loads the Inter font and mounts the React app into `#root`. |
| `package.json` | Project metadata, npm scripts (`dev`, `build`, `preview`), and dependencies (React 18, Vite). |
| `vite.config.js` | Vite bundler config — enables the React plugin for JSX/Fast Refresh. |
| `.gitignore` | Tells Git to ignore `node_modules/` and `.claude/` so they are never committed. |

---

### `src/` — Frontend (React)

| File | Description |
|------|-------------|
| `main.jsx` | App entry point. Renders `<App>` into the DOM inside React StrictMode. |
| `App.jsx` | Root component. Holds global state (selected mood, filters, current food pick) and composes all major sections. |
| `App.css` | Global layout and theme styles scoped to the app shell. |
| `index.css` | Base CSS reset and CSS custom properties (colors, fonts, spacing). |
| `data.js` | Static data — `FOODS` array (32 food items with tags and moods), `MOODS` filter options, and `EXCLUDES` (dietary restrictions). |
| `config.js` | Frontend config — API base URL and any feature flags. |

#### `src/components/`

| File | Description |
|------|-------------|
| `DiceRoller.jsx` | The main spin button. Randomly picks a food from the filtered list and triggers the result animation. |
| `ResultCard.jsx` | Displays the picked food — name, emoji, and mood tags. Shown after a spin. |
| `FilterBar.jsx` | Mood and exclusion filter controls (Cheap, Comfort Food, Healthy-ish, etc.). Updates the active filter state in App. |
| `Favorites.jsx` | Lets users save and revisit their favourite food picks (stored in localStorage). |
| `NearbySection.jsx` | Shows nearby restaurants that serve the picked food, fetched from the backend API. |
| `Confetti.jsx` | Confetti burst animation that fires when a food is picked. |
| `Orb.jsx` | Animated decorative orb used as a visual background element. |

#### `src/hooks/`

| File | Description |
|------|-------------|
| `useFoodImage.js` | Custom hook that fetches or maps a food image URL for the picked food item. |
| `useNearbyRestaurants.js` | Custom hook that calls `/api/restaurants` with the user's location and picked food, returning nearby restaurant results. |

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
| `referral.js` | `POST /api/referral` — handles Wolt referral/webhook events. |

#### `server/services/`

| File | Description |
|------|-------------|
| `wolt.js` | Wrapper around the Wolt API — handles auth, request formatting, and response parsing. |
| `tracking.js` | Logs or forwards analytics events (spins, picks, referral clicks). |

---

## Getting Started

```bash
# Install dependencies
npm install

# Run the frontend (dev mode)
npm run dev

# Build for production
npm run build
```
