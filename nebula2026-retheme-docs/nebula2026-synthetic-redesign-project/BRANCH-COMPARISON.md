# Nebula 2026 — Branch Comparison & Harvest Guide

> **Refreshed:** March 2026  
> Single source of truth for what exists across all branches and what's worth cherry-picking into `poc`.

---

## Overview

The `poc` branch is the production base — it has the complete theme-dispatch architecture and all essential features built. However, the earlier exploration branches (particularly `nebula2026-snarktank` and `nebula2026-synth`) contain richer JavaScript and a more comprehensive SCSS system that `poc` deliberately simplified. This document identifies exactly what was left behind, what's worth upgrading, and where the code lives.

---

## Branch Inventory

### `poc` — Current production base ✅

| Asset | Detail |
|-------|--------|
| Partials | 17 files in `layouts/partials/themes/nebula2026/` (uses theme-dispatch correctly) |
| `story-card-interactions.js` | 138 lines — simplified: click to open, click/X to close, READ button navigates |
| `chapter-markers.js` | 54 lines — reads `data-chapter-marker` from `.nebula-article-content`, basic `<hr>` replacement |
| `nebula2026.css` | 709 lines flat CSS |
| Roundels | All 16 ✅ |
| Missing | No swipe/keyboard/hover in cards; no roundel animations; no parallax; no reading progress |

### `nebula2026-snarktank` — Most complete interaction code

| Asset | Detail |
|-------|--------|
| Partials | 6 files in `layouts/partials/nebula2026/` (different path from poc — not compatible directly) |
| `story-card-interactions.js` | **509 lines** — full implementation (see below) |
| `chapter-markers.js` | **131 lines** — reads `data-genre` on `article[data-genre]`, valid-genres list, error fallback, self-injects CSS |
| `roundel-animations.js` | **79 lines** — IntersectionObserver scroll-into-view, respects `prefers-reduced-motion` |
| SCSS | Modular: `_animations.scss` (599 lines), `_components.scss` (855 lines), `_interactions.scss` (410 lines), `_responsive.scss` (359 lines), `_variables.scss` (208 lines) |
| Roundels | All 16 ✅ |

### `nebula2026-synth` — Snarktank + two additional JS modules

| Asset | Detail |
|-------|--------|
| Partials | Same structure as snarktank (6 files, different path from poc) |
| `story-card-interactions.js` | 509 lines — **identical to snarktank** |
| `chapter-markers.js` | **Identical to snarktank** |
| `roundel-animations.js` | **Identical to snarktank** |
| `parallax-hero.js` | **62 lines — NEW** (synth only) |
| `reading-progress.js` | **66 lines — NEW** (synth only) |
| SCSS | Identical to snarktank |
| Roundels | All 16 ✅ |

### `nebula2026-superskilled` — Cleaner CSS architecture, incomplete

| Asset | Detail |
|-------|--------|
| Partials | 8 files in `layouts/partials/nebula2026/` including `base.html` template block pattern |
| `story-cards.js` | 308 lines — medium implementation |
| `chapter-markers.js` | 48 lines — similar to poc |
| CSS | Modular plain CSS (7 files): `_variables.css`, `_reset.css`, `_typography.css`, `_layout.css`, `_components.css`, `_animations.css`, `main.css` |
| Roundels | Only 10 (missing `dark`, `supernatural`, `psion`) ❌ |

### `nebula2026-kimi-gemini` — Historical only, no useful code

Layout foundation only (Phase 1). No usable JS, CSS, or roundels. Archive reference only.

---

## What POC Is Missing vs Snarktank/Synth

### 1. Story Card Interactions — Significant Upgrade Available

**POC (138 lines):**
- Click to open overlay
- Click background or ✕ to close
- READ button navigates

**Snarktank/Synth (509 lines) additionally has:**
- Mobile swipe detection (50px threshold, 300ms max duration) with directional slide animation
- Desktop hover popup (Wikipedia-style, cursor-positioned)
- Desktop click-to-fix popup in place
- Card-to-card navigation with `‹` / `›` buttons
- Keyboard navigation (ESC, Arrow Left/Right)
- Device type detection with debounced resize handler
- 100ms cubic-bezier slide transition between cards (uses CSS animation classes)
- `no-scroll` body class while overlay is open

**Note:** The snarktank JS reads story data from `.story-card__title`, `.story-card__authors` etc. (DOM elements). The POC JS reads from `data-*` attributes on the list item. These are different HTML approaches — the snarktank version would need its `loadStoryContent()` function adapted to use the POC's `data-*` attribute pattern, or the templates updated to match snarktank's DOM structure.

**Slide animation dependency:** The full snarktank version uses CSS classes `story-card--slide-out-left/right` and `story-card--slide-in-left/right`. These are defined in snarktank's `_animations.scss`. If upgrading the JS, ~50 lines of animation CSS need to be added to `nebula2026.css` first.

---

### 2. Chapter Markers — Minor Upgrade Available

**POC (54 lines):**
- Reads `data-chapter-marker` attribute from `.nebula-article-content` container
- Basic replacement, no error handling

