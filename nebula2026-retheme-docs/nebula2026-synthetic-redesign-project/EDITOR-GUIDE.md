# Editor Guide

> How to publish an issue using the Nebula 2026 theme

---

## Quick Start

Add one line to the issue's `__index.md`:

```yaml
theme: nebula2026
```

That's it. The issue and all its stories will use the new design.

---

## Full Issue Frontmatter

```yaml
---
title: "Issue 44"
date: 2025-12-01
theme: nebula2026         # ← enables the new design
issueRoundel: cosmic      # roundel shown at end of each story
image: images/cover.jpg   # full-bleed hero image
season: Winter
year: "2025"

# Optional: match colors to your cover art
colorScheme:
  primary: "#5a3d6e"
  secondary: "#a8765c"
---
```

---

## Story Frontmatter

Stories inherit the theme from their parent issue automatically. Optionally add:

```yaml
---
title: "The Last Algorithm"
type: stock
authors: ["Jane Smith"]
genre: scifi
chapterMarker: scifi       # roundel used for *** dividers in the story
image: story-art.jpg       # artwork shown in the preview card
abstract: "A quantum computer achieves consciousness..."
date: 2025-12-01
---
```

**Key fields:**
- `chapterMarker` — roundel for in-story section breaks (defaults to `orbit`)
- `abstract` — teaser text shown in the story preview card; Hugo auto-summary is used if absent
- `image` — story-specific artwork for the card; optional but recommended


---

## Available Roundels

8 genre-specific roundels, each in two sizes:

| Value | Description |
|-------|-------------|
| `orbit` | Default — concentric circles |
| `fantasy` | Celtic knotwork |
| `scifi` | UFO beam figure |
| `horror` | Cracked eyeball |
| `cosmic` | Swirling galaxy spiral |
| `dark` | Grinning skull |
| `supernatural` | Crossed swords |
| `psion` | Mutated hand |

- **100px** — chapter marker (replaces `***` or `<hr>` in stories)
- **200px** — story-end marker (appears in the story footer)

---

## Color Customization

Issue colors cascade down from cover art to buttons, backgrounds, and accents:

1. Pick two colors from your cover art using a color picker
2. Add them to the issue frontmatter under `colorScheme`
3. Use full 6-digit hex codes with `#`

```yaml
colorScheme:
  primary: "#5a3d6e"    # main accent (buttons, highlights)
  secondary: "#a8765c"  # supporting accent
```

Avoid colors close to pure white or black — they won't contrast well against text.

---

## Story Card Requirements

A card appears automatically for each story in the TOC. For best results:
- Add an `abstract` to each story (otherwise Hugo uses an auto-generated excerpt)
- Add an `image` to each story (the card works without it but looks better with one)

---

## Reverting to the Old Layout

Remove the `theme:` line, or explicitly set it:

```yaml
theme: horizon2020
```

---

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues.

**Last Updated:** March 2026
