# Frontpage Layout System

## Problem

The current frontpage has two mechanisms that conflict:

1. **`featured: true`** pulls stories out of weight order — the first featured item goes above `.posts`, the second goes below. This breaks the editor's intended reading order.
2. **CSS `nth-child` alternation** controls image left/right positioning. The editor has no say in which side an image appears on.
3. **Snake corner CSS** relies on strict odd=left, even=right alternation. Featured items rendered outside `.posts` don't participate in the snake flow.

## Proposed Solution: `cardLayout` frontmatter field

Replace `featured: true/false` with a `cardLayout` field that controls both visual style and image position, while keeping all stories in weight order inside `.posts`.

> **Note:** Named `cardLayout` (not `layout`) to avoid conflict with Hugo's built-in `layout` field which controls template lookup.

### Layout values

| Value | Image position | Text style | Use case |
|---|---|---|---|
| `stock-left` | Left | Standard (title, author, description) | Default for odd positions |
| `stock-right` | Right | Standard | Default for even positions |
| `featured-left` | Left | Featured (author above, larger title, Basalte font) | Lead stories |
| `featured-right` | Right | Featured | Lead stories |

Future extensions (not yet implemented):

| Value | Image position | Text style | Use case |
|---|---|---|---|
| `review-left` | Left | Review (TBD styling) | Review round-ups |
| `review-right` | Right | Review | Review round-ups |

### Default behaviour

If `cardLayout` is omitted, the system auto-assigns based on position:

- Odd position (1st, 3rd, 5th...): `stock-left`
- Even position (2nd, 4th, 6th...): `stock-right`

This means existing content files need zero changes to maintain current appearance. The editor only adds `cardLayout:` when they want to override the default.

### Example frontmatter

```yaml
# Story at weight 1, editor wants featured styling with image on left
title: "The Witness"
type: stock
weight: 1
cardLayout: featured-left

# Story at weight 8, standard row, editor is happy with auto-positioning
title: "Short Reviews"
type: stock
weight: 8
# no cardLayout field — auto-assigned based on position
```

## Architecture

### Template structure

All layout variants share one Hugo content view template. The view template reads `cardLayout` from frontmatter and calls the appropriate partial.

```
layouts/
  stock/
    list.html              # content view — dispatcher (replaces current list.html + featured.html)
  _default/
    section.html           # loop — all posts in weight order, single .Render call
  partials/
    themes/nebula2026/
      content-row.html     # unified partial — branches on layout value
```

### section.html (the loop)

```
{{ $posts := where (where .Site.Pages "Section" ...) ".Type" "stock" }}

<section class="posts">
  {{ range $posts }}
    {{ .Render "list" }}
  {{ end }}
</section>
```

No featured extraction. No complement. All stories render in weight order.

### stock/list.html (content view)

```
{{ partial "theme-dispatch" (dict "partial" "content-row" "context" .) }}
```

A single content view for all layouts. The `featured.html` content view becomes unused (can be deleted or kept for horizon2020 compat).

### content-row.html (the partial)

This partial reads `cardLayout` from frontmatter and outputs the appropriate HTML. All variants share the same outer `<article>` structure so the snake CSS can target them uniformly.

```
{{- $page := .Page -}}
{{- $layout := $page.Params.layout | default "" -}}

{{/* Parse layout into style + direction */}}
{{- $style := "stock" -}}
{{- $direction := "" -}}
{{- if hasPrefix $layout "featured" -}}
  {{- $style = "featured" -}}
{{- else if hasPrefix $layout "review" -}}
  {{- $style = "review" -}}
{{- end -}}
{{- if hasSuffix $layout "-right" -}}
  {{- $direction = "right" -}}
{{- else if hasSuffix $layout "-left" -}}
  {{- $direction = "left" -}}
{{- end -}}

<article class="nebula-content-row{{ with $direction }} nebula-content-row--{{ . }}{{ end }}">
  {{ if $page.Params.image }}
  <div class="nebula-content-row__image">
    <a href="{{ $page.Permalink }}">
      <img src="{{ path.Join ... }}" alt="" />
    </a>
  </div>
  {{ end }}
  <div class="nebula-content-row__text">
    {{ if eq $style "featured" }}
      {{/* featured text: author above, larger Basalte title, description */}}
      <span class="nebula-content-row__authors">...</span>
      <h2 class="nebula-content-row__title nebula-content-row__title--featured">
        <a href="..." data-text="...">{{ $page.Title }}</a>
      </h2>
      {{ with $page.Description }}<p class="nebula-content-row__description">{{ . }}</p>{{ end }}
    {{ else }}
      {{/* stock text: title, author, description */}}
      <h3 class="nebula-content-row__title">
        <a href="...">{{ $page.Title }}</a>
      </h3>
      <span class="nebula-content-row__authors">...</span>
      {{ with $page.Description }}<p class="nebula-content-row__description">{{ . }}</p>{{ end }}
    {{ end }}
  </div>
</article>
```

