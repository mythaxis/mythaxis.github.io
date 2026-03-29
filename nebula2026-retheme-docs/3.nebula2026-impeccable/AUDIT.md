# Nebula2026 Theme — Comprehensive Audit Report (Third Pass)

**Date:** 2026-03-29
**Branch:** `poc`
**Auditor:** Claude (impeccable:audit skill)
**Scope:** CSS, templates (Hugo partials), JavaScript (8 files)
**Previous:** [First-pass audit](first-pass/AUDIT.md) (2026-03-21)

---

## Anti-Patterns Verdict: PASS

First pass: **PARTIAL FAIL** — purple gradient `#667eea → #764ba2` in 6 components, gradient text on logo/title, generic card hover lifts.

Third pass: **PASS** — all three anti-patterns eliminated. Purple gradients replaced with `var(--color-primary)`/`var(--color-secondary)`. Gradient text replaced with Basalte chromatic font layering (intentional typography). Card hover lifts removed. The theme now has a cohesive CSS custom property system with no AI design tells.

---

## Executive Summary

| Severity | First Pass | Third Pass | Change |
|----------|-----------|------------|--------|
| Critical | 3 | 1 | -2 resolved |
| High | 7 | 4 | -3 resolved |
| Medium | 9 | 5 | -4 resolved |
| Low | 5 | 6 | +1 (new catalogue features) |
| **Total** | **24** | **16** | **-8 net** |

**First-pass score: 6.5/10** → **Third-pass score: 8/10**

**Remaining critical:** Copyright text contrast (0.4 opacity, ~2:1 ratio).

**Top remaining issues:**
1. Copyright text contrast critically low — WCAG AA failure
2. Nav strip link contrast borderline — should exceed minimum
3. Genre/alpha pill touch targets too small (<44px)
4. No responsive images (srcset) anywhere
5. Missing focus styles on dark backgrounds

---

## Resolution Tracker: First-Pass Issues

### Resolved (16 of 24)

| ID | Issue | Resolution |
|----|-------|------------|
| C1 | Skip-to-content link missing from HTML | **Fixed** — `<a href="#main" class="skip-to-content">` now in base layout |
| C2 | Nav panel no focus management | **Fixed** — full focus trap, `role="dialog"`, `aria-modal="true"`, ESC key, focus restore with `preventScroll` |
| C3 | Mandatory scroll-snap on mobile | **Fixed** — changed to `y proximity` |
| H1 | Purple gradient in 6 components | **Fixed** — all replaced with `var(--color-primary)`/`var(--color-secondary)` |
| H2 | Gradient text on logo/title | **Fixed** — replaced with Basalte chromatic layering (Fond + Multicolor) |
| H5 | Audio player no accessible label | **Fixed** — `role="button"`, `tabindex="0"`, `aria-label="Audio controls"`, Enter/Space keyboard support |
| H6 | `prefers-reduced-motion` missed bounce | **Fixed** — all animations now covered by reduced motion block |
| H7 | Story nav `<nav>` lacks aria-label | **Fixed** — `aria-label="Story navigation"` added |
| M1 | 24 hardcoded hex values | **Mostly fixed** — core colors use CSS vars; only print styles retain hard-coded values |
| M2 | Font format .woff only | **Fixed** — all `@font-face` now use `.woff2` format |
| M3 | `min-height: 100vh` iOS bug | **Fixed** — now uses `100svh` with `100vh` fallback |
| M4 | `console.log` in production JS | **Fixed** — removed |
| M5 | `:root` tokens defined after first use | **Fixed** — tokens moved to top of CSS file |
| M7 | `--font-secondary` duplicates `--font-primary` | **Fixed** — now correctly differentiated: `--font-primary` is Alegreya body, `--font-secondary` is Basalte display |
| M8 | Deprecated `-webkit-overflow-scrolling` | **Fixed** — removed |
| L2 | Reading progress z-index outside scale | **Fixed** — now uses `var(--z-progress)` token |

### Re-evaluated (2 of 24)

| ID | Issue | Re-evaluation |
|----|-------|---------------|
| M6 | `fileExists` broken for author photos | **Not applicable** — only present in `horizon2020` theme, not `nebula2026` |
| L5 | `<glyph>` custom element | **Fixed** — replaced with CSS `::first-letter` drop caps (issue-45+); `<glyph>` shortcode retained for horizon2020 compatibility |

