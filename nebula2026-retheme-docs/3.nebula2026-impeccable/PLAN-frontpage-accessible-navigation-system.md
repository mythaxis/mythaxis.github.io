# Frontpage Scroll-Snap + Keyboard Navigation

## Problem

The frontpage stacks story cards vertically on mobile with 10rem spacing between them. Currently there's no reliable snap behaviour — `scroll-snap-type: y proximity` is set on `.posts`, but `.posts` isn't a scroll container (no overflow), so the snap is inert. The scroll container is the viewport (`html`).

The editor wants a **card-browsing experience**:
1. **Swipe** through cards on mobile, each snapping cleanly below the sticky header
2. **Arrow keys** to navigate between snap targets (intro → card 1 → card 2 → ...)

## Solution

### CSS: Fix scroll-snap target (mobile only)

Move snap declarations to the correct elements:

- **Remove** `scroll-snap-type: y proximity` from `.theme-nebula2026 .posts` (inert — not a scroll container)
- **Add** `scroll-snap-type: y proximity` to `html` (the actual scroll container) — mobile only
- **Add** `scroll-snap-align: start` to `.nebula-intro` (the full-screen intro section)
- **Keep** existing `scroll-snap-align: start` on `.nebula-content-row` (already there in mobile CSS)

The existing `scroll-padding-top: 5.5rem` on `html` already offsets for the sticky header height — snap targets will position below the header automatically.

#### Why `proximity` not `mandatory`

- `proximity` allows free-scrolling when the user swipes hard (won't trap them)
- `mandatory` could trap users if a card is taller than the viewport
- The keyboard navigation (JS) provides the definitive card-to-card movement
- `nebula-nav.js` already has an iOS workaround that temporarily sets `scroll-snap-type: none` near the top of the page — this only works cleanly with `proximity`

### JS: Arrow key card navigation

**New file:** `static/js/nebula2026/frontpage-nav.js`

Follows existing conventions: IIFE, `'use strict'`, `prefers-reduced-motion` check, rAF patterns.

#### Behaviour

- **Self-guards**: only activates when `.posts` exists (landing/section pages)
- **Snap targets**: `[#intro, ...all .nebula-content-row]` — ordered top-to-bottom
- **ArrowDown**: find the first target whose top is below the current snap position → `scrollIntoView()`
- **ArrowUp**: find the last target whose top is above the current snap position → `scrollIntoView()`
- **`preventDefault()`** on ArrowDown/ArrowUp so arrow keys don't also do incremental scroll. Normal scrolling via touch/trackpad/mouse wheel is unaffected.
- **Smooth scroll**: `scrollIntoView({ behavior: 'smooth', block: 'start' })` — the `scroll-padding-top` on `html` handles header offset
- **`prefers-reduced-motion`**: `behavior: 'auto'` (instant) instead of `'smooth'`

#### Guards (when arrow keys pass through normally)

- Nav panel is open (`.nebula-nav-panel--open` exists)
- Active element is an input, textarea, select, or contenteditable
- At first target + ArrowUp → no-op (already at top)
- At last target + ArrowDown → no-op (already at bottom)

#### Current target detection

The "current" snap target is determined by `getBoundingClientRect().top` relative to the scroll-padding offset:

- **ArrowDown**: find first target with `top > scrollPaddingOffset + threshold` (next card below)
- **ArrowUp**: find last target with `top < scrollPaddingOffset - threshold` (previous card above)

A small threshold (~20px) prevents re-selecting the already-snapped target due to sub-pixel positioning.

### Template: Load the script

**File:** `layouts/partials/themes/nebula2026/scripts.html`

```html
<script src="{{ "js/nebula2026/frontpage-nav.js" | relURL }}" defer></script>
```

## Files

| File | Change |
|---|---|
| `static/themes/nebula2026.css` | Move scroll-snap to `html`, add `.nebula-intro` snap align |
| `static/js/nebula2026/frontpage-nav.js` | **New** — arrow key card navigation |
| `layouts/partials/themes/nebula2026/scripts.html` | Add script tag |

## Architecture notes

- Separate file from `nebula-nav.js` to keep single-responsibility (nav panel vs card navigation)
- The JS self-guards by checking for `.posts` — safe to load on all nebula2026 pages
- Arrow key navigation works on both mobile and desktop (harmless on desktop where no scroll-snap applies)
- The CSS snap is mobile-only (inside `@media max-width: 736px`)

## Verification

1. `hugo server -D --disableFastRender`
2. Mobile viewport (≤736px):
   - Swipe through cards — each snaps with image below sticky header
   - Arrow Down from intro → first card
   - Arrow Down/Up navigates between cards
   - Last card → Arrow Down does nothing
   - Intro → Arrow Up does nothing
3. Desktop viewport (>736px):
   - No scroll-snap (two-column grid, no stacking)
   - Arrow keys still navigate cards (scrollIntoView works regardless)
4. `prefers-reduced-motion`: instant scroll, no smooth animation
5. Open nav panel → arrow keys don't navigate cards
6. `hugo build` — no errors
