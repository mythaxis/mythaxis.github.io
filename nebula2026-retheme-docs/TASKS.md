# Nebula 2026 — Completion Tasks

> **Branch:** `poc` | **Docs:** `nebula2026-retheme-docs/nebula2026-synthetic-redesign-project/`
>
> Work through phases in order, one sub-task at a time. After each sub-task: mark it `[x]`, run any automated checks listed, then stop and wait for confirmation before proceeding.
>
> At steps marked **Manual browser check required**, stop and explicitly ask the user to test in the browser and confirm before continuing.
>
> Commit at the end of each phase using the commit message specified in the final sub-task.
>
> Reference [`BRANCH-COMPARISON.md`](./nebula2026-synthetic-redesign-project/BRANCH-COMPARISON.md) for full detail on what to cherry-pick and why.

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

### What Claude Code can verify automatically
- `hugo build` — template errors, broken partials, YAML issues
- `node --check static/js/nebula2026/<file>.js` — JS syntax validity

### What requires manual browser testing (you must do these)
- Visual layout at different screen widths
- Story card interactions (click, swipe, hover, keyboard)
- Roundel rendering and animations
- Reading progress bar behaviour
- Parallax effect
- Runtime JS errors in the browser console

### Commit strategy
Claude Code should commit after each completed task/phase using:
```bash
git add -A && git commit -m "feat: [description of task/phase]"
```
---

## Tasks

- [x] 1.0 Manual testing — validate the current `poc` build
  - [x] 1.1 Run `hugo server -D` and create a test issue with `theme: nebula2026` in its `__index.md`
  - [x] 1.2 Add 3 test stories with different `chapterMarker` genres (e.g. `orbit`, `scifi`, `horror`)
  - [x] 1.6 Verify `<hr>` tags in story content are replaced by roundel images
  - [x] 1.7 Verify story-end roundel (200px) appears in the story footer
  - [x] 1.10 Confirm an old issue ( `theme: horizon2020` frontmatter) still renders as horizon2020 — no regressions
  - [x] 1.11 Check browser console — no errors on homepage, section, story, or archive pages


- [x] 2.0 CSS audit and merge from reference branches
  - [x] 2.1 Read `_variables.scss` from snarktank to get the resolved values for all SCSS variables — these will be substituted literally when copying rules:
    - `git show nebula2026-snarktank:assets/scss/nebula2026/_variables.scss`
  - [x] 2.2 Read the remaining four SCSS files and identify CSS rules that are absent or incomplete in `static/themes/nebula2026.css` (focus on: responsive breakpoints, card overlay states, story card layout, interaction states):
    - `git show nebula2026-snarktank:assets/scss/nebula2026/_components.scss`
    - `git show nebula2026-snarktank:assets/scss/nebula2026/_responsive.scss`
    - `git show nebula2026-snarktank:assets/scss/nebula2026/_animations.scss`
    - `git show nebula2026-snarktank:assets/scss/nebula2026/_interactions.scss`
  - [x] 2.3 Copy the missing CSS rules directly into `static/themes/nebula2026.css`. Rules should be copied as-is where they are already plain CSS. Where SCSS syntax appears, resolve it minimally: substitute `$variable` with its literal value from `_variables.scss`; flatten any nested selectors into explicit selectors; inline any `@include` content. Do not rewrite or redesign — copy then fix syntax only.
  - [x] 2.4 Copy slide animation CSS from `_animations.scss` (required by Phase 4 story card JS):
    - Copy `@keyframes slideInRight`, `slideInLeft`, `slideOutLeft`, `slideOutRight` directly
    - Copy `.story-card--slide-in-right/left` and `.story-card--slide-out-left/right` rules, resolving any SCSS variables to literal values
    - Append under `/* Card slide transitions */` comment in `nebula2026.css`
  - [x] 2.5 Add roundel animation classes (required by Phase 5) — these are short enough to write directly:
    - `.roundel-animate { opacity: 0; transform: scale(0.9); transition: opacity 400ms ease-out, transform 400ms ease-out; }`
    - `.roundel-animate--visible { opacity: 1; transform: scale(1); }`
  - [x] 2.6 Add reading progress CSS (required by Phase 6) — write directly:
    - `.reading-progress { position: fixed; top: 0; left: 0; width: 100%; height: 3px; z-index: 9999; }`
    - `.reading-progress__bar { width: 0%; height: 100%; background: linear-gradient(to right, var(--color-primary), var(--color-secondary)); }`
  - [x] 2.7 Rename `story-card-abstract` → `story-card-description` anywhere it appears in `nebula2026.css`
  - [x] 2.8 **Manual browser check required** — run `hugo server -D` and verify: visual layout at mobile (375px), tablet (768px), and desktop (1200px); story card overlay renders correctly; roundels display; old horizon2020 issue unaffected. Confirm before proceeding.
  - [x] 2.9 Run `hugo build` — must complete with no errors
  - [x] 2.10 Commit: `git add -A && git commit -m "feat: CSS merge from snarktank — responsive, animations, reading progress, slide transitions"`

