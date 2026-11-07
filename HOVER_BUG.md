# Pass 7 hover bug investigation

## Reproduction

1. Started the Vite app and opened `/discover` at the local preview.
2. Checked the first scholarship card in the dark theme and forced the same hover state used by a pointer.
3. Inspected the card and its title, provider, amount, and deadline through the browser DOM/computed-style view.

The card content remained in the DOM with `opacity: 1` and `visibility: visible`, but the card had `position: relative`, `z-index: auto`, and `isolation: auto`. Its shadow layer used a negative z-index without a containing stacking context. The reveal panel was also a sibling inside the header flex row instead of a dedicated footer layer.

## Root cause

The shared card pattern did not establish an isolated stacking context. The absolutely positioned shadow/reveal layers could therefore participate in an ancestor stacking context and paint over or beside card content depending on browser compositing and the sticky Discover filter layer. The reveal panel also competed for horizontal space with the face content, which made the hover state fragile at narrow widths.

This is a layering/layout bug, not a scoring or data bug. No `framer-motion` hover variant, `content-visibility`, or `mix-blend-mode` was found in the scholarship card path.

## Affected surfaces

- `src/components/ScholarshipCard.tsx` — Discover and shared scholarship cards.
- `src/components/ui/Card.tsx` — shared card surface used by Dashboard, Compare, Tracker, and quick-view-adjacent surfaces.
- `src/index.css` — global stacking and focus rules.

## Fix

- Isolate every shared Card stacking context.
- Keep shadow/fill layers below the face and put card content on an explicit foreground layer.
- Move the scholarship criteria reveal into a dedicated reserved footer area.
- Keep the title, provider, amount, and deadline visible and unchanged on hover/focus/touch.
- Add stable test IDs for the scholarship face fields.
- Use paired semantic foreground tokens for filled controls.

## Verification status

Computed-style reproduction confirmed the fragile stacking context before the fix. Automated browser hover, axe, Lighthouse, and physical-device verification are not available in this environment; the remaining limitation is recorded in `NOTES.md`.
