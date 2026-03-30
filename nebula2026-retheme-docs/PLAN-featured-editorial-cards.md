# Task 32.0 — Featured Row + Editorial Card on Frontpage

**Date:** 2026-03-30
**Status:** Plan ready for implementation

---

## Context

The frontpage content rows all look similar — same 2-column grid, alternating left/right. Task 32.0 adds two visually distinct card styles:

1. **Featured** (image-as-background): full-width hero card with story image as darkened backdrop, title + author overlaid in light text. For highlighting a lead story.
2. **Editorial** (pill card): full-width rounded pill with smaller inset image and text feature. For editor's notes and similar content.

Both styles are available to any content type via `cardLayout` frontmatter — the prefix determines the visual treatment, not the content type.

The editorial in issue-45 (`editorial.md`) is currently invisible on the frontpage because editorials are filtered out unless `cardLayout` is set. Adding `cardLayout: editorial-center` fixes this — no code changes to the filter.

---

## Files to modify

| File | Change |
|------|--------|
| `static/themes/nebula2026.css` | Add featured + editorial card CSS (~80 lines) |
| `layouts/partials/themes/nebula2026/content-row.html` | Add `--featured` modifier class to article element |
| `content/issue-45/editorial.md` | Add `cardLayout: editorial-left` to frontmatter |

---

## Step 1: Template — add featured modifier class

**File:** `layouts/partials/themes/nebula2026/content-row.html` (line 25)

Currently the article only gets `--editorial` and `--review` modifier classes. Add `--featured`:

```go
<article class="nebula-content-row nebula-content-row--{{ $direction }}
  {{- if eq $style "editorial" }} nebula-content-row--editorial{{ end -}}
  {{- if eq $style "review" }} nebula-content-row--review{{ end -}}
  {{- if eq $style "featured" }} nebula-content-row--featured{{ end -}}">
```

No other template changes needed — the existing HTML (image div + text div) works for both styles via CSS repositioning.

## Step 2: CSS — featured row (image-as-background)

Triggered by: `cardLayout: featured-left`, `featured-right`, or `featured-center`

Design: the existing image div becomes a full-bleed absolutely positioned background. A pseudo-element overlay darkens it. The text div sits on top with light colours.

```css
/* Featured: image-as-background hero card */
.nebula-content-row--featured {
    position: relative;
    display: block;                     /* override 2-col grid */
    min-height: 350px;
    border-radius: var(--radius-snake);
    overflow: hidden;
}

.nebula-content-row--featured .nebula-content-row__image {
    position: absolute;
    inset: 0;
    min-height: auto;
    border-radius: 0;
}

.nebula-content-row--featured .nebula-content-row__image::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.2));
    pointer-events: none;
}

.nebula-content-row--featured .nebula-content-row__text {
    position: relative;
    z-index: 1;
    min-height: 350px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 3rem;
    color: #fff;
}

/* Override chromatic title for light-on-dark context */
.nebula-content-row--featured .nebula-content-row__title--featured a {
    color: #fff;
    text-shadow: 0.06em 0.06em 0 rgba(0,0,0,0.4);
}
.nebula-content-row--featured .nebula-content-row__title--featured a::after {
    color: rgba(255,255,255,0.4);
    text-shadow: none;
}
.nebula-content-row--featured .nebula-content-row__authors {
    color: rgba(255,255,255,0.8);
}
.nebula-content-row--featured .nebula-content-row__description {
    color: rgba(255,255,255,0.85);
}

/* Snake corners: featured row resets the alternation pattern */
.nebula-content-row--featured + .nebula-content-row--left {
    --tl: var(--radius-snake);
}
.nebula-content-row--featured + .nebula-content-row--right {
    --tr: var(--radius-snake);
}
```

## Step 3: CSS — editorial pill card

Triggered by: `cardLayout: editorial-left`, `editorial-right`, or `editorial-center`

Design: a horizontally-oriented pill with subtle border, smaller rounded image inset on one side, and text filling the rest. Centred on the page with breathing room.

