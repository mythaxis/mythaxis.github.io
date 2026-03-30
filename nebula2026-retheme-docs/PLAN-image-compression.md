# Task 35.0 — Hugo Pipes Image Compression

**Date:** 2026-03-30
**Status:** Research complete — plan ready for implementation

---

## Context

Mythaxis currently serves all content images as-is — no compression, no WebP, no responsive sizing. Some source images are very large (e.g., monkeyking.jpg is 3.2MB). This task adds automatic image processing at build time via Hugo Pipes: WebP conversion, quality optimisation, and responsive `srcset` for different viewports.

---

## Current Image Architecture

### Three path resolution patterns in templates

**Pattern 1: Section-relative** (most common)
```go
{{ path.Join $page.Section $page.Params.image | relURL }}
```
Used in: intro.html, featured.html, list-item.html, article-single.html, authorfooter.html, page-single.html, catalogue pages. Constructs URL like `/issue-45/images/monkeyking.jpg`.

**Pattern 2: Smart detection** (absolute vs relative)
```go
{{- if hasPrefix . "/" -}}
  {{- $imagePath = . | relURL -}}
{{- else -}}
  {{- $imagePath = path.Join $page.Section . | relURL -}}
{{- end -}}
```
Used in: content-row.html, article-single.html (story header), page-single.html (page image). Allows both `/images/shared/review.jpg` (absolute from static/) and `images/story.jpg` (relative to section).

**Pattern 3: Static SVG roundels** (fixed path)
```html
<img src="/images/roundels/{{ $issueRoundel }}.svg" ... />
```
Used in ~15 instances. SVGs — cannot be processed by Hugo Pipes. Leave as-is.

### Image locations

| Location | Contents | Count |
|----------|----------|-------|
| `content/issue-43/images/` | Issue 43 story illustrations | ~14 files |
| `content/issue-44/images/` | Issue 44 story illustrations | ~13 files |
| `content/issue-45/images/` | Issue 45 story illustrations | 11 files |
| `static/images/shared/` | Cross-issue review images | 2 files |
| `static/images/roundels/` | SVG roundels | 10 files |

### File sizes (issue-45 sample)

| Image | Size |
|-------|------|
| monkeyking.jpg (hero) | 3.2 MB |
| monkeyking_mob.jpg | 1.4 MB |
| monkeyking_sml.jpg | 700 KB |
| Pultu10x6.jpg | 921 KB |
| Spear10x6.jpg | 725 KB |
| SearchHistory10x6.jpg | 725 KB |
| ShortReviews01_10x6.jpg | 563 KB |
| PerfectMother10x6.jpg | 513 KB |
| AgenticNecklace10x6.jpg | 1.2 MB |
| Negotiation10x6.jpg | 391 KB |
| OnMiracles10x6.jpg | 310 KB |

---

## Key Constraint: `__index.md`

Issue sections use `__index.md` (double underscore), not Hugo's standard `_index.md`. The `getThemeContext.html` partial loads these explicitly:

```go
$currSection := .Site.GetPage "section" (print $currSection "/__index.md")
```

This means section directories are **not** proper Hugo branch bundles, so `.Resources.GetMatch` won't find images in `content/issue-XX/images/`.

**Implication:** Content images must be moved to `assets/` for Hugo Pipes access.

---

## Implementation Plan

### Step 0: Verify resource access (5 min)

Before moving any files, test whether `$section.Resources` can see images despite `__index.md`. Add a temporary debug line in `intro.html`:

```go
{{ range $section.Resources }}DEBUG: {{ .Name }}{{ end }}
```

Run `hugo server` and check the homepage output. If images appear → we can use `.Resources.GetMatch` directly and skip file moves. If not → proceed with Step 1.

**Expected result:** No resources found (proceed to Step 1).

### Step 1: Move processable images to `assets/`

