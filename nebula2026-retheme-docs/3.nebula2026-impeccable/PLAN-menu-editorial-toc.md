# Plan: Menu Items, Editorials & TOC System

> Updated — April 2026. Decisions finalised.

## Problem Statement

Three related systems need better architecture:

1. **Menu items** are hardcoded to match `slug: "editorial"` or `slug: "contents"` — any page with a non-standard slug is invisible in the nav panel.
2. **Table of Contents** pages are manually curated markdown — duplicating information already present in frontmatter (title, weight, authors).
3. **Editorial preamble** — the editorial text should be embeddable on the TOC page, so a standalone editorial page is optional, not required.

## Decisions

### D1: Menu items — Use Hugo's native `menus` frontmatter

Use Hugo's built-in [front matter menu system](https://gohugo.io/content-management/menus/#define-in-front-matter) with a custom menu name: `issue`.

```yaml
# Simple — appears in menu with page title
menus: issue

# With custom label
menus:
  issue:
    name: "Congratulations"

# With explicit ordering
menus:
  issue:
    name: "Contents"
    weight: 10
```

**Nav template change**: Replace the hardcoded slug query with `site.Menus.issue` iteration, inserted between Home and the global menu items.

**Positioning without weight**: The template renders `site.Menus.issue` items in Hugo's default order (weight, then title alphabetical). For most issues this is fine — "Contents" and "Editorial" are the only two section items. If ordering matters, use `weight` on the menu entry (not the page weight — they're independent). Convention:
- Contents: `weight: 1` (first)
- Editorial: `weight: 2` (second)
- Or omit weight entirely — Hugo sorts alphabetically by name, so "Contents" < "Editorial" naturally.

**Backward compatibility**: The nav template adds a fallback — if no `menus: issue` items exist for the current section, fall back to the current slug-matching query (`slug IN ("editorial", "contents")`). This means issues ≤44 continue working without frontmatter changes. New issues use `menus: issue`.

**Scope**: `site.Menus.issue` is global (all pages declaring `menus: issue` across all sections). The nav template must filter to current section only. Hugo menu entries include `.Page` so we filter: `where .Page.Section == currentSection`.

### D2: `cardLink` — Keep as-is

No rename. `cardLink: true|false` remains a simple frontpage-only control. Menu visibility is handled by `menus: issue` (present = in menu, absent = not in menu). These are independent concerns.

### D3: Auto-generated TOC — Dynamic layout with editorial preamble

The contents page gets a dedicated nebula2026 layout that:

1. **Finds the editorial page** in the same section (if one exists) and injects its `.Content` as a preamble — regardless of whether the editorial has `cardLink: false` or not. This means an issue doesn't need a standalone editorial page; the editorial text lives on the TOC.

2. **Auto-generates the TOC** by querying all displayable pages in the section:
   - Types: `stock`, `review`, `editorial` (excluding the editorial already embedded as preamble)
   - Sorted by weight
   - Each entry: linked title + author(s) + issue label (for cross-issue reprints)

3. **Allows manual content**: If `contents.md` has body content (`.Content`), render it between the editorial preamble and the auto-TOC. This lets the editor add custom notes.

4. **The TOC page should still function without an editorial page.** If no editorial exists in the section, skip the preamble — just show the auto-TOC (with optional manual content above).

**Template location**: The dispatch happens in `page-single.html` — if the page slug is `"contents"` and theme is `nebula2026`, render the TOC layout instead of the generic page layout. Alternatively, a new partial `toc-single.html` dispatched from `page-single.html`.

### D4: TOC page design — Unique, visually striking template

The TOC page gets a bespoke design:
- **Pill-shaped TOC items** — each story is a rounded, interactive card/pill
- **Title + author only** — no descriptions, keep it clean and compact
- **Content type designed into pills** — reviews and editorials visually distinct from stock stories (e.g. subtle badge, border style, or icon treatment)
- **Per-story colour accents** from each page's `colorScheme.primary` (if set) — each pill gets its own accent
- **Basalte chromatic font** for pill titles (Fond + Volume + text-shadow, same three-layer system as frontpage)
- Responsive: stacked pills on mobile, potentially staggered/grid on desktop
- Hover/focus micro-interactions with transitions
- Design should feel like a curated gallery, not a plain list
- **Editorial preamble**: text only (no editorial image), rendered above the pill list

### D5: Backward compatibility

