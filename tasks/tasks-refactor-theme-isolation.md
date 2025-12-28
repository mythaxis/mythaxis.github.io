# Tasks: Complete Theme Isolation Refactoring

Generated from `REFACTOR-THEME-ISOLATION-PLAN.md`

## Overview

Complete isolation of theme CSS and JavaScript so themes are fully independent with zero shared dependencies.

## Goals

1. **Horizon2020 Independence**: Self-contained CSS + JS (SCSS, Starcraft fonts, jQuery bundle)
2. **Nebula2025 Simplicity**: Plain CSS only (no SCSS), minimal JS (no jQuery if not needed)
3. **Zero Shared Assets**: No base.css, no shared JavaScript, complete separation
4. **Maintainability**: Each theme can be edited/deleted without affecting the other

## Relevant Files

### Files to Modify
- `layouts/partials/themes/horizon2020/styles.html` - Load complete horizon2020.css
- `layouts/partials/themes/nebula2025/styles.html` - Load complete nebula2025.css
- `static/themes/horizon2020.css` - Expand with base.css content
- `static/themes/nebula2025.css` - Expand with needed base styles
- `layouts/partials/htmlhead.html` - Conditional SCSS loading
- `layouts/partials/scripts/index.html` - Theme-aware script loading

### Files to Create
- `layouts/partials/themes/horizon2020/scripts.html` - jQuery bundle loading
- `layouts/partials/themes/nebula2025/scripts.html` - Minimal/modern JS loading
- `static/themes/nebula2025/js/nebula2025.js` - Modern vanilla JS (if needed)

### Files to Delete
- `static/assets/css/base.css` - Content merged into theme CSS files
- (Potentially) Unused JS files if nebula2025 doesn't need them

### Documentation to Update
- `docs/THEME-SYSTEM.md` - Updated architecture
- `docs/THEME-DEVELOPMENT-GUIDE.md` - Updated theme creation guide
- `docs/THEME-PERFORMANCE-METRICS.md` - New performance comparison

---

## Tasks

- [ ] 1.0 Phase 1: Merge base.css into horizon2020.css
  - [ ] 1.1 Read current static/assets/css/base.css (116 lines)
  - [ ] 1.2 Read current static/themes/horizon2020.css
  - [ ] 1.3 Create backup of horizon2020.css
  - [ ] 1.4 Prepend base.css content to horizon2020.css
  - [ ] 1.5 Fix font paths in merged file (from `../fonts/` to `../../assets/fonts/`)
  - [ ] 1.6 Add section comments for organization
  - [ ] 1.7 Update `layouts/partials/themes/horizon2020/styles.html` to remove base.css reference
  - [ ] 1.8 Test horizon2020 theme (issue 23, 30, 40)
  - [ ] 1.9 Verify fonts load correctly
  - [ ] 1.10 Verify author footer, blockquotes, glyphs, image tricks work
  - [ ] 1.11 Commit Phase 1 changes

- [ ] 2.0 Phase 2: Create standalone nebula2025.css (plain CSS)
  - [ ] 2.1 Audit what nebula2025 needs from base.css
    - [x] Blockquote styles (used in editorials)
    - [x] TEI glyph styles (used in stories via shortcode)
    - [x] Author footer styles (used on all articles)
    - [x] Image layout tricks (used for centered images)
    - [x] NOT NEEDED: Starcraft fonts (horizon2020 only)
  - [ ] 2.2 Read current static/themes/nebula2025.css
  - [ ] 2.3 Create new nebula2025.css structure:
    - [ ] 2.3a Add blockquote styles from base.css
    - [ ] 2.3b Add glyph styles from base.css
    - [ ] 2.3c Add author footer styles from base.css
    - [ ] 2.3d Add image layout tricks from base.css
    - [ ] 2.3e Keep all existing nebula2025 styles
    - [ ] 2.3f Add section comments for organization
  - [ ] 2.4 Verify NO Starcraft fonts in nebula2025.css
  - [ ] 2.5 Verify plain CSS only (no SCSS/SASS syntax)
  - [ ] 2.6 Update `layouts/partials/themes/nebula2025/styles.html` to remove base.css reference
  - [ ] 2.7 Test nebula2025 theme (issue 41, 44)
  - [ ] 2.8 Verify blockquotes styled correctly
  - [ ] 2.9 Verify glyphs render correctly
  - [ ] 2.10 Verify author footer displays correctly
  - [ ] 2.11 Verify image centering works
  - [ ] 2.12 Commit Phase 2 changes

