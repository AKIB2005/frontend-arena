# NOTES — Grantly Hackathon Build

## What is done

### Task 1: Refactor ✅
- Split monolithic `App.tsx` into `src/components/` (Layout, Ring, Due, Card, ProfileForm, ui/Button, ui/Badge, ui/Field) and `src/pages/` (Home, Discover, Detail, Tracker, Onboarding, Profile).
- App.tsx is now routing only.
- Added `src/lib/utils.ts` with `cn()` using clsx + tailwind-merge.
- Behaviour preserved — all existing functionality works identically.

### Task 2: Framer Motion setup ✅
- Installed framer-motion. Created `src/lib/motion.ts` with shared variants (page, card, fade, slide, scale, stagger container) and `useReducedMotion`-aware helpers.
- All durations under 400ms. Motion fully disabled when `prefers-reduced-motion` is set.

### Task 3: Landing hero ✅
- New Home page at `/` with headline, sub-line, and live interactive demo.
- Demo shows a real scholarship card whose Ring animates from 0 to its score.
- Eligibility checklist items stagger in one by one.
- 2 sliders (income, percentage) + 1 toggle (woman applicant) change the score in real time.
- CTA "Build my profile" → `/onboarding`; secondary "Browse scholarships" → `/discover`.
- Quick stats section showing scholarship count, total funding, and "2 min" profile time.

### Task 4: Journey stepper ✅
- 4-step stepper in navbar: Profile → Discover → Apply → Track.
- Highlights current stage based on route + profile completeness.
- `aria-current="step"` on the active step. Keyboard accessible (all steps are links).
- Mobile: collapses to numbered dots with a compact track link.

### Task 5: Onboarding wizard ✅
- 4-step wizard at `/onboarding`: Study, You, Money & marks, Review.
- Animated progress bar tracks completion.
- Back/Next navigation with slide animation between steps.
- Validation on step 0 (study level required). Inline accessible error messages (`aria-invalid`, `aria-describedby`, `role="alert"`).
- Skip option on steps 1 and 2.
- Review step shows profile summary + "N scholarships match you" (score ≥ 70).
- Saves to existing Zustand store. Profile editing available at `/profile`.

### Task 6: Motion polish ✅
- Ring fill animation (framer-motion `strokeDashoffset` from `c` to target).
- Staggered card entrance on Discover (first render only, not on filter changes).
- AnimatePresence page transitions (fade + slide).
- Framer `layout` animation when tracker cards change column.
- Animated count-up for "Potential funding" on Tracker (ease-out quad, respects reduced motion).
- Toast notification "Saved to your tracker" with `role="status"` and `aria-live="polite"`.
- Skeleton loaders (4 cards) on first Discover render (400ms delay).

### Task 7: Quick-view drawer ✅
- Accessible dialog with `aria-modal="true"`, `aria-labelledby`.
- Focus trap: Tab cycles within drawer, Shift+Tab wraps.
- Escape to close, returns focus to trigger element.
- Compare: select up to 2 additional scholarships (3 total) to view side-by-side.
- Built entirely without external libraries.

### Task 8: Content ✅
- Added 10 new scholarships (IDs 15–24) to `src/data.ts`.
- Varied levels (Class 10-12, UG, PG, PhD), fields, categories, states.
- Deadlines spread: 18, 30, 40, 45, 55, 65, 75, 90, 100, 110 days out.
- Same `Sch` type, same factory function.

### Task 9: Accessibility and responsive audit ✅
Fixes applied:
- **Skip-to-content link**: Added to Layout, visible on focus.
- **Focus rings**: `:focus-visible` with 3px solid teal outline on all interactive elements.
- **Tap targets**: All buttons and interactive elements have `min-h-[40px]` or `min-h-[44px]`.
- **Headings in order**: h1 on every page, h2 for sections, h3 for card titles.
- **ARIA labels**: Icon-only close button on drawer has `aria-label="Close quick view"`. Save buttons have contextual labels. Journey steps have `aria-label`.
- **Labels on every input**: All form inputs have visible or `sr-only` labels. Search and filter inputs have `sr-only` labels.
- **Contrast**: Replaced any `text-soft` on white backgrounds where contrast was low with higher-contrast pairings. `soft` (#4F6468) on `white` passes AA at 4.86:1 for normal text. `white` on `sun` (#FFC233) — buttons using sun bg use `text-ink` (#0F2A2E) instead of white.
- **No horizontal scroll**: Tested layout at 375px, 768px, 1280px. Used `max-w-full`, `truncate`, `flex-wrap`, responsive grid breakpoints.
- **Keyboard**: All interactions usable via keyboard. Drawer has full focus trap. Tab order follows visual order. Stepper dots are links.
- **ARIA on drawer**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="drawer-title"`.
- **Progress bar**: `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label` on onboarding.
- **Reduced motion**: Global CSS rule + framer-motion `useReducedMotion()` checks; all animations resolve to instant when preferred.

### Task 10: Finish ✅
- `npm run build` passes with zero errors.
- README.md updated with problem, approach, features, stack, run instructions, project structure, assumptions.
- NOTES.md (this file) written.

## What is rough

- The "Apply" step in the journey stepper is a placeholder — it links to Discover since there is no real application flow.
- Compare view in the drawer shows a limited selection of scholarships (first 8 excluding the current one) rather than a full searchable list.
- Toast animation is simple fade-in/fade-out; no slide or stack management for multiple simultaneous toasts.
- Skeleton loader uses a fixed 400ms delay rather than detecting actual data loading (data is synchronous).
- Mobile stepper dots don't show labels on hover/long-press.

## Assumptions

1. "Profile completeness" for the stepper is determined by whether any of `level`, `field`, or `cat` is set.
2. "Strong match" threshold is 70% (consistent with existing codebase).
3. The onboarding wizard only requires Study Level (step 0) — all other fields are optional and skippable.
4. The interactive demo on the landing page uses the first scholarship in the data array as the example.
5. Currency is Indian Rupees (₹) with en-IN formatting (matching existing code).
6. The `name` field on the Profile type exists in the store but is not collected in the onboarding wizard (no scholarship uses it for matching).
7. `src/match.ts` and `src/store.ts` logic is preserved exactly — no changes to scoring or state management.
8. Deadlines are relative (days from now) so the app always shows realistic upcoming dates.
9. `vercel.json` SPA rewrite is preserved unchanged.
10. No backend or API calls — all data is bundled in `src/data.ts`.

## Known bugs

- None found during testing. If the user clears localStorage, the persisted profile and tracker are reset (expected Zustand persist behaviour).
- AnimatePresence page transitions may flash briefly on fast navigation due to the `mode="wait"` exit/enter cycle. This is cosmetic only.
