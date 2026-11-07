# Pass 8 hover bug investigation

## Pass 8 root cause

The requested source audit was run with:

```text
grep -rn "group-hover:bg\|hover:bg-ink\|bg-ink\|group-hover:text" src
grep -rn "\bgroup\b" src
```

The relevant matches are:

| File and line | Match | Classification |
| --- | --- | --- |
| `src/components/ScholarshipCard.tsx:41` | Decorative `bg-ink` layer | Intentional shadow layer; it is `pointer-events-none` and `-z-10`, not the card face |
| `src/components/ScholarshipCard.tsx:95` | Criteria indicator `bg-ink` | Intentional indicator with no text |
| `src/pages/Dashboard.tsx:66` | Dashboard `bg-ink` fill | Filled card surface; changed to `bg-fill-ink text-on-ink` |
| `src/pages/Home.tsx:235` | Ranking badge `bg-ink` fill | Filled badge; changed to `bg-fill-ink text-on-ink` |
| `src/components/CompareBar.tsx:45` | Compare action `bg-ink` fill | Filled action; changed to `bg-fill-ink text-on-ink` |
| `src/components/Stepper.tsx:63` | Step number `bg-ink` fill | Filled step marker; changed to `bg-fill-ink text-on-ink` |
| `src/components/ui/Tooltip.tsx:17` | Tooltip `bg-ink` fill | Filled tooltip; changed to `bg-fill-ink text-on-ink` |

No card face currently uses `hover:bg-ink`, `group-hover:bg-ink`, or
`group-hover:text`, and no unscoped `group` class is present on a grid,
section, or list. The card-specific groups are `group/card` in
`src/components/ScholarshipCard.tsx:35`, `group/tracker` in
`src/pages/Tracker.tsx:33`, and other component-local named groups.

The remaining card-face risk was the scholarship card overriding the shared
`Card` contract with `bg-paper` while its foreground inherited `text-ink`.
That made the face dependent on the paper token rather than the explicit
surface token and left the visual result vulnerable to the old broad-hover
composition. The face now explicitly uses `relative isolate bg-surface
text-ink`; its title, provider, amount, and ring number also have explicit
foreground tokens. Decorative layers remain `-z-10 pointer-events-none`, and
content remains `relative z-10`.

## Reproduction

1. Started the Vite app and opened `/discover` at the local preview.
2. Checked the first scholarship card in the dark theme and forced the same hover state used by a pointer.
3. Inspected the card and its title, provider, amount, and deadline through the browser DOM/computed-style view.

The card content remained in the DOM with `opacity: 1` and `visibility: visible`, but the card had `position: relative`, `z-index: auto`, and `isolation: auto`. Its shadow layer used a negative z-index without a containing stacking context. The reveal panel was also a sibling inside the header flex row instead of a dedicated footer layer.

## Root cause

The shared card pattern previously did not establish an isolated stacking context.
The absolutely positioned shadow/reveal layers could therefore participate in an
ancestor stacking context and paint over or beside card content depending on
browser compositing and the sticky Discover filter layer. The reveal panel also
competed for horizontal space with the face content, which made the hover state
fragile at narrow widths. Pass 8 additionally removes the `bg-paper` override
from the scholarship card face and pairs every intentional ink fill with its
on-ink foreground token.

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
