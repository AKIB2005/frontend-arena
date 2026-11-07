# Pass 6 audit

## Bugs found

- [x] **P1** Persisted Zustand data has an explicit version/migration and malformed storage falls back to defaults with a toast.
- [x] **P1** Deadline calculations use local calendar midnights, including past, today, tomorrow, and seven-day boundaries.
- [x] **P1** Moving a tracker card to `submitted` is idempotent and only fires the confirmation effect on a real transition.
- [ ] **P2** Unknown routes have a friendly fallback, but there is no route-specific error boundary or global runtime error fallback.
- [x] **P2** Vercel keeps the SPA rewrite and now adds immutable asset caching plus no-cache HTML.

## Performance hotspots

- The production entry chunk is approximately 141 kB gzip; it is below the 170 kB target but should be recorded with a repeatable build report.
- Framer Motion is loaded in the main chunk and several pages; the existing route chunks remain below 60 kB gzip.
- The Home re-rank lab recomputes five matches per profile change, which is bounded and acceptable; autoplay is already disabled by the reduced-motion hook.
- No browser CPU-throttle or Lighthouse measurement is available in this environment.

## Accessibility failures

- [ ] **P1** No automated route/axe suite is configured in this environment.
- [x] **P2** Corrupted persisted state announces a single recovery toast.
- [x] **P2** Profile includes a confirm-gated reset-data action.
- Existing controls use visible focus styles and native keyboard semantics; the current dialog and command palette should be verified with a browser test.

## Dead or unused code/dependencies

- dnd-kit is installed but the tracker remains button-first.
- `react-tabs`, several Radix packages, and the existing confetti component may be unused on some routes; verify with a one-off dependency/code search before removing anything.

## Risky effects

- The existing route wipe and deadline flip use transform/opacity; they are bounded but need reduced-motion and browser verification.
- Confetti is capped to one session burst and 28 pieces. It should remain disabled in reduced-motion and low-power modes.
- No 4x CPU frame measurement is available yet.

## Consistency issues

- Semantic orange accent migration is present, but legacy inverse-text utility usage and non-semantic confetti colors require a final search.
- README and NOTES contain earlier-pass claims that need a final Pass 6 results section.
- Vercel cache headers and a repeatable `check` script are missing.

## Verification log

This audit is created before Pass 6 fixes. Items are checked only after targeted tests or build verification demonstrate the fix.
