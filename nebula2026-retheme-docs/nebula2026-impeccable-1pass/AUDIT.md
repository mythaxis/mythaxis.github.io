# Nebula2026 Theme — Comprehensive Audit Report

**Date:** 2026-03-21
**Branch:** `poc`
**Auditor:** Claude (impeccable:audit skill)

---

## Anti-Patterns Verdict: PARTIAL FAIL

The **story page** and **catalogue pages** are well-executed — Alegreya is a distinctive, context-appropriate choice for a literary magazine, the blurred parallax hero is genuinely atmospheric, and the minimal sticky header is polished. These feel designed, not generated.

The **landing page and card section** fail the test. The core offender:

- **Purple gradient `#667eea → #764ba2`** is literally the most stereotypical AI-generated color palette on the web. It appears on badges, buttons, nav underlines, and button hover glows. It has zero relationship to the `--color-primary`/`--color-secondary` system.
- **Gradient text** (`-webkit-background-clip: text`) on the hero title `.nebula-title` and `.nebula-header__logo` — flagged directly as an AI aesthetic anti-pattern.
- **Card hover lift** (`transform: translateY(-4px)` + shadow intensification) — predictable, used on both `.nebula-card` and `.nebula-featured`.

The purple gradients are the single worst issue in the theme. Everything else adapts to the issue's `colorScheme`; these six spots stubbornly don't.

---

## Executive Summary

| Severity | Count |
|----------|-------|
| Critical | 3 |
| High | 7 |
| Medium | 9 |
| Low | 5 |

**Top 3 issues:**
1. Skip-to-content link has CSS but no HTML — WCAG A blocker
2. Hard-coded purple gradient overrides the entire color system
3. Nav panel opens without focus management — keyboard trap risk

**Overall quality score: 6.5/10** — the typography, story page layout, and JS architecture are genuinely good; the landing page color system and accessibility fundamentals need work.

---

## Detailed Findings

### Critical Issues

---

**C1 — Skip-to-content link is CSS-only**
- **Location:** `nebula2026.css:2316–2331` defines `.skip-to-content`; no template renders it
- **Severity:** Critical
- **Category:** Accessibility
- **Description:** The CSS defines a complete skip link that transitions into view on focus, but no `<a href="#main" class="skip-to-content">` exists in any template. The feature is fully dead.
- **Impact:** Keyboard-only users and screen reader users must tab through the entire header navigation on every page to reach content.
- **WCAG:** 2.4.1 Bypass Blocks (Level A)
- **Recommendation:** Add `<a href="#main" class="skip-to-content">Skip to content</a>` as the very first child of `<body>` in the base layout.

---

**C2 — Nav panel opens without focus management**
- **Location:** `nebula-nav.js:93–102` (`openPanel` function)
- **Severity:** Critical
- **Category:** Accessibility
- **Description:** When the nav panel opens, focus stays on the burger button. The panel has `aria-hidden` toggled correctly but no `role="dialog"`, no focus trap, and no focus move to the first link inside.
- **Impact:** Keyboard users cannot reach the nav links without manually tabbing through them; screen reader users may not know the panel opened.
- **WCAG:** 2.1.2 No Keyboard Trap (Level A), 4.1.2 Name, Role, Value (Level A)
- **Recommendation:** On `openPanel()`, move focus to the first `<a>` inside the panel. Add `role="dialog"` and `aria-modal="true"` to `#nebula-nav-panel`. Implement a focus trap while open.

---

**C3 — Mandatory scroll-snap on mobile accessibility**
- **Location:** `nebula2026.css:700–704`
- **Severity:** Critical
- **Category:** Accessibility / Responsive
- **Description:** `scroll-snap-type: y mandatory` is applied on mobile landing pages. Mandatory snap can prevent users from reaching content that doesn't align to a snap point, and can interfere with AT scroll controls.
- **Impact:** Some users with motor impairments or those using keyboard scrolling may be unable to access partial content between snap points.
- **WCAG:** 2.5.4 Motion Actuation consideration; general scrolling accessibility
- **Recommendation:** Consider `y proximity` instead of `y mandatory` on mobile, or ensure every content item has a snap point. At minimum, provide a clear way to disable snap.

---

### High-Severity Issues

---

**H1 — Hard-coded purple gradient overrides the color system**
- **Location:** `nebula2026.css:203–212, 311–318, 391–392, 662–668, 866–875, 849`
- **Severity:** High
- **Category:** Theming
- **Description:** `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` appears in 6 components (issue badge, header badge, nav underline, `.nebula-button`, `.nebula-button-small`, `.nebula-header__logo`). These values are completely hardcoded and will never adapt to the `colorScheme` frontmatter.
- **Impact:** Every issue uses the same purple-on-blue aesthetic regardless of configured colors. Defeats the purpose of the per-issue color system. Also: this specific gradient is a textbook AI aesthetic tell.
- **Recommendation:** Replace with `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`.