**Snarktank (131 lines) additionally has:**
- `VALID_GENRES` whitelist — invalid values fall back to `orbit`
- `onerror` handler on the `<img>` — missing SVG falls back to orbit
- Self-injects hover/opacity CSS (avoids inline styles)

**Attribute mismatch:** Snarktank reads `data-genre` from `article[data-genre]`. POC reads `data-chapter-marker` from a wrapper. The snarktank logic is better — only the attribute name needs reconciling if adopting it.

---

### 3. Roundel Scroll Animations — New Feature

**`roundel-animations.js` (79 lines) — from snarktank/synth:**
- Uses IntersectionObserver to detect when roundels enter the viewport
- Triggers CSS fade-in + scale animation (requires `.roundel-animate` class on roundel `<img>` elements)
- Graceful fallback for browsers without IntersectionObserver (shows all roundels immediately)
- Respects `prefers-reduced-motion`
- One-time animation (stops observing after first trigger)

**CSS dependency:** Needs these classes in `nebula2026.css`:
```css
.roundel-animate { opacity: 0; transform: scale(0.9); transition: opacity 400ms ease-out, transform 400ms ease-out; }
.roundel-animate--visible { opacity: 1; transform: scale(1); }
```

---

### 4. Parallax Hero — New Feature (synth only)

**`parallax-hero.js` (62 lines):**
- Applies parallax scrolling to hero images on issue and story pages
- Targets `.landing-header__image` and `.story-header__image`
- Hero moves at 50% scroll speed, with `scale(1.1)` to prevent edge-gaps
- rAF-throttled for performance
- Respects `prefers-reduced-motion` (skips entirely if enabled)

**CSS dependency:** None beyond the class names on the existing image elements.

**Template dependency:** The POC partials need to confirm these CSS classes are on the hero `<img>` tags.

---

### 5. Reading Progress Bar — New Feature (synth only)

**`reading-progress.js` (66 lines):**
- Shows a thin gradient progress bar at the top of story pages
- Only activates on pages with `.nebula2026-story-single` class
- Injects its own DOM element (`<div class="reading-progress"><div class="reading-progress__bar"></div></div>`)
- rAF-throttled scroll handler
- Respects `prefers-reduced-motion`

**CSS dependency:** Needs `.reading-progress` and `.reading-progress__bar` styles — not currently in `nebula2026.css`.

---

### 6. SCSS Design System — Reference Material

Snarktank's SCSS is not currently used in `poc` (which uses flat CSS). However, `_variables.scss` (208 lines) and `_animations.scss` (599 lines) are worth keeping as reference:

- `_variables.scss` — complete design token system: color cascade, typography scale, spacing scale, border radius, shadows, transitions, z-index scale, breakpoint variables with SCSS mixins
- `_animations.scss` — comprehensive animation system: all keyframes, scroll-triggered header collapse, roundel animations, story card slide transitions, staggered TOC item reveals, reduced-motion handling

If SCSS is ever added to `poc`'s build pipeline, these files can be dropped in almost as-is.

---

## Harvest Priority Table

| Feature | Source | Priority | Effort | Dependency |
|---------|--------|----------|--------|------------|
| Upgrade `chapter-markers.js` (error handling, valid genres) | snarktank | **High** | 30 min | Attribute name reconciliation |
| Add slide animation CSS for card nav | snarktank `_animations.scss` | **High** | 20 min | Required before upgrading card JS |
| Upgrade `story-card-interactions.js` (swipe, keyboard, hover) | snarktank | **High** | 1–2 hrs | Slide CSS + data attribute approach |
| Add `roundel-animations.js` + CSS classes | snarktank | Medium | 30 min | Add `.roundel-animate` to templates |
| Add `reading-progress.js` + CSS | synth | Medium | 30 min | Add `.nebula2026-story-single` class check |
| Add `parallax-hero.js` | synth | Low | 20 min | Confirm CSS class names on hero images |
| SCSS pipeline | snarktank/synth | Low | 1 day | Build pipeline change |

---

## How to Access the Code

All branches are local in `/Users/marty/Sites/mythaxis.github.io/`. To view or copy any file:

```bash
# View a file from another branch without switching
git show nebula2026-snarktank:static/js/nebula2026/story-card-interactions.js

# Copy a file from another branch into current working tree
git checkout nebula2026-snarktank -- static/js/nebula2026/roundel-animations.js

# Copy synth-only files
git checkout nebula2026-synth -- static/js/nebula2026/parallax-hero.js
git checkout nebula2026-synth -- static/js/nebula2026/reading-progress.js

# View snarktank SCSS
git show nebula2026-snarktank:assets/scss/nebula2026/_animations.scss
git show nebula2026-snarktank:assets/scss/nebula2026/_variables.scss
```

---

## Template Path Note

Snarktank, superskilled, and synth all have their nebula2026 partials at `layouts/partials/nebula2026/`.  
POC has them at `layouts/partials/themes/nebula2026/`.

POC's path is **correct** — it integrates with the theme-dispatch system properly. The older branches use a different (pre-dispatch) architecture. **Do not copy templates from the old branches** — only copy JS and SCSS/CSS assets, and adapt them to POC's attribute names and class names as needed.
