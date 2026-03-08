# Nebula 2026 — Completion Tasks

> **Branch:** `poc` | **Project docs:** `/Users/marty/Freelancing/PROJECTS/MythAxis Retheme 2026/nebula2026-synthetic-redesign-project/`
>
> Work through phases in order. Each phase builds on the last.
> Reference `BRANCH-COMPARISON.md` in the project docs for full detail on what to cherry-pick and why.

---

## Relevant Files

- `static/js/nebula2026/story-card-interactions.js` — current simplified card overlay (138 lines)
- `static/js/nebula2026/chapter-markers.js` — current basic HR replacement (54 lines)
- `static/themes/nebula2026.css` — all nebula2026 styles (709 lines)
- `layouts/partials/themes/nebula2026/list-item.html` — sets `data-*` attributes on TOC items
- `layouts/partials/themes/nebula2026/article-single.html` — sets `data-chapter-marker` on article wrapper
- `layouts/partials/themes/nebula2026/scripts.html` — loads JS files for this theme

### Notes

- Hugo templates: use `hugo server -D --disableFastRender` to test
- All JS should be vanilla, no dependencies
- Snarktank/synth source files accessible via: `git show nebula2026-snarktank:path/to/file`
- Do NOT copy templates from old branches — only JS/CSS assets

---

## Tasks

- [ ] 1.0 Manual testing — validate the current `poc` build
  - [ ] 1.1 Run `hugo server -D` and create a test issue with `theme: nebula2026` in its `__index.md`
  - [ ] 1.2 Add 3 test stories with different `chapterMarker` genres (e.g. `orbit`, `scifi`, `horror`)
  - [ ] 1.3 Verify story cards open on clicking a TOC item
  - [ ] 1.4 Verify card closes on background click and ✕ button
  - [ ] 1.5 Verify READ button navigates to the correct story URL
  - [ ] 1.6 Verify `<hr>` tags in story content are replaced by roundel images
  - [ ] 1.7 Verify story-end roundel (200px) appears in the story footer
  - [ ] 1.8 Check layout at mobile (375px), tablet (768px), and desktop (1200px) widths
  - [ ] 1.9 Test in Chrome and Safari
  - [ ] 1.10 Confirm an old issue (no `theme:` frontmatter) still renders as horizon2020 — no regressions
  - [ ] 1.11 Check browser console — no errors on homepage, section, story, or archive pages


- [ ] 2.0 Upgrade `chapter-markers.js` — better error handling and genre validation
  - [ ] 2.1 Copy snarktank's version as reference: `git show nebula2026-snarktank:static/js/nebula2026/chapter-markers.js`
  - [ ] 2.2 Add a `VALID_GENRES` whitelist — invalid values fall back to `orbit` silently
  - [ ] 2.3 Add `onerror` handler on the replacement `<img>` — if SVG is missing, fall back to orbit
  - [ ] 2.4 Reconcile attribute name: snarktank reads `data-genre` from `article[data-genre]`; poc reads `data-chapter-marker` from `.nebula-article-content` — keep poc's attribute name, apply snarktank's validation logic
  - [ ] 2.5 Test: use a story with an invalid `chapterMarker` value and confirm orbit roundel appears without console errors

- [ ] 3.0 Add slide animation CSS — prerequisite for upgraded card interactions
  - [ ] 3.1 Copy the slide animation block from snarktank: `git show nebula2026-snarktank:assets/scss/nebula2026/_animations.scss`
  - [ ] 3.2 Extract the keyframes and classes needed by story card nav (approximately 50 lines):
    - `@keyframes slideInRight`, `slideInLeft`, `slideOutLeft`, `slideOutRight`
    - `.story-card--slide-in-right/left` and `.story-card--slide-out-left/right`
    - The `100ms cubic-bezier(0.4, 0.0, 0.2, 1)` timing for card snap
  - [ ] 3.3 Append these to `static/themes/nebula2026.css` under a `/* Card slide transitions */` comment
  - [ ] 3.4 Also add the two roundel animation classes needed for Task 5:
    - `.roundel-animate { opacity: 0; transform: scale(0.9); transition: opacity 400ms ease-out, transform 400ms ease-out; }`
    - `.roundel-animate--visible { opacity: 1; transform: scale(1); }`

