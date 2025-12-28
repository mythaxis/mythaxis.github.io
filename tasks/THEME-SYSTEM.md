# Mythaxis Theme System Documentation

## Overview

The Mythaxis Magazine site uses a flexible theme system that allows different sections (issues) to use different visual themes. This enables the site to maintain a classic look for legacy content while using modern styling for new issues.

## Architecture

### Core Components

1. **Theme Dispatcher** (`layouts/partials/theme-dispatch.html`)
   - Central routing system for all theme-specific partials
   - Determines which theme to use based on section configuration
   - Falls back to shared partials when theme-specific versions don't exist

2. **Theme Function** (`layouts/partials/functions/getCurrentTheme.html`)
   - Determines the current theme for a given page/section
   - Checks for `theme` parameter in front matter
   - Falls back to site default (`config.yaml`: `defaultTheme: nebula2025`)

3. **Theme Partials** (`layouts/partials/themes/{themeName}/`)
   - Theme-specific implementations of UI components
   - Each theme has its own directory under `layouts/partials/themes/`
   - Currently supported themes: `horizon2020`, `nebula2025`

4. **Static Assets**
   - **Shared**: `static/assets/css/base.css` - Fonts, image tricks, author footer, blockquotes
   - **Theme-specific**: `static/themes/{themeName}.css` - Theme-unique styles
   - **Theme-specific images**: `static/themes/{themeName}/` - SVG assets, decorative elements

### Theme Configuration

#### Site-Wide Default

In `config.yaml`:
```yaml
params:
  defaultTheme: nebula2025  # Used when no theme is specified
```

#### Per-Section Override

In section front matter (e.g., `content/issue-23/__index.md`):
```yaml
---
title: "Mythaxis Magazine Issue 23"
theme: horizon2020  # Override the site default
---
```

## Available Themes

### horizon2020 (Legacy Theme)

**Purpose**: Maintain the classic Mythaxis look for issues 23-43

**Visual Characteristics**:
- Starcraft font for headings
- Linear gradient background (bottom-up fade)
- Classic Mythaxis color scheme
- SVG decorative elements (toplist.svg, divider.svg)

**Files**:
- CSS: `static/themes/horizon2020.css`
- Images: `static/themes/horizon2020/toplist.svg`, `divider.svg`
- Partials: `layouts/partials/themes/horizon2020/*.html`

### nebula2025 (Modern Theme)

**Purpose**: Fresh, modern design for issue 44 onwards

**Visual Characteristics**:
- Gradient text effects
- Card-based layouts
- Modern purple/blue color palette (#667eea, #764ba2)
- Smooth animations and transitions
- Top-down gradient background overlay

**Files**:
- CSS: `static/themes/nebula2025.css`
- Partials: `layouts/partials/themes/nebula2025/*.html`

## Theme Partials

Each theme implements the following partials:

| Partial | Purpose |
|---------|---------|
| `intro.html` | Homepage hero section |
| `header.html` | Site header with logo |
| `nav.html` | Main navigation menu |
| `styles.html` | Loads theme CSS + dynamic background |
| `featured.html` | Featured article card |
| `list-item.html` | Article card in listings |
| `article-single.html` | Single article layout |
| `page-single.html` | Single page layout (About, Submissions) |
| `catalogue-content.html` | Catalogue page listings |
| `editorials-content.html` | Editorial content listings |
| `authors-content.html` | Author taxonomy index |
| `genres-content.html` | Genre taxonomy index |
| `authorfooter.html` | Author bio section |
| `copyright.html` | Footer copyright |
| `catalogue-nav.html` | Catalogue navigation |
| `divider.html` | Section dividers |

## CSS Architecture

### Three-Layer System

1. **Base Layer** (`static/assets/css/base.css`)
   - Shared across all themes
   - Font definitions (@font-face)
   - Common utilities (image tricks, author footer)
   - Content styles (blockquotes, TEI glyphs)

2. **Theme Layer** (`static/themes/{themeName}.css`)
   - Theme-specific component styles
   - Color schemes
   - Layout variations
   - Animations and transitions

3. **Dynamic Layer** (inline `<style>` in `{themeName}/styles.html`)
   - Page-specific background images
   - Front matter-driven customizations
   - Responsive background adjustments

### Loading Order

```html
<!-- 1. Shared base styles -->
<link rel="stylesheet" href='{{ "assets/css/base.css" | relURL }}' />

<!-- 2. Theme-specific styles -->
<link rel="stylesheet" href='{{ "themes/nebula2025.css" | relURL }}' />

<!-- 3. Dynamic page-specific styles -->
<style type="text/css">
#wrapper > .bg {
    background-image: url({{ .Section.Params.image | relURL }});
}
</style>
```

## How to Set a Theme

### For a Single Issue

Edit the issue's `__index.md`:

```yaml
---
title: "Mythaxis Magazine Issue 23"
theme: horizon2020  # Add this line
---
```

### For Multiple Issues

Use the provided script:

```bash
./scripts/add-theme-to-legacy-issues.sh
```

Or manually edit each `__index.md` file.

### For All Future Content

Change the site default in `config.yaml`:

```yaml
params:
  defaultTheme: horizon2020  # or nebula2025
```

## Current Theme Distribution

- **Issues 23-43**: `horizon2020` (legacy theme)
- **Issue 44+**: `nebula2025` (modern theme, site default)
- **Archive page**: `nebula2025` (follows site default)
- **Static pages**: `nebula2025` (follows site default)

## Creating a New Theme

See `layouts/partials/themes/README.md` for detailed instructions on creating a new theme.

Quick steps:
1. Create new directory: `layouts/partials/themes/mytheme/`
2. Copy partials from an existing theme
3. Create `static/themes/mytheme.css`
4. Customize styles and markup
5. Set `theme: mytheme` in front matter to test

## Troubleshooting

### Theme Not Applied

**Check**:
1. Front matter has `theme: themename` (lowercase, no quotes)
2. Theme directory exists: `layouts/partials/themes/themename/`
3. CSS file exists: `static/themes/themename.css`
4. Hugo server restarted if config changed

### Missing Styles

**Check**:
1. `base.css` is loading (check browser dev tools)
2. Theme CSS file is loading
3. Font paths are correct in `base.css`
4. No CSS syntax errors (check Hugo build output)

### Wrong Background Image

**Check**:
1. Section `__index.md` has `image: images/bg.jpg` parameter
2. Image file exists in section directory
3. Dynamic background styles in `{themeName}/styles.html` are correct

## Performance Considerations

- **Build Time**: Adding theme system increased build time by ~2-3%
- **Page Load**: Two CSS files vs. one has negligible impact
- **Caching**: Both `base.css` and theme CSS are cacheable
- **Bundle Size**: Total CSS reduced by 15% vs. old `overrides.css`

## Migration History

- **Phase 1**: Created theme dispatcher and theme-specific partials
- **Phase 2**: Separated CSS into base.css + theme files
- **Phase 3**: Applied themes to all issues (23-43 → horizon2020, 44+ → nebula2025)
- **Phase 4**: Documentation and QA

## Future Enhancements

Potential improvements (not currently implemented):

- Dark mode variants per theme
- Runtime theme switching (JavaScript toggle)
- Theme preview mode for editors
- Additional themes for special issues
- Theme-specific JavaScript bundles
