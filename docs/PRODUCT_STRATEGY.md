# WhatToEat — Product Strategy

> Written from the perspective of a senior PM reviewing an early-stage consumer product.
> Goal: build traction, understand user behavior, and become partnership-ready for Wolt / Bolt Food.

---

## 1. Target Audience

**Primary segment: Decision-fatigued young adults (18–34)**
They've already made 200+ decisions today. Food is the last thing they want to think about. They're not asking "what exists" — they're asking "please just tell me."

**Secondary segments:**
- Couples who argue about what to eat (high viral potential)
- Remote workers eating lunch alone, daily
- Students with limited budget and limited cuisine knowledge
- Foodies who want discovery, not just convenience

**The real problem isn't hunger. It's this:**
> "I have 10 minutes, I'm tired, everything sounds both good and bad, and I can't commit."

That's decision fatigue mixed with option paralysis. The app is a permission slip to stop thinking.

**Focus first on:** Solo urban users, 22–32, smartphone-first, using food delivery 2–3x/week.

---

## 2. Core Value Proposition

Don't position this as a "random generator." That sounds like a toy.

**Position it as:**
> "The fastest way to decide what to eat — before you waste 20 minutes scrolling Wolt."

**Emotional hook:**
The moment the result appears and it feels *right* — that micro-relief is the product. The user thinks: "Yes, that's exactly what I wanted but couldn't name." That's the moment to engineer every single time.

**How to make users feel "this actually helped me":**
- The result card must have an emotional description, not just a dish name
- The copy does the work: *"Warm, crispy, filling. Perfect for a tired Thursday evening."*
- Tags should validate the choice: `comfort · quick · cheap`
- Show a "Why this?" line based on active mood filters

---

## 3. User Retention

**The daily use case:** Lunchtime and dinner-decision moment (12:00–13:00 and 18:00–20:00). Own that 2-minute window of indecision.

**Retention mechanics that don't overcomplicate:**

| Feature | Why it works | Status |
|---|---|---|
| Meal history | "Last Tuesday you picked Ramen too" — makes it feel personal | ✅ Built |
| Mood filters | Personalises results without a signup form | ✅ Built |
| Favorites | Not for re-rolling — for when you already know | ✅ Built |
| Meal streak | "5 days decided in under 30 seconds" — tiny dopamine | 🔜 V2 |
| Weekly recap | "Your top mood this week: Quick & Cheap" — shareable | 🔜 V2 |
| "Try something new" nudge | After 3 similar picks, suggest outside comfort zone | 🔜 V2 |
| "What did you eat?" follow-up | Increases data quality + habit loop | 🔜 V2 |

**Do not add yet:** Login walls, push notifications before trust is earned, gamification points systems.

---

## 4. Personalization

**Golden rule: ask nothing upfront, learn everything through behavior.**

Onboarding is zero-friction:
- No signup, no form, no wizard
- First visit → one click → result
- Personalization builds after the first roll

**Progressive profiling approach:**
- Session 1: pure random
- Session 2: "Want results like last time?" (yes/no)
- Session 3: mood picker appears naturally
- Session 5+: diet/budget preferences saved silently from patterns

**The question hierarchy (if you ever ask):**
1. Mood/vibe — highest intent signal, fastest to answer
2. Budget — critical for delivery intent
3. Diet restriction — binary, one tap
4. Cuisine exclusions — optional
5. Cook vs order — splits the funnel for monetization

**Rule:** Never ask more than 2 things before the first roll.

---

## 5. UX Flow

**Mobile-first. Under 3 taps to value.**

```
LANDING
────────────────────────────────────
Big headline: "What should I eat?"
One button: [ Roll my meal 🎲 ]
Tiny subtext: "No signup. No BS. Just decide."
────────────────────────────────────

MOOD SELECTOR (optional, 1 tap)
[ Comfort food ]  [ Something light ]
[ Cheap eats ]    [ Surprise me ]
────────────────────────────────────

ROLL ANIMATION (0.8s max)
Spinning food emojis → snap to result
Fast. Satisfying. No loading spinner.
────────────────────────────────────

RESULT CARD
🍛 Chicken Katsu Curry
"Crispy, warm, filling. Perfect for a tired evening
when you want real food without overthinking."
Tags: [ comfort · filling · popular ]
Matches your vibe: Comfort Food

[ 📦 I'd order this ]   [ 👨‍🍳 I'd cook this ]
[ ♡ Save ]  [ ↗ Share ]  [ ↺ Again ]
────────────────────────────────────

POST-CLICK (delivery intent)
"Nice. Showing restaurants near you serving this →"
(location prompt here — user already decided, trust is highest)
────────────────────────────────────

RETURNING USER
"Back again? Last time you picked Ramen."
[ Same vibe ]  [ Try something different ]
```

