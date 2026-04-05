# Nebula 2026 — Comprehensive Task List

> **Branch:** `poc` | **Docs:** `nebula2026-retheme-docs/`
>
> This is the full history of the nebula2026 retheme, including work tracked in the original task list, the impeccable audit/critique sessions, and additional/adhoc and remaining items.

---

## Phase 1 — Foundation

- [x] **1.0 Manual testing** — validate the current `poc` build
  - [x] 1.1 Run `hugo server -D` and create test issue with `theme: nebula2026`
  - [x] 1.2 Add test stories with different `chapterMarker` genres
  - [x] 1.3 Verify `<hr>` tags replaced by roundel images
  - [x] 1.4 Verify story-end roundel appears in story footer
  - [x] 1.5 Confirm old horizon2020 issue still renders correctly
  - [x] 1.6 Check browser console — no errors on any page type

- [x] **2.0 CSS audit and merge from snarktank**
  - [x] 2.1 Resolve SCSS variables from `_variables.scss`
  - [x] 2.2 Identify missing CSS from snarktank SCSS files
  - [x] 2.3 Copy missing rules into `nebula2026.css` (flatten SCSS)
  - [x] 2.4 Copy slide animation CSS (`@keyframes slideIn/Out`)
  - [x] 2.5 Add roundel animation classes (`.roundel-animate`)
  - [x] 2.6 Add reading progress CSS
  - [x] 2.7 Rename `story-card-abstract` → `story-card-description`
  - [x] 2.8 Browser check + `hugo build` pass
  - Commit: `00233a48`

- [x] **3.0 Upgrade chapter-markers.js** — genre validation and error fallback
  - [x] 3.1 Add `VALID_GENRES` whitelist with fallback to orbit
  - [x] 3.2 Add `onerror` handler on replacement `<img>`
  - [x] 3.3 Keep poc's `data-chapter-marker` attribute name
  - Commit: `a5f6ff71`

- [x] **4.0 Upgrade story-card-interactions.js** — swipe, keyboard nav, hover popup
  - [x] 4.1 Adapt `loadStoryContent()` to read from `data-*` attributes
  - [x] 4.2 Mobile swipe detection
  - [x] 4.3 Keyboard handling (ESC, arrows)
  - [x] 4.4 Desktop hover popup with viewport checks
  - [x] 4.5 Navigation buttons and `fadeToStory()`
  - [x] 4.6 Debounced resize handler
  - Commit: `3ab29bf6`

---

## Phase 2 — JS Features

- [x] **5.0 roundel-animations.js** — scroll-triggered fade-in via IntersectionObserver
- [x] **6.0 reading-progress.js** — thin progress bar on story pages
- [x] **7.0 parallax-hero.js** — parallax scroll on hero images

---

## Phase 3 — Manual Fixes (9.x series)

- [x] **9.1** Fix issue hero image (styles.html targeting fix)
- [x] **9.2** Add Alegreya web font (5 `@font-face` declarations)
- [x] **9.3** Story page rewrite — `article-single.html` with hero header, sticky minimal header, reading area, author footer, nav strip
- [x] **9.4** Header, nav, and burger menu — slim issue bar, slide-in panel, `nebula-nav.js`
- [x] **9.5** Parallax hero on landing + normal pages — `<img>` elements replacing CSS backgrounds
- [x] **9.6** Body margin reset to 0
- [x] **9.7** Blurred issue image in story-header-minimal with object-position pan
- [x] **9.8** Wire up `colorScheme` CSS custom properties from frontmatter
- [x] **9.9** Burger menu restyle — black border, content-height panel, rounded corners, logotype, roundel
- [x] **9.10** Replace hardcoded colors with CSS vars (all `#667eea`/`#764ba2`/`#a78bfa`)
- [x] **9.11** Minimal nav strip (prev arrow | Contents | next arrow)
- [x] **9.12** Author footer full-width on normal pages
- [x] **9.13** Theme taxonomy pages — authors, catalogue, editorials, genres layouts with hero images
- [x] **9.14** Fix random button JS — `.href` fix, fallback selector, pill-style button CSS
- [x] **9.15** Update copyright footer link
- [x] **9.16** Fix horizon2020 CSS/JS/font 404s on GitHub Pages (Hugo Pipes `relURL` fix)
- [x] **9.17** Fix horizon2020 divider regression (theme context passing)
- [x] **9.18** Redesign frontpage — two-column CSS grid, scroll-snap, remove overlay/popup system

