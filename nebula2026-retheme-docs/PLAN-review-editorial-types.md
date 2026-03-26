# Plan: Review & Editorial Page Types

## Overview

Add two new Hugo content types (`review` and `editorial`) to the nebula2026 theme. Both render like the existing page-single layout but participate in the frontpage cardLayout grid. The nav strip on stock pages is fixed to only page through stories. Taxonomy/catalogue pages get a consistency audit. Shared image location introduced for reusable review images.

**Scope:** Nebula2026 issues only (43+). Older horizon2020 issues keep `type: stock` / `type: page` unchanged.

---

## Current State (Problems)

| Area | Current | Problem |
|------|---------|---------|
| Editorial | `type: page`, `slug: editorial` | Not on frontpage. No cardLayout. Appears in stock nav strip. |
| Review | `type: stock`, `genres: [review]` | Renders as full story (sticky header, reading progress). Appears in stock nav strip. Same review images duplicated across 13+ issue folders. |
| Nav strip | Uses `NextInSection` / `PrevInSection` | Pages through ALL section content (stories, editorials, reviews, contents page). |
| Taxonomy layouts | Inline hero image, duplicated page chrome | Inconsistent with stock/page layout patterns. Each taxonomy layout is a standalone HTML document. |
| Archetypes | Missing nebula2026 fields | `stock.md` lacks genres, chapterMarker, cardLayout, colorScheme. `default.md` is minimal. `section.md` has legacy commented-out flexbox config. |

---

## Architecture Decisions

### 1. Hugo Content Types

Create proper Hugo types rather than relying on genre tags or slug conventions:

```
type: review      # Book reviews, short reviews
type: editorial   # Issue editorials
type: stock       # Stories (unchanged)
type: page        # Static pages: contents, about, submissions (unchanged)
```

**Why types over genres?** Types give us:
- Dedicated layout lookup (`layouts/review/single.html`)
- Clean filtering in template queries (`where .Type "review"`)
- Distinct archetypes per type
- No ambiguity between "genre: review" (a taxonomy tag) and "this is a review" (a content kind)

### 2. cardLayout Extension

Current: `[featured|review|stock]-[left|right]` (6 combos, plus auto-alternate)

New: `[featured|editorial|review|stock]-[left|right|center]` (12 combos, plus auto-alternate)

The **center** variant is a new full-width layout:
- Image spans full row width as a low banner (shorter aspect ratio than left/right)
- Title and author centered beneath the image
- Description below, also centered
- Visually breaks up the left/right alternation rhythm
- Works well for editorials (one per issue, should stand out) and featured content

The `editorial` style is a new visual treatment in the content-row partial:
- Distinct from `featured` (which uses h2 with data-text chromatic overlay)
- Uses h3 like stock, but with a subtle visual differentiator (e.g. italicized title, smaller type, or different accent)
- The editorial style signals "meta-content" vs "fiction"

### 3. Shared Images

New convention: `static/images/shared/` for images reused across issues.

```
static/images/shared/
  ShortReviews01_10x6.jpg      # SF/fantasy short reviews
  ShortCrimeReviews10x6.jpg    # Crime short reviews
  (future reusable images)
```

Review frontmatter uses absolute path:
```yaml
image: /images/shared/ShortReviews01_10x6.jpg
```

This replaces 13+ duplicate copies across issue folders. The image path logic in templates needs to handle both relative (`images/foo.jpg` → prepend section path) and absolute (`/images/shared/foo.jpg` → use as-is) paths.

### 4. Migration Strategy (Nebula2026 Only)

**Issues 43+:** Update content files to new types.
**Issues ≤42:** Leave as-is. `type: stock` reviews continue rendering via `layouts/stock/single.html`. `type: page` editorials continue via `layouts/_default/single.html`.

The catalogue/taxonomy layouts already merge Hugo pages with xway2 data — they'll be updated to query the new types alongside stock.

---

## Implementation Plan

### Step 1: Archetypes

Update all archetypes with current nebula2026 frontmatter fields.