---

**H2 — Gradient text on logo and hero title**
- **Location:** `nebula2026.css:215–223` (`.nebula-title`), `333–338` (`.nebula-header__logo`), `507–513` (`.nebula-nav-panel__logotype`)
- **Severity:** High
- **Category:** Anti-Pattern / Theming
- **Description:** `-webkit-background-clip: text` with purple gradients on the Mythaxis title and logo. Gradient text is explicitly called out as an AI aesthetic anti-pattern. Also fails on some older browsers where the fallback is invisible (`-webkit-text-fill-color: transparent` with no fallback).
- **Impact:** Visual AI-slop tell; potential rendering failure on older WebKit without `-webkit-background-clip` support.
- **Recommendation:** Use solid `var(--color-primary)` or a well-considered non-gradient treatment. Reserve texture/effects for decorative elements, not brand identity.

---

**H3 — Copyright footer text fails WCAG contrast**
- **Location:** `nebula2026.css:2125–2133`
- **Severity:** High
- **Category:** Accessibility
- **Description:** `.nebula-copyright-main/secondary/notice` start at `rgba(255,255,255,0.15)` on the secondary color background (#4a6d8c). That's approximately a 1.3:1 contrast ratio. Even on hover at `rgba(255,255,255,0.4)`, it reaches ~1.8:1. The threshold for 0.7rem text is 4.5:1.
- **Impact:** Copyright information is functionally invisible to most users, including those with low vision.
- **WCAG:** 1.4.3 Contrast (Minimum) (Level AA)
- **Recommendation:** Set a minimum of `rgba(255,255,255,0.6)` resting state (achieving ~3:1), or move to `rgba(255,255,255,0.75)` for AA compliance on small text. The "fade-in on hover" effect can remain but must start from a legible baseline.

---

**H4 — Author bio copyright text also at risk**
- **Location:** `nebula2026.css:1997–2003` (`.nebula-copyright-text`, `.nebula-image-copyright`)
- **Severity:** High
- **Category:** Accessibility
- **Description:** These use `rgba(255,255,255,0.6)` on `var(--color-secondary)` (#4a6d8c). Computed contrast ≈ 2.9:1 for 0.8rem/12.8px non-bold text (requires 4.5:1 for AA).
- **Impact:** Copyright attribution for author work and images is illegible at small sizes.
- **WCAG:** 1.4.3 Contrast (Minimum) (Level AA)
- **Recommendation:** Increase to `rgba(255,255,255,0.85)` minimum.

---

**H5 — Audio player has no accessible label**
- **Location:** `article-single.html:103–110`
- **Severity:** High
- **Category:** Accessibility
- **Description:** `<audio controls>` has no `aria-label` and no visible label. Screen readers will announce it as just "audio" with no context.
- **Impact:** Users can't determine what story the audio corresponds to without surrounding context.
- **WCAG:** 4.1.2 Name, Role, Value (Level AA)
- **Recommendation:** Add `aria-label="Audio version of {{ $page.Title }}"` to the `<audio>` element.

---

**H6 — `prefers-reduced-motion` doesn't cover bounce animation**
- **Location:** `nebula2026.css:263–268` (`@keyframes nebula-bounce`); `nebula2026.css:2358–2399` (reduced motion block)
- **Severity:** High
- **Category:** Accessibility
- **Description:** The scroll indicator SVG has `animation: nebula-bounce 2s infinite` — an infinite looping animation. The `@media (prefers-reduced-motion: reduce)` block does not include `.nebula-scroll-indicator svg` or the `nebula-bounce` keyframe.
- **Impact:** Users who have requested reduced motion will still see a constantly-bouncing arrow. Can cause distress for users with vestibular disorders.
- **WCAG:** 2.3.3 Animation from Interactions (Level AAA); WCAG 2.2 Success Criterion 2.3.3
- **Recommendation:** Add `.nebula-scroll-indicator svg { animation: none !important; }` to the reduced motion block.

---

**H7 — Story nav `<nav>` lacks aria-label**
- **Location:** `article-single.html:140`
- **Severity:** High
- **Category:** Accessibility
- **Description:** `<nav class="story-nav-strip">` has no `aria-label`. The page already has a header `<nav>` (panel links) making this unlabelled landmark ambiguous for screen reader users.
- **Impact:** Screen reader users can't distinguish the story navigation from the main site navigation when browsing landmarks.
- **WCAG:** 4.1.2 / ARIA Landmarks best practice
- **Recommendation:** Add `aria-label="Story navigation"` to the `<nav>` element.

---

### Medium-Severity Issues

---

**M1 — 24 hardcoded hex values bypass the token system**
- **Location:** Throughout `nebula2026.css` Parts 1–3
- **Severity:** Medium
- **Category:** Theming
- **Description:** Many values are hardcoded before the `:root` tokens (which appear at line 1387). Examples: `#1a1a2e` (title color, ≈ primary but not the same), `#666` (description text), `#764ba2` (author names), `#eee` (borders), `#999` (muted text), `#f8f9fa` (audio background).
- **Impact:** Per-issue color theming only partially works. Author names and feature colors are always purple regardless of `colorScheme`.
- **Recommendation:** Replace with design tokens. Move `:root` to the top of the CSS file. Map: `#666 → var(--color-text-light)`, `#999 → var(--color-text-muted)`, `#eee → var(--color-border)`, `#f8f9fa → var(--color-surface)`, `#1a1a2e → var(--color-primary)`.

---

**M2 — Font format is `.woff` only, no `.woff2`**
- **Location:** `nebula2026.css:9–47`
- **Severity:** Medium
- **Category:** Performance
- **Description:** All five Alegreya `@font-face` declarations use only `.woff` format. `.woff2` provides 30–40% better compression and is supported by all modern browsers.
- **Impact:** Unnecessary network overhead on every page load, particularly impactful on mobile.
- **Recommendation:** Convert font files to `.woff2` and add as the primary `src` format with `.woff` as fallback.

---

**M3 — `min-height: 100vh` iOS viewport bug**
- **Location:** `nebula2026.css:153–157` (`.nebula-intro`)
- **Severity:** Medium
- **Category:** Responsive
- **Description:** `min-height: 100vh` on iOS Safari measures the viewport including the address bar, causing the hero to be taller than the visible area and requiring scrolling to see the scroll indicator.
- **Impact:** Mobile users see a truncated hero with no obvious call-to-action visible until they scroll.
- **Recommendation:** Use `min-height: 100svh` (small viewport height) with `100vh` fallback: `min-height: 100vh; min-height: 100svh`.

---

**M4 — `console.log` in production JS**
- **Location:** `nebula-nav.js:145`
- **Severity:** Medium
- **Category:** Performance
- **Description:** `console.log('[nebula-nav] Initialized')` fires on every page load.
- **Impact:** Minor — pollutes browser console for users with DevTools open; slightly wasteful.
- **Recommendation:** Remove the log or gate behind a debug flag.

---

**M5 — `:root` design tokens defined after first use**
- **Location:** `nebula2026.css:1387` vs usage starting at line ~350
- **Severity:** Medium
- **Category:** Theming / Maintainability
- **Description:** The complete design token system is defined at line 1387 (Part 4), but tokens like `--color-primary`, `--color-border` etc. are referenced via `var()` from line 350 onwards. CSS parsing handles this correctly, but it's architecturally backwards and makes the file hard to maintain.
- **Impact:** Future editors adding styles in Parts 1–3 won't see the token definitions without scrolling past 1300 lines.
- **Recommendation:** Move the `:root {}` block to the very top of the file, before all component styles.

---

**M6 — `fileExists` check is likely broken for author photos**
- **Location:** `authorfooter.html:25`
- **Severity:** Medium
- **Category:** Template / Bug
- **Description:** `{{ if fileExists (path.Join .Section .Params.photo | relURL) }}` — `relURL` converts the path to a URL like `/authors/photo.jpg`. Hugo's `fileExists` works on filesystem paths relative to the project root (e.g. `static/authors/photo.jpg`), not URL paths starting with `/`. This means the condition may always evaluate to false and author photos are never shown.
- **Impact:** Author photo images may never render.
- **Recommendation:** Use `fileExists (path.Join "static" .Section .Params.photo)` or remove the guard entirely.

---

**M7 — `--font-secondary` duplicates `--font-primary`**
- **Location:** `nebula2026.css:1407–1408`
- **Severity:** Medium
- **Category:** Theming / Token Design
- **Description:** `--font-secondary: 'Alegreya', Georgia, "Times New Roman", serif` is identical to `--font-primary`. The token exists but adds no typographic differentiation.
- **Impact:** No current impact, but suggests a second typeface was planned but never implemented.
- **Recommendation:** Either differentiate `--font-secondary` with a complementary sans-serif for UI chrome, or remove it.

---

**M8 — Deprecated `-webkit-overflow-scrolling: touch`**
- **Location:** `nebula2026.css:703`
- **Severity:** Medium (Low)
- **Category:** Performance
- **Description:** `-webkit-overflow-scrolling: touch` has been deprecated since iOS 13 (2019) where momentum scrolling became the default.
- **Impact:** Dead code; no user impact but signals stale code in a modern theme.
- **Recommendation:** Remove entirely.

---

**M9 — Image alt text is unhelpful on cards and featured items**
- **Location:** `list-item.html:20`, `featured.html:20`
- **Severity:** Medium
- **Category:** Accessibility
- **Description:** Both use `alt="Story image for {{ $page.Title }}"`. The prefix "Story image for" adds no information. For purely decorative cover images adjacent to the story title, `alt=""` is the correct pattern.
- **Impact:** Screen readers announce redundant "Story image for The Witness" — noise.
- **WCAG:** 1.1.1 Non-text Content (Level A)
- **Recommendation:** For card images where the title is already visible: use `alt=""`, or provide a genuinely descriptive alt if the image conveys meaning beyond decoration.

---

### Low-Severity Issues

---

**L1 — `will-change: transform` on initially-static images**
- **Location:** `nebula2026.css:174`, `1696`
- **Severity:** Low
- **Category:** Performance
- **Description:** `.landing-header__image` and `.story-header__image` both have `will-change: transform` declared in their base styles, even on pages where parallax might be disabled (e.g. `prefers-reduced-motion`). This creates compositor layers eagerly, consuming GPU memory.
- **Recommendation:** Apply `will-change: transform` only when parallax is active via JS.

---

**L2 — Reading progress bar z-index outside defined scale**
- **Location:** `nebula2026.css:1578`
- **Severity:** Low
- **Category:** Theming / Consistency
- **Description:** `.reading-progress` uses `z-index: 9999`, while the defined scale tops out at `--z-tooltip: 1070`. Inconsistent.
- **Recommendation:** Define a `--z-progress-bar` token at an appropriate level.

---

**L3 — `nebula-bounce` uses non-standard bounce easing**
- **Location:** `nebula2026.css:264–268`
- **Severity:** Low
- **Category:** Anti-Pattern
- **Description:** The scroll indicator uses a keyframe bounce — explicitly cited as an overused AI pattern. For a literary publication, a gentler editorial motion would be more appropriate.
- **Recommendation:** Replace with a gentle `translateY` pulse or fade + translate.

---

**L4 — Two duplicate `<button>` menu triggers**
- **Location:** `header.html:26` (`#nebula-menu-trigger`), `nav.html:22` (`#nebula-burger`)
- **Severity:** Low
- **Category:** Accessibility / UX
- **Description:** Both the logotype button and the burger button trigger the same panel open/close. Having two buttons for the same action is redundant and may confuse screen reader users browsing by button role.
- **Impact:** Minor UX confusion. Both are labelled, so impact is low.
- **Recommendation:** Consider whether both are necessary. If yes, ensure they share state clearly via `aria-controls` pointing to the same panel.

---

**L5 — `glyph` custom element in CSS**
- **Location:** `nebula2026.css:71–83`
- **Severity:** Low
- **Category:** Accessibility / Semantics
- **Description:** The CSS targets `glyph` and `glyph.small` as if `<glyph>` were a recognized HTML element. It's a TEI (Text Encoding Initiative) custom element. Browsers treat it as `HTMLUnknownElement`.
- **Impact:** Works visually but has no semantic meaning for screen readers.
- **Recommendation:** Replace with `<span class="glyph">` or use CSS `::first-letter` pseudo-element for drop caps.

---

## Patterns & Systemic Issues

1. **Hard-coded purple (#667eea/#764ba2) appears in 6+ components** — a single color variable replacement could fix all of them at once
2. **Hard-coded greys (#666, #999, #eee) bypass tokens in 10+ places** — all should use `--color-text-light`, `--color-text-muted`, `--color-border`
3. **ARIA/keyboard accessibility is partially implemented** — `aria-expanded` and `aria-hidden` are present but focus management and focus trapping are absent
4. **No dark mode** despite the token system being perfectly set up for it

---

## Positive Findings

These are worth preserving and replicating:

- **Alegreya font choice** — genuinely distinctive and appropriate for literary fiction
- **`prefers-reduced-motion` in both CSS and JS** — parallax-hero.js and roundel-animations.js both check the media query
- **`font-display: swap`** on all font faces
- **`@supports not (backdrop-filter)` fallback** — handles gracefully
- **`*:focus-visible` implementation** — correctly uses `:focus-visible` not `:focus`
- **IIFE pattern in all JS** — no global scope pollution
- **Intersection Observer for roundel animations** — performant scroll detection
- **`requestAnimationFrame` scroll throttling** in nebula-nav.js
- **Print styles** included
- **ESC key closes panel** — correct keyboard interaction
- **`aria-expanded` on burger button** — partially complete ARIA implementation
- **Story page layout flow** — hero → sticky header → reading area → author footer → nav strip is excellent UX