Move JPEG/PNG images from content to assets for nebula2026 issues only. SVGs stay in content (used by inline markdown `![](images/Orbit.svg)`, and Hugo can't process SVGs anyway).

```
content/issue-43/images/*.jpg  →  assets/issue-43/images/*.jpg
content/issue-43/images/*.png  →  assets/issue-43/images/*.png  (keep Orbit.svg in content/)
content/issue-44/images/*.jpg  →  assets/issue-44/images/
content/issue-44/images/*.png  →  assets/issue-44/images/       (keep Orbit.svg in content/)
content/issue-45/images/*.jpg  →  assets/issue-45/images/
static/images/shared/*.jpg     →  assets/images/shared/
```

Leave horizon2020 issue images untouched in `content/`.

**Files to move:** ~35 JPEGs + ~4 PNGs across 3 issues + 2 shared images.

### Step 2: Create responsive-image partial

**New file:** `layouts/partials/themes/nebula2026/responsive-image.html`

API (dict parameters):

| Param | Required | Description |
|-------|----------|-------------|
| `src` | yes | Image filename from frontmatter (e.g., `images/monkeyking.jpg`) |
| `section` | yes | Section string (e.g., `issue-45`) — or empty for absolute paths |
| `absolute` | no | If true, `src` is an absolute path like `/images/shared/foo.jpg` |
| `alt` | yes | Alt text |
| `class` | no | CSS class for the `<img>` |
| `loading` | no | `eager` or `lazy` (default: `lazy`) |
| `decoding` | no | `sync` or `async` (default: `async`) |
| `sizes` | no | Responsive `sizes` attribute (default: `100vw`) |
| `widths` | no | Slice of pixel widths (default: `480 800 1200`) |
| `quality` | no | JPEG/WebP quality (default: `80`) |
| `ariaHidden` | no | Set `aria-hidden="true"` |

Logic:
1. Resolve resource: `resources.Get (path.Join .section .src)` — or `resources.Get (strings.TrimPrefix "/" .src)` for absolute paths
2. If resource found → generate resized variants at each width (skip widths larger than original)
3. Output `<picture>` with WebP `<source>` srcset + original-format `<img>` srcset
4. If resource NOT found → fallback to plain `<img>` with URL construction (backwards-compatible)

Output structure:
```html
<picture>
  <source type="image/webp"
          srcset="...480w.webp 480w, ...800w.webp 800w, ...1200w.webp 1200w"
          sizes="(max-width: 736px) 100vw, 50vw" />
  <img src="...1200w.jpg"
       srcset="...480w.jpg 480w, ...800w.jpg 800w, ...1200w.jpg 1200w"
       sizes="(max-width: 736px) 100vw, 50vw"
       width="1200" height="800"
       alt="..." class="..." loading="lazy" decoding="async" />
</picture>
```

### Step 3: Update templates to use the partial

**15 templates to modify** (replacing `<img>` tags with partial calls):

#### Hero/landing images (eager, full-width)
- `intro.html` (line 27) — landing hero
- `article-single.html` (line 47) — story header hero
- `page-single.html` (line 21) — page hero
- `layouts/catalogue/reviews.html` — catalogue hero
- `layouts/catalogue/editorials.html` — catalogue hero
- `layouts/_default/list.html` — section list hero

Config: `widths: [480, 800, 1200, 1920]`, `sizes: "100vw"`, `loading: "eager"`, `decoding: "sync"`

#### Minimal/background images (lazy, decorative)
- `article-single.html` (line 93) — sticky header bg
- `article-single.html` (line 172) — story-end hero
- `page-single.html` (line 86) — story-end hero
- `*-content.html` (5 files) — catalogue story-end heroes

Config: `widths: [480, 800]`, `sizes: "100vw"`, `loading: "lazy"`, `ariaHidden: true`

#### Content images (frontpage rows, featured, list)
- `content-row.html` (line 29) — frontpage row images (smart detection pattern)
- `featured.html` (line 13) — featured split-lead
- `list-item.html` (line 13) — list page split-row

Config: `widths: [320, 480, 640, 800]`, `sizes: "(max-width: 736px) 100vw, 50vw"`

#### Author photos
- `authorfooter.html` (line 27) — author photo thumbnail

Config: `widths: [150, 300]`, `sizes: "150px"`, `quality: 85`

### Step 4: CSS check for `<picture>` element

The `<picture>` wrapper is transparent to CSS layout — the `<img>` retains its class and existing styles apply. Verify that `object-fit: cover` and percentage widths/heights still work.

If any layout breaks, add to `nebula2026.css`:
```css
picture { display: contents; }
```

### Step 5: Verify and test

1. `hugo server -D --disableFastRender` — full build, check all page types
2. Check `resources/_gen/images/` exists and contains processed images
3. Browser DevTools → Network tab: confirm WebP served, check file sizes
4. Test pages: homepage, story page, review page (shared image), editorial, catalogue, taxonomy
5. Check mobile viewport: srcset should serve smaller images
6. Check horizon2020 issue pages still work (images untouched)
7. Verify inline markdown SVGs still render (`![Orbit](images/Orbit.svg)`)

---

## Files Summary

**New (1):**
- `layouts/partials/themes/nebula2026/responsive-image.html`

**Modified (~15):**
- `layouts/partials/themes/nebula2026/intro.html`
- `layouts/partials/themes/nebula2026/article-single.html`
- `layouts/partials/themes/nebula2026/content-row.html`
- `layouts/partials/themes/nebula2026/featured.html`
- `layouts/partials/themes/nebula2026/list-item.html`
- `layouts/partials/themes/nebula2026/page-single.html`
- `layouts/partials/themes/nebula2026/authorfooter.html`
- `layouts/partials/themes/nebula2026/catalogue-content.html`
- `layouts/partials/themes/nebula2026/reviews-content.html`
- `layouts/partials/themes/nebula2026/editorials-content.html`
- `layouts/partials/themes/nebula2026/authors-content.html`
- `layouts/partials/themes/nebula2026/genres-content.html`
- `layouts/catalogue/reviews.html`
- `layouts/catalogue/editorials.html`
- `layouts/_default/list.html`

**Moved (~40 files):**
- `content/issue-4{3,4,5}/images/*.{jpg,png}` → `assets/issue-4{3,4,5}/images/`
- `static/images/shared/*.jpg` → `assets/images/shared/`

**Not touched:**
- SVG roundels in `static/images/roundels/` (can't process, no benefit)
- SVG orbit markers in `content/issue-XX/images/Orbit.svg` (inline markdown needs them in content/)
- All horizon2020 templates and images
- CSS file (likely no changes — verify in Step 4)

---

## Expected Impact

| Metric | Before | After (est.) |
|--------|--------|-------------|
| monkeyking.jpg (hero) | 3.2 MB | ~200 KB (WebP 800w) |
| Typical story image | 500–900 KB | ~80–150 KB (WebP 640w) |
| HTTP requests | Same | Same (no change in count) |
| Build time | ~2s | ~5–8s first build, cached after |
| Mobile page weight | ~4 MB | ~1 MB |

---

## Future Issues Convention

For issue-46+, place images in `assets/issue-46/images/` instead of `content/issue-46/images/`. The frontmatter `image:` value stays the same (e.g., `images/hero.jpg`). SVG orbit markers (if used in inline markdown) still go in `content/`.

---

## Alternative Approaches Considered

### Hugo Module mounts (no file moves)
Could mount `content/` as a secondary `assets/` source via `module.mounts` config. Avoids moving files but requires adding `go.mod` and reconfiguring all default Hugo mounts. Rejected for now — adds Go module complexity.

### Rename `__index.md` to `_index.md` (proper bundles)
Would make sections proper branch bundles, enabling `.Resources.GetMatch` directly. But this changes fundamental site architecture, affects all issues (including horizon2020), and the double-underscore naming may be intentional. Too risky for an image compression task.

### Pre-build script (not Hugo Pipes)
External tool (sharp/cwebp) to process images before Hugo runs. Achieves the same goal but bypasses Hugo Pipes, requires additional tooling, and clutters content directories with generated files.
