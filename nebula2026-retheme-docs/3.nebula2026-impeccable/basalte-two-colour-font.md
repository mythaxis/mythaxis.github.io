# Basalte Two-Colour Font — Cross-Platform Rendering Issue

## How it works

The two-colour title effect uses CSS chromatic layering:

1. **Base layer:** Text rendered in Basalte Fond at `color: var(--color-primary)` (blue)
2. **Overlay layer:** `::after` pseudo-element with `content: attr(data-text)` renders the same text in Basalte Multicolor at `color: var(--color-secondary)` (orange)

Basalte Multicolor has diamond-shaped cutouts on vertical strokes. When COLR/CPAL renders correctly, those cutouts are transparent — the orange only shows through the diamond shapes, with the blue base visible elsewhere. This creates the distinctive two-tone effect (e.g. orange diamond accents on the "I" letterforms).

## Affected CSS selectors

- `.nebula-title__myth::after` — intro logotype "MYTH"
- `.nebula-title__axis::after` — intro logotype "AXIS"
- `.nebula-split-lead__title a::after` — featured story/article titles

## Platform behaviour

| Platform | Rendering | Result |
|----------|-----------|--------|
| Desktop Safari / Chrome (macOS) | COLR/CPAL renders transparency in diamond shapes | Two-colour effect works as intended |
| iOS Safari | COLR support limited — Multicolor renders as solid glyphs | Overlay covers base text solidly; appears muddier, single-tone |

## Options to revisit

1. **Disable overlay on mobile** — `@media (max-width: 736px)` hide the `::after` layer; clean single-colour Basalte Fond on iOS
2. **Accept platform variation** — different but not broken
3. **SVG/image titles** — replace CSS text with pre-rendered two-colour images (heaviest approach, loses text accessibility)

## Status

Documented 2026-03-24. Not yet actioned — revisit in a future pass.