### HTML output

Every story produces the same outer element:

```html
<article class="nebula-content-row">                        <!-- auto-positioned -->
<article class="nebula-content-row nebula-content-row--left">   <!-- explicit left -->
<article class="nebula-content-row nebula-content-row--right">  <!-- explicit right -->
```

The image div and text div are always in the same DOM order. Direction (left/right) is controlled by CSS, not by reordering DOM elements.

## CSS

### Image position

Two mechanisms, auto and explicit, with explicit winning:

```css
/* Auto-positioned: even children default to image-right */
.posts > :nth-child(even):not(.nebula-content-row--left):not(.nebula-content-row--right) {
    direction: rtl;
}

/* Explicit overrides */
.nebula-content-row--right {
    direction: rtl;
}
/* --left is default (ltr), no rule needed */

/* Reset direction on all children */
.nebula-content-row--right > *,
.posts > :nth-child(even) > * {
    direction: ltr;
}
```

### Snake corners — transition-based model

The snake rounds the **outer edge** of each image, but only at **transition points** — where the image side changes between adjacent rows. Consecutive same-side images form a straight vertical edge with no curves between them.

#### The core rule

A corner curves only when the neighboring row has its image on the **opposite side**:

- **TL** curves when image is LEFT and **previous** row is RIGHT
- **BL** curves when image is LEFT and **next** row is RIGHT
- **TR** curves when image is RIGHT and **previous** row is LEFT
- **BR** curves when image is RIGHT and **next** row is LEFT

First row has no previous → top corner never curves. Last row has no next → bottom corner never curves. First/last logic falls out automatically with no extra selectors.

#### CSS implementation: custom properties per corner

Each corner is an independent CSS custom property. The `border-radius` shorthand reads all four. Transition detection uses `+` (previous sibling) and `:has(+)` (next sibling):

```css
/* Default: all corners flat */
.nebula-content-row {
    --tl: 0;
    --tr: 0;
    --br: 0;
    --bl: 0;
}

.nebula-content-row__image {
    border-radius: var(--tl) var(--tr) var(--br) var(--bl);
    overflow: hidden;
}

/* ── Transition corners (4 rules total) ── */

/* TL: left image after a right image */
.nebula-content-row--right + .nebula-content-row--left {
    --tl: var(--radius-snake);
}

/* BL: left image before a right image */
.nebula-content-row--left:has(+ .nebula-content-row--right) {
    --bl: var(--radius-snake);
}

/* TR: right image after a left image */
.nebula-content-row--left + .nebula-content-row--right {
    --tr: var(--radius-snake);
}

/* BR: right image before a left image */
.nebula-content-row--right:has(+ .nebula-content-row--left) {
    --br: var(--radius-snake);
}
```

Four selectors. No first/last overrides. No nth-child. No `:only-child`. Everything is automatic.

#### Walkthrough: every scenario

**Default alternation (L, R, L, R, L):**

```
Row 1 (L, first):  prev=none  next=R  →  --bl only       ← snake starts
Row 2 (R):         prev=L     next=L  →  --tr + --br      ← zigzag
Row 3 (L):         prev=R     next=R  →  --tl + --bl      ← zigzag
Row 4 (R):         prev=L     next=L  →  --tr + --br      ← zigzag
Row 5 (L, last):   prev=R     next=none → --tl only       ← snake ends
```

Classic zigzag.

**Consecutive same-side run (L, R, L, L, L, R, L):**

```
Row 1 (L, first):  prev=none  next=R  →  --bl             ← snake starts
Row 2 (R):         prev=L     next=L  →  --tr + --br
Row 3 (L):         prev=R     next=L  →  --tl             ← entering left run
Row 4 (L):         prev=L     next=L  →  no corners       ← straight edge
Row 5 (L):         prev=L     next=R  →  --bl             ← exiting left run
Row 6 (R):         prev=L     next=L  →  --tr + --br
Row 7 (L, last):   prev=R     next=none → --tl            ← snake ends
```

```
  ╭──────┬──────╮
  │ img  │ text │
  ╰──╮   │      │  BL
     ╭───╰──╮
  │ text │ img  │  TR + BR
  │      ╰──╮──╯
  ╭──╯      │      TL (run entry)
  │ img  │ text │
  │      │      │  ← straight vertical edge, no corners
  │ img  │ text │
  │      │      │  ← straight vertical edge
  │ img  │ text │
  ╰──╮   │      │  BL (run exit)
     ╭───╰──╮
  │ text │ img  │  TR + BR
  │      ╰──╮──╯
  ╭──╯      │      TL (snake ends)
  │ img  │ text │
  ╰──────┴──────╯
```

The run of 3 left images forms a straight vertical column — curves only at entry (TL on row 3) and exit (BL on row 5).

**All same side (L, L, L, L):**