---

## Phase 4 — Audit & Accessibility (impeccable first-pass)

- [x] **10.0** Color system and contrast fixes (Audit Groups A + C)
  - [x] 10.1 Replace 15 remaining hardcoded purple values
  - [x] 10.2 Replace ~26 hardcoded grey/neutral values with design tokens
  - [x] 10.3 Move `:root` design tokens to top of CSS
  - [x] 10.4 Copyright footer contrast improvement
  - [x] 10.5 Author footer copyright contrast improvement

- [x] **11.0** Accessibility (Audit Group B)
  - [x] 11.1 Skip-to-content link in all 8 layout files
  - [x] 11.2 Nav panel focus management (save/restore trigger, focus first link)
  - [x] 11.3 `role="dialog" aria-modal="true" aria-label` on nav panel
  - [x] 11.4 `aria-label="Story navigation"` on nav strip
  - [x] 11.5 `aria-label` on audio element
  - [x] 11.6 Fix bounce animation reduced-motion coverage
  - [x] 11.7 Card/featured image alt text `alt=""` (decorative)

- [x] **12.0** Bugs and performance (Audit Groups D + E)
  - [x] 12.1 Fix `fileExists` author photo check
  - [x] 12.2 Remove `console.log` from production JS
  - [x] 12.3 `.woff2` primary font format with `.woff` fallback
  - [x] 12.4 `min-height: 100svh` progressive enhancement

---

## Phase 5 — Typography & Roundels

- [x] **13.0** Basalte display font (Audit Group H)
  - [x] 13.1 Three Basalte `@font-face` declarations (Fond, Multicolor, Volume)
  - [x] 13.2 Update `--font-secondary` token
  - [x] 13.3 Apply Basalte to headings
  - [x] 13.4 Swap hero from Multicolor → Volume (COLR/CPAL fix)

- [x] **14.0** Roundels and logo (Audit Group I)
  - [x] 14.1 10 designer SVG roundels
  - [x] 14.2 Detach genre from roundels
  - [x] 14.3 MYTH(roundel)AXIS logotype with CSS mask
  - [x] 14.4 Header logotype with scroll fade
  - [x] 14.5 Issue roundel in story-header-minimal
  - [x] 14.6 Nav panel roundels (brand top, issue bottom)
  - [x] 14.7 All roundel paths updated (drop size suffixes, default MythaxisTarget)
  - [x] 14.8 Story footer roundel (240px, left-aligned within 700px)
  - [x] 14.9 Non-story article divider (issue roundel 60px)
  - [x] 14.10 Non-story footer roundel (MythaxisIcon brand)

---

## Phase 6 — Polish

- [x] **15.0** Polish (Audit Groups F + G)
  - [x] 15.1 Remove `-webkit-overflow-scrolling: touch`
  - [x] 15.2 Mobile scroll-snap `mandatory` → `proximity`
  - [x] 15.3 z-index tokens (`var(--z-progress)`)
  - [x] 15.4 Scroll indicator gentle bounce
  - [x] 15.5 `aria-controls` on burger and logotype triggers

- [x] **16.0** Additional fixes
  - [x] 16.1 CSS `::first-letter` drop caps (issue-45, `<glyph>` kept for horizon2020)
  - [x] 16.2 Author footer photo centering on mobile
  - [x] 16.3 Nav panel denser spacing, larger logotype
  - [x] 16.4 Nav strip weight-based ordering fix
  - [x] 16.5 Reading progress bar in minimal header (replaces border-bottom)
  - [x] 16.6 Story reading/footer padding tightened

---

## Phase 7 — Story End & Headers

- [x] **17.0** Story-end fixed backdrop and hover polish
  - [x] 17.1 Fixed viewport backdrop image (replacing parallax JS)
  - [x] 17.2 Non-story page footer backdrop (same technique in `page-single.html`)
  - [x] 17.3 Author/copyright hover darkening transitions

- [x] **18.0** Intro positioning and header tweaks
  - [x] 18.1 Scroll offset fix (`scroll-padding-top: 3.5rem`)
  - [x] 18.2 Sticky header restyle (color-mix background, white text, larger roundel)
  - [x] 18.3 9-position intro padding system

---