**Key UX principles:**
- Animation is a **3D dice roll under theater curtains** (Three.js) — not a spinner
- Result copy is written by a human, not a template
- "I'd order this" captures delivery intent before you have a partner
- Share button generates a card, not just a link
- Never ask for location on landing — ask only after delivery intent click

---

## 6. Feature Roadmap

### MVP (built)
- Roll button with **3D dice roll under theater curtains** (Three.js + React Three Fiber)
- Mood/vibe filter (1 tap) — collapsible via ⚙ button on mobile
- Exclusion filters (vegetarian, no spicy, no meat, etc.)
- Result card with emotional description copy
- "I'd order this" → **opens Wolt with dish pre-searched** (`@capacitor/browser`)
- "I'd cook this" intent button
- Save / favorites (localStorage)
- Share (Web Share API + clipboard fallback)
- Meal history (last 10 rolls, localStorage)
- PostHog analytics (11 events tracked)
- **Native iOS app** (Capacitor) — Android ready for colleague
- Mobile-first layout: fixed header with safe area, scroll-to-top on reveal

### V2 (next — build before 1,000 users)
- ✅ **Meal streak counter** — 🔥 N day streak badge, resets on missed day, localStorage
- **Location-aware nearby restaurants** — Google Places API replacing "Coming Soon"
- Returning user experience — "Back again? Last time you picked Ramen."
- Wolt affiliate ref code appended to deep link (apply at wolt.com/en/business)

### V3 (after 1,000 users)
- Shareable result image card (9:16 Instagram Stories format)
- Weekly recap card (shareable, branded)
- City-based "most popular this week" widget
- "Try something different" nudge after repeated similar picks
- "Cook it" mode — links to recipe (SEO play)
- UTM tracking on all Wolt deep links per dish per city

### V4 (partnership-ready)
- User accounts + OAuth login (Supabase — Google, Apple, Email)
- Favourites + history synced to cloud
- i18n: Lithuanian + major European languages
- Restaurant "featured" placement slot (clearly labeled)
- Click-to-order handoff with server-side redirect logging

### Do NOT build yet
- Social features / follow friends
- Full restaurant menus or delivery integration
- Push notifications
- AI meal generation
- Subscription or paywall of any kind (wait for user base)

---

## 7. Analytics

