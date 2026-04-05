# Image Dimensions & Specifications — Nebula2026 Theme

> Generated April 2026. Reference for editors preparing image assets.

## Quick Reference

| Image Type | Dimensions | Ratio | Format | Notes |
|---|---|---|---|---|
| **Issue hero (desktop)** | 2000 x 1125 | 16:9 | JPG | Full-viewport parallax hero |
| **Issue hero (tablet)** | 800 x 450 | 16:9 | JPG | `_sml` suffix |
| **Issue hero (mobile)** | 720 x 1280 | 9:16 | JPG | `_mob` suffix, portrait |
| **Story card** | 1000 x 600 | 10:6 (5:3) | JPG | `10x6` suffix in filename |
| **Featured row** | 1000 x 600 | 10:6 (5:3) | JPG | Same as story card |
| **Review/editorial image** | 1000 x 600 | 10:6 (5:3) | JPG | Same as story card |
| **Author photo** | 500 x 500 | 1:1 | JPG | Square, faces need clarity |
| **Shared image** | 1000 x 600 | 10:6 (5:3) | JPG | Cross-issue reusable |
| **Roundel** | Vector | 1:1 | SVG | 600-949pt viewBox |

## Issue Hero (Cover Art)

Three variants per issue:

| Variant | Dimensions | Filename Pattern | Breakpoint |
|---|---|---|---|
| Desktop | 2000 x 1125 | `[name].jpg` | 737px+ |
| Tablet | 800 x 450 | `[name]_sml.jpg` | Fallback |
| Mobile | 720 x 1280 | `[name]_mob.jpg` | 0-736px |

- Displayed full-viewport with `object-fit: cover` and parallax scroll effect
- `_mob` variant is optional — auto-detected by `intro.html` via `fileExists`
- Can also be set explicitly with `imageMobile` frontmatter
- Reused on: issue landing hero, story page hero, sticky header background, story-end footer backdrop
- Min-height: 70vh on story pages

**Examples from existing issues:**
- `monkeyking.jpg` (1750 x 1149) — issue 45
- `synthwave.jpg` (2000 x 1125) — issue 43
- `monkeyking_mob.jpg` (719 x 1150) — issue 45 mobile

## Story Card Images

- **Dimensions:** 1000 x 600 (10:6 ratio = 5:3)
- **Filename convention:** `[Title]10x6.jpg` (the `10x6` suffix indicates dimensions)
- **Location:** `content/issue-XX/images/`
- **Display:** `object-fit: cover` in grid layout
  - Desktop: 50% width in two-column grid, min-height 200px (280px every 3rd row)
  - Mobile: full width, single column

Used for: frontpage content rows, featured split-lead, review cards, editorial cards.

All card types use the same image dimensions.

## Author Photos

- **Dimensions:** 500 x 500 (square)
- **Location:** `content/authors/images/`
- **Naming:** `FirstnameLastname.jpg` or `firstname-lastname.jpg`
- **Display:** 150 x 150px desktop, 120 x 120px mobile
  - `object-fit: cover`, `border-radius: 12px`
  - 4px border in `var(--color-primary)`

500px provides 2-3x resolution at rendered size for sharp display on retina screens.

## Shared Images

- **Location:** `/static/images/shared/`
- **Dimensions:** 1000 x 600 (same as story cards)
- For images reused across multiple issues (e.g. recurring review columns)
- Referenced with absolute path in frontmatter: `image: /images/shared/ShortReviews01_10x6.jpg`

## Roundel SVGs

- **Location:** `/static/images/roundels/`
- **Format:** SVG (vector, scale-independent)
- **ViewBox:** 949 x 949 or 600 x 600 (all square)
- Displayed at sizes from 40px (nav panel) to 240px (story footer divider)
- Used via CSS mask technique — inherits text colour

| Roundel | ViewBox | File Size |
|---|---|---|
| MythaxisAbduction | 949 x 949 | ~10 KB |
| MythaxisEye | 949 x 949 | ~15 KB |
| MythaxisGalaxy | 600 x 600 | ~5 KB |
| MythaxisGrey | 949 x 949 | ~56 KB |
| MythaxisHand | 949 x 949 | ~15 KB |
| MythaxisIcon | 949 x 948 | ~3 KB |
| MythaxisKnot | 949 x 949 | ~10 KB |
| MythaxisMonster | 949 x 949 | ~20 KB |
| MythaxisSwords | 949 x 949 | ~8 KB |
| MythaxisTarget | 600 x 600 | ~3 KB |

## Compression Guidelines

| Image Type | JPG Quality | Typical File Size |
|---|---|---|
| Issue hero (2000 x 1125) | 80-85% | 1-3 MB |
| Issue hero tablet (800 x 450) | 80% | 400-800 KB |
| Issue hero mobile (720 x 1280) | 80% | 700 KB - 1.5 MB |
| Story card (1000 x 600) | 80% | 300-700 KB |
| Author photo (500 x 500) | 85% | 100-200 KB |

Higher quality (85%) recommended for author photos since faces require good clarity.

## Checklist for New Issues

- [ ] Issue hero: 3 variants (main, `_sml`, `_mob`) in `content/issue-XX/images/`
- [ ] Story cards: 1000 x 600 with `10x6` suffix
- [ ] Author photos: 500 x 500 square in `content/authors/images/`
- [ ] Shared images: 1000 x 600 in `/static/images/shared/` if cross-issue
- [ ] All JPGs: 80-85% quality
- [ ] Verify responsive rendering at desktop, tablet, and mobile widths
