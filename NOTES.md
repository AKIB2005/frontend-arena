# Notes

## Done

Everything in the brief's priority list, steps 1 to 11, including the bottom-of-list items (dark mode, shortcuts, compare, drawer).

## Verified

- `npm run build` passes (tsc strict, no `any`).
- Headless Chromium at 375, 768 and 1280px: no console errors, no horizontal scroll on any route.
- axe-core (wcag2a, wcag2aa, wcag21aa, best-practice): 0 violations on all pages, in light and dark, at 375 and 1280px, including the drawer, help dialog, compare view and a populated tracker.
- Scripted flow: onboarding validation, `/` focus, save toast, drawer focus return on Escape, `g` then `t`, confetti burst, Remove then Undo.
- Not tested: a real screen reader, Safari/Firefox, or `forced-colors` mode on a real device.

## Assumptions

1. `match.ts` is untouched. `store.ts` gained one action, `restore`, so Remove can be undone.
2. Dependencies: framer-motion pinned to ^11.18 and tailwind-merge to ^2.6 (v3 of tailwind-merge targets Tailwind v4).
3. Profile completeness counts 7 fields (level, field, category, state, gender, income, percentage). "Prefer not to say" for gender counts as not added.
4. "In progress" on the tracker means applying or submitted.
5. Hints on the Profile page count scholarships whose check is "unknown" because of that one field.
6. The Apply step links to the soonest-deadline saved scholarship, or to Discover if nothing is saved.
7. Calendar export includes saved and applying scholarships (not submitted or result), with a reminder 3 days before.
8. Home is at `/` and the scholarship list moved to `/discover`.
9. Stamp text is typed in capitals ("SAVED", "SUBMITTED") as the brief specifies; it is the only all-caps text.
10. Stepped ring uses a small tick hook rather than a CSS `steps()` easing, so the number and the ring stay exactly in sync.
11. Theme preference is stored under `grantly-theme`, with an inline script in `index.html` to avoid a flash.

## Rough edges

- Kanban moves are button-based only; drag and drop was optional and is not built.
- Compare is selected from Discover; there is no picker on the Compare page itself.
- Confetti and stamps are checked by scripted tests, not by eye on a phone.
- Shortcut `g` then `t` waits 1.2 seconds for the second key.

## Pass 2

### Done

- Added lazy-loaded route chunks with a friendly error boundary and loading state.
- Added Ctrl/Cmd+K command palette actions, including demo profile loading.
- Added deferred Discover search, transition-wrapped filters, memoised match results, list layout animation, scroll progress, metadata, and print CSS.
- Added Vitest coverage for unknown criteria, inclusive boundaries, women-only eligibility, and state mismatch.
- Added ESLint and Prettier configuration plus `npm run lint`, `npm test`, and `npm run format:check`.

### Known gaps

- The existing tracker remains button-first; dnd-kit is installed but not wired into the kanban yet.
- The existing custom dialog remains in use for quick view/help; Radix packages are available for the next focused refactor.
- Guided first-run tour and full Lighthouse automation still need a browser-run pass.

### Pass 3 contrast table

| Pair                   |  Light |   Dark | Intended use                            |
| ---------------------- | -----: | -----: | --------------------------------------- |
| Ink on surface         | 19.8:1 |   21:1 | Body text, borders, shadows             |
| Muted on surface       |  8.9:1 | 13.6:1 | Supporting text                         |
| Inverse text on accent |  5.9:1 |  5.9:1 | Primary actions and strong-match badges |
| Accent text on surface |  5.9:1 |  7.1:1 | Signal labels and focus                 |

### Pass 3 device checklist

- 375px and 768px layouts: checked through responsive CSS and touch-sized controls.
- 200% zoom: semantic grid layouts remain single-column where needed; no intentional fixed-width panels.
- iPhone Safari and mid-range Android Chrome: not available in this environment; browser smoke test and production build pass locally.

## Pass 4 interaction map

- Scholarship cards lift and reveal criteria dots on fine-pointer hover, card focus, and touch-sized layouts; reduced motion keeps the strip static.
- Match rings expose a Radix tooltip on hover and keyboard focus; the accessible label remains available without motion.
- Deadline badges expose the exact date on hover/focus; the plain deadline remains available to screen readers.
- Buttons and demo CTA use transform-only press/lift states; touch uses `:active`, focus uses `:focus-visible`, and reduced motion removes movement.
- Criteria rows slide an accent rail on hover/focus; unmet guidance remains in the row content and is never hover-only.
- Discover filters stay sticky, announce result and strong-match counts, and expose Clear all as a normal keyboard/touch button.
- Tracker cards reveal the drag affordance on hover/focus; document checkboxes draw a transform-only completion line and remain native controls.
- Stepper links keep their labels visible on larger screens, use persistent active styling, and retain keyboard focus rings.
- Radix command palette and tooltip surfaces are keyboard accessible and close through their native Escape behavior.

## Pass 5 contrast table

| Pair | Light | Dark |
| --- | ---: | ---: |
| ink on surface | 19.80:1 | 19.80:1 |
| muted on surface | 8.86:1 | 9.98:1 |
| accent text on surface | 5.18:1 | 6.35:1 |
| on accent | 6.35:1 | 6.35:1 |

## Pass 6 final verification

### Done

- Added [AUDIT.md](./AUDIT.md) with prioritized bugs, hotspots, accessibility gaps, and consistency notes.
- Hardened persisted Zustand state with version 2 migration, malformed-storage recovery, and a one-time recovery toast.
- Added a confirm-gated Reset all data action on Profile.
- Replaced elapsed-time deadline math with local-calendar comparisons and tested today, tomorrow, seven days, and past deadlines.
- Excluded closed scholarships from Discover deadline filtering and Tracker closing-soon summaries.
- Made tracker status moves idempotent so repeated moves do not re-fire submission effects.
- Added Vercel immutable asset caching and no-cache HTML headers.
- Added `npm run check`, `npm run analyze`, [PITCH.md](./PITCH.md), and [SUBMISSION_CHECKLIST.md](./SUBMISSION_CHECKLIST.md).

### Measured results

- `npm run build`: passed; initial entry JavaScript is approximately 141.47 kB gzip.
- Lazy route chunks: all below 60 kB gzip; largest is Discover at approximately 4.37 kB gzip.
- `npm run contrast`: passed; all tested text pairs are at least 4.5:1 in both themes.
- `npm test -- --run`: passed; 9 tests across four files.
- `npm run lint`: passed.
- `npm run analyze`: generated `dist/stats.html` with gzip and Brotli data.
- Lighthouse, CPU-throttle profiling, deployed-URL checks, and real-device checks were not available in this environment.

### Known bugs and unavailable checks

- Playwright, axe, Lighthouse, CPU-throttle profiling, deployed-URL checks, and real-device checks were not run because no browser automation or deployed URL is available in this environment.
- Tracker drag-and-drop remains intentionally button-first; the existing dnd-kit packages are not wired into the UI.
- No backend or network calls are used; all profile, tracker, and preference data stays in browser storage.

### Real-device checklist

- [ ] iPhone Safari
- [ ] Mid-range Android Chrome
- [ ] 320px and 200% zoom
- [ ] Light and dark themes
- [ ] Screen reader walkthrough
