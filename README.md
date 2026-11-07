# Grantly

**Rethinking the Scholarship Experience** — a calm, clear scholarship discovery and tracking app built for THE OUTPOST hackathon.

## Problem

Finding scholarships is overwhelming. Students waste hours scrolling through lists, unsure which ones they qualify for. Grantly solves this by showing a personalised match score on every scholarship, highlighting exactly which criteria are met, unmet, or unknown.

## Approach

- **Match-first design**: Every scholarship shows a score ring — the single memorable element. Everything else stays quiet so a stressed student can focus.
- **Guided onboarding**: A 4-step wizard (Study → You → Money & marks → Review) builds the profile in under 2 minutes. Skip any step and come back later.
- **Journey stepper**: The navbar shows where you are — Profile, Discover, Apply, Track — and collapses to dots on mobile.
- **Quick-view drawer**: See eligibility details and compare up to 3 scholarships without leaving the Discover page.
- **Application tracker**: Kanban-style columns (Saved → Applying → Submitted → Result) with document checklists, notes, and an animated funding counter.
- **Accessible by default**: Skip-to-content link, focus rings, ARIA landmarks, keyboard navigation, 40px+ tap targets, reduced-motion support.

## Features

- Landing hero with live interactive demo (sliders change the match score in real time)
- 24 fictional scholarships with varied eligibility criteria
- Profile-aware match scoring (met / unmet / unknown)
- Filtering by level, deadline, text search, and "strong matches only"
- Animated page transitions, staggered card entrances, ring fill animation
- Toast notifications for tracker actions
- Skeleton loaders on first Discover render
- Responsive at 375px, 768px, and 1280px
- Full keyboard accessibility and screen reader support

## Stack

- **Vite** + **React 18** + **TypeScript** (strict)
- **Tailwind CSS v3** — custom palette (ink, mist, teal, sun, rose) + Bricolage Grotesque / DM Sans fonts
- **React Router v6** — SPA routing with Vercel rewrite
- **Zustand** — persisted to localStorage (`grantly-v1`)
- **Framer Motion** — page transitions, ring animation, layout animation, staggered cards
- **clsx** + **tailwind-merge** — utility class composition via `cn()`

## Run

```bash
npm install
npm run dev       # opens at http://localhost:5173
npm run build     # TypeScript check + production build
npm run preview   # preview the production build
```

Deploy: import on Vercel — `vercel.json` handles SPA routing.

## Project structure

```
src/
├── components/
│   ├── ui/          # Button, Badge, Field (reusable primitives)
│   ├── Card.tsx     # Scholarship card with Ring + actions
│   ├── Due.tsx      # Deadline badge
│   ├── Layout.tsx   # Shell with navbar, journey stepper, footer
│   ├── ProfileForm.tsx
│   ├── QuickViewDrawer.tsx
│   ├── Ring.tsx      # Match score ring (animated)
│   ├── Skeleton.tsx  # Card loading skeleton
│   └── Toast.tsx     # Notification toast system
├── pages/
│   ├── Home.tsx       # Landing hero with interactive demo
│   ├── Discover.tsx   # Scholarship list with filters
│   ├── Detail.tsx     # Full scholarship page
│   ├── Tracker.tsx    # Kanban application tracker
│   ├── Onboarding.tsx # 4-step profile wizard
│   └── Profile.tsx    # Edit profile page
├── lib/
│   ├── motion.ts     # Framer Motion variants + helpers
│   └── utils.ts      # cn() class utility
├── App.tsx           # Routing only
├── data.ts           # 24 fictional scholarships
├── match.ts          # Match scoring logic (unchanged)
├── store.ts          # Zustand store (unchanged)
├── main.tsx          # Entry point
└── index.css         # Tailwind directives + custom styles
```

## Assumptions

- All scholarship data is fictional sample data — see `src/data.ts`
- Match logic treats unknown profile fields as "not penalised" (score = met / judgeable)
- Deadlines are relative to today (`Date.now() + n days`) so they always appear fresh
- The app is client-side only with localStorage persistence; no backend
- "Apply" step in the journey stepper is a future feature placeholder (links to Discover)

## Sample data note

All scholarships, providers, and amounts are fictional and created for demonstration purposes only.
