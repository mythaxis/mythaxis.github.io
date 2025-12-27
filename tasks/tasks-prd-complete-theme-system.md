# Tasks: Complete Theme Switching System

Generated from `prd-complete-theme-system.md`

## Relevant Files

### Phase 1: Partial Coverage
- `layouts/partials/themes/horizon2020/catalogue-content.html` - Catalogue page content for legacy theme
- `layouts/partials/themes/nebula2025/catalogue-content.html` - Catalogue page content for new theme
- `layouts/partials/themes/horizon2020/editorials-content.html` - Editorials page content for legacy theme
- `layouts/partials/themes/nebula2025/editorials-content.html` - Editorials page content for new theme
- `layouts/partials/themes/horizon2020/authors-content.html` - Authors index for legacy theme
- `layouts/partials/themes/nebula2025/authors-content.html` - Authors index for new theme
- `layouts/partials/themes/horizon2020/genres-content.html` - Genres index for legacy theme
- `layouts/partials/themes/nebula2025/genres-content.html` - Genres index for new theme
- `layouts/partials/themes/horizon2020/authorfooter.html` - Author bio section for legacy theme
- `layouts/partials/themes/nebula2025/authorfooter.html` - Author bio section for new theme
- `layouts/partials/themes/horizon2020/copyright.html` - Footer copyright for legacy theme
- `layouts/partials/themes/nebula2025/copyright.html` - Footer copyright for new theme
- `layouts/partials/themes/horizon2020/catalogue-nav.html` - Catalogue navigation for legacy theme
- `layouts/partials/themes/nebula2025/catalogue-nav.html` - Catalogue navigation for new theme
- `layouts/partials/themes/horizon2020/divider.html` - Section dividers for legacy theme
- `layouts/partials/themes/nebula2025/divider.html` - Section dividers for new theme
- `layouts/catalogue/list.html` - Main catalogue listing (refactor to use dispatcher)
- `layouts/catalogue/editorials.html` - Editorials listing (refactor to use dispatcher)
- `layouts/authors/taxonomy.html` - Author index (refactor to use dispatcher)
- `layouts/genres/taxonomy.html` - Genre index (refactor to use dispatcher)
- `layouts/partials/authorfooter.html` - Dispatcher wrapper for author footer
- `layouts/partials/copyright.html` - Dispatcher wrapper for copyright
- `layouts/partials/catalogue-nav.html` - Dispatcher wrapper for catalogue nav
- `layouts/partials/postcustom.html` - Dispatcher wrapper for dividers

### Phase 2: Asset Separation (CSS/Images)

**New structure:**
```
static/
├── assets/
│   ├── css/
│   │   └── base.css              # Shared: fonts, image tricks, author footer
│   └── fonts/                    # Starcraft fonts (used by both, referenced by base.css)
├── images/
│   ├── toplist.svg               # Legacy decorative header (horizon2020)
│   └── divider.svg               # Legacy section divider (horizon2020)
└── themes/
    ├── horizon2020.css           # Legacy theme styles (Starcraft, intro, header)
    └── nebula2025.css            # Modern theme styles (extracted from inline)
```

**Files to modify:**
- `static/assets/css/base.css` - New file with shared styles extracted from overrides.css
- `static/themes/horizon2020.css` - New file with horizon-specific styles
- `static/themes/nebula2025.css` - New file with nebula styles (from inline)
- `static/assets/css/overrides.css` - Will be replaced by base.css
- `layouts/partials/themes/horizon2020/styles.html` - Update to load base.css + horizon2020.css
- `layouts/partials/themes/nebula2025/styles.html` - Update to load base.css + nebula2025.css

### Phase 3: Content Migration
- `content/issue-23/__index.md` through `content/issue-43/__index.md` - Add theme param

### Phase 4: Documentation
- `docs/THEME-SYSTEM.md` - Theme system documentation
- `layouts/partials/themes/README.md` - Theme development guide

### Notes

- Unit tests are not applicable for Hugo templates
- Use `hugo server` to visually verify changes
- Use `hugo --templateMetrics` to monitor build performance
- JavaScript bundle remains shared between themes (no changes needed)

---

## Tasks

