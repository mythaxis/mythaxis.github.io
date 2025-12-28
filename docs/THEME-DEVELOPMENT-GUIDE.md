# Theme Development Guide

This guide explains how to create and modify themes for the Mythaxis Magazine site.

## Quick Start

### Creating a New Theme

1. **Create theme directory**:
   ```bash
   mkdir layouts/partials/themes/mytheme
   ```

2. **Copy reference partials** (use nebula2025 as template):
   ```bash
   cp -r layouts/partials/themes/nebula2025/* layouts/partials/themes/mytheme/
   ```

3. **Create theme CSS**:
   ```bash
   touch static/themes/mytheme.css
   ```

4. **Update `styles.html`** to reference your theme CSS:
   ```html
   <link rel="stylesheet" href='{{ "themes/mytheme.css" | relURL }}' />
   ```

5. **Test your theme**:
   - Set `theme: mytheme` in a test issue's `__index.md`
   - Run `hugo server` and view the issue

## Required Partials

Every theme must implement these partials:

### 1. `styles.html`
Loads CSS files and defines dynamic background styles.

**Context available**:
- `.Page` - Current page
- `.Section` - Current section (from getCurrentTheme)
- `.Theme` - Theme name string
- `.Data` - Extra data passed from dispatcher

**Template**:
```html
{{- $section := .Section -}}

{{/* Load shared base styles */}}
<link rel="stylesheet" href='{{ "assets/css/base.css" | relURL }}' />

{{/* Load theme-specific styles */}}
<link rel="stylesheet" href='{{ "themes/mytheme.css" | relURL }}' />

{{/* Dynamic background customization */}}
<style type="text/css">
#wrapper > .bg {
    background-image: url({{ path.Join $section.Section $section.Params.image | relURL }});
    /* Add theme-specific background styling */
}
</style>
```

### 2. `intro.html`
Homepage hero section / intro area.

**Typical elements**:
- Issue badge/number
- Magazine title/logo
- Subtitle
- Headline/description
- Scroll indicator

**Context**: Same as `styles.html`

### 3. `header.html`
Site header with logo and branding.

**Typical elements**:
- Site logo/title
- Issue number (optional)
- Header background/styling

### 4. `nav.html`
Main navigation menu.

**Typical elements**:
- Navigation links (Archive, About, Catalogue, etc.)
- Active state indicators
- Responsive menu (if needed)

### 5. `featured.html`
Featured article card (homepage).

**Data passed**:
- `.Title` - Article title
- `.Summary` - Article description
- `.Permalink` - Article URL
- `.Params.image` - Article image
- `.Params.authors` - Author list

### 6. `list-item.html`
Article card in listings (issue pages).

**Data passed**: Same as `featured.html`

### 7. `article-single.html`
Single article page layout.

**Typical sections**:
- Article header (title, authors, date)
- Article image
- Audio player (if applicable)
- Article content
- Article footer (support text)

### 8. `page-single.html`
Single page layout (About, Submissions, etc.).

**Similar to `article-single.html` but for pages**

### 9. `catalogue-content.html`
Catalogue page content area.

**Shows**: List of all articles organized by issue/section

### 10. `editorials-content.html`
Editorial content listings.

### 11. `authors-content.html`
Author taxonomy index.

### 12. `genres-content.html`
Genre taxonomy index.

### 13. `authorfooter.html`
Author bio section at end of articles.

**Data**:
- `.Params.author` - Author name
- `.Params.authorBio` - Author biography
- `.Params.authorImage` - Author photo

### 14. `copyright.html`
Footer copyright notice.

### 15. `catalogue-nav.html`
Catalogue page navigation.

### 16. `divider.html`
Section dividers used in articles.

## CSS Guidelines

### File Organization

```
static/
├── assets/
│   └── css/
│       └── base.css              # Shared across themes (DO NOT MODIFY)
└── themes/
    └── mytheme.css              # Your theme styles
```

### CSS Architecture

1. **Never modify `base.css`** - This is shared across all themes
2. **Use namespaced classes** - Prefix your classes with theme name:
   ```css
   .mytheme-button { }
   .mytheme-card { }
   .mytheme-header { }
   ```
3. **Avoid global selectors** - Target specific theme elements
4. **Use CSS custom properties** for theme colors:
   ```css
   :root {
       --mytheme-primary: #667eea;
       --mytheme-secondary: #764ba2;
   }
   ```

### Required Styles

Your theme CSS should define styles for:

- Intro/Hero section
- Header and navigation
- Cards and listings
- Article layouts
- Typography (if not using base.css fonts)
- Buttons and links
- Responsive breakpoints

### Example Theme CSS Structure