#### `archetypes/stock.md` (update)
```yaml
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ dateFormat "2006-01-02" .Date }}
issue: Issue XX
slug: {{ .Name }}
weight: 2
type: stock
draft: true

# Authors
authors:
- Firstname Lastname
showAuthorFooter: true
copyright: "© Firstname Lastname 20XX All Rights Reserved"

# Content
description: "Short blurb for list pages"
genres:
- genre-tag

# Images
image: images/Title10x6.jpg
imageCopyright: "Image attribution (markdown supported)"

# Audio (optional, omit if unused)
# audio: "https://github.com/mythaxis/mythaxis.github.io/releases/download/iXX/filename.mp3"

# Nebula2026 theme options (optional, omit for defaults)
# cardLayout: stock-left       # [stock|featured]-[left|right], or omit for auto-alternate
# chapterMarker: MythaxisTarget  # roundel name for chapter breaks
# colorScheme:                   # per-story color override
#   primary: "#hex"
#   secondary: "#hex"
---

Story content goes here.
```

#### `archetypes/review.md` (new)
```yaml
---
title: "Review Title, by Author Name"
date: {{ dateFormat "2006-01-02" .Date }}
issue: Issue XX
slug: {{ .Name }}
weight: 7
type: review
draft: true

# Authors
authors:
- Firstname Lastname
showAuthorFooter: true
copyright: "© Firstname Lastname 20XX All Rights Reserved"

# Content
description: "Short blurb for list pages"
genres:
- review

# Images (use /images/shared/ for reusable images, or issue-local path)
image: /images/shared/ShortReviews01_10x6.jpg
imageCopyright: "Image attribution"

# Nebula2026 theme options (optional)
# cardLayout: review-left   # [review]-[left|right|center], or omit for auto-alternate
# colorScheme:
#   primary: "#hex"
#   secondary: "#hex"
---

Review content goes here.
```

#### `archetypes/editorial.md` (new)
```yaml
---
title: "Editorial"
date: {{ dateFormat "2006-01-02" .Date }}
issue: Issue XX
slug: editorial
weight: 1
type: editorial
draft: true

# Authors
authors:
- Andrew Leon Hudson

# Content
genres:
- editorial

# Images (typically uses the issue's main image)
image: images/issue_image_sml.jpg
imageCopyright: "Image attribution"

# Nebula2026 theme options (optional)
# cardLayout: editorial-center   # [editorial]-[left|right|center], or omit for auto-alternate
# colorScheme:
#   primary: "#hex"
#   secondary: "#hex"
---

Editorial content goes here.
```

#### `archetypes/default.md` (update — for generic pages like contents, about)
```yaml
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ dateFormat "2006-01-02" .Date }}
issue: Issue XX
slug: {{ .Name }}
type: page
draft: true

# Optional
# description: "Page description"
# image: images/filename.jpg
# imageCopyright: "Attribution"
---

Page content goes here.
```

#### `archetypes/section.md` (update — remove legacy flexbox config)
```yaml
---
title: "Mythaxis Magazine Issue XX"
date: {{ dateFormat "2006-01-02" .Date }}
slug: index
layout: section

# Issue metadata
theme: nebula2026
issue: Issue XX
subhead: Season 20XX
editor: Andrew Leon Hudson
issueRoundel: MythaxisTarget

# Color scheme (applies to all pages in this issue)
colorScheme:
  primary: "#hex1"
  secondary: "#hex2"

# Hero image
image: images/hero.jpg
imageMobile: images/hero_mob.jpg
imageCopyright: "Image attribution"

# Intro positioning: [top|center|bottom]-[left|center|right] or "center"
introPosition: center
# scrollLineText: "Scroll to explore"
---
```

### Step 2: Layout Files

#### 2a. New type layouts (outer HTML wrappers)

**`layouts/review/single.html`** — Mirrors `layouts/stock/single.html` structure:
```go
{{- $themeCtx := partial "functions/getThemeContext" . -}}
<!DOCTYPE HTML>
<html lang='{{ .Site.Language.Lang | default "en-us" }}'>
  {{ partial "htmlhead" . }}
  <body class="is-preload theme-{{ $themeCtx.Theme }}">
    {{ if eq $themeCtx.Theme "nebula2026" }}<a href="#main" class="skip-to-content">Skip to content</a>{{ end }}
    <div id="wrapper">
      {{ partial "header" . }}
      {{ partial "nav" . }}
      <div id="main">
        {{ partial "theme-dispatch" (dict "partial" "review-single" "context" .) }}
      </div>
      {{ if ne $themeCtx.Theme "nebula2026" }}{{ partial "copyright" . }}{{ end }}
      <a href="#navPanel" id="navPanelToggle">{{ i18n "NAV_MENU" . }}</a>
    </div>
    {{ template "_internal/google_analytics.html" . }}
    {{ partial "scripts/index" . }}
  </body>
</html>
```

