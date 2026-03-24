# Plan: Arrange Story Listing — Visual Rhythm (Priority 1)

> **Status: IMPLEMENTED** — Commits `2e766c2b` and predecessors on `poc` branch.

## Context

The nebula2026 landing page story listing was visually monotonous. After the featured lead story, every remaining story row got identical treatment: same 2:3 grid ratio, same 200px image height, same title size, same padding. The alternating RTL direction (image left/right) added subtle variety but didn't create editorial hierarchy.

## What Was Done

### Visual Rhythm (CSS-only)
- `:nth-child(3n+1)` creates a **highlight → standard → standard** repeating pattern
- Highlight rows: `1fr 1fr` grid (equal columns), taller images (`min-height: 280px`), larger title
- Standard rows: `2fr 3fr` grid, `min-height: 200px` images
- Group break between clusters: `4px` border-top (heavier than the standard `2px`)

### Full-Bleed Images
- Row padding removed (`padding: 0`) — images touch top/bottom borders
- `align-items: stretch` — images fill row height dynamically
- `gap: 0` — no space between image and text columns
- Text padding moved to `__text` elements (`padding: 2rem` desktop, `1rem` mobile)
- Container padding removed from `.posts` and `.nebula-split-lead` — images go edge-to-edge

### Featured Heroes
- Top hero: image moved to right via `direction: rtl`
- Both heroes: `align-items: stretch`, zero padding, full-bleed
- Massively base `#main > *` padding/border overridden for nebula2026

### Dividers
- Row borders increased from `1px` to `2px`
- Group break borders at `4px` (no margin gap)

### Mobile
- All rows stack to `grid-template-columns: 1fr` including highlight rows
- Scroll snap: `scroll-snap-type: y proximity` on `.posts`, `scroll-snap-align: start` on rows
- Fixed image heights: 180px standard, 220px highlight

## Files Modified
- `static/themes/nebula2026.css` — ~40 lines changed/added