```css
/* Theme: MyTheme
   ========================================================================== */

/* Color Palette */
:root {
    --mytheme-primary: #667eea;
    --mytheme-secondary: #764ba2;
    --mytheme-text: #333;
    --mytheme-background: #fff;
}

/* Intro Section */
.mytheme-intro {
    /* ... */
}

/* Header */
.mytheme-header {
    /* ... */
}

/* Navigation */
.mytheme-nav {
    /* ... */
}

/* Cards */
.mytheme-card {
    /* ... */
}

/* Typography */
.mytheme-title {
    /* ... */
}

/* Responsive */
@media screen and (max-width: 736px) {
    .mytheme-intro {
        /* Mobile adjustments */
    }
}
```

## Theme Parameters

Themes can read configuration from section front matter:

```yaml
---
theme: mytheme
intro:
  logo:
    color: '#f1401d'
    font_family: "Custom Font"
  justify_content: flex-start
---
```

Access in templates:
```html
{{ with .Section.Params.intro }}
    {{ with .logo }}
        <h1 style="color: {{ .color }}; font-family: {{ .font_family }};">
            Logo
        </h1>
    {{ end }}
{{ end }}
```

## Testing Your Theme

### 1. Local Development

```bash
# Start Hugo server
hugo server --buildDrafts

# View at http://localhost:1313
```

### 2. Test on Multiple Page Types

Ensure your theme works on:
- Homepage (/)
- Issue pages (/issue-XX/)
- Article pages (/issue-XX/article-name/)
- Static pages (/about/, /submissions/)
- Catalogue (/catalogue/)
- Archive (/archive.html)

### 3. Mobile Testing

Test responsive breakpoints:
- Desktop (> 980px)
- Tablet (736px - 980px)
- Mobile (< 736px)

```bash
# Use browser dev tools or
# Test with different viewport sizes
```

### 4. Performance Testing

```bash
# Check build performance
hugo --templateMetrics

# Look for your theme partials in the output
```

## Common Patterns

### Conditional Styling

```html
{{ if eq .Theme "mytheme" }}
    <div class="mytheme-special-layout">
        {{/* Special content for mytheme only */}}
    </div>
{{ else }}
    <div class="default-layout">
        {{/* Fallback */}}
    </div>
{{ end }}
```

### Image Paths

```html
{{/* Section images */}}
<img src="{{ path.Join .Section.Section .Section.Params.image | relURL }}">

{{/* Theme-specific images */}}
<img src="{{ "themes/mytheme/logo.svg" | relURL }}">
```

### Author Lists

```html
{{ $authors := split .Params.authors "|" }}
{{ range $i, $author := $authors }}
    {{ if $i }}, {{ end }}{{ $author }}
{{ end }}
```

### Gradient Backgrounds

```html
<style>
#wrapper > .bg {
    background-image:
        linear-gradient(180deg,
            rgba(15, 15, 35, 0.7) 0%,
            rgba(15, 15, 35, 0.3) 50%,
            rgba(255, 255, 255, 1) 100%
        ),
        url({{ path.Join .Section.Section .Section.Params.image | relURL }});
}
</style>
```

## Troubleshooting

### Theme Not Loading

1. Check theme directory name matches front matter exactly
2. Verify all required partials exist
3. Check CSS file is in `static/themes/`
4. Restart Hugo server after adding new files

### Styles Not Applying

1. Check browser console for CSS 404 errors
2. Verify CSS file path in `styles.html`
3. Check for CSS syntax errors
4. Clear browser cache
5. Use browser dev tools to inspect element classes

### Layout Broken

1. Compare your partial with reference theme (nebula2025)
2. Check that you're using correct context variables
3. Verify Hugo template syntax (no typos in `{{ }}` blocks)
4. Check Hugo server output for template errors

## Reference Themes

### nebula2025
Modern, gradient-heavy theme with cards and animations.

**Good for**: Learning modern CSS techniques, card layouts, smooth transitions

**Files to study**:
- `styles.html` - Dynamic background patterns
- `intro.html` - Gradient text effects
- `list-item.html` - Card hover effects

### horizon2020
Classic theme with custom fonts and SVG decorations.

**Good for**: Learning custom font integration, SVG usage, traditional layouts

**Files to study**:
- `styles.html` - Custom font loading and intro flexbox customization
- `divider.html` - SVG asset integration
- `catalogue-content.html` - Table-based layouts

## Best Practices

1. **Start with a copy** - Don't build from scratch, copy nebula2025
2. **Test incrementally** - Change one partial at a time
3. **Use semantic class names** - `.mytheme-card-title` not `.mt-ct`
4. **Keep it responsive** - Test on mobile devices
5. **Minimize inline styles** - Put styles in theme CSS file
6. **Document special parameters** - If your theme needs custom front matter
7. **Version your theme** - Consider adding version comment in CSS
8. **Performance matters** - Keep CSS lean, avoid heavy animations

## Getting Help

- Check existing themes for reference patterns
- Review `docs/THEME-SYSTEM.md` for architecture overview
- Test with `hugo server --verbose` for detailed error messages
- Use browser dev tools to debug CSS/HTML

## Contributing

When submitting a new theme:
1. Ensure all required partials are implemented
2. Test on all page types
3. Verify mobile responsiveness
4. Document any custom front matter parameters
5. Include example usage in a test issue
