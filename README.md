# Grantly

Scholarship discovery and tracking for students. Every scholarship shows a personal match score, what you meet, what you miss, and how to fix it.
Built solo for a 6-hour frontend hackathon. Style: softened neo-brutalism (2px ink borders, hard offset shadows, flat colour, sticker badges).

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # tsc --noEmit + vite build
npm run preview
```

Deploy on Vercel as-is. `vercel.json` rewrites everything to `index.html` for the SPA routes.

## Features

- **Home**: live sample card. Sliders and a toggle recompute the score; the checklist punches in item by item.
- **Journey stepper** (Profile, Discover, Apply, Track) with `aria-current="step"` and a tracker count.
- **Onboarding**: 4 steps, segmented progress bar, inline accessible validation, skip, saves as you go.
- **Profile**: edit anytime, completeness meter, hints like "Add your percentage to check 3 more scholarships".
- **Discover**: search, level/field/category filters, deadline window, strong matches only, sort, quick-view drawer, compare picker with sticky bar.
- **Detail**: eligibility first, a "how to fix" hint on every unmet item, "What would change my score?" sliders (not saved), documents, steps as a timeline.
- **Compare**: up to 3 side by side.
- **Tracker**: funding meter and odometer, 4 columns, document checklist and notes, "Gather these documents first" ranking, 30-day deadline strip, `.ics` download, undo after Remove.
- **Dark mode** (persisted) and **keyboard shortcuts**: `/` search, `?` help, `g` then `t` tracker, `g` then `d` discover.
- **Pass 2 polish**: deferred search/filter work, lazy route chunks, Ctrl/Cmd+K command palette, one-click demo profile, scroll progress, optimistic undo, and print-friendly tracker output.
- **Pass 3 centerpiece**: a live five-scholarship re-rank lab with real matching, stepped rings, score deltas, category chips, woman-applicant control, and reduced-motion-aware autoplay. Returning users land on a dashboard bento view.
- 24 fictional scholarships (10 added, deadlines over the next 4 months).

## Motion (all under 400ms, none with `prefers-reduced-motion`)

RatchetRing (stepped fill + count-up), Stamp, TicketTear (dashed edge + stepped pulse for deadlines within 7 days), BlockWipe route transition, SegmentedMeter, square confetti (once per session), staggered first-load cards, skeletons, kanban layout animation, funding odometer.

## Stack

Vite, React 18, TypeScript (strict), Tailwind v3, React Router v6, Zustand (persisted as `grantly-v1`), Framer Motion 11, cmdk, Radix primitives, dnd-kit, Vitest, clsx + tailwind-merge v2.

## Structure

```
src/
  components/   Layout, Stepper, RatchetRing, Stamp, SegmentedMeter, Dialog, QuickView, ...
    ui/         Button, Card, Badge, Field, Sticker, Slider
  pages/        Home, Onboarding, Discover, Detail, Compare, Tracker, Profile
  lib/          motion, hooks, hints, ics, actions, ui-store, options, utils
  match.ts      scoring (unchanged)    data.ts  24 scholarships    store.ts  Zustand store
```

All scholarships, providers and amounts are fictional sample data.

## Performance notes

`npm run build` emits route-level chunks and keeps the entry chunk under 170 kB gzip in the current Vite build (about 128 kB gzip). Discover search uses `useDeferredValue`, filters use `useTransition`, and match calculations are memoised once per profile change.

## Assumptions

- The existing fictional data and scoring contract remain authoritative; `src/match.ts` was not changed.
- The demo profile is intentionally realistic but fictional and navigates directly to Discover.
- Print output is intentionally focused on the tracker and hides navigation/actions.
- Browser Lighthouse and real screen-reader checks require a running browser environment; build, lint, and focused scoring tests are included locally.