- [x] 3.0 Upgrade `chapter-markers.js` — better error handling and genre validation
  - [x] 3.1 Copy snarktank's version as reference: `git show nebula2026-snarktank:static/js/nebula2026/chapter-markers.js`
  - [x] 3.2 Add a `VALID_GENRES` whitelist — invalid values fall back to `orbit` silently
  - [x] 3.3 Add `onerror` handler on the replacement `<img>` — if SVG is missing, fall back to orbit
  - [x] 3.4 Reconcile attribute name: snarktank reads `data-genre` from `article[data-genre]`; poc reads `data-chapter-marker` from `.nebula-article-content` — keep poc's attribute name, apply snarktank's validation logic
  - [x] 3.5 **Manual browser check required** — use a story with an invalid `chapterMarker` value and confirm orbit roundel appears without console errors
  - [x] 3.6 Run `node --check static/js/nebula2026/chapter-markers.js` — must pass with no errors
  - [x] 3.7 Run `hugo build` — must complete with no errors
  - [x] 3.8 Commit: `git add -A && git commit -m "feat: upgrade chapter-markers.js with genre validation and error fallback"`

- [x] 4.0 Upgrade `story-card-interactions.js` — swipe, keyboard nav, desktop hover
  - [x] 4.1 Copy snarktank's version as reference: `git show nebula2026-snarktank:static/js/nebula2026/story-card-interactions.js`
  - [x] 4.2 Adapt `loadStoryContent()` to read from `data-*` attributes (poc's pattern) rather than querying DOM child elements (snarktank's pattern) — the data attributes on `[data-has-card]` articles are: `data-story-url`, `data-story-title`, `data-story-authors`, `data-story-description`, `data-story-image`; populate `.story-card-description` in the overlay (not `.story-card-abstract`)
  - [x] 4.3 Integrate the mobile swipe detection from snarktank (`MIN_SWIPE_DISTANCE: 50`, `MAX_SWIPE_TIME: 300`)
  - [x] 4.4 Integrate keyboard handling: ESC closes overlay, Arrow Left/Right navigate between cards when overlay is open
  - [x] 4.5 Integrate desktop hover popup (cursor-positioned, `positionPopup()` with viewport boundary checks)
  - [x] 4.6 Integrate `‹` / `›` navigation buttons and `fadeToStory()` (uses slide CSS classes from Phase 2)
  - [x] 4.7 Integrate debounced resize handler that closes active interactions on breakpoint change
  - [x] 4.8 **Manual browser check required** — swipe on mobile emulator, keyboard nav on desktop, hover popup on desktop, ESC to close; confirm before proceeding
  - [x] 4.9 Run `node --check static/js/nebula2026/story-card-interactions.js` — must pass
  - [x] 4.10 Run `hugo build` — must complete with no errors
  - [x] 4.11 Commit: `git add -A && git commit -m "feat: upgrade story-card-interactions.js with swipe, keyboard nav and desktop hover"`

