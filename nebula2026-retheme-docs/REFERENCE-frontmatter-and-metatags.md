# Frontmatter & Meta Tags Reference

Reference for all frontmatter fields and HTML meta tag output in the Mythaxis Hugo site.

---

## Site Config (`config.yaml` params)

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `defaultTheme` | string | `nebula2026` | Active theme (`nebula2026` or `horizon2020`). Override per-section in `__index.md`. |
| `brandRoundel` | string | `MythaxisIcon` | Brand roundel SVG name. Used on site-level page dividers, and drives the MYTH(roundel)AXIS logotype via `--brand-roundel-url` CSS custom property. Overridden per-section in `__index.md`. Also the ultimate fallback for `issueRoundel` and `chapterMarker`. |
| `issueRoundel` | string | `MythaxisIcon` | Default issue roundel. Overridden per-section in `__index.md`. Used on story pages (footer, sticky header, nav panel). Falls back to `brandRoundel`. |
| `chapterMarker` | string | `MythaxisIcon` | Default chapter-break roundel. Overridden per-section and per-story. Falls back to `brandRoundel`. |
| `colorScheme.primary` | string | `#3a5f7d` | Fallback primary CSS color |
| `colorScheme.secondary` | string | `#8b6f4e` | Fallback secondary CSS color |
| `colorScheme.accent` | string | — | Fallback accent color (used for chromatic font text-shadow) |
| `currentIssue` | string | — | Display label for the current issue, e.g. "Issue 45" |

### Roundel Cascade

| Context | Resolution order |
|---------|-----------------|
| **Logotype roundel** (intro, header, nav panel) | section `brandRoundel` → site `brandRoundel` (via `--brand-roundel-url` CSS custom property) |
| **Site-level page dividers** (contents, about, catalogue, taxonomy) | site `brandRoundel` only |
| **Story footer / sticky header** | story `storyRoundel` → section `issueRoundel` → site `issueRoundel` → `brandRoundel` |
| **Chapter breaks** (`<hr>` tags) | story `chapterMarker` → section `chapterMarker` → story `storyRoundel` → site `chapterMarker` → `brandRoundel` |

#### Bidirectional Inheritance

The `storyRoundel` and `chapterMarker` frontmatter fields work bidirectionally:

- **Set only `storyRoundel`:** Both footer/header AND chapter breaks inherit it
- **Set only `chapterMarker`:** Chapter breaks use it; footer/header use issue default
- **Set both:** Chapter breaks use `chapterMarker`; footer/header use `storyRoundel`

**Examples:**
```yaml
# Scenario 1: MythaxisFaces everywhere
storyRoundel: MythaxisFaces
# → Footer/header: MythaxisFaces
# → Chapter breaks: MythaxisFaces (inherited from storyRoundel)

# Scenario 2: Different roundels for different contexts
storyRoundel: MythaxisFaces
chapterMarker: MythaxisTarget
# → Footer/header: MythaxisFaces
# → Chapter breaks: MythaxisTarget

# Scenario 3: Custom chapter breaks only
chapterMarker: MythaxisTarget
# → Footer/header: (uses issueRoundel default)
# → Chapter breaks: MythaxisTarget
```

#### No Validation

Roundel names are **not validated** against a whitelist. Any roundel name can be used in frontmatter. If the SVG file doesn't exist at `/images/roundels/{name}.svg`, the system falls back to `MythaxisIcon` via JavaScript 404 handling. This means you can add new roundels to `/static/images/roundels/` without updating any code.

---

## Content Type Frontmatter

### Stock (stories)

