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

### E1 — Update `@font-face` to `.woff2` (Alegreya done, CSS needs updating)
- **Audit ref:** M2
- **Status:** Font files already converted — `.woff2` versions are in `static/assets/fonts/nebula2026/`. Source files archived in `nebula2026-retheme-docs/nebula2026-webfonts/`.
- **What remains:** The `@font-face` declarations in `nebula2026.css` (lines 9–47) still reference `.woff` format. Update them to use `.woff2` as primary format with `.woff` as fallback.
- **How to fix:** Change each `src:` line to: `src: url('...woff2') format('woff2'), url('...woff') format('woff');`
- **Note:** Also remove the unused weights. The CSS declares 5 weights (400, 400i, 700, 700i, 800) but 16 `.woff2` files exist. Only declare what the theme actually uses.

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

## Group H: Typography — Basalte Display Font

The Degheest Family (Velvetyne Type Foundry) Basalte font is a striking display typeface. Three variants have been copied to `static/assets/fonts/nebula2026/`: **Basalte-Fond**, **Basalte-Multicolor**, and **Basalte-Volume**. Source files are archived in `nebula2026-retheme-docs/nebula2026-webfonts/degheest-types-master/`.

### H1 — Add Basalte `@font-face` declarations
- **What:** Declare the three Basalte variants in `nebula2026.css`. These are display fonts for headings only, not body text.
- **How to fix:** Add three `@font-face` blocks after the Alegreya declarations:
  ```css
  @font-face {
      font-family: 'Basalte';
      src: url('../assets/fonts/nebula2026/Basalte-Fond.woff2') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
  }
  @font-face {
      font-family: 'Basalte Multicolor';
      src: url('../assets/fonts/nebula2026/Basalte-Multicolor.woff2') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
  }
  @font-face {
      font-family: 'Basalte Volume';
      src: url('../assets/fonts/nebula2026/Basalte-Volume.woff2') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
  }
  ```
- **Discussion:** Basalte is a single-weight font (no bold/italic variants). Each variant is a separate visual style, not a weight. Do we want all three available as CSS classes, or pick one as the primary heading font?

### H2 — Update `--font-secondary` token to Basalte
- **What:** The `--font-secondary` token is currently identical to `--font-primary` (both Alegreya). Replace with Basalte.
- **Audit ref:** M7 (resolves the redundant token issue)
- **How to fix:** Change `:root` to: `--font-secondary: 'Basalte', 'Alegreya', Georgia, serif;`
- **Discussion:** Alegreya as fallback ensures graceful degradation if Basalte fails to load.

### H3 — Apply Basalte to headings
- **What:** Decide which elements use Basalte vs Alegreya. Candidates:
  - **Definite:** `.nebula-title` (hero "Mythaxis"), `.nebula-header__logo`, `.nebula-nav-panel__logotype`
  - **Probable:** `.nebula-featured-title`, `.nebula-card-title`, `.story-header__title`
  - **Maybe:** `.nebula-page-title`, `.nebula-catalogue-header h1`
  - **Probably not:** Body text, nav links, metadata, bylines (keep Alegreya)
- **Discussion points:**
  - Basalte-Fond is the base form. Basalte-Multicolor has a striped/layered effect. Basalte-Volume has a 3D/shadow effect. Which variant for which context?
  - One approach: **Fond** for most headings, **Volume** for the hero `.nebula-title` (big impact moment), **Multicolor** reserved for special use (hover states? featured card?).
  - Or keep it simple: **Fond** everywhere, use Alegreya weight variation for hierarchy.
- **How to fix:** Add `font-family: var(--font-secondary);` to the chosen heading selectors.

### H4 — Consider Basalte for the MYTH(roundel)AXIS logotype
- **What:** The logotype mockup (see wireframe `Example new logotype.jpg`) shows "MYTH AXIS" with the roundel between them. Basalte could be the logotype font.
- **Discussion:** This ties directly into Group I (roundels/logo). The header currently renders "Mythaxis" as a `<button>` with gradient text. Basalte + roundel image inline would be more distinctive and match the wireframe. See I3 below.
- **Depends on:** I3 (logo restructure)