- [x] 5.0 Add `roundel-animations.js` — scroll-triggered fade-in for roundel images
  - [x] 5.1 Copy from snarktank: `git show nebula2026-snarktank:static/js/nebula2026/roundel-animations.js`
  - [x] 5.2 Add the file to `static/js/nebula2026/roundel-animations.js` (79 lines, no changes needed)
  - [x] 5.3 Add `class="roundel-animate"` to roundel `<img>` elements in `article-single.html` (chapter markers and story-end marker)
  - [x] 5.4 Load the script in `layouts/partials/themes/nebula2026/scripts.html`
  - [x] 5.5 **Manual browser check required** — scroll a story page and confirm roundels fade in as they enter the viewport; disable animations in OS accessibility settings and confirm they appear instantly
  - [x] 5.6 Run `node --check static/js/nebula2026/roundel-animations.js` — must pass
  - [x] 5.7 Run `hugo build` — must complete with no errors
  - [x] 5.8 Commit: `git add -A && git commit -m "feat: add roundel-animations.js scroll-triggered fade-in"`

- [x] 6.0 Add `reading-progress.js` — thin progress bar on story pages (synth only)
  - [x] 6.1 Copy from synth: `git show nebula2026-synth:static/js/nebula2026/reading-progress.js`
  - [x] 6.2 Add the file to `static/js/nebula2026/reading-progress.js` (66 lines, no changes needed)
  - [x] 6.3 Confirm the story single template has class `nebula2026-story-single` on its wrapper — the script checks for this class before activating; add it if missing
  - [x] 6.4 Load the script in `layouts/partials/themes/nebula2026/scripts.html`
  - [x] 6.5 **Manual browser check required** — scroll through a story and confirm bar advances; confirm it does NOT appear on non-story pages
  - [x] 6.6 Run `node --check static/js/nebula2026/reading-progress.js` — must pass
  - [x] 6.7 Run `hugo build` — must complete with no errors
  - [x] 6.8 Commit: `git add -A && git commit -m "feat: add reading-progress.js"`

- [x] 7.0 Add `parallax-hero.js` — parallax scroll on hero images (synth only)
  - [x] 7.1 Copy from synth: `git show nebula2026-synth:static/js/nebula2026/parallax-hero.js`
  - [x] 7.2 Add the file to `static/js/nebula2026/parallax-hero.js` (62 lines, no changes needed)
  - [x] 7.3 Check `layouts/partials/themes/nebula2026/` templates for hero image elements — add class `landing-header__image` to issue landing hero `<img>` and `story-header__image` to story page hero `<img>` if not already present
  - [x] 7.4 Load the script in `layouts/partials/themes/nebula2026/scripts.html`
  - [x] 7.5 **Manual browser check required** — scroll an issue landing page and story page and confirm the hero moves at 50% scroll rate; disable animations in OS and confirm parallax is skipped
  - [x] 7.6 Run `node --check static/js/nebula2026/parallax-hero.js` — must pass
  - [x] 7.7 Run `hugo build` — must complete with no errors
  - [x] 7.8 Commit: `git add -A && git commit -m "feat: add parallax-hero.js"`