Archetype: `archetypes/stock.md` | Layout: `article-single` (sticky header, reading progress, nav strip)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | yes | — | Story title |
| `date` | date | yes | — | Publication date (YYYY-MM-DD) |
| `issue` | string | yes | — | Display label, e.g. "Issue 45" |
| `slug` | string | yes | — | URL slug |
| `weight` | int | yes | — | Sort order within issue (lower = earlier in nav strip) |
| `type` | string | yes | `stock` | Must be `stock` |
| `draft` | bool | no | `false` | Hugo draft flag |
| `authors` | list | yes | — | Author name(s) |
| `showAuthorFooter` | bool | no | `true` | Show author bio footer |
| `copyright` | string | no | — | Copyright notice |
| `description` | string | no | — | Blurb for frontpage cards and meta description |
| `genres` | list | no | — | Genre taxonomy tags |
| `image` | string | no | — | Hero image path (section-relative or absolute `/images/...`) |
| `imageCopyright` | string | no | — | Image attribution (markdown supported) |
| `audio` | string | no | — | MP3 URL for audio player and remote button |
| `featured` | bool | no | `false` | Legacy horizon2020 featured flag |
| `cardLayout` | string | no | auto-alternate | Frontpage layout: `stock-left`, `stock-right`, `featured-left`, etc. |
| `cardLink` | bool | no | `true` | When `false`, frontpage card is visible but not clickable (no link to standalone page) |
| `storyRoundel` | string | no | inherits from `issueRoundel` | Roundel for story footer/header. Also inherited by chapter breaks if `chapterMarker` not set. |
| `chapterMarker` | string | no | inherits from `storyRoundel` | Roundel name for chapter breaks (`<hr>` tags). Falls back to `storyRoundel` if not set. |
| `colorScheme` | object | no | inherits from section | Per-story color override |
| `colorScheme.primary` | string | no | — | Primary CSS color |
| `colorScheme.secondary` | string | no | — | Secondary CSS color |
| `colorScheme.accent` | string | no | — | Accent color (text-shadow for chromatic font) |

### Review

Archetype: `archetypes/review.md` | Layout: `article-single` (same as stock)

Identical fields to stock, with these typical differences:

| Field | Typical Value | Notes |
|-------|---------------|-------|
| `type` | `review` | Must be `review` |
| `weight` | `7` | Reviews typically sort after stories |
| `genres` | `[review]` | Review genre tag |
| `image` | `/images/shared/...` | Often uses shared images across issues |
| `cardLayout` | `review-left`, `review-right`, `review-center` | Review-specific variants available |

### Editorial