- [ ] 3.0 Phase 3: Isolate SCSS to horizon2020 only
  - [ ] 3.1 Read current layouts/partials/htmlhead.html
  - [ ] 3.2 Identify SCSS compilation section (main.scss, noscript.scss)
  - [ ] 3.3 Update htmlhead.html to conditionally load SCSS based on theme:
    - [ ] 3.3a Get theme context using getThemeContext
    - [ ] 3.3b Only compile/load SCSS if theme == "horizon2020"
    - [ ] 3.3c Nebula2025 loads zero SCSS
  - [ ] 3.4 Alternative: Move SCSS loading to horizon2020/styles.html
  - [ ] 3.5 Test horizon2020 still loads main.css and noscript.css
  - [ ] 3.6 Test nebula2025 does NOT load any SCSS
  - [ ] 3.7 Check browser DevTools Network tab for CSS files loaded
  - [ ] 3.8 Verify no SCSS compilation errors
  - [ ] 3.9 Run `hugo --templateMetrics` to check performance
  - [ ] 3.10 Commit Phase 3 changes

- [ ] 4.0 Phase 4: Create theme-specific JavaScript loading
  - [ ] 4.1 Analyze current JavaScript usage:
    - [ ] 4.1a Check what horizon2020 needs (jQuery, scrollex, scrolly, util, main.js)
    - [ ] 4.1b Check what nebula2025 actually uses (check nav panel, scroll behavior)
    - [ ] 4.1c Identify if nebula2025 can work with vanilla JS
  - [ ] 4.2 Create `layouts/partials/themes/horizon2020/scripts.html`:
    - [ ] 4.2a Copy current scripts/index.html content
    - [ ] 4.2b Load jQuery bundle for horizon2020
  - [ ] 4.3 Create `layouts/partials/themes/nebula2025/scripts.html`:
    - [ ] 4.3a Determine minimal JS needs
    - [ ] 4.3b Create vanilla JS version if possible
    - [ ] 4.3c Or load lighter modern libraries
  - [ ] 4.4 Create theme dispatcher wrapper for scripts:
    - [ ] 4.4a Update layouts/partials/scripts/index.html
    - [ ] 4.4b Use theme-dispatch pattern for script loading
    - [ ] 4.4c Pass theme context to script partials
  - [ ] 4.5 Update layout templates to call script dispatcher:
    - [ ] 4.5a Check _default/single.html
    - [ ] 4.5b Check stock/single.html
    - [ ] 4.5c Check index.html
    - [ ] 4.5d Check other layout templates
  - [ ] 4.6 Test horizon2020 JavaScript functionality:
    - [ ] 4.6a Navigation panel works
    - [ ] 4.6b Smooth scrolling works
    - [ ] 4.6c Any image galleries work
  - [ ] 4.7 Test nebula2025 JavaScript functionality:
    - [ ] 4.7a Navigation panel works (if exists)
    - [ ] 4.7b No console errors
    - [ ] 4.7c Interactive elements work
  - [ ] 4.8 Commit Phase 4 changes

