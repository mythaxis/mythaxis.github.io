# Basalte Chromatic Font — Three-Layer Rendering

## The Basalte Family

Basalte is a layered display typeface from Velvetyne Type Foundry (Degheest revival). Three variants are designed to be stacked for a bichromatic/trichromatic effect:

| Variant | File | Size | Visual Character |
|---------|------|------|-----------------|
| **Fond** | `Basalte-Fond.woff2` | 8.5 KB | Solid base letterforms — the "body" of the glyph |
| **Volume** | `Basalte-Volume.woff2` | 9.0 KB | Shadow/depth layer — offset strokes that create a 3D/embossed effect behind the Fond layer |
| **Multicolor** | `Basalte-Multicolor.woff2` | 14 KB | Striped overlay — diamond-shaped cutouts on vertical strokes (COLR/CPAL colour font) |

The intended stacking order (back to front):
1. **Volume** — darkest/shadow colour, positioned behind
2. **Fond** — primary colour, main letterform
3. **Multicolor** — secondary colour overlay, cutouts reveal Fond beneath

## Current Implementation (Fond + Multicolor)

Uses two CSS layers via `::after` pseudo-element:

```
Base text:   Basalte Fond       → color: var(--color-primary)
::after:     Basalte Multicolor → color: var(--color-secondary)
```

### Problem: iOS Safari

COLR/CPAL support is limited on iOS Safari. The Multicolor variant renders as **solid glyphs** instead of showing transparent diamond cutouts. Result: the overlay covers the base text solidly, producing a muddy single-tone appearance instead of the intended two-colour effect.

| Platform | Rendering | Result |
|----------|-----------|--------|
| Desktop Chrome/Safari (macOS) | COLR/CPAL renders transparency in diamond shapes | Two-colour effect works |
| iOS Safari | COLR support limited — solid glyph rendering | Overlay covers base; single-tone |

### Affected selectors (current)

- `.nebula-title__myth::after`, `.nebula-title__axis::after` — intro logotype
- `.nebula-split-lead__title a::after` — featured story title
- `.nebula-content-row__title--featured a::after` — featured content row title

## Proposed Fix: Switch to Fond + Volume

Replace the Multicolor overlay with Volume. This fixes the iOS issue because Volume is a standard outline font (not COLR/CPAL) — it renders identically on all platforms.

### New three-layer approach

```
::before:    Basalte Volume  → color: var(--color-accent)   (shadow/depth, offset)
Base text:   Basalte Fond    → color: var(--color-primary)  (main letterform)
::after:     Basalte Volume  → color: var(--color-secondary)(overlay, zero offset)
```

Or a simpler two-layer approach:

```
Base text:   Basalte Fond    → color: var(--color-primary)
::after:     Basalte Volume  → color: var(--color-secondary) (depth/emboss overlay)
```

The Volume variant provides a visually distinct overlay (3D/depth strokes rather than diamond cutouts) that doesn't depend on COLR rendering.

### Third colour: accent/shadow

The old theme used a hard `text-shadow` without blur offset for depth. Instead of a CSS `text-shadow`, the Volume layer itself can serve as the shadow/border element — positioned with a slight pixel offset behind the Fond layer, in a third colour.

This introduces `--color-accent` (or `--color-tertiary`) to the colour scheme:

```yaml
# Issue frontmatter
colorScheme:
  primary: "#28c53d"    # Fond — main letterform
  secondary: "#5d1212"  # Volume overlay or second accent
  accent: "#1a1a2e"     # Volume shadow/border (dark offset behind Fond)
```

## Headings using Basalte on frontpage

Currently chromatic (Fond + Multicolor):
- `.nebula-title` — intro logotype (MYTH·AXIS)
- `.nebula-split-lead__title` — featured story title
- `.nebula-content-row__title--featured` — featured content row title

Currently Fond only (no overlay):
- `.nebula-content-row__title` — regular story titles in content rows
- `.nebula-page-title` — non-story page titles
- `.nebula-catalogue-header h1` — catalogue page headers
- `.nebula-genre-title` — genre section titles
- `.nebula-author-name` — author names in footer

The plan should extend the Fond+Volume treatment to the regular content row titles on the frontpage, making all Basalte headings use the chromatic technique.

## Status

- **Documented:** 2026-03-24 (original), updated 2026-03-29
- **Plan:** See `PLAN-basalte-fond-volume.md`