### Carried Forward (4 of 24)

| ID | Issue | Status |
|----|-------|--------|
| H3 | Copyright footer contrast | **Still open** — improved from 0.15 to 0.4 opacity, but still fails WCAG AA (~2:1). Needs 0.7+ |
| H4 | Author bio copyright contrast | **Partially improved** — verify current state against AA threshold |
| L1 | `will-change: transform` on static images | **Still open** — low priority, creates GPU layers eagerly |
| L3 | Bounce easing on scroll indicator | **Improved** — changed to gentle bounce, but still an infinite animation |

### No longer applicable (2 of 24)

| ID | Issue | Reason |
|----|-------|--------|
| M9 | Card image alt text "Story image for X" | **Corrected assessment** — the first pass correctly identified these as decorative images adjacent to title links; `alt=""` is the right pattern per WCAG 1.1.1 |
| L4 | Two duplicate menu triggers | **Architecture changed** — logotype button is now the sole trigger, no separate burger button |

---

## New Findings (Third Pass)

### Critical

#### C1. Copyright Text Contrast Failure
- **Location:** `nebula2026.css` — `.nebula-copyright-main`
- **Category:** Accessibility
- **Description:** Copyright text at `rgba(255,255,255,0.4)` on dark secondary color background gives ~2:1 contrast ratio. Improved from first-pass 0.15, but still far below WCAG AA.
- **Impact:** Unreadable for low-vision users
- **WCAG:** 1.4.3 Contrast (Minimum) (Level AA) — requires 4.5:1
- **Fix:** Increase opacity to 0.7+ minimum

### High

#### H1. Nav Strip Link Contrast
- **Location:** `nebula2026.css` — `.story-nav-strip__link`
- **Category:** Accessibility
- **Description:** Navigation links at `rgba(255,255,255,0.7)` on dark strip — borderline 4.5:1
- **Impact:** Navigation links are critical UI; should comfortably exceed minimum
- **WCAG:** 1.4.3 Contrast (Level AA)
- **Fix:** Increase to 0.85+ opacity

#### H2. Genre/Alpha Pill Touch Targets
- **Location:** `nebula2026.css` — `.nebula-genre-link`
- **Category:** Accessibility
- **Description:** Padding `0.3rem 0.875rem` gives ~28px height — well below 44px minimum
- **Impact:** Difficult to tap on mobile
- **WCAG:** 2.5.8 Target Size (Level AAA)
- **Fix:** Increase padding to `0.5rem 0.875rem`

#### H3. Missing Focus Styles on Dark Backgrounds
- **Location:** `nebula2026.css` — global `:focus-visible`
- **Category:** Accessibility
- **Description:** Focus outline uses `var(--color-primary)` (dark navy) — invisible on dark backgrounds (nav panel, story header, nav strip)
- **WCAG:** 2.4.7 Focus Visible (Level AA)
- **Fix:** Add light-colored focus styles for dark-context elements

#### H4. No Responsive Images (srcset)
- **Location:** All template files with `<img>` tags
- **Category:** Performance
- **Description:** All images use single-resolution `src` — mobile users download desktop-sized images
- **Fix:** Add `srcset` with breakpoints and `sizes` attribute

### Medium

#### M1. Headline Contrast on Hero
- **Location:** `nebula2026.css` — `.nebula-headline`
- **Category:** Accessibility
- **Description:** `rgba(255,255,255,0.7)` on dark hero — borderline for large text
- **Fix:** Increase to 0.85+

#### M2. Nav Panel Link Touch Targets
- **Location:** `nebula2026.css` — `.nebula-nav-panel__link`
- **Category:** Accessibility
- **Description:** Padding `0.65rem 0.75rem` gives ~36-40px — slightly below 44px
- **Fix:** Increase vertical padding to `0.75rem`