## Phase 8 — Unified Nav & Translucency

- [x] **19.0** Unified nav menu — replace burger with Mythaxis logotype trigger
  - [x] 19.1 Remove burger button HTML, CSS, and JS
  - [x] 19.2 Add logotype trigger to story-header-minimal
  - [x] 19.3 Simplify JS to single trigger class
  - [x] 19.4 Nav panel restyle (250px, centered logotype)
  - [x] 19.5 Logotype/roundel plain black, fade on hover, close on click
  - [x] 19.6 Menu links: rounded border hover/active states
  - [x] 19.7 Story-level `colorScheme` override (per-story color theming)
  - [x] 19.8 Fix close-panel focus restore scroll jump

- [x] **20.0** Translucent headers and mobile polish
  - [x] 20.1 Shorten landing cover gradient (feather bottom 25% only)
  - [x] 20.2 Translucent sticky header (backdrop-filter blur, frosted glass)
  - [x] 20.3 Translucent story-header-minimal
  - [x] 20.4 Sticky header on all pages, minimal header triggers on hero scroll-out
  - [x] 20.5 Mobile: roundel-only menu triggers, tighter spacing
  - [x] 20.6 Mobile intro roundel 5rem
  - [x] 20.7 Fix sticky header on non-landing pages

---

## Phase 9 — Frontpage Layout System

- [x] **21.0** Frontpage layout system with snake-corner grid
  - [x] 21.1 `cardLayout` frontmatter system (`stock-left`, `stock-right`, `editorial-center`, `featured-left`, `review-right`)
  - [x] 21.2 Transition-based snake rounded corners
  - [x] 21.3 Scroll-snap keyboard navigation
  - [x] 21.4 Logotype restyle on frontpage

---

## Phase 10 — Content Types

- [x] **22.0** Review and editorial content types
  - [x] 22.1 New archetypes for review and editorial
  - [x] 22.2 Layout wrappers (`review/single.html` → `article-single`, `editorial/single.html` → `page-single`)
  - [x] 22.3 Frontpage integration (auto-alternate stock+reviews, editorials with explicit `cardLayout`)
  - [x] 22.4 Nav strip filtering (stock + review only, excludes editorials)
  - [x] 22.5 Shared images system (`/static/images/shared/`)
  - [x] 22.6 Catalogue pages (reviews, editorials, authors taxonomy)
  - [x] 22.7 Content migration (issues 43-45)

---

## Phase 11 — Audio Remote

- [x] **23.0** Audio remote button
  - [x] 23.1 CSS 3D flip card styles and pulse animation
  - [x] 23.2 Conditional audio-remote markup in sticky header
  - [x] 23.3 `audio-remote.js` — flip state machine, peek animation, playback control
  - [x] 23.4 Conditional script loading (only when `audio` frontmatter present)
  - [x] 23.5 Reduced-motion fallback
  - [x] 23.6 Mobile sizing fixes

---

## Phase 12 — Catalogue Enhancement

- [x] **24.0** Catalogue and listings page upgrade
  - [x] 24.1 A-Z alphabetical navigation with pill links
  - [x] 24.2 Genre pill navigation with jump links
  - [x] 24.3 Catalogue-nav dot menu (Catalogue, Reviews, Editorials, Authors, Genres)
  - [x] 24.4 "Random" buttons with configurable labels
  - [x] 24.5 Back-to-top SVG triangles in group headings
  - [x] 24.6 Story-end footers with feathered issue image
  - [x] 24.7 Issue roundel dividers between content and footer

---

## Phase 13 — Chromatic Font

- [x] **25.0** Basalte Fond + Volume chromatic font
  - [x] 25.1 Replace Multicolor with Volume (fixes iOS Safari COLR issue)
  - [x] 25.2 Three-layer stack: `text-shadow` (accent) → Fond (primary) → `::after` Volume (secondary)
  - [x] 25.3 Introduce `--color-accent` (third colour token from `colorScheme.accent` frontmatter)
  - [x] 25.4 Extend chromatic treatment to all frontpage titles (logotype, featured, content-row)
  - [x] 25.5 `data-text` attribute for `content: attr(data-text)` on `::after`
  - [x] 25.6 Story-level `colorScheme.accent` overrides
  - [x] 25.7 Print styles hide `::after` overlays
  - Commits: `c85bb154`, `f10356c1`, `c9b23fa2`