- [ ] 4.0 Upgrade `story-card-interactions.js` — swipe, keyboard nav, desktop hover
  - [ ] 4.1 Copy snarktank's version as reference: `git show nebula2026-snarktank:static/js/nebula2026/story-card-interactions.js`
  - [ ] 4.2 Adapt `loadStoryContent()` to read from `data-*` attributes (poc's pattern) rather than querying DOM child elements (snarktank's pattern) — the data attributes on `[data-has-card]` list items are: `data-story-url`, `data-story-title`, `data-story-authors`, `data-story-abstract`, `data-story-image`
  - [ ] 4.3 Integrate the mobile swipe detection from snarktank (`MIN_SWIPE_DISTANCE: 50`, `MAX_SWIPE_TIME: 300`)
  - [ ] 4.4 Integrate keyboard handling: ESC closes overlay, Arrow Left/Right navigate between cards when overlay is open
  - [ ] 4.5 Integrate desktop hover popup (cursor-positioned, `positionPopup()` with viewport boundary checks)
  - [ ] 4.6 Integrate `‹` / `›` navigation buttons and `fadeToStory()` (uses slide CSS classes from Task 3)
  - [ ] 4.7 Integrate debounced resize handler that closes active interactions on breakpoint change
  - [ ] 4.8 Test: swipe on mobile emulator, keyboard nav on desktop, hover popup on desktop, ESC to close


- [ ] 5.0 Add `roundel-animations.js` — scroll-triggered fade-in for roundel images
  - [ ] 5.1 Copy from snarktank: `git show nebula2026-snarktank:static/js/nebula2026/roundel-animations.js`
  - [ ] 5.2 Add the file to `static/js/nebula2026/roundel-animations.js` (79 lines, no changes needed)
  - [ ] 5.3 Add `class="roundel-animate"` to roundel `<img>` elements in `article-single.html` (chapter markers and story-end marker)
  - [ ] 5.4 Load the script in `layouts/partials/themes/nebula2026/scripts.html`
  - [ ] 5.5 Test: scroll a story page — roundels should fade in as they enter the viewport; disable animations in OS accessibility settings and confirm they appear instantly

- [ ] 6.0 Add `reading-progress.js` — thin progress bar on story pages (synth only)
  - [ ] 6.1 Copy from synth: `git show nebula2026-synth:static/js/nebula2026/reading-progress.js`
  - [ ] 6.2 Add the file to `static/js/nebula2026/reading-progress.js` (66 lines, no changes needed)
  - [ ] 6.3 Confirm the story single template has class `nebula2026-story-single` on its wrapper — the script checks for this class before activating; add it if missing
  - [ ] 6.4 Add CSS for `.reading-progress` and `.reading-progress__bar` to `nebula2026.css`:
    - Fixed bar at top of viewport, full width, height ~3px
    - Gradient fill using `--color-primary` and `--color-secondary`
    - `z-index` above content
  - [ ] 6.5 Load the script in `layouts/partials/themes/nebula2026/scripts.html`
  - [ ] 6.6 Test: scroll through a story and confirm bar advances; confirm it does NOT appear on non-story pages

- [ ] 7.0 Add `parallax-hero.js` — parallax scroll on hero images (synth only)
  - [ ] 7.1 Copy from synth: `git show nebula2026-synth:static/js/nebula2026/parallax-hero.js`
  - [ ] 7.2 Add the file to `static/js/nebula2026/parallax-hero.js` (62 lines, no changes needed)
  - [ ] 7.3 Check `layouts/partials/themes/nebula2026/` templates for hero image elements — add class `landing-header__image` to issue landing hero `<img>` and `story-header__image` to story page hero `<img>` if not already present
  - [ ] 7.4 Load the script in `layouts/partials/themes/nebula2026/scripts.html`
  - [ ] 7.5 Test: scroll an issue landing page and story page — hero image should move at 50% scroll rate; disable animations in OS and confirm parallax is skipped

- [ ] 8.0 Final regression check and deploy
  - [ ] 8.1 Full smoke test: homepage, issue landing (nebula2026), story page (nebula2026), old issue (horizon2020), archive, authors index
  - [ ] 8.2 Mobile test on real device or accurate emulator — swipe cards, check parallax, reading progress
  - [ ] 8.3 No console errors on any page type
  - [ ] 8.4 `git merge poc` into `master`
  - [ ] 8.5 `git push origin master` — triggers GitHub Pages build
  - [ ] 8.6 Smoke-test live site on real device