- [ ] 5.0 Phase 5: Cleanup and Documentation
  - [ ] 5.1 Delete obsolete files:
    - [ ] 5.1a Delete `static/assets/css/base.css`
    - [ ] 5.1b Verify no references to base.css remain
    - [ ] 5.1c Consider deleting unused JS files (if nebula2025 doesn't use them)
  - [ ] 5.2 Update documentation:
    - [ ] 5.2a Update `docs/THEME-SYSTEM.md`:
      - [ ] Remove base.css references
      - [ ] Update CSS architecture section
      - [ ] Update theme file structure
      - [ ] Document theme independence
    - [ ] 5.2b Update `docs/THEME-DEVELOPMENT-GUIDE.md`:
      - [ ] Update CSS guidelines
      - [ ] Remove SCSS requirements
      - [ ] Update theme creation steps
      - [ ] Update file structure examples
    - [ ] 5.2c Update `docs/THEME-PERFORMANCE-METRICS.md`:
      - [ ] Run new `hugo --templateMetrics`
      - [ ] Compare before/after performance
      - [ ] Document CSS file sizes
      - [ ] Document JS file sizes
  - [ ] 5.3 Run comprehensive tests:
    - [ ] 5.3a Test all page types with horizon2020
    - [ ] 5.3b Test all page types with nebula2025
    - [ ] 5.3c Test mobile responsiveness
    - [ ] 5.3d Check browser console for errors
    - [ ] 5.3e Verify no 404s for missing assets
  - [ ] 5.4 Performance benchmarking:
    - [ ] 5.4a Measure horizon2020 page load time
    - [ ] 5.4b Measure nebula2025 page load time
    - [ ] 5.4c Compare CSS bundle sizes
    - [ ] 5.4d Compare JS bundle sizes
    - [ ] 5.4e Document improvements
  - [ ] 5.5 Final verification:
    - [ ] 5.5a Homepage (nebula2025)
    - [ ] 5.5b Archive page (nebula2025)
    - [ ] 5.5c Issue 23 (horizon2020)
    - [ ] 5.5d Issue 44 (nebula2025)
    - [ ] 5.5e Article page horizon2020
    - [ ] 5.5f Article page nebula2025
    - [ ] 5.5g Catalogue page both themes
  - [ ] 5.6 Commit Phase 5 changes and documentation

## Success Criteria

### Complete Isolation
- [x] Assessment complete: nebula2025 needs blockquotes, glyphs, author footer, image tricks
- [ ] Horizon2020 loads ONLY: horizon2020.css + Massively SCSS + jQuery bundle
- [ ] Nebula2025 loads ONLY: nebula2025.css + minimal/zero JS
- [ ] No shared CSS between themes
- [ ] No shared JavaScript between themes
- [ ] Each theme is completely self-contained

### File Organization
- [ ] `static/themes/horizon2020.css` - Complete, includes former base.css content
- [ ] `static/themes/nebula2025.css` - Complete, plain CSS only, no SCSS
- [ ] `static/assets/css/base.css` - DELETED
- [ ] Theme-specific script partials created
- [ ] All documentation updated

### Functionality
- [ ] All horizon2020 pages render correctly
- [ ] All nebula2025 pages render correctly
- [ ] Fonts load correctly for both themes
- [ ] Blockquotes styled in both themes
- [ ] Glyphs render in both themes
- [ ] Author footers display in both themes
- [ ] Image tricks work in both themes
- [ ] Navigation functional in both themes
- [ ] No console errors
- [ ] No 404s for missing assets

### Performance
- [ ] Nebula2025 CSS smaller (no Starcraft fonts)
- [ ] Nebula2025 JS smaller (no jQuery if not needed)
- [ ] Build time acceptable (< 10% increase)
- [ ] Page load times documented
- [ ] Performance metrics updated

## Risks & Mitigation

### Risk: Breaking horizon2020 during merge
**Mitigation**:
- Create backups before changes
- Test after each phase
- Commit each phase separately for easy rollback

### Risk: Nebula2025 missing critical Massively styles
**Mitigation**:
- Audit compiled main.css output
- Test all page types thoroughly
- Check for layout issues
- Have plan to copy needed Massively styles

### Risk: JavaScript breaks without jQuery
**Mitigation**:
- Test interactive features first
- Identify actual JS dependencies
- Create vanilla JS alternatives if needed
- Keep jQuery as option if necessary

### Risk: Font paths break after merge
**Mitigation**:
- Carefully update relative paths
- Test font loading immediately
- Check browser DevTools Network tab
- Verify @font-face declarations

## Notes

- Each phase should be committed separately
- Test thoroughly before moving to next phase
- Phases can be rolled back independently if issues arise
- Document any unexpected findings during execution
- Performance testing should happen after Phase 3 and Phase 5

## Execution Timeline

This is a complex refactoring. Estimated time per phase:
- Phase 1: 30-45 min (merge + test)
- Phase 2: 45-60 min (audit + create + test)
- Phase 3: 30-45 min (conditional loading + test)
- Phase 4: 60-90 min (JS analysis + implementation + test)
- Phase 5: 30-45 min (cleanup + documentation)

**Total**: ~3-5 hours for complete refactoring with thorough testing