---

## Phase 14 — Meta & Docs

- [x] **26.0** Meta tags and documentation
  - [x] 26.1 Fix DC.Creator, add OG/DC metadata
  - [x] 26.2 Frontmatter and meta tags reference doc
  - [x] 26.3 Use story image in minimal sticky header instead of issue image
  - [x] 26.4 Performance cleanup (remove unused fonts, defer scripts, delete dead JS)
  - [x] 26.5 Active states, touch targets, hardcoded color sweep
  - [x] 26.6 Fix story-header-minimal invisible content on iOS Safari
  - [x] 26.7 Make intro logotype clickable (scrolls to content)

---

## Phase 15 — Third-Pass Audit (impeccable)

- [x] **27.0** Comprehensive audit (third pass) — score 6.5 → 8.0/10
  - [x] 27.1 Anti-patterns verdict: PASS (purple gradients eliminated, gradient text replaced, card hover lifts removed)
  - [x] 27.2 16 of 24 first-pass issues resolved
  - [x] 27.3 Design critique: AI slop verdict PASS — "no AI tells detected"
  - See: `3.nebula2026-impeccable/AUDIT.md`, `3.nebula2026-impeccable/design-critique.md`

---

## Remaining — Outstanding Items

### Accessibility & Contrast (from audit)

- [x] **28.0** Fix remaining audit issues
  - [x] 28.1 Copyright text contrast — `--color-text-muted` from `#999999` (2.85:1) to `#767676` (4.54:1 WCAG AA pass)
  - [x] 28.2 Story header text contrast — text-shadow on byline and abstract, gradient overlay strengthened (30%→65%)
  - [x] 28.3 `--color-text-muted` stronger colour — `#767676` passes WCAG AA contrast test
  - [x] 28.4 `aria-label="Scroll to content"` on scroll indicator, logotype link, and subtitle pill

### Roundel & Logotype Colour

- [x] **29.0** Main roundel background colour / drop shadow with logotype
  - [x] 29.1 Secondary colour background disc on logotype roundel (via `::before`)
  - [x] 29.2 Accent colour drop shadow on roundel disc (`box-shadow: 0.06em`)
  - [x] 29.3 Hover uses `filter: brightness()` instead of opacity (no transparency leak)

- [x] **30.0** Roundel/chapterMarker default cascade from config.yaml
  - [x] 30.1 Renamed config keys to `issueRoundel` / `chapterMarker` (matches frontmatter names)
  - [x] 30.2 All 8 templates cascade: page → section → `site.Params` → hardcoded `MythaxisIcon`
  - [x] 30.3 JS default updated to `MythaxisIcon`

### Chromatic Font

- [x] **31.0** Fix chromatic font overlay on multi-line titles
  - [x] 31.1 Add `display: block` to frontpage title links (fixes Volume `::after` stacking)
  - [x] 31.2 Increase text-shadow offset from `0.04em` to `0.06em` on all chromatic titles

### Intro & Footer Polish

- [x] **31.5** Subtitle frosted pill background (`width: fit-content`, subtle blur)
- [x] **31.6** Intro cover feather gradient uses `--color-accent`
- [x] **31.7** Fix listings page copyright footer overlap

### Mobile Cover Art

- [x] **43.0** Mobile variant cover image (`_mob` suffix) on landing/issue hero
  - [x] 43.1 In `intro.html`, derive `_mob` filename from `image` frontmatter (e.g. `cover.jpg` → `cover_mob.jpg`)
  - [x] 43.2 Use Hugo `fileExists` to check for mobile variant in `content/{section}/`
  - [x] 43.3 Wrap hero `<img>` in `<picture>` with `<source media="(max-width: 736px)">` when `_mob` exists
  - [x] 43.4 Falls back to regular image when no `_mob` variant — zero breakage for existing issues
  - [x] 43.5 Landing hero only (not story hero)

### Author Footer Restructure

- [x] **42.0** Author footer — support text, "thanks for reading", text sizing
  - [x] 42.1 Move `.nebula-support-text` from story-footer into author-footer (between author-card and copyright-info)
  - [x] 42.2 Add "thanks for reading" line above support-text: "*Thanks for reading - but we'd love feedback! Let us know what you think of **{Title}** at [Bluesky](https://bsky.app/profile/mythaxis.bsky.social).*" (hardcoded link, dynamic story title)
  - [x] 42.3 Order: author-card → thanks-for-reading → support-text → copyright-info
  - [x] 42.4 Size thanks-for-reading and support-text to match body content font size
  - [x] 42.5 Increase `.nebula-author-bio` font size to match body content (was 0.875rem → 1.125rem)
  - [x] 42.6 Leave `.nebula-copyright-text` small — no change

