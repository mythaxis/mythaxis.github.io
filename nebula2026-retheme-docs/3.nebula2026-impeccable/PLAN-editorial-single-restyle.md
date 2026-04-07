# Editorial Single Page Restyle

## Context

The editorial page (`type: editorial`) currently renders through `page-single.html` with the same layout as generic pages (about, submissions). The user wants a distinct editorial presentation where:
- The editorial's own image fills the hero area (not the issue cover)
- The header block (title, author, roundel) overlaps the bottom of the hero with a white background and snake-radius curved top corners — creating a "cutout" effect
- The description and inline page image are hidden

## Files to Modify

1. **`layouts/partials/themes/nebula2026/page-single.html`** — add editorial-specific template logic
2. **`static/themes/nebula2026.css`** — add `.nebula-page--editorial` styles

## Template Changes (`page-single.html`)

Add editorial detection and modify the rendering:

1. Detect editorial type: `$isEditorial := eq $page.Type "editorial"`
2. Add class to section element: `nebula-page--editorial` when editorial
3. **Hero image logic**:
   - Editorials: resolve the **page's own** `image` (absolute or section-relative) and render it in `.nebula-page-hero`
   - Non-editorials: keep current behavior (section/issue image in hero)
4. **Hide inline image**: wrap `.nebula-page-image` block in `{{ if not $isEditorial }}` guard
5. **Hide description**: wrap `.nebula-page-description` in `{{ if not $isEditorial }}` guard

## CSS Changes (`nebula2026.css`)

Add after the existing `.nebula-page-image img` block (~line 1167):

```css
/* Editorial page — hero overlap with cutout header */
.nebula-page--editorial .nebula-page-header {
    background: var(--color-background);
    border-radius: var(--radius-snake) var(--radius-snake) 0 0;
    margin-top: -4rem;
    position: relative;
    z-index: 2;
    padding: 2rem 2rem 1rem;
}
```

Mobile adjustments in the existing `@media (max-width: 736px)` block:
```css
.nebula-page--editorial .nebula-page-header {
    margin-top: -3rem;
    padding: 1.5rem 1.25rem 1rem;
}
```

## Verification

1. `hugo build` — no template errors
2. `hugo server -D --disableFastRender` — check `/issue-45/reintroduction.html`:
   - Hero area shows the editorial's own image (monkeyking.jpg)
   - White header block overlaps the hero bottom with rounded top corners
   - No description text visible in header
   - No inline `.nebula-page-image` block
   - Other page types (about, submissions, contents) render unchanged
