---
title: Complete Theme Switching System
date: 2024-12-27
status: draft
---

# PRD: Complete Theme Switching System for Mythaxis Magazine

## Introduction/Overview

The Mythaxis Magazine Hugo site needs a complete theme switching system that allows different sections (issues) to use different visual themes. The foundation has been laid with a `theme-dispatch` partial system and two themes (`horizon2020` for legacy issues, `nebula2025` as the new default).

This PRD covers the remaining work needed to make the theme system complete, production-ready, and maintainable.

## Goals

1. **Complete coverage**: All page types and components should be theme-aware
2. **Backward compatibility**: Legacy issues must render identically to current production
3. **Clean separation**: Theme-specific code should be isolated in theme folders
4. **Easy maintenance**: Adding new themes or modifying existing ones should be straightforward
5. **Performance**: No significant build time or page load regressions
6. **Documentation**: Clear guidance for editors on how to use and extend the system

## Current State

### Completed
- Theme dispatcher (`partials/theme-dispatch.html`)
- Site-wide default in `config.yaml` (`defaultTheme: nebula2025`)
- Per-section override via `theme:` front matter param
- Theme-specific partials for both themes:
  - `intro.html`
  - `header.html`
  - `nav.html`
  - `styles.html`
  - `featured.html`
  - `list-item.html`
  - `article-single.html`
  - `page-single.html`

### Not Yet Refactored
- Catalogue pages (`catalogue/list.html`, `catalogue/editorials.html`)
- Taxonomy pages (`authors/taxonomy.html`, `genres/taxonomy.html`)
- Supporting partials (`authorfooter.html`, `copyright.html`, `catalogue-nav.html`)
- Static CSS (`overrides.css`) - currently shared between themes
- Decorative images (`toplist.svg`, `divider.svg`) - horizon2020-specific
- Content updates (batch-set `theme: horizon2020` on legacy issues)

## Functional Requirements

### 1. Catalogue & Taxonomy Pages
1.1. `catalogue/list.html` must use theme dispatcher for content area
1.2. `catalogue/editorials.html` must use theme dispatcher for content area
1.3. `authors/taxonomy.html` must use theme dispatcher for content area
1.4. `genres/taxonomy.html` must use theme dispatcher for content area
1.5. Each theme must have a `catalogue-content.html` partial
1.6. Tables and lists must be styled appropriately per theme

### 2. Supporting Partials
2.1. `authorfooter.html` should have theme variants (different styling)
2.2. `copyright.html` should have theme variants (styling only)
2.3. `catalogue-nav.html` should have theme variants (styling/layout)
2.4. `postcustom.html` should have theme variants (different dividers)

### 3. Static Assets Separation
3.1. Create theme-specific asset folders: `static/themes/horizon2020/`, `static/themes/nebula2025/`
3.2. Move `toplist.svg` and `divider.svg` to `horizon2020` assets
3.3. Create nebula2025 equivalents (or use CSS-based alternatives)
3.4. Split `overrides.css` into theme-specific files
3.5. Update partials to reference theme-specific assets

### 4. Content Migration
4.1. Add `theme: horizon2020` to all issues prior to the switchover point
4.2. Determine the switchover issue (recommendation: current issue onwards uses nebula2025)
4.3. Document which issues use which theme

### 5. Theme Configuration
5.1. Each theme should support its own set of configurable params
5.2. Create a theme config partial that validates/defaults theme params
5.3. Document available params per theme in a README

### 6. Quality Assurance
6.1. Visual regression testing for horizon2020 (must match current production)
6.2. All page types tested with nebula2025
6.3. Mobile responsiveness verified for both themes
6.4. Performance benchmarking (build time, page load)

## Non-Goals (Out of Scope)

- Runtime theme switching (JavaScript-based toggle) - not needed
- User preference storage - not applicable
- Dark mode variants - future enhancement
- New themes beyond horizon2020 and nebula2025 - future work
- Changing the base Massively theme - only overrides

## Design Considerations

### File Structure (Target State)
```
layouts/
├── partials/
│   ├── theme-dispatch.html
│   ├── themes/
│   │   ├── horizon2020/
│   │   │   ├── intro.html
│   │   │   ├── header.html
│   │   │   ├── nav.html
│   │   │   ├── styles.html
│   │   │   ├── featured.html
│   │   │   ├── list-item.html
│   │   │   ├── article-single.html
│   │   │   ├── page-single.html
│   │   │   ├── catalogue-content.html   # NEW
│   │   │   ├── authorfooter.html        # NEW
│   │   │   ├── copyright.html           # NEW
│   │   │   └── divider.html             # NEW (replaces postcustom)
│   │   └── nebula2025/
│   │       ├── (same structure)
│   │       └── ...
│   └── functions/
│       └── getCurrentTheme.html

static/
├── themes/                              # NEW
│   ├── horizon2020/
│   │   ├── css/
│   │   │   └── theme.css
│   │   └── images/
│   │       ├── toplist.svg
│   │       └── divider.svg
│   └── nebula2025/
│       └── css/
│           └── theme.css
```

### Theme Param Schema
Each section's `__index.md` can specify:
```yaml
theme: horizon2020 | nebula2025  # Required for legacy, optional for new
# Theme-specific params (optional):
intro:
  justify_content: flex-start
  logo:
    color: '#f1401d'
  # ... etc
```

## Technical Considerations

1. **Hugo Template Lookup**: The dispatcher uses `templates.Exists` to check for theme partials before falling back
2. **Asset Paths**: Theme-specific assets should use `relURL` with theme path prefix
3. **CSS Specificity**: nebula2025 classes use `.nebula-*` prefix to avoid conflicts
4. **Build Performance**: Additional partials may slightly increase build time; monitor with `hugo --templateMetrics`

## Success Metrics

1. Zero visual regressions on production pages when using horizon2020
2. All nebula2025 pages render correctly without horizon2020 artifacts
3. Build time increase < 10%
4. Theme switching requires only a single front matter change
5. Documentation allows a new developer to add a theme variant in < 1 hour

## Open Questions

1. What is the cutoff issue for nebula2025 adoption? (Issue 44? Issue 45?)
2. Should the archive page (`archive.md`) use a specific theme or follow currentIssue?
3. Are there any issues with unique styling that needs special handling?
4. Should we consider a "preview" mode for editors to see both themes?

## Implementation Phases

### Phase 1: Complete Partial Coverage
- Refactor remaining page templates to use dispatcher
- Create theme variants for catalogue/taxonomy pages
- Create theme variants for supporting partials

### Phase 2: Asset Separation  
- Create theme asset folder structure
- Split and migrate CSS
- Migrate/create theme-specific images

### Phase 3: Content Migration
- Audit all issues for special styling needs
- Batch-update legacy issues with `theme: horizon2020`
- Verify no regressions

### Phase 4: Documentation & QA
- Create theme system README
- Visual regression testing
- Performance benchmarking
- Editor documentation