---

## Group I: Roundels & Logo

The current AI-generated SVG roundels are being replaced by professionally designed artwork (10 designs in `nebula2026-retheme-docs/nebula2026-wireframes/roundels-png/`). This group covers format, frontmatter, the Mythaxis brand roundel, and the logo/header layout.

### Designer Roundel Inventory

| File | Matches genre | Current SVG |
|------|--------------|-------------|
| `ufo.png` | `scifi` | `scifi-100/200.svg` |
| `target.png` | `orbit` (default) | `orbit-100/200.svg` |
| `braid.png` | `fantasy` | `fantasy-100/200.svg` |
| `eye.png` | `horror` | `horror-100/200.svg` |
| `alien.png` | — (new, or alt scifi) | — |
| `hand.png` | `psion` | `psion-100/200.svg` |
| `swords.png` | `supernatural` | `supernatural-100/200.svg` |
| `face.png` | `dark` | `dark-100/200.svg` |
| `galaxy.png` | `cosmic` | `cosmic-100/200.svg` |
| `atom.png` | — (new, or alt scifi) | — |

### I1 — Decide roundel format: SVG vs PNG
- **What:** The designer artwork is PNG. The current system expects SVGs at `/images/roundels/{genre}-100.svg` and `-200.svg`. Need to decide format going forward.
- **Discussion points:**
  - **SVG preferred** (your stated preference): Can we get SVG versions from the designer, or trace/convert the PNGs? The designs are high-contrast black-and-white with clean shapes — they'd trace well.
  - **PNG option:** Change the JS/CSS/templates to reference `.png` instead of `.svg`. Simpler but means no resolution independence and larger files.
  - **Hybrid:** Use SVGs where possible, PNGs as fallback. But this adds complexity.
  - **Size question:** Current system uses `-100` (100x100 chapter markers) and `-200` (200x200 story-end markers). With SVGs this is just a naming convention (they scale). With PNGs, you'd want actual resolution variants or one large image scaled down via CSS.
- **How to fix:** Decision needed first. If SVG: trace the PNGs (or get designer files). If PNG: update `chapter-markers.js` file extension, update `article-single.html` roundel `src` attributes, update CSS sizing.

### I2 — Update genre-to-roundel mapping
- **What:** The designer has 10 roundels but the current system has 8 genres. Need to map the new art and decide what to do with extras (`alien.png`, `atom.png`).
- **Discussion points:**
  - `alien` could be a new genre, or an alternative for `scifi` (which already has `ufo`)
  - `atom` could map to a new genre, or be an alternative for `cosmic`/`scifi`
  - Or: expand the genre list to include `alien` and `atom` as valid `chapterMarker` values
  - The `chapter-markers.js` VALID_GENRES whitelist needs updating to match
- **How to fix:** Agree on mapping, update `VALID_GENRES` in `chapter-markers.js`, deploy new roundel files to `static/images/roundels/`.

### I3 — Restructure the logo: MYTH(roundel)AXIS in the header
- **What:** The wireframe mockup shows the Mythaxis logotype with the roundel embedded between "MYTH" and "AXIS". Currently the header has just a text button saying "Mythaxis". The logo should:
  1. Move from `.nebula-intro-content` (hero area) into `.nebula-header` (sticky header bar)
  2. Be **centered** in the header (not right-aligned as currently)
  3. Include the brand roundel inline: `MYTH [roundel] AXIS`
- **Discussion points:**
  - **Which roundel for the brand mark?** The logotype wireframe shows a compass/sun design — not one of the genre roundels. Is there a separate MythaxisIcon roundel from the designer? Or does it use the issue's `issueRoundel`? Or is `target`/`orbit` the brand mark?
  - **Header layout impact:** Currently the header has `justify-content: space-between` with the issue badge left and logo right. Centering the logo means restructuring to a three-column layout (badge | logo | burger) or centering everything.
  - **Menu trigger:** The logo currently opens the nav panel. If it moves and becomes centered, it still works as a menu trigger — but the burger button also exists. Keep both triggers? Or make the centered logo the primary trigger and retire the separate logotype button?
  - **Mobile:** On mobile, the header is slim (0.75rem padding). A logo with roundel image may need more space or a smaller rendering. The wireframe (Mob_01) shows the roundel large on the landing hero — does it shrink in the header?
  - **Landing page:** The hero currently has `<h1 class="nebula-title">Mythaxis</h1>` as plain text. Should this also become the MYTH(roundel)AXIS treatment? Or does the hero only show the roundel large (per Mob_01 wireframe) with the text logo in the header above?
