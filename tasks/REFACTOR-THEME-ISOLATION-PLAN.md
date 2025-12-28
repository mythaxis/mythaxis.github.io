# Refactoring Plan: Complete Theme Isolation

## Goal
Completely isolate themes so they don't share any CSS or JavaScript dependencies.

## Current State Assessment

### CSS Architecture
```
Shared (loaded for all pages):
├── assets/scss/main.scss → compiled to main.css (Massively theme)
│   └── ~70 lines, complex SCSS with mixins, breakpoints, components
├── assets/scss/noscript.scss → compiled to noscript.css
└── static/assets/css/base.css (116 lines)
    ├── Starcraft fonts (@font-face × 5)
    ├── Blockquote styles
    ├── TEI glyph styles
    ├── Author footer styles
    └── Image layout tricks

Theme-specific (loaded per theme):
├── static/themes/horizon2020.css (2.3KB)
│   └── Starcraft intro/header, nav, button styles
└── static/themes/nebula2025.css (8.4KB)
    └── Modern gradient styles, card layouts
```

### JavaScript Architecture
```
Shared (loaded for all pages):
├── assets/js/jquery.min.js
├── assets/js/jquery.scrollex.min.js
├── assets/js/jquery.scrolly.min.js
├── assets/js/browser.min.js
├── assets/js/breakpoints.min.js
├── assets/js/util.js
└── assets/js/main.js
    └── Bundled in production as bundle.js
```

### Problems Identified

1. **SCSS Dependency for Nebula2025**
   - Nebula2025 relies on Massively theme SCSS
   - Heavy, complex system for a modern clean theme
   - User wants plain CSS only

2. **Shared Base CSS**
   - Starcraft fonts only used by horizon2020
   - Forces nebula2025 to load unnecessary fonts
   - TEI/image tricks may not be needed by both themes

3. **Shared JavaScript**
   - jQuery scrollex/scrolly may not be needed by nebula2025
   - Modern theme could use vanilla JS or lighter libs
   - Both themes forced to load same bundle

4. **Loading Location**
   - CSS loaded in htmlhead.html (before theme known)
   - JavaScript loaded in scripts/index.html (theme-agnostic)

## Target State

### Horizon2020 Theme (Legacy)
```
static/themes/horizon2020/
├── horizon2020.css (complete, self-contained)
│   ├── Starcraft fonts (@font-face)
│   ├── Base styles (blockquote, TEI, author footer, image tricks)
│   └── Horizon-specific styles (intro, header, nav)
└── js/
    └── horizon2020.js (jQuery bundle if needed)
```

### Nebula2025 Theme (Modern)
```
static/themes/nebula2025/
├── nebula2025.css (complete, plain CSS, no SCSS)
│   ├── Modern fonts (if any)
│   ├── Base styles (if needed: blockquote, author footer)
│   └── Nebula-specific styles (gradients, cards, animations)
└── js/
    └── nebula2025.js (vanilla JS or modern libs)
```

### Loading System
```
layouts/partials/htmlhead.html
└── No SCSS compilation
└── No base.css
└── Calls theme-specific styles partial

layouts/partials/themes/{theme}/styles.html
└── Loads theme's complete CSS file

layouts/partials/themes/{theme}/scripts.html (NEW)
└── Loads theme's complete JS file
```

## Implementation Plan

### Phase 1: Merge base.css into horizon2020.css ✓ Ready
**Rationale**: Horizon2020 needs all base.css content (fonts, styles)

1.1. Copy base.css content into static/themes/horizon2020.css
1.2. Fix font paths (from `../fonts/` to `../../assets/fonts/`)
1.3. Update horizon2020/styles.html to remove base.css reference
1.4. Test horizon2020 issues render correctly

### Phase 2: Create standalone nebula2025.css (plain CSS) ✓ Ready
**Rationale**: Nebula2025 should not depend on SCSS/Massively theme

2.1. Audit what nebula2025 actually needs from base.css
    - Likely: blockquote, author footer, maybe image tricks
    - Not needed: Starcraft fonts, TEI glyphs
