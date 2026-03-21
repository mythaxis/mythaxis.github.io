# Nebula2026 Audit — Task List

> **Context:** These tasks come from the [AUDIT.md](./AUDIT.md) findings, reassessed against the original [DESIGN-SPEC.md](./nebula2026-synthetic-redesign-project/DESIGN-SPEC.md), [BEST-PRACTICES.md](./nebula2026-synthetic-redesign-project/BEST-PRACTICES.md), and wireframes.
>
> **How to work through this:** Go task by task. For each one, we'll discuss whether it applies, what the right fix is, and then implement. Some you may want to skip or defer — that's fine, we'll mark those. Tasks are grouped by theme rather than raw severity, so related changes can be batched.

---

## Reassessment Notes

After reviewing the project specs, several audit findings shift:

1. **Dark mode** — DESIGN-SPEC.md lists "Day/Night Mode" as a **Future Enhancement, not v1.0**. Dropped from this task list.
2. **Story preview cards removed** — Task 9.18 deliberately replaced the popup/overlay system with a two-column grid. This deviates from the DESIGN-SPEC wireframes (Mob_03) but was a conscious design decision. Not flagged.
3. **Task 9.10 incomplete** — Was marked `[x]` in TASKS.md but **14 instances of `#667eea`/`#764ba2`/`#a78bfa` remain** in `nebula2026.css`. This is the biggest regression.
4. **Skip links** — DESIGN-SPEC.md explicitly requires them under Accessibility Requirements ("Skip links for main content"). The CSS exists but no HTML. This is a spec violation, not just an audit finding.
5. **Focus management** — BEST-PRACTICES.md shows the exact pattern (`triggerElement.focus()` on modal close). The nav panel doesn't implement this. Another spec violation.
6. **`fileExists` author photo bug** — The reading page wireframe (Mob_04) shows author info at the bottom. If photos never render, this feature is broken.

---

## Group A: Color System (the big one)

These are all related to the hardcoded purple colors that should have been replaced in task 9.10.

### A1 — Replace 14 remaining hardcoded purple values
- **Audit ref:** H1, M1
- **What:** `#667eea`, `#764ba2`, `#a78bfa` appear 14 times in `nebula2026.css`. These should all use `var(--color-primary)` and `var(--color-secondary)` per the color system.
- **Where:** Lines 203, 217, 251, 311, 333, 391, 622, 649, 662, 849, 854, 869, 902, 990
- **Discussion points:**
  - The intro page wireframe (Mob_01) uses a neon purple/synthwave aesthetic. Do you want to preserve that vibe on the landing page specifically, or should all pages use the issue's `colorScheme`?
  - Gradient text on `.nebula-title` and `.nebula-header__logo` — the spec doesn't call for gradient text. Replace with solid color, or keep a gradient using theme colors?
  - Author name color (`#764ba2`) on cards and featured — should this be `var(--color-secondary)` or `var(--color-accent)`?
- **How to fix:** Find-and-replace with appropriate `var()` references. The gradient replacements would be `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`.

