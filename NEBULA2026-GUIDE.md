# Nebula2026 Theme Guide

Quick reference for using the Mythaxis nebula2026 theme.

---

## For Editors: Quick Start

### Enable Nebula2026 for an Issue

Add to your issue's `__index.md`:

```yaml
---
title: "Issue 44"
theme: nebula2026
issueRoundel: cosmic
---
```

### Story Frontmatter

```yaml
---
title: "The Last Algorithm"
type: stock
authors: ["Jane Smith"]
genre: scifi
chapterMarker: scifi
image: story-art.jpg
abstract: "A quantum computer achieves consciousness..."
---
```

**Key fields:**
- `chapterMarker`: Roundel used for `<hr>` dividers (defaults to `orbit`)
- `abstract`: Text shown in story card preview
- `image`: Story-specific cover art

---

## Available Roundels

8 genre-specific roundels in two sizes:

| Genre | Use |
|-------|-----|
| `orbit` | Default, general sci-fi/fantasy |
| `fantasy` | Fantasy stories (Celtic knot design) |
| `scifi` | Science fiction (geometric pattern) |
| `horror` | Horror stories (eye design) |
| `cosmic` | Space/cosmic horror (galaxy spiral) |
| `dark` | Dark fantasy (skull design) |
| `supernatural` | Supernatural fiction (crossed swords) |
| `psion` | Psychic/mental powers (hand with energy) |

**Sizes:**
- `100px` - Chapter markers (replaces `<hr>` tags in stories)
- `200px` - Story-end markers (appears in footer)

---

## Story Cards

Interactive preview cards automatically appear when readers click story listings.

**Features:**
- Click any story card → preview overlay appears
- Shows: title, authors, abstract, cover art
- Click "READ STORY" → navigate to full story
- Click background or X → close overlay

**Requirements:**
- Story must have `abstract` or Hugo will use auto-generated summary
- Optional: `image` for visual appeal

---

## For Developers

### File Structure

```
static/
├── js/nebula2026/
│   ├── chapter-markers.js       # <hr> → roundel replacement
│   └── story-card-interactions.js  # Preview overlay system
└── images/roundels/
    └── [genre]-[size].svg       # 16 SVG files

layouts/partials/themes/nebula2026/
├── article-single.html          # Story page template
├── list-item.html               # Story card in TOC
├── scripts.html                 # Loads theme JS
└── styles.html                  # Loads theme CSS

static/themes/
└── nebula2026.css               # ~710 lines total
```

### How It Works

**Chapter Markers:**
- `chapter-markers.js` runs on page load
- Finds all `<hr>` tags in `.nebula-article-content`
- Reads `data-chapter-marker` from article wrapper
- Replaces each `<hr>` with appropriate roundel image

**Story Cards:**
- Each story card has `data-*` attributes with metadata
- Click triggers `story-card-interactions.js`
- Populates overlay with story data
- Handles show/hide/navigation

### Configuration

In `config.yaml`:

```yaml
params:
  defaultTheme: nebula2026
  currentIssue: Issue 44
  defaultRoundel: orbit
  defaultChapterMarker: orbit
```

---

## Troubleshooting

### Story cards not appearing
- Check `data-has-card="true"` on article elements
- Verify story has `abstract` in frontmatter
- Check browser console for JavaScript errors

### Roundels not showing
- Verify genre spelling matches exactly (lowercase)
- Check `/images/roundels/[genre]-100.svg` exists
- Defaults to `orbit` if genre not found

### Chapter markers not replacing
- Ensure story template has `data-chapter-marker` attribute
- Check `<hr>` tags are inside `.nebula-article-content`
- Verify JavaScript is loading (check Network tab)

### Styling issues
- Nebula2026 CSS is in `/themes/nebula2026.css`
- Check theme resolution in browser DevTools
- Verify `theme: nebula2026` in issue frontmatter

---

## Testing Checklist

Before publishing an issue with nebula2026:

- [ ] Issue displays correctly (intro, hero image)
- [ ] All story cards appear in TOC
- [ ] Story cards open on click
- [ ] Story previews show correct data
- [ ] "READ STORY" button navigates correctly
- [ ] Chapter markers appear in stories with `<hr>` tags
- [ ] Story-end marker appears in footer
- [ ] Mobile responsive (test on phone)
- [ ] No console errors

---

**Last Updated:** January 2026
**Theme Version:** 1.0 (POC branch)