**`layouts/editorial/single.html`** — Same pattern, dispatches to `editorial-single`:
```go
{{ partial "theme-dispatch" (dict "partial" "editorial-single" "context" .) }}
```

#### 2b. New nebula2026 theme partials

**`layouts/partials/themes/nebula2026/review-single.html`**
Based on `page-single.html` with these additions:
- Same hero image, title, author, divider roundel structure
- Same article content area
- Same footer area with author footer + copyright
- **No** sticky header, reading progress, or chapter markers (those are story features)
- **No** nav strip (reviews don't chain to each other)

**`layouts/partials/themes/nebula2026/editorial-single.html`**
Based on `page-single.html`:
- Same structure as page-single
- **No** nav strip

**Note:** If review-single and editorial-single end up being identical to page-single, we can simply have the type layouts (`review/single.html`, `editorial/single.html`) dispatch to `page-single` directly instead of creating new partials. This avoids partial duplication. We'd only create separate partials if the types diverge visually.

**Recommendation:** Start with dispatching to `page-single`. Create separate partials only if visual differentiation is needed later.

#### 2c. Image path handling

The `page-single.html` (and any type-specific variants) need to handle both relative and absolute image paths:

```go
{{/* Resolve image path: absolute (/images/...) or section-relative (images/...) */}}
{{- $imagePath := $page.Params.image -}}
{{- if not (hasPrefix $imagePath "/") -}}
  {{- $imagePath = path.Join $page.Section $imagePath | relURL -}}
{{- else -}}
  {{- $imagePath = $imagePath | relURL -}}
{{- end -}}
```

This same pattern is needed in `content-row.html` for frontpage cards.

### Step 3: Frontpage Integration

#### 3a. Update page queries in `section.html` and `index.html`

Current:
```go
{{ $allPosts := where (where .Site.Pages "Section" $currSection.Section) ".Type" "stock" }}
```

New — include all displayable types:
```go
{{ $sectionPages := where .Site.Pages "Section" $currSection.Section }}
{{ $allPosts := where $sectionPages ".Type" "in" (slice "stock" "review" "editorial") }}
```

This includes reviews and editorials in the frontpage content row grid, controlled by weight ordering and cardLayout.

#### 3b. Add `editorial` style + `center` direction to cardLayout parsing

Current parsing in `section.html` / `index.html`:
```go
{{- if hasPrefix $layout "featured" -}}
  {{- $style = "featured" -}}
{{- else if hasPrefix $layout "review" -}}
  {{- $style = "review" -}}
{{- end -}}
```

New:
```go
{{- if hasPrefix $layout "featured" -}}
  {{- $style = "featured" -}}
{{- else if hasPrefix $layout "review" -}}
  {{- $style = "review" -}}
{{- else if hasPrefix $layout "editorial" -}}
  {{- $style = "editorial" -}}
{{- end -}}

{{- if hasSuffix $layout "-center" -}}
  {{- $direction = "center" -}}
{{- else if hasSuffix $layout "-right" -}}
  ...
```

#### 3c. Update `content-row.html` partial

Add center direction class + editorial style rendering:

```html
<article class="nebula-content-row nebula-content-row--{{ $direction }}
  {{- if eq $style "editorial" }} nebula-content-row--editorial{{ end -}}
  {{- if eq $style "featured" }} nebula-content-row--featured{{ end -}}
  {{- if eq $style "review" }} nebula-content-row--review{{ end -}}">
```

**Center layout variant:**
- Full-width row (no left/right image split)
- Image as a wide banner above the text
- Title, author, description centered below
- Distinct visual rhythm break in the grid

**Editorial style:**
- h3 title (like stock, not h2 like featured)
- Italicized or visually differentiated to signal "meta-content"
- Works in left/right/center directions

### Step 4: Nav Strip Fix

Replace Hugo's built-in `NextInSection`/`PrevInSection` with custom filtered navigation in `article-single.html`.

```go
{{/* Build filtered stock-only page list for navigation */}}
{{- $stockPages := sort (where (where $page.Site.RegularPages "Section" $section.Section) ".Type" "stock") "Weight" "asc" -}}

{{/* Find current page index in filtered list */}}
{{- $currentIndex := -1 -}}
{{- range $i, $p := $stockPages -}}
  {{- if eq $p.File.Path $page.File.Path -}}
    {{- $currentIndex = $i -}}
  {{- end -}}
{{- end -}}

{{/* Get prev/next from filtered list */}}
{{- $prevPage := false -}}
{{- $nextPage := false -}}
{{- if gt $currentIndex 0 -}}
  {{- $prevPage = index $stockPages (sub $currentIndex 1) -}}
{{- end -}}
{{- if lt $currentIndex (sub (len $stockPages) 1) -}}
  {{- $nextPage = index $stockPages (add $currentIndex 1) -}}
{{- end -}}
```

Then use `$prevPage` / `$nextPage` instead of `NextInSection` / `PrevInSection`.

**Weight-based ordering preserved:** left = heavier weight (prev), right = lighter weight (next). Same convention as current nav strip.

### Step 5: Shared Images

#### 5a. Create shared image directory
```
static/images/shared/
  ShortReviews01_10x6.jpg
  ShortCrimeReviews10x6.jpg
```

#### 5b. Migrate nebula2026 review content to use shared paths
Update review frontmatter in issues 43+:
```yaml
image: /images/shared/ShortReviews01_10x6.jpg
```

#### 5c. Update image resolution in templates

All templates that resolve image paths need the absolute/relative check from Step 2c. Affected templates:
- `content-row.html` (frontpage cards)
- `page-single.html` (or review-single/editorial-single)
- `article-single.html` (story pages — already works with section-relative, but needs absolute support)
- `list-item.html` / `featured.html` (legacy partials, low priority)

#### 5d. Clean up duplicate images (optional, later)
After migration, the per-issue copies of `ShortReviews01_10x6.jpg` and `ShortCrimeReviews10x6.jpg` in issues 43+ can be deleted. Older issues keep their copies (no migration).

### Step 6: Catalogue & Taxonomy Updates

#### 6a. New reviews catalogue page

Create `layouts/catalogue/reviews.html` (mirrors `editorials.html` pattern):
- Queries `where .Site.Pages "Type" "review"` + xway2 data
- Renders via theme-dispatch with partial `reviews-content`
- Includes nebula2026 hero image

Create `layouts/partials/themes/nebula2026/reviews-content.html`:
- Lists reviews grouped or sorted by issue, author, etc.

Create `content/catalogue/reviews.md` (if Hugo requires a content file to trigger the layout).

#### 6b. Update editorials catalogue

`layouts/catalogue/editorials.html` currently finds editorials by `slug: editorial`. Update to also query `type: editorial`:
```go
{{ range (where (where .Site.Pages "Section" .Section) "Type" "eq" "editorial") }}
  ...
{{ end }}
{{ /* Keep existing slug-based lookup as fallback for older issues */ }}
{{ range (where (where .Site.Pages "Section" .Section) "Slug" "eq" "editorial") }}
  ...
{{ end }}
```

Or a combined approach that deduplicates.

#### 6c. Update main catalogue

`layouts/catalogue/list.html` currently queries `type: stock`. Update to include `review`:
```go
{{ range (where .Site.AllPages "Type" "in" (slice "stock" "review")) }}
```

Or decide whether reviews should appear in the main story catalogue at all (they might belong only in the reviews catalogue). **Recommendation:** Keep reviews out of the main catalogue; they have their own dedicated page.

#### 6d. Update authors taxonomy

`layouts/authors/taxonomy.html` currently queries `type: stock`. Update to include reviews and editorials:
```go
{{ $pages := where .Site.Pages "Type" "in" (slice "stock" "review" "editorial") }}
```

This ensures review authors and the editorial author appear in the author index.

#### 6e. Update genres taxonomy

`layouts/genres/taxonomy.html` already excludes "editorial" and "review" from `$ignoreGenres`. This works correctly — no change needed. Reviews tagged `genres: [review]` won't appear in genre listings.

#### 6f. Update catalogue-nav partial

`layouts/partials/themes/nebula2026/catalogue-nav.html` links to Archives, Authors, Catalogue, Editorials, Genres. Add a Reviews link.

#### 6g. Taxonomy layout consistency audit

The taxonomy layouts (`genres/taxonomy.html`, `authors/taxonomy.html`, `catalogue/list.html`, `catalogue/editorials.html`) share a common pattern:
1. Build data from Hugo pages + xway2
2. Full HTML document with getThemeContext
3. Inline nebula2026 hero image block
4. theme-dispatch for content partial

The hero image block is duplicated 4 times (soon 5 with reviews). **Recommendation for this plan:** Do not refactor the taxonomy scaffolding in this pass. The duplication is manageable and a refactor risks breaking the catalogue system. Flag for future cleanup.

If a future refactor is desired, the shared pattern could be extracted into a base template or a `taxonomy-chrome.html` partial that wraps the hero + wrapper + scripts boilerplate.

### Step 7: Content Migration (Issues 43+ Only)

#### 7a. Editorial files

Update editorial.md in issues 43, 44, 45:
```yaml
# Change:
type: page  →  type: editorial
# Add (if missing):
weight: 1
authors:
- Andrew Leon Hudson
# cardLayout is optional — omit for auto-alternate, or set explicitly:
# cardLayout: editorial-center
```

#### 7b. Review files

Update review files in issues 43, 44, 45:
```yaml
# Change:
type: stock  →  type: review
# Update image path (if using shared image):
image: /images/shared/ShortReviews01_10x6.jpg
# Keep:
genres:
- review
weight: (existing value)
cardLayout: (existing or new value)
```

**Files to update:**
- `issue-43/beautyland-marie-helene-bertino.md` — type: stock → review
- `issue-43/ShortReviews11.md` — type: stock → review
- `issue-44/payment-deferred-c-s-forester.md` — type: stock → review (note: uses `genre:` not `genres:`)
- `issue-44/ShortReviews12.md` — type: stock → review
- `issue-45/payment-deferred-c-s-forester.md` — type: stock → review
- `issue-45/ShortReviews12.md` — type: stock → review

Also fix inconsistency: `payment-deferred-c-s-forester.md` uses `genre:` (singular) instead of `genres:` (plural). Normalize to `genres:`.

#### 7c. Verify no breakage

After migration, run `hugo build` and `hugo server` to verify:
- Frontpage shows editorials and reviews in correct positions
- Review/editorial single pages render correctly
- Nav strip on stock pages skips reviews and editorials
- Catalogue pages include the right content
- Author index includes review/editorial authors

---

## CSS Changes

### New classes needed in `nebula2026.css`:

```css
/* Center direction variant */
.nebula-content-row--center {
  /* Full-width single column layout */
  display: block;          /* Override the two-column grid */
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.nebula-content-row--center .nebula-content-row__image {
  width: 100%;
  max-height: 280px;       /* Banner aspect ratio */
  overflow: hidden;
  margin-bottom: 1rem;
}
.nebula-content-row--center .nebula-content-row__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.nebula-content-row--center .nebula-content-row__text {
  text-align: center;
}

/* Editorial style modifier */
.nebula-content-row--editorial .nebula-content-row__title {
  font-style: italic;
}
```

Exact styling TBD during implementation — these are directional sketches.

---

## File Summary

### New files
| File | Purpose |
|------|---------|
| `archetypes/review.md` | Review archetype |
| `archetypes/editorial.md` | Editorial archetype |
| `layouts/review/single.html` | Review type layout wrapper |
| `layouts/editorial/single.html` | Editorial type layout wrapper |
| `layouts/catalogue/reviews.html` | Reviews catalogue data + layout |
| `layouts/partials/themes/nebula2026/reviews-content.html` | Reviews catalogue content partial |
| `static/images/shared/ShortReviews01_10x6.jpg` | Shared review image |
| `static/images/shared/ShortCrimeReviews10x6.jpg` | Shared review image |

### Modified files
| File | Change |
|------|--------|
| `archetypes/stock.md` | Add nebula2026 frontmatter fields |
| `archetypes/default.md` | Add nebula2026 fields |
| `archetypes/section.md` | Update with current nebula2026 fields, remove legacy flexbox |
| `layouts/_default/section.html` | Include review + editorial types in query; add editorial/center cardLayout parsing |
| `layouts/index.html` | Same changes as section.html |
| `layouts/partials/themes/nebula2026/content-row.html` | Add center direction + editorial style |
| `layouts/partials/themes/nebula2026/article-single.html` | Replace NextInSection/PrevInSection with filtered stock-only navigation |
| `layouts/partials/themes/nebula2026/page-single.html` | Add absolute image path support |
| `layouts/catalogue/editorials.html` | Query by type: editorial alongside slug |
| `layouts/catalogue/list.html` | Decide whether to include/exclude reviews |
| `layouts/authors/taxonomy.html` | Include review + editorial types in query |
| `layouts/partials/themes/nebula2026/catalogue-nav.html` | Add Reviews link |
| `static/themes/nebula2026.css` | Center layout + editorial style CSS |
| `content/issue-43/editorial.md` | type: page → editorial |
| `content/issue-44/editorial.md` | type: page → editorial |
| `content/issue-45/editorial.md` | type: page → editorial |
| `content/issue-43/beautyland-marie-helene-bertino.md` | type: stock → review |
| `content/issue-43/ShortReviews11.md` | type: stock → review |
| `content/issue-44/payment-deferred-c-s-forester.md` | type: stock → review, fix genre→genres |
| `content/issue-44/ShortReviews12.md` | type: stock → review |
| `content/issue-45/payment-deferred-c-s-forester.md` | type: stock → review |
| `content/issue-45/ShortReviews12.md` | type: stock → review |

### Unchanged
| File | Why |
|------|-----|
| `layouts/genres/taxonomy.html` | Already excludes editorial + review genres |
| `layouts/stock/single.html` | Stock type unchanged |
| `layouts/_default/single.html` | Page type unchanged (used for contents, about, etc.) |
| All content in issues ≤42 | Out of migration scope |

---

## Implementation Order

1. **Archetypes** — Low risk, no runtime impact
2. **Shared images** — Copy files, no template changes yet
3. **Layout files** — New type layouts + theme partials
4. **Frontpage cardLayout** — section.html, index.html, content-row.html
5. **Nav strip fix** — article-single.html
6. **Image path handling** — content-row.html, page-single.html
7. **Content migration** — Update frontmatter in issues 43-45
8. **Catalogue + taxonomy** — reviews catalogue, editorials update, authors update, catalogue-nav
9. **CSS** — Center layout, editorial style
10. **Build + test** — `hugo build`, `hugo server`, visual regression

---

## Open Questions / Future Considerations

1. **Review-single vs page-single divergence:** Start by dispatching review/editorial types to `page-single` partial. Only create separate `review-single.html` / `editorial-single.html` partials if the types need visual differentiation on their single pages. This avoids partial duplication upfront.

2. **Main catalogue inclusion:** Should reviews appear in the main `/catalogue/` story list, or exclusively in `/catalogue/reviews/`? Recommendation: exclusive to reviews catalogue.

3. **Editorial in contents.md:** The ToC page manually lists stories. Should it auto-generate from type queries, or remain manual? Recommendation: remain manual (editor control).

4. **Taxonomy layout refactor:** The 5 catalogue/taxonomy layouts share ~30 lines of boilerplate (HTML wrapper, hero image, scripts). A future refactor could extract this into a shared base. Not in scope for this plan.

5. **issue-44 directory:** The issue-44 directory contains content files referencing "Issue 44" but issue-45 also references "Issue 44" in the `__index.md` title. This appears to be a pre-existing naming inconsistency (issue-45 folder has `title: "Mythaxis Magazine Issue 44"` but `issue: Issue 45`). Not addressed in this plan.

6. **Basalte center variant:** The center cardLayout could use the Basalte chromatic title treatment (like featured). Deferred to CSS implementation.
