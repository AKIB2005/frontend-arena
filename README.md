# Grantly

**A transparent scholarship workspace for Indian students.**

Grantly helps students discover relevant fictional scholarships, understand their eligibility, and track applications. It keeps matching local, explains each score, and highlights the next useful action.

[Live demo: not published](./SUBMISSION_CHECKLIST.md) · [Demo video: not published](./SUBMISSION_CHECKLIST.md) · [Repository](https://github.com/AKIB2005/frontend-arena)

| Light desktop                     | Dark desktop                      | Mobile                            |
| --------------------------------- | --------------------------------- | --------------------------------- |
| Screenshot not captured at freeze | Screenshot not captured at freeze | Screenshot not captured at freeze |

## Contents

- [The problem](#the-problem)
- [Our approach](#our-approach)
- [Try it in 60 seconds](#try-it-in-60-seconds)
- [Features](#features)
- [How the match score works](#how-the-match-score-works)
- [Judging criteria map](#judging-criteria-map)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Design system](#design-system)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Testing](#testing)
- [Deployment](#deployment)
- [Data and privacy](#data-and-privacy)
- [Limitations and roadmap](#limitations-and-roadmap)
- [Credits and licences](#credits-and-licences)
- [Author](#author)

## The problem

Students often find scholarship lists without enough context to decide where to apply. The hackathon problem is to make scholarship discovery more relevant, eligibility easier to understand, and applications easier to track.

Grantly targets three pain points:

- Finding relevant scholarships among many opportunities.
- Understanding eligibility without decoding dense criteria.
- Tracking applications, documents, and deadlines in one place.

## Our approach

Grantly is a personal scholarship workspace with three steps: **Discover**, **Match**, and **Track**. It is designed for Indian students across school, undergraduate, postgraduate, and PhD levels, with categories, states, and INR amounts represented in the sample data.

The signature idea is a match score paired with a plain-language eligibility checklist. The visual system uses softened neo-brutalism: black and white surfaces, one signal-orange accent, hard shadows, and motion that confirms a state change.

## Try it in 60 seconds

1. Open `/` and select **Try demo profile**.
2. In Discover, open a scholarship card.
3. Read the match ring and the met, unmet, and unknown criteria.
4. Save the scholarship to the tracker.
5. Open **My tracker** and move the card through its stages.
6. Open Dashboard to review funding and upcoming deadlines.

## Features

### Discover and match

- **Live match lab:** Home recalculates a ranked sample shortlist as income, percentage, category, or gender changes.
- **Search and filters:** Discover supports search, level, field, category, deadline window, strong matches, and sorting.
- **Quick view:** Scholarship cards provide a compact preview before opening the detail route.
- **Compare:** Discover can select up to three scholarships for side-by-side comparison.

### Understand eligibility

- **Match breakdown:** Detail pages show each criterion as met, not met, or not checked.
- **Coach notes:** Detail pages summarize the next missing checks and link back to profile editing.
- **What-if sliders:** Income and percentage scenarios update a temporary match without changing the saved profile.
- **Deadline context:** Deadline badges show calendar dates and closed states.

### Apply and track

- **Tracker stages:** Saved scholarships can move through saved, applying, submitted, and result.
- **Documents:** Each tracked scholarship has a document checklist and notes field.
- **Calendar export:** Open saved and applying scholarships can be exported as an ICS calendar.
- **Undo:** Removing a tracked scholarship offers an undo action.
- **Dashboard:** Returning users see profile progress, funding, pipeline, recommendations, and deadlines.

### Experience

- **Themes:** Light and dark themes persist locally and follow the system preference on first visit.
- **Motion:** Reduced motion is supported through the system preference and the in-app setting.
- **Keyboard controls:** The command palette and documented shortcuts provide keyboard navigation.
- **Accessible states:** Statuses use icons, labels, patterns, and text instead of color alone.

## How the match score works

The score is `criteria met / criteria that can be judged`. Criteria that do not apply are skipped. Unknown profile values are excluded from the denominator, so they are not treated as failures.

| Criterion       | Profile value | Result                                           |
| --------------- | ------------- | ------------------------------------------------ |
| Study level     | Undergraduate | Met when the scholarship includes Undergraduate  |
| Family income   | ₹420,000      | Met when it is at or below the scholarship limit |
| Exam percentage | 72%           | Met when it is at or above the minimum           |
| State           | Not provided  | Unknown and excluded from the score              |

The authoritative implementation is [`src/match.ts`](./src/match.ts). Its edge cases are covered in [`src/match.test.ts`](./src/match.test.ts).

## Judging criteria map

| Criterion                                 | What we did                                                                                                   | Where to see it                                                                    |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| UI/UX and visual quality                  | Used a consistent boarding-pass card language, hierarchy, stickers, rings, and hard-shadow controls.          | [`src/index.css`](./src/index.css), `/`, `/discover`                               |
| Functionality                             | Added matching, filters, compare, save, tracker moves, undo, calendar export, dashboard, and persistence.     | `/discover`, `/tracker`, `/dashboard`, [`src/store.ts`](./src/store.ts)            |
| Creativity and innovation                 | Made the live re-ranking lab and transparent “why this match” breakdown the main demo moment.                 | `/`, [`src/pages/Home.tsx`](./src/pages/Home.tsx)                                  |
| Problem statement alignment               | Connects discovery, eligibility, documents, and deadlines in one local workspace.                             | `/discover`, `/s/:id`, `/tracker`                                                  |
| Code quality and technical implementation | Uses strict TypeScript, route splitting, selectors, tests, linting, and tokenized UI primitives.              | [`src/`](./src), [`package.json`](./package.json)                                  |
| Responsiveness and accessibility          | Uses native controls, focus styles, semantic labels, reduced motion, responsive layouts, and contrast checks. | [`src/index.css`](./src/index.css), [`scripts/contrast.ts`](./scripts/contrast.ts) |

## Tech stack

| Technology                     | Why it is here                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------ |
| React 18                       | Component-based UI                                                             |
| React DOM                      | Browser rendering                                                              |
| TypeScript                     | Strict static typing                                                           |
| Vite                           | Development server and production bundling                                     |
| Tailwind CSS                   | Tokenized utility styling                                                      |
| React Router                   | Client-side routes                                                             |
| Zustand                        | Small persisted application store                                              |
| Framer Motion                  | Bounded layout and state motion                                                |
| cmdk                           | Command palette                                                                |
| Sonner                         | Toast notifications                                                            |
| Radix Checkbox                 | Accessible checkbox primitive                                                  |
| Radix Dialog                   | Dialog and drawer primitives                                                   |
| Radix Popover                  | Popover primitive                                                              |
| Radix Slider                   | Accessible range controls                                                      |
| Radix Switch                   | Switch primitive                                                               |
| Radix Tooltip                  | Match explanations and hints                                                   |
| dnd-kit                        | Installed tracker interaction dependency; drag behavior is not currently wired |
| react-tabs                     | Installed tab dependency; not used by the current routes                       |
| clsx                           | Conditional class names                                                        |
| tailwind-merge                 | Conflict-safe Tailwind class merging                                           |
| Fontsource Bricolage Grotesque | Self-hosted heading font                                                       |
| Fontsource DM Sans             | Self-hosted body font                                                          |

Route pages are lazy-loaded with React `lazy` and `Suspense`. No runtime dependency is separately lazy-loaded.

## Architecture

```text
src/
├── components/       shared UI and feature components
│   └── ui/           buttons, cards, fields, sliders, stickers
├── pages/            route-level screens
├── lib/              motion, dates, coach, hints, ICS, actions
├── data.ts           fictional scholarship records
├── match.ts          scoring contract
├── store.ts          persisted profile and tracker state
└── main.tsx          React, router, and motion entry point
```

Data flows from [`src/data.ts`](./src/data.ts) into [`src/match.ts`](./src/match.ts), then through selectors and the persisted Zustand store to route pages. Profile changes recalculate match results. Tracker actions update the store and notify the UI. React Router selects lazy route components. Theme tokens live in CSS variables, while the motion hook combines system and in-app reduced-motion preferences.

See [`NOTES.md`](./NOTES.md) for measured results and known gaps.
The documentation index is [`docs/index.md`](./docs/index.md).

## Design system

| Token       | Light value | Dark value | Usage                            |
| ----------- | ----------- | ---------- | -------------------------------- |
| Ink         | `#0A0A0A`   | `#FFFFFF`  | Text, borders, strong marks      |
| Surface     | `#FFFFFF`   | `#0A0A0A`  | Main surfaces                    |
| Paper       | `#F0F0F0`   | `#171717`  | Secondary surfaces               |
| Accent      | `#FF5A1F`   | `#FF5A1F`  | Signal, urgency, selected states |
| Accent text | `#C2410C`   | `#FF5A1F`  | Small accent text                |
| Muted       | `#4A4A4A`   | `#D0D0D0`  | Supporting text                  |

The type scale uses body text from 14px to 18px, headings from 20px to 56px, and tabular numbers for amounts. Spacing follows an 8px grid with 2px borders and hard offset shadows. Motion tokens use 120ms fast, 220ms base, and 380ms slow durations, plus snappy, soft, and bouncy springs. Accent use is reserved for signals and actions rather than full-screen decoration.

See the generated [contrast table in NOTES.md](./NOTES.md#pass-5-contrast-table).

## Accessibility

- Keyboard focus is visible on controls, links, dialogs, tooltips, and form fields.
- Native inputs, labels, headings, lists, and live regions are used for core flows.
- Match states include an icon, text label, and pattern treatment.
- The in-app Reduce motion setting is persisted and works with `prefers-reduced-motion`.
- The contrast gate checks the documented token pairs in both themes.
- Earlier local notes record axe scans as zero violations, but those scans are not reproducible from the current dependency set and are not claimed as a Pass 6 measurement.

No Lighthouse or current axe run was available in this environment. A real screen-reader, forced-colors, Safari, and physical-device check remains outstanding.

## Performance

| Measurement                   | Result                      | Setup                                   |
| ----------------------------- | --------------------------- | --------------------------------------- |
| Initial JavaScript            | 141.47 kB gzip              | Vite production build on 2026-11-07     |
| Largest lazy JavaScript chunk | 13.31 kB raw Discover chunk | Vite production build on 2026-11-07     |
| Lighthouse mobile light       | Not measured                | No Lighthouse runner available          |
| Lighthouse mobile dark        | Not measured                | No Lighthouse runner available          |
| CLS and LCP                   | Not measured                | No browser performance runner available |

Implemented optimizations include lazy route chunks, deferred Discover search, transition-wrapped filters, memoized match selectors, bounded animations, content-sized layouts, and self-hosted fonts. A low-power device fallback and LazyMotion are not currently implemented.

## Getting started

### Prerequisites

Use Node.js `20.19.x`, as pinned in [`.nvmrc`](./.nvmrc) and [`package.json`](./package.json).

### Install

```powershell
npm ci
```

### Development

```powershell
npm run dev
```

### Production build

```powershell
npm run build
```

### Preview

```powershell
npm run preview
```

No environment variables are required.

## Scripts

| Script         | Description                                         |
| -------------- | --------------------------------------------------- |
| `dev`          | Start the Vite development server                   |
| `build`        | Type-check and create a production build            |
| `preview`      | Serve the production build locally                  |
| `lint`         | Run ESLint                                          |
| `test`         | Run Vitest                                          |
| `check`        | Run type-checking, lint, tests, contrast, and build |
| `contrast`     | Check token contrast and update the Notes table     |
| `analyze`      | Build with `dist/stats.html` bundle analysis        |
| `format:check` | Check the configured files with Prettier            |

An `e2e` script is not configured in this repository.

## Testing

Unit tests cover match edge cases, criteria state mapping, coach guidance, and local-calendar deadline boundaries. The current freeze run passed 9 tests across 4 test files with `npm test -- --run`.

Run the local checks with:

```powershell
npm test -- --run
npm run lint
npm run contrast
npm run check
```

Playwright flows, axe scans, viewport checks, and screenshot capture are not configured in this repository.

## Deployment

Import the repository into Vercel with the default Vite settings. [`vercel.json`](./vercel.json) rewrites SPA routes to `index.html`, caches hashed assets for one year, and marks `index.html` as no-cache.

After deployment, verify direct refreshes on `/tracker` and `/s/1`, then check the unknown route fallback.

## Data and privacy

All 24 scholarships are fictional sample data. All profile, tracker, theme, and motion preferences stay in browser `localStorage`; there are no accounts, analytics, or network calls. Reset profile and tracker data from **Profile → Reset all data**, after confirmation.

## Limitations and roadmap

### Known limitations

- There is no backend and no real scholarship submission flow.
- Data is fictional and deadlines are generated relative to the current date.
- Tracker drag-and-drop is not wired; stage buttons are the current interaction.
- Lighthouse, axe, and physical-device verification remain outstanding.

### What we would build next

- Integrate a verified scholarship data source.
- Add optional accounts and sync.
- Add deadline notifications.
- Add multilingual content.
- Add secure document upload.

## Credits and licences

| Item                                   | License               |
| -------------------------------------- | --------------------- |
| Bricolage Grotesque                    | SIL Open Font License |
| DM Sans                                | SIL Open Font License |
| React, React DOM, React Router         | MIT                   |
| Vite, TypeScript, Tailwind CSS, Vitest | MIT                   |
| Zustand, Framer Motion, cmdk, Sonner   | MIT                   |
| Radix UI packages                      | MIT                   |
| dnd-kit                                | MIT                   |
| clsx, tailwind-merge                   | MIT                   |

Icons are inline SVG or text glyphs; no icon asset pack is used. AI-assisted development tools were used in line with the hackathon rules, and the author reviewed and understands the code. This project is licensed under [MIT](./LICENSE).

## Author

**AKIB2005** — frontend hackathon participant and developer.

Hackathons: **THE OUTPOST** and **Frontend Arena**. Date: **2026-11-07**.