### Intro & Frontpage Polish

- [x] **44.0** Intro subtitle position override
  - [x] 44.1 Add `introSubtitlePosition: left|center|right` frontmatter
  - [x] 44.2 CSS override classes with specificity to beat `:has()` rules

- [x] **45.0** Frontpage card link control
  - [x] 45.1 Add `cardLink: true|false` frontmatter — disables `<a>` on image + title
  - [x] 45.2 Fallback to `<span>` with same chromatic styling when `cardLink: false`
  - [x] 45.3 CSS `span` selectors mirror `a` selectors for content-row titles

- [x] **46.0** Frontpage title and author size bump
  - [x] 46.1 Content-row titles: `clamp(1.375rem, 2vw+0.5rem, 1.625rem)`, mobile `1.5rem`
  - [x] 46.2 All author names: `1.125rem` (split-lead, content-row, featured)

### Frontpage

- [ ] **32.0** Featured row + editorial card on frontpage — plan complete, see `PLAN-featured-editorial-cards.md`
  - [x] 32.1 Design: **featured** = image-as-background hero (dark overlay, light text); **editorial** = pill border, inset image
  - [ ] 32.2 Add `--featured` modifier class to content-row.html
  - [ ] 32.3 CSS: featured hero card (~30 lines), editorial pill card (~30 lines), mobile adjustments
  - [ ] 32.4 Add `cardLayout: editorial-left` to issue-45 editorial frontmatter
  - [ ] 32.5 Test all variants (featured/editorial x left/right/center) at mobile + desktop

### Menu, TOC & Editorial System

> Plan: `PLAN-menu-editorial-toc.md`

- [ ] **33.0** Nav panel menu — Hugo native `menus: issue` with fallback
  - [ ] 33.1 Update `nav.html`: iterate `site.Menus.issue` filtered to current section
  - [ ] 33.2 Fallback: if no `menus: issue` items, use legacy slug query (`slug IN ("editorial", "contents")`)
  - [ ] 33.3 Add `menus: issue` to congratulations issue content (contents.md, editorial.md if needed)
  - [ ] 33.4 Test: congratulations menu shows items; issue-44 still works via fallback; horizon2020 unaffected

- [ ] **34.0** Auto-TOC page with editorial preamble and bespoke design
  - [ ] 34.1 Create `toc-page.html` partial — dispatched from `page-single.html` when `slug == "contents"`
  - [ ] 34.2 Editorial preamble: find editorial page in section, inject `.Content` as text-only preamble (no image)
  - [ ] 34.3 Auto-TOC: query section pages (stock + review), sort by weight, render as pill-shaped items
  - [ ] 34.4 Pill design: title + author, per-story `colorScheme.primary` accent, Basalte chromatic font
  - [ ] 34.5 Content type visual distinction: reviews/editorials noticeably different from stock stories
  - [ ] 34.6 Manual content: if `contents.md` has body text, render between preamble and auto-TOC
  - [ ] 34.7 TOC works without editorial page (preamble simply omitted)
  - [ ] 34.8 Responsive: stacked pills on mobile, grid/stagger on desktop
  - [ ] 34.9 Hover/focus micro-interactions
  - [ ] 34.10 Backward compat: horizon2020 contents pages render via their own `page-single.html` — unaffected

### Hugo Optimisation

- [x] **35.0** Hugo Pipes — image compression
  - [x] 35.1 Research Hugo Pipes image processing — plan complete, see `PLAN-image-compression.md`
- [x] **36.0** Hugo Pipes — combine JavaScript into single bundle
  - [x] 36.1 Move 9 JS files from `static/js/nebula2026/` to `assets/js/nebula2026/`
  - [x] 36.2 Bundle 7 core scripts via `resources.Concat` + `minify` + `fingerprint` → `nebula2026.bundle.min.{hash}.js` (20.5 KB → 8.4 KB, 7 requests → 1)
  - [x] 36.3 Conditional scripts (audio-remote, submissions-status) piped individually with minify + fingerprint