### A2 — Replace remaining hardcoded grey/neutral values
- **Audit ref:** M1
- **What:** ~10 hardcoded neutral colors bypass the token system: `#1a1a2e` (titles), `#666` (descriptions), `#999` (muted), `#eee` (borders), `#f8f9fa` (audio bg), `#ccc` (separator)
- **Where:** Throughout Parts 1–3 of `nebula2026.css`
- **Discussion points:**
  - `#1a1a2e` is close to `--color-primary` (#1a2b4c) but slightly different. Intentional or drift? Replace with `var(--color-primary)`?
  - These neutrals won't change per-issue, so they're less urgent than the purples. But using tokens means future dark mode becomes trivial.
- **How to fix:** Map each to the correct token: `#666 → var(--color-text-light)`, `#999 → var(--color-text-muted)`, `#eee → var(--color-border)`, `#f8f9fa → var(--color-surface)`, `#1a1a2e → var(--color-primary)`.

### A3 — Move `:root` tokens to top of CSS file
- **Audit ref:** M5
- **What:** Design token definitions at line 1387 should be at the very top, before all component styles.
- **Discussion:** This is a reorder, not a rewrite. No visual change. Makes the file maintainable.
- **How to fix:** Cut the `:root { ... }` block and paste after the `@font-face` declarations.

---

## Group B: Accessibility (spec requirements)

These are directly required by DESIGN-SPEC.md § Accessibility Requirements.

### B1 — Add skip-to-content link HTML
- **Audit ref:** C1
- **Spec ref:** DESIGN-SPEC.md → "Skip links for main content"
- **What:** CSS for `.skip-to-content` exists but no HTML renders it. Need to add the `<a>` element.
- **Discussion points:**
  - Best placed in the base layout (`_default/baseof.html`), not in the nebula2026 partials, so both themes get it. Or is there a theme-dispatch point that makes more sense?
  - Target should be `#main` — does that ID exist in the current markup?
- **How to fix:** Add `<a href="#main" class="skip-to-content">Skip to content</a>` as first child of `<body>`. Verify `#main` exists.

### B2 — Nav panel focus management
- **Audit ref:** C2
- **Spec ref:** BEST-PRACTICES.md → "Maintain Focus Management" (exact code pattern shown)
- **What:** When nav panel opens, focus should move to the first link. When it closes, focus should return to the trigger element.
- **Discussion:** The BEST-PRACTICES.md literally shows the pattern:
  ```js
  const triggerElement = document.activeElement;
  openModal();
  closeModal();
  triggerElement.focus();
  ```
- **How to fix:** In `nebula-nav.js`:
  1. Save `document.activeElement` before opening
  2. In `openPanel()`, focus the first `.nebula-nav-panel__link`
  3. In `closePanel()`, restore focus to saved element
  4. Add `role="dialog"` and `aria-modal="true"` to the panel div in `nav.html`

### B3 — Add `aria-label` to story navigation
- **Audit ref:** H7
- **Spec ref:** DESIGN-SPEC.md → "ARIA labels on all buttons"
- **What:** `<nav class="story-nav-strip">` needs `aria-label="Story navigation"` to distinguish it from other nav landmarks.
- **How to fix:** One attribute addition in `article-single.html:140`.

### B4 — Add `aria-label` to audio player
- **Audit ref:** H5
- **What:** `<audio controls>` has no label. Screen readers announce it as "audio" with no context.
- **How to fix:** Add `aria-label="Listen to {{ $page.Title }}"` on the `<audio>` element in `article-single.html`.

### B5 — Fix bounce animation reduced-motion coverage
- **Audit ref:** H6
- **What:** The scroll indicator's infinite `nebula-bounce` animation isn't disabled by `@media (prefers-reduced-motion: reduce)`.
- **How to fix:** Add `.nebula-scroll-indicator svg { animation: none !important; }` to the reduced-motion media query block in `nebula2026.css`.

### B6 — Fix card/featured image alt text
- **Audit ref:** M9
- **What:** `alt="Story image for {{ $page.Title }}"` is redundant noise. These are decorative images adjacent to the visible title.
- **Discussion:** Per WCAG, decorative images should use `alt=""`. But if covers convey genre/mood info, a descriptive `imageAlt` frontmatter field might be better long-term. For now, `alt=""` is the quick correct fix.
- **How to fix:** Change to `alt=""` in `list-item.html:20` and `featured.html:20`.

---

## Group C: Contrast Fixes

### C1 — Copyright footer text contrast
- **Audit ref:** H3
- **What:** Site copyright text starts at `rgba(255,255,255,0.15)` — essentially invisible. Hover state reaches only `rgba(255,255,255,0.4)`. Both fail WCAG AA 4.5:1.
- **Discussion:** The "fade in on hover" effect is a design choice — copyright notices are meant to be unobtrusive. But 0.15 is so low it's functionally invisible. Can we start at 0.4 and hover to 0.7?
- **Where:** `nebula2026.css:2132` (base), `2138` (hover)
- **How to fix:** Increase resting state to `rgba(255,255,255,0.4)`, hover to `rgba(255,255,255,0.7)`.

### C2 — Author footer copyright text contrast
- **Audit ref:** H4
- **What:** `.nebula-copyright-text` and `.nebula-image-copyright` use `rgba(255,255,255,0.6)` on `--color-secondary` background. At 0.8rem, this fails 4.5:1.
- **Discussion:** This is the individual story copyright, not the site footer. Needs to be legible.
- **How to fix:** Increase to `rgba(255,255,255,0.8)`.

---

## Group D: Bug Fixes

### D1 — `fileExists` author photo check
- **Audit ref:** M6
- **What:** `{{ if fileExists (path.Join .Section .Params.photo | relURL) }}` likely always returns false because `relURL` produces a URL path (`/authors/photo.jpg`), not a filesystem path.
- **Discussion:** Need to verify — does this actually work in the current Hugo version? Test with a known author who has a photo set.
- **How to fix:** If broken, change to `{{ if .Params.photo }}` (trust the frontmatter) or `{{ if fileExists (path.Join "static" .Section .Params.photo) }}`.

### D2 — Remove `console.log` from production JS
- **Audit ref:** M4
- **Where:** `nebula-nav.js:145`
- **How to fix:** Delete the line.

---

## Group E: Performance

### E1 — Convert fonts to `.woff2`
- **Audit ref:** M2
- **What:** All five Alegreya `@font-face` declarations use `.woff` only. `.woff2` is 30-40% smaller.
- **Discussion:** Requires converting the font files. Do you have the original `.ttf`/`.otf` sources, or should we use a conversion tool?
- **How to fix:** Convert files, add `.woff2` sources to `@font-face` with `.woff` fallback.

### E2 — Fix `min-height: 100vh` iOS viewport issue
- **Audit ref:** M3
- **What:** `.nebula-intro` uses `min-height: 100vh` which on iOS Safari includes the address bar height, making the hero taller than the visible area.
- **How to fix:** Add `min-height: 100svh` after `100vh` as a progressive enhancement:
  ```css
  min-height: 100vh;
  min-height: 100svh;
  ```

---

## Group F: Polish & Cleanup

### F1 — Remove `-webkit-overflow-scrolling: touch`
- **Audit ref:** M8
- **Where:** `nebula2026.css:703`
- **How to fix:** Delete the line.

### F2 — Consider scroll-snap `proximity` vs `mandatory`
- **Audit ref:** C3
- **What:** Mobile scroll snap uses `mandatory` which can trap content between snap points. `proximity` is more forgiving.
- **Discussion:** You deliberately chose `mandatory` in task 9.18 for the flick-to-next-card UX. This is a tradeoff between snappy feel and accessibility. What's your preference?
- **How to fix:** Change `scroll-snap-type: y mandatory` to `y proximity` in the mobile media query if desired.

### F3 — Tidy z-index: progress bar
- **Audit ref:** L2
- **What:** `.reading-progress` uses `z-index: 9999` outside the defined token scale.
- **How to fix:** Either add `--z-progress: 9999` to `:root` or use a lower value from the scale.

---

## Group G: Design Refinement (optional)

These are lower priority and more subjective. Worth discussing but not blockers.

### G1 — Gradient text treatment
- **Audit ref:** H2
- **What:** `-webkit-background-clip: text` gradient on `.nebula-title` and `.nebula-header__logo`. Flagged as AI aesthetic anti-pattern.
- **Discussion:** The wireframe (Mob_01) shows "MYTH AXIS" in white/light text over the hero image. Solid white or solid `--color-primary` might better match the editorial tone. But this is a design call — do you like the gradient text?

### G2 — Bounce animation on scroll indicator
- **Audit ref:** L3
- **What:** The bouncing arrow is a common AI pattern. For a literary publication, a subtler motion might fit better.
- **Discussion:** Could replace with a gentle opacity pulse or slow translateY drift. Or remove animation entirely and let the "Explore this issue" text do the work.

### G3 — `--font-secondary` token
- **Audit ref:** M7
- **What:** Currently identical to `--font-primary`. A contrasting sans-serif for UI elements (nav, metadata, badges) could add typographic interest.
- **Discussion:** Adding a second font means more weight to load. Worth it? Candidates might be a clean sans like Source Sans, or keep single-font and differentiate via weight/style.

### G4 — Dual menu trigger buttons
- **Audit ref:** L4
- **What:** Both the logotype button and burger button trigger the same nav panel. Redundant for screen readers.
- **Discussion:** The logotype trigger is hidden when the burger appears (header scrolls away), so they're never both visible. Probably fine as-is. Could add `aria-controls="nebula-nav-panel"` to both for clarity.

### G5 — `glyph` custom element
- **Audit ref:** L5
- **What:** CSS targets `<glyph>` which is a non-standard HTML element used for drop caps in story content.
- **Discussion:** This is in the story markdown content itself — changing it means editing published stories. Probably leave as-is unless you're doing a content migration.

---

## Suggested Workflow

**Session 1 — Colors (Groups A + C):** ~30 min
Fix the color system in one pass. This is the biggest visual improvement. Commit once.

**Session 2 — Accessibility (Group B):** ~20 min
Skip link, focus management, ARIA labels. Small targeted changes across a few files. Commit once.

**Session 3 — Bugs & Performance (Groups D + E):** ~15 min
Quick fixes. Console.log removal, `fileExists`, font format, iOS viewport. Commit once.

**Session 4 — Polish (Groups F + G):** discussion-driven
Go through each item, decide keep/change/defer. These are design calls, not bugs.

---

## Quick Reference: Files to Touch

| File | Groups |
|------|--------|
| `static/themes/nebula2026.css` | A, B5, C, E2, F |
| `static/js/nebula2026/nebula-nav.js` | B2, D2 |
| `layouts/partials/themes/nebula2026/article-single.html` | B3, B4 |
| `layouts/partials/themes/nebula2026/nav.html` | B2 |
| `layouts/partials/themes/nebula2026/list-item.html` | B6 |
| `layouts/partials/themes/nebula2026/featured.html` | B6 |
| `layouts/partials/themes/nebula2026/authorfooter.html` | D1 |
| `layouts/_default/baseof.html` | B1 |
| `static/assets/fonts/nebula2026/*.woff` | E1 |