- [x] 9.0 Fixes from manual testing
  - [x] 9.1 Fix issue hero image not displaying — `styles.html` targeted `#wrapper > .bg` (created by jQuery in horizon2020) which doesn't exist in nebula2026; changed to target `.nebula-intro` directly
  - [x] 9.2 Add Alegreya web font — 5 `@font-face` declarations (Regular, Italic, Bold, Bold Italic, ExtraBold); ExtraBold (800) for `.nebula-title`; applied via `.theme-nebula2026` body rule using `--font-primary` variable
  - [x] 9.3 Bring snarktank story page elements into poc — rewrite `article-single.html` with hero header, sticky minimal header, reading area, author footer, story footer, prev/next navigation; add story page CSS to `nebula2026.css`; create `story-header.js` for sticky header scroll behavior
  - [x] 9.4 Header, nav, and burger menu — restyle `header.html` as slim issue bar; rewrite `nav.html` with full-width menu, slide-in panel, burger button; create `nebula-nav.js` replacing `story-header.js`; add CSS for all components
  - [x] 9.5 Parallax hero header on landing + normal pages — replace CSS background-image with `<img>` element in `intro.html` and `page-single.html`; add `landing-header__*` CSS; `parallax-hero.js` already targets `.landing-header__image`
  - [x] 9.6 Body margin reset to 0 — flush to edges on all screen sizes
  - [x] 9.7 Blurred issue image in story-header-minimal — image pans bottom→top via `object-position` as user scrolls; story-header overlay blur reduced from 10px to 4px
  - [x] 9.8 Wire up `colorScheme` from section frontmatter to CSS custom properties (`--color-primary`, `--color-secondary`) in `styles.html`
  - [x] 9.9 Burger menu restyle — black border on button; panel: content-height, black border, rounded corners (12px), aligned so burger sits in top-right corner; "Mythaxis" gradient logotype at top; issue roundel at bottom; burger→X animation restored
  - [x] 9.10 Replace hardcoded colors with CSS custom properties — all `#667eea`/`#764ba2`/`#a78bfa` instances now use `var(--color-primary)` / `var(--color-secondary)` across header, intro, nav, cards, buttons, authors
  - [x] 9.11 Minimal nav strip — replace card-style prev/next navigation with single-row strip (prev arrow | Contents | next arrow); TOC link now points to contents page instead of section landing
  - [x] 9.12 Author footer full-width on normal pages — move `{{ partial "authorfooter" }}` outside the max-width `.nebula-page` section in `page-single.html`
  - [x] 9.13 Theme taxonomy pages — add `theme-{{ $themeCtx.Theme }}` body class to authors, catalogue, editorials, genres layouts; add CSS for all four page types (`.nebula-catalogue`, authors two-column layout, catalogue list, editorials list, genre sections with pill nav); add hero image with theme guard (`if eq $themeCtx.Theme "nebula2026"`); remove duplicate catalogue-nav from bottom of content partials
  - [x] 9.14 Fix random button — update shortcode JS to use `.href`, add fallback selector for nebula2026 markup (divs instead of tables); add centered pill-style button CSS scoped to `.theme-nebula2026`
  - [x] 9.15 Update copyright footer link — Massively theme URL changed to GitHub repo
  - [x] 9.16 Fix horizon2020 CSS/JS/font 404s on GitHub Pages — Hugo Pipes `.RelPermalink` generates broken relative URLs when baseURL has a subpath (e.g. `/mythaxis/`); pre-compiled SCSS→`static/assets/css/main.min.css`, noscript→`static/assets/css/noscript.css`, jQuery bundle→`static/assets/js/bundle.js`; updated `htmlhead.html` and `horizon2020/scripts.html` to use `relURL` with static paths; fixed font paths in `horizon2020.css` from `../../` to `../`
  - [x] 9.17 Fix horizon2020 divider regression — nested `theme-dispatch` calls in `article-single.html` passed `.` (theme context dict) instead of `.Page` (Hugo page), causing `getThemeContext` to fail and fall back to nebula2026's divider; now correctly renders `divider.svg` and `toplist.svg`
  - [x] 9.18 Redesign frontpage — remove story-card-interactions.js popup/overlay system; replace with two-column CSS grid layout for `.posts`; add rounded borders to `.nebula-card` and `.nebula-featured`; add mobile scroll-snap (`scroll-snap-type: y mandatory`) for flick-to-next-card navigation; remove all overlay/popup CSS (~400 lines); simplify `list-item.html` by removing `data-*` attributes; remove overlay HTML blocks from `section.html` and `index.html`

- [ ] 8.0 Final regression check and deploy
  - [ ] 8.1 Full smoke test: homepage, issue landing (nebula2026), story page (nebula2026), old issue (horizon2020), archive, authors index
  - [ ] 8.2 Mobile test on real device or accurate emulator — swipe cards, check parallax, reading progress
  - [ ] 8.3 No console errors on any page type
  - [ ] 8.4 `git merge poc` into `master`
  - [ ] 8.5 `git push origin master` — triggers GitHub Pages build
  - [ ] 8.6 Smoke-test live site on real device