- [x] **37.0** Hugo theme switch capability — assessed, recommendation: **keep as-is**
  - [x] 37.1 Evaluate module refactor — adds complexity with no functional benefit
  - [x] 37.2 Research Hugo theme composition — no native per-section switching; custom dispatch is canonical
  - [x] 37.3 Assess separation effort — possible but risky (asset paths, shared dispatch coupling)
  - [x] 37.4 Document: `PLAN-theme-refactor-assessment.md`

### Submissions

- [x] **38.0** Submissions open/closed JavaScript
  - [x] 38.1 Extract inline script to `static/js/nebula2026/submissions-status.js`
  - [x] 38.2 Conditional loading in `scripts.html` (submissions page only)
  - [x] 38.3 Date range styling: bold + "See how to submit" link on current window, strikethrough + dimmed on past windows, future unchanged
  - [x] 38.4 Old `htmlhead-scripts-overrides.html` gutted (no-op stub for compat)
  - [x] 38.5 Verified: correctly shows CLOSED with January struck through (March 30th)

### Image Documentation

- [ ] **39.0** Document image pixel dimensions and ratios
  - [ ] 39.1 Cover art (issue landing hero) — document dimensions, aspect ratio, recommended size
  - [ ] 39.2 Stock images on frontpage content rows — document dimensions for left/right layouts
  - [ ] 39.3 Stock images on story page (story-header hero) — document dimensions
  - [ ] 39.4 Featured row images — document recommended size
  - [ ] 39.5 Review/editorial images — document any differences from stock
  - [ ] 39.6 Author photos — document recommended size and aspect ratio
  - [ ] 39.7 Create a reference doc or add to existing frontmatter docs

### Documentation & Archive

- [ ] **40.0** Tidy up and archive theming documentation
  - [ ] 40.1 Organise docs: remove stale/duplicate files, consolidate references
  - [ ] 40.2 Zip the documentation folder
  - [ ] 40.3 Place the zip in the issue MP3 files location (for interested readers)

### Final

- [ ] **41.0** Final regression check and deploy
  - [ ] 41.1 Full smoke test: homepage, issue landing, story page, old horizon2020 issue, archive, authors
  - [ ] 41.2 Mobile test on real device — parallax, reading progress, drop caps, scroll-snap
  - [ ] 41.3 No console errors on any page type
  - [ ] 41.4 Cross-browser check (Safari, Chrome, Firefox)
  - [ ] 41.5 `git merge poc` into `master`
  - [ ] 41.6 `git push origin master` — triggers GitHub Pages build
  - [ ] 41.7 Smoke-test live site on real device

- [ ] **17.0 optional** Clean up duplicate images in issue folders (after confirming shared images work)

---

## Future — Editor Ideas (post-launch)

> Recorded from Andrew's late-night brainstorm (via WhatsApp to Marty), 2026-03-30. Not blocking launch — these are ideas for a later site revision.

- [ ] **F1.0** Retrofit nebula2026 build to all post-2020 issues
  - [ ] F1.1 Evaluate effort to apply nebula2026 theme to issues 40–44
  - [ ] F1.2 Content/frontmatter migration for older issues
  - [ ] F1.3 Verify old content renders correctly in new theme

- [ ] **F2.0** Swipe left/right issue navigation (mobile)
  - [ ] F2.1 Swipe left → issue selector panel (plus archive button for legacy magazine)
  - [ ] F2.2 Swipe right → genre/author story menu
  - [ ] F2.3 Make default `mythaxis.co.uk` auto-load latest issue (`/issue##`)
  - [ ] F2.4 Research feasibility of cross-issue card grid (e.g. issue40/story3 → issue41/story3)
  - [ ] F2.5 Graceful fallback when issue story counts differ

- [ ] **F3.0** "Mythaxis TOC TOC" — sideways-scrolling catalogue browser
  - [ ] F3.1 TikTok-style horizontal swipe UI for browsing the catalogue
  - [ ] F3.2 "Swipe right to like, swipe left for the TOC" — reader feedback/engagement mechanic
  - [ ] F3.3 Could be a wrapper UI over existing catalogue data
  - [ ] F3.4 Unique web feature — worth prototyping as a standalone experiment

> *"The mythaxis tinder grinder, swipe right for story love"*