#### M3. Hard-coded Print Colors
- **Location:** `nebula2026.css` — `@media print` rules
- **Category:** Theming
- **Description:** Seven hard-coded hex values (#000, #999) in print styles
- **Fix:** Create print color tokens or accept as intentional (print needs absolute colors)

#### M4. Audio Autoplay Error Handling
- **Location:** `audio-remote.js` — `.play().catch()`
- **Category:** UX
- **Description:** Catch handler provides no user feedback when autoplay is blocked
- **Fix:** Show visible "tap to play" indicator

#### M5. Scroll Indicator Missing Accessible Name
- **Location:** `intro.html` — scroll-down arrow link
- **Category:** Accessibility
- **Description:** Arrow SVG link has no `aria-label`
- **Fix:** Add `aria-label="Scroll to content"`

### Low

#### L1. Duplicate CSS Rule
- **Location:** `nebula2026.css` — `.nebula-genre-section` appears twice
- **Category:** Maintenance
- **Fix:** Remove duplicate

#### L2. Backdrop Blur Performance on Mobile
- **Location:** `nebula2026.css` — `.nebula-header` `backdrop-filter: blur(10px)`
- **Category:** Performance
- **Fix:** Consider reducing/disabling at mobile breakpoint

#### L3. Event Listener Cleanup
- **Location:** `reading-progress.js`, `parallax-hero.js`
- **Category:** Performance
- **Description:** Scroll listeners never removed. Minimal impact on static Hugo site (full page reloads).
- **Fix:** Store references and clean up on `pagehide`

#### L4. Focus Trap Missing Form Selectors
- **Location:** `nebula-nav.js` — focus trap query
- **Category:** Accessibility
- **Description:** Queries `a[href], button, [tabindex]` but omits `input`, `select`, `textarea`
- **Fix:** Add form selectors for future-proofing

#### L5. Unused CSS Classes (Suspected)
- **Location:** `nebula2026.css` — `.nebula2026-section-landing`, `.nebula2026-story-single`
- **Fix:** Verify template usage and remove if unused

#### L6. Back-to-top Arrow Opacity
- **Location:** `nebula2026.css` — `.nebula-back-to-top` at opacity 0.3
- **Fix:** Consider base 0.4, hover 0.7

---

## Patterns & Systemic Issues

### Things Done Consistently Well
- **`prefers-reduced-motion`** respected in all 6 interactive JS files
- **Passive scroll listeners** and **RAF throttling** in all scroll-driven scripts
- **ARIA attributes** properly applied: `aria-controls`, `aria-modal`, `role="dialog"`, focus trap, focus restore
- **CSS custom properties** used for colors, spacing tokens, z-index tokens
- **Lazy/eager loading** correctly applied (eager above-fold, lazy below)
- **SVG roundels** all marked `aria-hidden="true"`
- **IntersectionObserver cleanup** — `roundel-animations.js` unobserves after triggering
- **Conditional script loading** — `audio-remote.js` only when `audio` frontmatter present
- **Skip-to-content link** functional and styled
- **woff2 fonts** with `font-display: swap`
- **Modern CSS** — `100svh`, `color-mix()`, `clamp()`, `:has()`, `@supports` fallbacks

### Recurring Patterns to Address
- **Opacity-based contrast** — multiple white-on-dark elements use low opacity. Consider named tokens like `--text-on-dark-primary: rgba(255,255,255,0.9)`, `--text-on-dark-secondary: rgba(255,255,255,0.7)`
- **Touch targets** — pills and some links fall below 44px. Define a `--min-touch-target: 44px` token
- **No srcset** — the single biggest performance gap across all templates

---

## Positive Findings

1. **Massive improvement from first pass** — 16 of 24 issues resolved, score 6.5 → 8.0
2. **Anti-patterns eliminated** — purple gradients, gradient text, and card hover lifts all gone
3. **Focus management exemplary** — nav panel has full focus trap with ESC and focus restore
4. **Motion respect is best-in-class** — every interactive script checks `prefers-reduced-motion`
5. **Modern CSS architecture** — `100svh`, `color-mix()`, `clamp()`, design tokens at file top
6. **Audio accessibility** — `role="button"`, `tabindex`, keyboard support, dynamic `aria-label`
7. **Font optimization** — `.woff2` with `font-display: swap` across all faces

---

## Recommendations by Priority

### Immediate
1. Fix copyright text contrast (opacity 0.4 → 0.7+)

### Short-term
1. Fix nav strip link contrast (0.7 → 0.85+)
2. Increase genre pill touch targets to 44px
3. Add dark-context `:focus-visible` styles
4. Add `aria-label` to scroll indicator link

### Medium-term
1. Add responsive images (srcset) to hero and card images
2. Improve audio autoplay error handling
3. Remove duplicate CSS rule
4. Consider print color approach

### Long-term
1. Verify and remove unused CSS classes
2. Add event listener cleanup in scroll scripts
3. Consider backdrop blur on mobile
4. Add Web Vitals monitoring