2.2. Create new nebula2025.css with:
    - Needed base styles (if any)
    - Current nebula2025.css content
    - Any critical Massively theme styles (if used)
2.3. Update nebula2025/styles.html to load only nebula2025.css
2.4. Test nebula2025 issues render correctly

### Phase 3: Move SCSS loading to horizon2020 only ✓ Ready
**Rationale**: Only horizon2020 uses Massively theme SCSS

3.1. Update htmlhead.html to conditionally load SCSS
3.2. Load main.scss + noscript.scss only for horizon2020
3.3. Nebula2025 uses zero SCSS
3.4. Test both themes

### Phase 4: Create theme-specific JavaScript ✓ Ready
**Rationale**: Each theme should control its own JS dependencies

4.1. Create layouts/partials/themes/horizon2020/scripts.html
    - Load current jQuery bundle
4.2. Create layouts/partials/themes/nebula2025/scripts.html
    - Load minimal/modern JS (or none)
4.3. Update scripts/index.html to use theme dispatcher
4.4. Test interactive features on both themes

### Phase 5: Cleanup ✓ Ready
**Rationale**: Remove obsolete shared files

5.1. Delete static/assets/css/base.css
5.2. Update documentation (THEME-SYSTEM.md, THEME-DEVELOPMENT-GUIDE.md)
5.3. Run performance tests
5.4. Commit all changes

## Dependencies & Risks

### What horizon2020 needs from base.css
- ✅ Starcraft fonts (5 @font-face declarations)
- ✅ Blockquote styles (used in articles)
- ✅ TEI glyph styles (used in stories)
- ✅ Author footer styles (used on all articles)
- ✅ Image layout tricks (used in markdown content)

### What nebula2025 might need from base.css
- ❓ Blockquote styles (need to verify)
- ❓ Author footer styles (need to verify)
- ❓ Image layout tricks (need to verify)
- ❌ Starcraft fonts (definitely not)
- ❌ TEI glyph styles (probably not)

### What nebula2025 uses from Massively SCSS
- Need to audit compiled main.css output
- Check for critical layout/reset styles
- Identify typography, buttons, forms used by partials

### JavaScript Dependencies
- Horizon2020 uses: jQuery, scrollex, scrolly, util, main.js
- Nebula2025 needs: TBD (check nav panel, smooth scroll usage)

## Testing Checklist

For each phase:
- [ ] Homepage renders (nebula2025)
- [ ] Issue 23 renders (horizon2020)
- [ ] Issue 44 renders (nebula2025)
- [ ] Article page renders (both themes)
- [ ] Fonts load correctly
- [ ] Author footer displays
- [ ] Blockquotes styled
- [ ] Image tricks work
- [ ] Navigation functional
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Build successful

## Success Metrics

1. **Complete Isolation**
   - Horizon2020 loads: horizon2020.css + horizon2020.js only
   - Nebula2025 loads: nebula2025.css + nebula2025.js only
   - Zero shared CSS/JS between themes

2. **No SCSS for Nebula2025**
   - Nebula2025 uses plain CSS only
   - No dependency on Massively theme
   - Faster, simpler, more maintainable

3. **Performance**
   - Nebula2025 CSS smaller (no unused fonts/styles)
   - Nebula2025 JS smaller (no jQuery if not needed)
   - Faster page loads for modern theme

4. **Maintainability**
   - Each theme is self-contained
   - Editing one theme doesn't affect the other
   - Easy to delete a theme completely

## Open Questions

1. Does nebula2025 actually use any Massively theme styles?
2. Does nebula2025 need jQuery/scrollex/scrolly?
3. Should we keep image layout tricks in both themes?
4. Are there any shared utilities that should remain?

## Execution Order

Execute phases in order:
1. Phase 1 (merge base → horizon2020)
2. Phase 2 (audit & create standalone nebula2025)
3. Phase 3 (isolate SCSS to horizon2020)
4. Phase 4 (isolate JavaScript)
5. Phase 5 (cleanup)

Each phase should be committed separately for easy rollback if needed.