- [ ] 1.0 Phase 1: Complete Partial Coverage for Catalogue/Taxonomy Pages
  - [x] 1.1 Create `horizon2020/catalogue-content.html` partial with current catalogue styling
  - [x] 1.2 Create `nebula2025/catalogue-content.html` partial with modern styling
  - [x] 1.3 Refactor `catalogue/list.html` to use theme dispatcher for content area
  - [x] 1.4 Refactor `catalogue/editorials.html` to use theme dispatcher for content area
  - [x] 1.5 Refactor `authors/taxonomy.html` to use theme dispatcher for content area
  - [x] 1.6 Refactor `genres/taxonomy.html` to use theme dispatcher for content area
  - [ ] 1.7 Test all catalogue/taxonomy pages with both themes

- [ ] 2.0 Phase 1: Refactor Supporting Partials
  - [ ] 2.1 Create `horizon2020/authorfooter.html` from current authorfooter.html
  - [ ] 2.2 Create `nebula2025/authorfooter.html` with modern styling
  - [ ] 2.3 Update `partials/authorfooter.html` to use theme dispatcher
  - [ ] 2.4 Create `horizon2020/copyright.html` from current copyright.html
  - [ ] 2.5 Create `nebula2025/copyright.html` with modern styling
  - [ ] 2.6 Update `partials/copyright.html` to use theme dispatcher
  - [ ] 2.7 Create `horizon2020/catalogue-nav.html` from current catalogue-nav.html
  - [ ] 2.8 Create `nebula2025/catalogue-nav.html` with modern styling
  - [ ] 2.9 Update `partials/catalogue-nav.html` to use theme dispatcher
  - [ ] 2.10 Create `horizon2020/divider.html` using toplist.svg/divider.svg
  - [ ] 2.11 Create `nebula2025/divider.html` using CSS/SVG gradient dividers
  - [ ] 2.12 Update `partials/postcustom.html` to use theme dispatcher
  - [ ] 2.13 Update article-single.html partials to use divider partial instead of inline SVG refs

- [ ] 3.0 Phase 2: Separate Static CSS Assets
  - [ ] 3.1 Create `static/themes/` directory
  - [ ] 3.2 Analyze `overrides.css` and categorize styles as shared vs horizon-specific
  - [ ] 3.3 Create `static/assets/css/base.css` with shared styles (fonts, image tricks, author footer, blockquote, TEI)
  - [ ] 3.4 Create `static/themes/horizon2020.css` with legacy-specific styles (Starcraft intro/header, nav background, button hover)
  - [ ] 3.5 Extract inline styles from `nebula2025/styles.html` to `static/themes/nebula2025.css`
  - [ ] 3.6 Update `horizon2020/styles.html` to load base.css + horizon2020.css + dynamic background only
  - [ ] 3.7 Update `nebula2025/styles.html` to load base.css + nebula2025.css + dynamic background only
  - [ ] 3.8 Delete or archive `static/assets/css/overrides.css` (replaced by base.css)
  - [ ] 3.9 Verify all font paths work correctly in base.css
  - [ ] 3.10 Test both themes render correctly with new CSS structure

- [ ] 4.0 Phase 3: Content Migration
  - [ ] 4.1 Determine cutoff issue for theme switch (confirm with stakeholder)
  - [ ] 4.2 Create script or batch process to add `theme: horizon2020` to legacy issues
  - [ ] 4.3 Add `theme: horizon2020` to issues 23-43 (or determined cutoff)
  - [ ] 4.4 Remove test `theme: horizon2020` from issue-44 if keeping as nebula2025
  - [ ] 4.5 Verify homepage renders correctly with currentIssue theme
  - [ ] 4.6 Verify archive page renders correctly
  - [ ] 4.7 Spot-check 3-5 legacy issues for visual regressions

- [ ] 5.0 Phase 4: Documentation & QA
  - [ ] 5.1 Create `docs/THEME-SYSTEM.md` with architecture overview
  - [ ] 5.2 Document how to set theme per-section
  - [ ] 5.3 Document available theme params (intro styling, colors, etc.)
  - [ ] 5.4 Create `layouts/partials/themes/README.md` for theme developers
  - [ ] 5.5 Document how to create a new theme
  - [ ] 5.6 Run `hugo --templateMetrics` and document build performance
  - [ ] 5.7 Test all page types on mobile viewport
  - [ ] 5.8 Final visual review of nebula2025 on all page types
  - [ ] 5.9 Final visual comparison of horizon2020 vs production
  - [ ] 5.10 Create before/after screenshots for documentation