Archetype: `archetypes/editorial.md` | Layout: `editorial-single` (hero overlay with cutout header)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | yes | — | Usually "Editorial" |
| `date` | date | yes | — | Publication date |
| `issue` | string | yes | — | Display label |
| `slug` | string | yes | `editorial` | URL slug |
| `weight` | int | yes | `1` | Typically first in issue |
| `type` | string | yes | `editorial` | Must be `editorial` |
| `authors` | list | yes | — | Author name(s) |
| `description` | string | no | — | Subtitle for editorial-center banner cards |
| `genres` | list | no | `[editorial]` | Genre taxonomy tag |
| `image` | string | no | — | Image path (editorial's own image fills the hero) |
| `imageCopyright` | string | no | — | Image attribution |
| `cardLayout` | string | no | — | Only appears on frontpage if explicitly set: `editorial-left`, `editorial-right`, `editorial-center` |
| `excerptLength` | int | no | `280` | Character count for truncating body content on editorial-center banner cards |
| `cardLink` | bool | no | `true` | When `false`, frontpage card is visible but not clickable |
| `colorScheme` | object | no | inherits from section | Per-page color override |

Editorials use a distinct hero-overlay layout where the editorial's own image fills the hero area (not the issue cover), with title, author, and roundel overlaying the bottom as individually-backgrounded cutout pills.

Editorials are excluded from the nav strip and the TOC. They only appear on the frontpage when `cardLayout` is explicitly set.

#### Editorial Banner Cards (`editorial-center`)

The `editorial-center` layout creates a full-width banner card with distinctive styling:
- Title and subtitle (description) flow inline
- Excerpt shows trimmed body content
- Excerpt control: `<!--more-->` marker takes precedence, then `excerptLength`, then default 280 chars
- Author name hidden on card (appears on editorial page itself)
- Unified title sizing across all editorial layouts

#### Frontpage-only editorial (no standalone page)

To show an editorial card on the frontpage without linking to a separate page, combine `cardLink` with Hugo's `_build`:

```yaml
cardLayout: editorial-left
cardLink: false
_build:
  render: never
  list: always
```

- `cardLink: false` — card renders without any hyperlinks (title and image are plain text/image)
- `_build.render: never` — Hugo skips generating the standalone page (no `/issue-XX/slug.html`)
- `_build.list: always` — page still appears in page collections (frontpage query, taxonomy, etc.)

Without `_build.render: never`, the standalone page still exists at its URL and is accessible directly or via the nav menu — only the frontpage card is affected by `cardLink`.

### Page (generic)

Archetype: `archetypes/default.md` | Layout: `page-single`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | yes | — | Page title |
| `date` | date | yes | — | Publication date |
| `issue` | string | no | — | Display label |
| `slug` | string | yes | — | URL slug |
| `type` | string | yes | `page` | Must be `page` |
| `description` | string | no | — | Page description |
| `image` | string | no | — | Image path |
| `imageCopyright` | string | no | — | Image attribution |

---

## Section Frontmatter (Issue Index)

Archetype: `archetypes/section.md` | File: `content/issue-XX/__index.md`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | yes | — | Issue title, e.g. "Mythaxis Magazine Issue 45" |
| `date` | date | yes | — | Publication date |
| `slug` | string | yes | `index` | URL slug |
| `layout` | string | yes | `section` | Must be `section` |
| `theme` | string | yes | `nebula2026` | Theme name (`nebula2026` or `horizon2020`) |
| `issue` | string | yes | — | Display label, e.g. "Issue 45" |
| `subhead` | string | no | — | Subtitle shown in intro, e.g. "Spring 2026" |
| `editor` | string | no | — | Editor name (defined but not currently rendered in templates) |
| `brandRoundel` | string | no | inherits from site | Brand roundel for this issue. Drives the logotype roundel (`--brand-roundel-url`) and site-level page dividers when viewing this section. |
| `issueRoundel` | string | no | `MythaxisTarget` | Roundel SVG name for the issue (story pages only; site-level pages always use `brandRoundel`) |
| `colorScheme` | object | no | — | Issue-wide color scheme |
| `colorScheme.primary` | string | no | — | Primary CSS color |
| `colorScheme.secondary` | string | no | — | Secondary CSS color |
| `colorScheme.accent` | string | no | — | Accent color (text-shadow for chromatic Basalte font on featured titles) |
| `image` | string | yes | — | Hero image path (section-relative) |
| `imageMobile` | string | no | — | Mobile hero image variant |
| `imageCopyright` | string | no | — | Image attribution |
| `introPosition` | string | no | `center` | Intro block position: `center`, `center-left`, `top-right`, etc. (9-position grid) |
| `introPositionMobile` | string | no | `center` | Mobile vertical override: `top`, `center`, `bottom`. Always centered horizontally. |
| `scrollLineText` | string | no | — | Scroll indicator text (defined in archetype, used in intro partial) |

---

## Author Frontmatter

Archetype: `archetypes/authors.md` | File: `content/authors/author-name.md`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `date` | date | yes | — | Creation date |
| `type` | string | yes | `author` | Must be `author` |
| `name` | string | yes | — | Display name |
| `photo` | string | no | — | Author photo path |
| `avatar` | string | no | — | Unused (duplicate of `photo`) |
| `copyright` | string | no | — | Author copyright notice |
| `description` | string | no | — | Author bio (markdown supported) |

---

## HTML Meta Tags

Template: `layouts/partials/htmlhead.html`

### Standard Meta

| Tag | Source | Notes |
|-----|--------|-------|
| `charset` | hardcoded `utf-8` | |
| `viewport` | hardcoded | `width=device-width, initial-scale=1, user-scalable=no` |
| `keywords` | `Site.Params.keywords` | Site-level only (from `config.yaml`) |
| `description` | page `.Description`, fallback to `Site.Params.description` | Page-level when available |

### Dublin Core

| Tag | Source | Notes |
|-----|--------|-------|
| `DC.Title` | computed page title | Format: "Title — Section — Site" |
| `DC.Creator` | `.Params.authors` (plural), fallback `.Params.author` (singular) | One `<meta>` tag per author |
| `DC.Date` | `.Params.date` | ISO 8601 format (YYYY-MM-DD). Conditional — only rendered if date exists. |
| `DC.Format` | hardcoded `text/html` | |
| `DC.Language` | `.Site.Language.Lang` | e.g. `en` |
| `DC.Subject` | `.Params.genres` (plural), fallback `.Params.genre` (singular) | One `<meta>` tag per genre |

### Open Graph

| Tag | Source | Notes |
|-----|--------|-------|
| `og:title` | `.Title` | Raw page title (no section/site suffix) |
| `og:type` | computed | `article` for stock, review, editorial; `website` for everything else |
| `og:url` | `.Permalink` | Full canonical URL |
| `og:description` | same as `<meta description>` | Page-level with site fallback |
| `og:image` | `.Params.image` | Absolute URL; handles both `/images/shared/...` and section-relative paths |

### Example Output — Story Page

```html
<meta name="description" content="Story blurb from frontmatter..." />

<meta name="DC.Title" content="The Witness — Mythaxis Magazine Issue 44 — MYTHAXIS MAGAZINE" />
<meta name="DC.Creator" content="Donald McCarthy" />
<meta name="DC.Date" content="2025-12-24" />
<meta name="DC.Format" content="text/html">
<meta name="DC.Language" content="en">
<meta name="DC.Subject" content="crime" />

<meta property="og:title" content="The Witness" />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://mythaxis.co.uk/issue-45/the-witness.html" />
<meta property="og:description" content="Story blurb from frontmatter..." />
<meta property="og:image" content="https://mythaxis.co.uk/issue-45/images/Witness10x6.jpg" />
```

### Example Output — Landing Page

```html
<meta name="description" content="Speculative Fiction Without Distraction" />

<meta name="DC.Title" content="MYTHAXIS MAGAZINE — Speculative Fiction Without Distraction" />
<meta name="DC.Format" content="text/html">
<meta name="DC.Language" content="en">

<meta property="og:title" content="MYTHAXIS MAGAZINE" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://mythaxis.co.uk/" />
<meta property="og:description" content="Speculative Fiction Without Distraction" />
```

---

## Frontpage Display Rules

- **Stock + Review:** auto-alternate left/right rows by default. `cardLayout` overrides position.
- **Editorial:** only appears on frontpage if `cardLayout` is explicitly set in frontmatter.
- **Center variant:** `cardLayout: editorial-center` (or `stock-center`, `review-center`) renders a full-width banner row.
- **`cardLink: false`:** any content type — card is visible but title/image don't link to the standalone page. Useful for editorials that serve as frontpage-only announcements.

### Nav Strip Rules

The bottom-of-page nav strip on stock/review pages paginates through `type: stock` and `type: review` pages only, sorted by `weight` ascending. Editorials are always excluded.

---

## Image Path Resolution

Templates handle two image path formats:

| Format | Example | Resolution |
|--------|---------|------------|
| Section-relative | `images/Title10x6.jpg` | Joined with page section: `/issue-45/images/Title10x6.jpg` |
| Absolute | `/images/shared/ShortReviews01_10x6.jpg` | Used as-is (via `relURL` or `absURL`) |

Templates check `hasPrefix . "/"` to determine which path style is in use. This applies in `article-single.html`, `page-single.html`, `content-row.html`, and `htmlhead.html` (for og:image).
