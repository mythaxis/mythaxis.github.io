# Troubleshooting

> Common issues with the nebula2026 theme and how to fix them

---

## Theme / Layout Issues

### Issue isn't using the new design

Check that `__index.md` has exactly `theme: nebula2026` (lowercase, no quotes needed):

```yaml
---
title: "Issue 44"
theme: nebula2026    # ✅
---
```

Common mistakes: `theme: "Nebula2026"`, `theme: nebula-2026`, `layout: nebula2026` (wrong key).

### Frontpage shows wrong theme

`config.yaml` must have the correct current issue name, matching the folder name exactly:

```yaml
params:
  currentIssue: "Issue 44"   # case-sensitive, must match folder
```

---

## Story Cards

### Cards not appearing (clicking goes straight to story)

1. Check browser console for JavaScript errors
2. Verify `story-card-interactions.js` is loading (Network tab)
3. Check that `data-has-card="true"` is present on TOC list items (View Source)

### Card shows blank fields

Add the missing frontmatter to the story:

```yaml
authors: ["Author Name"]   # must be an array
abstract: "Teaser text..."
genre: scifi
```

### Overlay not filling screen on mobile Safari

Add `-webkit-fill-available` to the overlay CSS if needed:

```css
.story-card-overlay {
  min-height: 100vh;
  min-height: -webkit-fill-available;
}
```

---

## Roundels

### Chapter markers not replacing `***` / `<hr>` tags

1. Verify `chapter-markers.js` is loading (check Network tab)
2. Check the article wrapper has the `data-chapter-marker` attribute in the HTML source
3. Make sure `<hr>` tags are inside `.nebula-article-content`

### Wrong roundel appearing

Check the cascade: story `chapterMarker` → issue `issueRoundel` → site `params.defaultChapterMarker`. Verify spelling is exact (lowercase).

### Broken roundel image

Check the file exists: `static/images/roundels/[genre]-100.svg`. There should be 16 files total. If the genre value is misspelled, the JS falls back to `orbit`.

---

## Colors

### Colors not applying

Check YAML indentation (2 spaces, not tabs) and that hex codes include `#`:

```yaml
colorScheme:
  primary: "#5a3d6e"   # ✅
  primary: "5a3d6e"    # ❌
```

Clear browser cache after changes.

---

## Build Issues

### Hugo build fails

```bash
hugo --verbose   # shows detailed error with file and line
```

Common YAML errors: duplicate keys, bad indentation, missing quotes around values with `#` (which YAML treats as a comment), invalid date format.

### Template errors

```bash
hugo --templateMetrics   # shows template performance and any issues
```

---

## Performance

### Find large images slowing things down

```bash
find static -name "*.jpg" -size +500k
```

Use `loading="lazy"` on images below the fold. For animations, prefer `transform` over `top`/`left` to avoid layout reflow.

---

## Useful Commands

```bash
hugo server -D --disableFastRender   # dev server, all drafts, full rebuilds
hugo --gc --cleanDestinationDir      # clean build
hugo --verbose                       # verbose output
hugo --templateMetrics               # template performance
```

**Last Updated:** March 2026