| Issue era | Menu | TOC | Editorial | Impact |
|-----------|------|-----|-----------|--------|
| **≤42** (horizon2020) | Not affected — horizon2020 has own nav partial | Manual `contents.md` — unchanged | `type: page`, `slug: editorial` — unchanged | **Zero impact** — theme isolation is complete |
| **43–44** (nebula2026, existing) | Fallback slug query still works | Could migrate to auto-TOC, or keep manual | `type: editorial`, `slug: editorial` — unchanged | **Optional migration** only |
| **45+** (nebula2026, new) | Use `menus: issue` frontmatter | Auto-TOC with editorial preamble | Editorial embedded in TOC; standalone page optional | **Full new system** |

## Implementation Plan

### Phase 1: Menu system

1. **Update `nav.html`**: Replace hardcoded slug query (lines 37–45) with:
   ```
   a) Iterate site.Menus.issue, filtered to current section
   b) If no issue menu items found, fall back to slug query (backward compat)
   ```

2. **Add `menus: issue` to congratulations content**:
   - `contents.md`: `menus: issue` (name defaults to page title "Table of Contents")
   - `editorial.md`: add if it should appear in menu (or omit if TOC-embedded only)

3. **Test**: Verify congratulations issue menu shows items; verify issue-44 still works via fallback.

### Phase 2: Auto-TOC with editorial preamble

1. **Create `layouts/partials/themes/nebula2026/toc-page.html`**:
   - Query section for editorial page → inject `.Content` as preamble
   - Query section for stock + review pages → generate TOC entries
   - Render any manual `.Content` from contents.md between preamble and TOC
   - Sort by weight

2. **Dispatch from `page-single.html`**:
   - If `.Slug == "contents"`, render `toc-page` partial instead of generic page layout
   - Otherwise render existing `page-single` layout

3. **Design the TOC**: Pill-shaped items with:
   - Story title (linked)
   - Author name(s)
   - Type indicator (story / review / editorial)
   - Optional: per-story colour accent from colorScheme
   - Hover/focus states with transitions
   - Responsive layout (mobile stack, desktop grid/stagger)

### Phase 3: Content migration & cleanup

1. **Congratulations issue**:
   - `editorial.md`: keep for frontpage card (`cardLayout: editorial-left`, `cardLink: false`), content embedded in TOC
   - `contents.md`: strip manual links, add `menus: issue`

2. **Issue 45**: Add `menus: issue` to editorial.md and contents.md when ready

3. **Issues 43–44**: Optional — add `menus: issue` to editorial/contents pages, or leave using fallback

4. **Documentation**: Update `REFERENCE-frontmatter-and-metatags.md` with `menus: issue` and `cardLink` docs

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│  Nav Panel                                       │
│  ┌───────────┐                                   │
│  │   Home    │  ← site.Menus.main[0]             │
│  ├───────────┤                                   │
│  │ Contents  │  ← site.Menus.issue               │
│  │ Editorial │    (filtered to current section)   │
│  │ [custom]  │    OR fallback: slug query         │
│  ├───────────┤                                   │
│  │  Archive  │  ← site.Menus.main[1:]            │
│  │   About   │                                   │
│  │   ...     │                                   │
│  └───────────┘                                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  TOC Page (contents.md, slug: "contents")        │
│                                                  │
│  ┌─ Editorial Preamble ─────────────────────┐   │
│  │  (injected from editorial.md .Content)    │   │
│  │  Renders if editorial page exists.        │   │
│  │  Independent of cardLink value.           │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌─ Manual Content ─────────────────────────┐   │
│  │  (from contents.md .Content, if any)      │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌─ Auto-TOC ───────────────────────────────┐   │
│  │  ┌─────────────────────────────────┐      │   │
│  │  │ ● Story Title — Author Name     │ pill │   │
│  │  └─────────────────────────────────┘      │   │
│  │  ┌─────────────────────────────────┐      │   │
│  │  │ ● Story Title — Author Name     │ pill │   │
│  │  └─────────────────────────────────┘      │   │
│  │  ┌─────────────────────────────────┐      │   │
│  │  │ ● Review Title — Author Name    │ pill │   │
│  │  └─────────────────────────────────┘      │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

## Resolved Questions

1. **TOC ordering**: List all entries by weight (stories and reviews interleaved). Design the content type into each pill visually — editorials and reviews should be noticeably distinct from stock stories.
2. **TOC descriptions**: No descriptions. Keep pills simple — title + author only.
3. **Per-story colour in TOC**: Yes — each pill picks up the story's `colorScheme.primary` as an accent colour. Also use the Basalte chromatic font for pill titles.
4. **Editorial image in preamble**: No image. Text content only from the editorial page.
5. **Horizon2020 backport**: No backport. But backward compatibility is essential — old issues (horizon2020) generate menu items via their own nav partial and are completely unaffected. Nebula2026 issues ≤44 use the slug-based fallback in the updated nav template.