```css
/* Editorial: pill border card with inset image */
.nebula-content-row--editorial {
    display: flex;
    align-items: center;
    gap: 2rem;
    max-width: 900px;
    margin: 2rem auto;
    padding: 2rem 2.5rem;
    border: 1px solid var(--color-secondary);
    border-radius: 3rem;
}

.nebula-content-row--editorial .nebula-content-row__image {
    width: 120px;
    height: 120px;
    min-height: auto;
    flex-shrink: 0;
    border-radius: 1rem;
    overflow: hidden;
}

.nebula-content-row--editorial .nebula-content-row__text {
    padding: 0;
    flex: 1;
}

.nebula-content-row--editorial .nebula-content-row__title {
    font-style: italic;
}
.nebula-content-row--editorial .nebula-content-row__title a {
    font-style: italic;
}

/* Direction: right flips image to the other side */
.nebula-content-row--editorial.nebula-content-row--right {
    direction: rtl;
}
.nebula-content-row--editorial.nebula-content-row--right > * {
    direction: ltr;
}

/* Center: stack image above text */
.nebula-content-row--editorial.nebula-content-row--center {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 2rem;
}

/* Snake corners: editorial pill resets alternation */
.nebula-content-row--editorial + .nebula-content-row--left {
    --tl: var(--radius-snake);
}
.nebula-content-row--editorial + .nebula-content-row--right {
    --tr: var(--radius-snake);
}
```

### Mobile adjustments (inside `@media (max-width: 736px)`)

```css
.nebula-content-row--featured {
    min-height: 250px;
}
.nebula-content-row--featured .nebula-content-row__text {
    min-height: 250px;
    padding: 2rem 1.5rem;
}

.nebula-content-row--editorial {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 1.5rem;
    border-radius: 2rem;
    margin: 1rem auto;
}
.nebula-content-row--editorial .nebula-content-row__image {
    width: 100px;
    height: 100px;
}
```

## Step 4: Content — add editorial to frontpage

**File:** `content/issue-45/editorial.md` — add to frontmatter:

```yaml
cardLayout: editorial-left
```

This passes the existing filter (`ne $layout ""`) and the dispatch sets `$style = "editorial"`, `$direction = "left"`.

## Step 5: Verify

1. `hugo server -D --disableFastRender`
2. **Homepage**: editorial pill appears at weight position 1 (top), with inset image + italic text
3. **Featured test**: temporarily set a stock story to `cardLayout: featured-center` and verify the image-as-background hero renders with light overlaid text
4. **Snake corners**: check rows above/below featured/editorial reset their corners correctly
5. **Mobile**: check both styles at 375px viewport
6. **Direction variants**: test `editorial-left`, `editorial-right`, `editorial-center`
7. **Scroll-snap**: verify featured/editorial rows snap correctly on mobile
8. Remove any test `cardLayout` values from stories

---

## Key architecture notes

- `.posts` is `display: flex; flex-direction: column` — not a CSS grid
- Each `.nebula-content-row` uses its own internal `display: grid; grid-template-columns: 1fr 1fr`
- Featured overrides this to `display: block` with absolute-positioned image
- Editorial overrides to `display: flex` with smaller fixed-size image
- Both styles reset the snake corner alternation pattern for the row below them
- The `cardLayout` dispatch in `index.html` (lines 48-73) already handles all style/direction combinations — no changes needed

## cardLayout reference (after implementation)

| Value | Visual |
|-------|--------|
| `stock-left` / `stock-right` | Regular 50/50 grid row (default auto-alternate) |
| `review-left` / `review-right` | Same grid, review modifier |
| `editorial-left` / `editorial-right` / `editorial-center` | Pill card with inset image |
| `featured-left` / `featured-right` / `featured-center` | Image-as-background hero |
| *(no cardLayout on stock/review)* | Auto-alternates left/right |
| *(no cardLayout on editorial)* | Hidden from frontpage |