- **How to fix (after decisions):**
  1. Update `header.html` — restructure to center the logo, add roundel `<img>` inline
  2. Update `intro.html` — decide if hero still shows the text title or defers to the header
  3. Update CSS — new header layout (flexbox with centered logo), roundel sizing at different breakpoints
  4. Update `nebula-nav.js` — adjust menu trigger logic if needed

### I4 — Roundel in the nav panel
- **What:** The nav panel currently shows a small issue roundel at the bottom. With the new designer roundels, this should use the new artwork too.
- **How to fix:** This just works once I1/I2 are done — the template already reads `$section.Params.issueRoundel` and constructs the path. Only need to ensure new files are at the expected paths.

### I5 — Frontmatter schema for roundels
- **What:** Document and potentially extend the frontmatter schema for roundel configuration.
- **Current schema:**
  ```yaml
  # Issue __index.md
  issueRoundel: "orbit"       # which roundel for this issue

  # Story .md
  chapterMarker: "scifi"      # which roundel for chapter breaks in this story
  ```
- **Discussion points:**
  - Is the current two-field approach sufficient? Or do we need more granularity (e.g., separate `storyEndRoundel`)?
  - Should the valid values be documented in the frontmatter reference? (Currently they're only in the JS whitelist.)
  - If we add `alien` and `atom` as new genres, do existing stories need updating?
  - The config cascade (story `chapterMarker` → issue `issueRoundel` → site `defaultRoundel`) — is this still the right priority order?

---

## Suggested Workflow

**Session 1 — Colors (Groups A + C):** ~30 min
Fix the color system in one pass. This is the biggest visual improvement. Commit once.

**Session 2 — Accessibility (Group B):** ~20 min
Skip link, focus management, ARIA labels. Small targeted changes across a few files. Commit once.

**Session 3 — Bugs & Performance (Groups D + E):** ~15 min
Quick fixes. Console.log removal, `fileExists`, font format, iOS viewport. Commit once.

**Session 4 — Typography (Group H):** discussion-driven, then implementation
Decide Basalte variant strategy, add `@font-face`, apply to headings. Needs browser testing. Commit once.

**Session 5 — Roundels & Logo (Group I):** discussion-heavy
This is the most design-decision-dense session. Decisions needed on: format (SVG vs PNG), genre mapping, brand roundel identity, header layout. Implementation follows decisions. Multiple commits likely.

**Session 6 — Polish (Groups F + G):** discussion-driven
Go through each item, decide keep/change/defer. These are design calls, not bugs.

---

## Quick Reference: Files to Touch

| File | Groups |
|------|--------|
| `static/themes/nebula2026.css` | A, B5, C, E1, E2, F, H1–H3, I3 |
| `static/js/nebula2026/nebula-nav.js` | B2, D2, I3 |
| `static/js/nebula2026/chapter-markers.js` | I1, I2 |
| `layouts/partials/themes/nebula2026/header.html` | I3 |
| `layouts/partials/themes/nebula2026/intro.html` | I3 |
| `layouts/partials/themes/nebula2026/nav.html` | B2, I4 |
| `layouts/partials/themes/nebula2026/article-single.html` | B3, B4 |
| `layouts/partials/themes/nebula2026/list-item.html` | B6 |
| `layouts/partials/themes/nebula2026/featured.html` | B6 |
| `layouts/partials/themes/nebula2026/authorfooter.html` | D1 |
| `layouts/_default/baseof.html` | B1 |
| `static/images/roundels/*` | I1, I2 |
| `static/assets/fonts/nebula2026/*` | E1, H1 |