```
Row 1 (L):  prev=none  next=L  →  no corners
Row 2 (L):  prev=L     next=L  →  no corners
Row 3 (L):  prev=L     next=L  →  no corners
Row 4 (L):  prev=L     next=none → no corners
```

No transitions, no corners. Straight rectangular column — correct for a uniform layout.

**Two rows only (L, R):**

```
Row 1 (L):  prev=none  next=R  →  --bl
Row 2 (R):  prev=L     next=none → --tr
```

Minimal snake: BL + TR.

**Single row (L):**

No previous, no next → no corners.

#### Why no frontmatter overrides are needed

The transition model handles every combination automatically. The only hypothetical edge case requiring a manual override would be if the editor wanted to **remove** corners that the transition logic would otherwise add — and there's no obvious reason to do that.

If it ever comes up, a simple `snake: false` frontmatter flag could zero all four properties:

```css
.nebula-content-row--no-snake {
    --tl: 0; --tr: 0; --br: 0; --bl: 0;
}
```

#### Template requirement

For the transition selectors to work, **every row must have a `--left` or `--right` class**. The template resolves this from the `cardLayout` frontmatter field, or from position (odd=left, even=right) when `cardLayout` is omitted. No row is left classless.

#### Browser support

`:has()` is already used in the theme (`#wrapper:has(#intro)`). Supported in Chrome 105+, Safari 15.4+, Firefox 121+.

### Featured text styling

```css
.nebula-content-row__title--featured {
    font-size: clamp(1.75rem, 3vw + 0.5rem, 2.75rem);
    font-family: 'Basalte', var(--font-secondary);
    text-transform: uppercase;
    letter-spacing: 0.02em;
}

/* Chromatic layering on featured titles */
.nebula-content-row__title--featured a::after {
    content: attr(data-text);
    font-family: 'Basalte Multicolor', var(--font-secondary);
    /* ... same technique as current .nebula-split-lead__title a::after */
}
```

### Equal columns + mobile reset

```css
.nebula-content-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
}

@media (max-width: 736px) {
    .nebula-content-row {
        grid-template-columns: 1fr;
    }
    .nebula-content-row--right,
    .posts > :nth-child(even) {
        direction: ltr;
    }
    .nebula-content-row__image {
        border-radius: 0;
    }
}
```

## Migration

### What changes

| File | Change |
|---|---|
| `section.html` | Remove featured extraction logic; single `range` + `.Render "list"` |
| `stock/list.html` | Dispatch to `content-row` partial (unchanged mechanism) |
| `stock/featured.html` | Keep for horizon2020 compat |
| `nebula2026/list-item.html` | Replace with `content-row.html` |
| `nebula2026/featured.html` | Logic merged into `content-row.html` |
| `nebula2026.css` | Replace `.nebula-split-row` + `.nebula-split-lead` with `.nebula-content-row`; snake corners; featured text styles |
| Content files | Remove `featured: true`. Optionally add `cardLayout: featured-left` etc. |

### What stays the same

- `type: stock` — unchanged
- `weight` — controls order, unchanged
- All other frontmatter fields — unchanged
- Story single page — unaffected
- Other themes (horizon2020) — unaffected (theme-dispatch routes to different partials)
- Snake corner design token `--radius-snake: 2rem` — unchanged

### CSS class rename

| Old | New |
|---|---|
| `.nebula-split-row` | `.nebula-content-row` |
| `.nebula-split-row__image` | `.nebula-content-row__image` |
| `.nebula-split-row__text` | `.nebula-content-row__text` |
| `.nebula-split-row__title` | `.nebula-content-row__title` |
| `.nebula-split-row__authors` | `.nebula-content-row__authors` |
| `.nebula-split-row__description` | `.nebula-content-row__description` |
| `.nebula-split-lead` | absorbed into `.nebula-content-row` |
| `.nebula-split-lead__image` | absorbed into `.nebula-content-row__image` |
| `.nebula-split-lead__text` | absorbed into `.nebula-content-row__text` |

### Highlight rhythm

The current 3n+1 "highlight rhythm" (larger image, bigger title on every 3rd row starting from 1st) is independent of the layout system. It uses `:nth-child(3n+1)` and can remain, targeting `.nebula-content-row:nth-child(3n+1)`.

Consider: should `featured` layouts implicitly get the highlight treatment? Or should the highlight rhythm only apply to auto-positioned rows? This is an editorial/design decision.

## Extensibility

### Adding `review` layout (future)

1. Add `review` branch in `content-row.html` template
2. Add `.nebula-content-row__title--review` CSS styles
3. Stories use `cardLayout: review-left` or `cardLayout: review-right`
4. No changes to section.html, snake CSS, or grid structure

### Adding new layout styles

The `{style}-{direction}` naming convention scales to any future variant:
- `interview-left`, `interview-right`
- `poem-left`, `poem-right`
- `full-width` (no direction — spans both columns, no image)

Each new style only requires a template branch and CSS for the text styling. The grid, direction, and snake corners are shared infrastructure.