Analytics is live via PostHog. See [README](../README.md#analytics) for the full event list.

**What matters most before having a delivery partner:**

| Metric | Why it matters |
|---|---|
| `delivery_intent_clicked` rate | Proves purchase intent — the core pitch to Wolt/Bolt |
| `reroll_clicked` count per session | Proves engagement depth, not just bounce |
| `result_shown` by `hour` | Confirms dinner window (18:00–20:00) = delivery prime time |
| Top dishes by city | Actionable data for restaurant partners |
| D7 retention | Proves it's not a one-trick toy |
| Location permission rate | Shows funnel readiness for nearby restaurants feature |

---

## 8. Partnership Angle

**What Wolt / Bolt actually care about:**
They have millions of users who already decided to order. This app has users who are *deciding right now*. That's a different, earlier funnel stage — and it's valuable.

**The pitch:**
> "We capture users at peak decision moment — hungry, undecided, mobile. X% click 'I'd order this.' Our top dishes in Vilnius this month are X, Y, Z. We send pre-qualified, high-intent users directly into your app on a per-click or revenue-share basis."

**Numbers to hit before contacting partners:**

| Metric | Target |
|---|---|
| Monthly active users | 5,000+ |
| Delivery intent click rate | 15%+ of results shown |
| Location permission rate | 30%+ |
| D7 retention | 20%+ |
| Top city volume | 1,000+ sessions from one city |
| Total rolls | 50,000+ |

**Easier first step:** Partner with 2–3 local restaurants in your city. Offer a free "featured dish" placement in exchange for a quote/testimonial. Build the case study before approaching platforms.

---

## 9. Growth Strategy

**Zero-budget tactics that work for a solo developer:**

### TikTok / Reels (highest ROI right now)
- *"I let an app decide every meal for a week"* — relatable, viral format
- *"POV: you can't decide what to eat"* — show the app solving it in 5 seconds
- *"Rating every meal my app recommended"* — series format, consistent views
- Film the actual dice animation + result — it's satisfying to watch

### SEO (slow but durable)
- Target: *"what should I eat today"*, *"what to eat for dinner"*, *"I can't decide what to eat"*
- City pages: *"What to eat in Vilnius today"*
- Cuisine/mood pages: *"Comfort food ideas when you're tired"*
- Recipe pages per dish — cook intent + SEO + time-on-site

### Shareable moment (product-led growth)
- Generate a share card per result: *"Today I'm having: Chicken Katsu Curry 🍛"*
- Instagram Stories format — 9:16, branded, looks good
- Subtle watermark with URL — every share is a free impression

### Community / Meme angle
- Post weekly *"Most rolled dish in Lithuania this week"*
- *"What did 10,000 people decide to eat on Tuesday?"* — curiosity hook

### First 100 users
- Post in local Facebook food groups, Reddit, Discord
- Share on ProductHunt, IndieHackers
- DM 10 food bloggers in your city — no pitch, just share the link

---

## 10. Product Differentiation

Random generators feel cheap because the result doesn't *mean* anything.

| Generic generator | WhatToEat |
|---|---|
| Shows: "Pizza" | Shows: "Pizza — you picked comfort food, this is peak comfort" |
| No context | Emotional copy that validates the choice |
| One result | Roll again + history + streak |
| No location | "3 places near you serve this right now" |
| No data | Most ordered dish in Vilnius on Fridays |
| Forgettable | Shareable card, weekly recap, streak |

**The moat is behavioral data + emotional copy + local relevance.** Build the data layer from day one.

---

## 11. Monetization (after traffic exists)

| Model | Revenue potential | Trust risk | Notes |
|---|---|---|---|
| Affiliate deep links to Wolt/Bolt | High | Low | Only shows when user intends to order |
| Featured restaurant placement (labeled) | Medium | Low | Must be clearly labeled as sponsored |
| City/restaurant promotion pages | Medium | Low | SEO value too |
| "Promoted dish" in roll results | Medium | Medium | Must be rare and mood-relevant |
| Premium filters (cuisine packs) | Low | Low | Only after strong free base |
| Display ads | Low | High | Kills the clean UX — avoid |
| Selling aggregate data | Medium | High | Legal risk, user trust risk — avoid |

**Start with:** Wolt/Bolt affiliate links on delivery intent click. Zero friction, zero trust cost.

**Never do:** Banner ads. It signals you ran out of ideas.

---

## 12. Risks & Mitigations

| Risk | Solution |
|---|---|
| Users try once and leave | Streak, meal history, weekly recap — give a reason to return |
| Results feel too random | Weighted randomness based on mood + exclusions + history |
| No delivery integration = dead end for intent clicks | Use Google Maps / Wolt search URL as fallback immediately |
| Location permission refusal (50–70% will refuse) | Never ask on landing — ask only after delivery intent click |
| Weak differentiation | Emotional copy + local data + streak = moat that takes time to copy |
| Low repeat usage | Own the 12:00 and 18:00 decision window |
| No traction for partnership | Instrument everything from day one — even 1,000 users with clean data tells a story |

---

## 13. MVP Definition & Priorities

**What the MVP must be:**
One screen. One button. One beautiful result. Emotional copy. Roll again. Save. Share. "I'd order this" tracked even with no partner yet.

**The main hook:**
> Relief. The user felt stuck. Now they don't. That 2-second moment of "yes, that" is the entire product.

**Build order:**
1. ✅ Roll mechanic with weighted mood logic
2. ✅ Result card with emotional copy per dish
3. ✅ "I'd order this" → Wolt deep link + analytics tracking
4. ✅ Save + share
5. ✅ Basic filters (mood, diet exclusion)
6. ✅ Analytics (every event from day one)
7. ✅ Native iOS app (Capacitor) + mobile-first layout
8. ✅ Streak counter — 🔥 badge above hero headline, consecutive-day logic
9. 🔜 Location-aware restaurant results (Google Places)
10. 🔜 Shareable result image card

**Avoid:**
Login, push notifications, AI generation, restaurant menus, anything that adds a screen before the first roll.

**Partnership-ready when:**
> "X thousand users per month, hitting the app at 18:30, Y% clicking order intent, top dish in Vilnius on Fridays is Ramen, here's the UTM-tracked conversion path into your platform."

That's not an idea. That's a business development conversation.
