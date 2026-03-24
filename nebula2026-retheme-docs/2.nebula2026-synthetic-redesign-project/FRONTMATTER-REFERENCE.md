# Frontmatter Reference

> All frontmatter fields for the nebula2026 theme

---

## Site Config (`config.yaml`)

```yaml
params:
  currentIssue: "Issue 44"          # used by homepage
  defaultTheme: nebula2026          # site-wide default
  defaultRoundel: orbit             # fallback roundel
  defaultChapterMarker: orbit       # fallback chapter marker
  colorScheme:
    primary: "#3a5f7d"              # fallback primary color
    secondary: "#8b6f4e"            # fallback secondary color
```

---

## Issue Frontmatter (`__index.md`)

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | String | — | Issue title, e.g. `"Issue 44"` |
| `date` | Date | — | Publication date (YYYY-MM-DD) |
| `theme` | String | site default | `nebula2026` or `horizon2020` |
| `issueRoundel` | String | site default | Roundel shown at end of stories |
| `image` | String | — | Path to cover art (relative to issue folder) |
| `season` | String | — | Season name, e.g. `Winter` |
| `year` | String | — | Publication year |
| `colorScheme.primary` | String | site default | Hex color for main accents |
| `colorScheme.secondary` | String | site default | Hex color for secondary accents |

### Example

```yaml
---
title: "Issue 44"
date: 2025-12-01
theme: nebula2026
issueRoundel: cosmic
image: images/cover.jpg
season: Winter
year: "2025"
colorScheme:
  primary: "#5a3d6e"
  secondary: "#a8765c"
---
```

---

## Story Frontmatter

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | String | — | Story title |
| `type` | String | — | Must be `stock` for fiction |
| `authors` | Array | — | Author name(s) as array |
| `date` | Date | — | Publication date |
| `genre` | String | — | Genre shown on preview card |
| `chapterMarker` | String | cascades from issue/site | Roundel for `***` section breaks |
| `image` | String | — | Story artwork path |
| `description` | String | Hugo auto-summary | Teaser text for preview card |
| `audio` | String | — | Audio file URL |
| `featured` | Boolean | `false` | Featured position (horizon2020 only) |

### Example

```yaml
---
title: "The Last Algorithm"
type: stock
authors: ["Jane Smith"]
genre: scifi
chapterMarker: scifi
image: algorithm-art.jpg
description: "A quantum computer achieves consciousness and must decide humanity's fate."
date: 2025-12-01
---
```

---

## Cascade Order

**Chapter markers:**
1. Story `chapterMarker`
2. Issue `issueRoundel`
3. Site `params.defaultChapterMarker`

**Colors:**
1. Issue `colorScheme`
2. Site `params.colorScheme`

**Theme:**
1. Issue `theme`
2. Site `params.defaultTheme`

---

## Valid Roundel Values

`orbit` `fantasy` `scifi` `horror` `cosmic` `dark` `supernatural` `psion`

Values are lowercase and must match exactly.

---

## Format Notes

```yaml
# Colors: must include # and be 6-digit hex
colorScheme:
  primary: "#5a3d6e"   # ✅
  primary: "5a3d6e"    # ❌ missing #

# Authors: must be array
authors: ["Jane Smith"]         # ✅
authors: ["Jane Smith", "Bob"]  # ✅ co-authors
authors: "Jane Smith"           # ❌ not an array

# Image paths: relative to issue folder
image: story-art.jpg            # ✅
image: images/cover.jpg         # ✅
image: /content/issue-44/...    # ❌ absolute path
```

**Last Updated:** March 2026
