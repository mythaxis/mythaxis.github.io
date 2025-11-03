# Mythaxis Nebula 2026 Design System - Editor Guide

## Quick Start

The Nebula 2026 design is a modern, mobile-first layout that can be enabled per-issue. All existing issues remain unchanged unless you specifically opt them in.

### Enabling Nebula 2026 for a New Issue

Add this to your issue's `_index.md` frontmatter:

```yaml
---
title: "Issue 44"
layout: "nebula2026"
issueRoundel: "cosmic"
colorScheme:
  primary: "#5a7fa0"
  secondary: "#a68b5e"
---
```

That's it! The issue will now use the new design.

## Configuration Options

### Issue-Level Settings

These go in your issue's `_index.md`:

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `layout` | **Yes** | Enable nebula2026 design | `layout: "nebula2026"` |
| `issueRoundel` | No | Genre roundel for this issue | `issueRoundel: "fantasy"` |
| `colorScheme.primary` | No | Primary brand color | `primary: "#3a5f7d"` |
| `colorScheme.secondary` | No | Secondary brand color | `secondary: "#8b6f4e"` |

### Story-Level Settings

These go in individual story frontmatter:

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `genre` | Recommended | Story genre | `genre: "fantasy"` |
| `chapterMarker` | No | Override chapter roundel | `chapterMarker: "cosmic"` |
| `abstract` | Recommended | Story teaser for cards | `abstract: "A young mage discovers..."` |

## Available Roundels

Choose from these genre-specific roundels:

- **orbit** - Concentric orbital paths (default)
- **fantasy** - Celtic knot patterns
- **scifi** - Circuit board/technology
- **horror** - Eldritch eye
- **cosmic** - Spiral galaxy
- **supernatural** - (add to roundels folder)
- **dark** - (add to roundels folder)
- **psion** - (add to roundels folder)

Two versions of each:
- `roundels/[genre]-100.svg` - Chapter markers (in stories)
- `roundels/[genre]-200.svg` - Story-end markers
- `roundels2/[genre]-*.svg` - Intricate alternate versions

## Color Scheme Guide

### Extracting Colors from Cover Art

1. Open cover art in any image editor
2. Use eyedropper to sample 2 dominant colors
3. Get hex codes (e.g., `#3a5f7d`)
4. Add to issue frontmatter

### Color Requirements

- **Primary** - Main brand color (buttons, links, accents)
- **Secondary** - Supporting color (hover states, highlights)
- Ensure contrast ratio ≥ 4.5:1 for accessibility

### Example Schemes

```yaml
# Cool/Blue scheme
colorScheme:
  primary: "#2c5f8d"
  secondary: "#5a89b3"

# Warm/Earth scheme
colorScheme:
  primary: "#8b6f4e"
  secondary: "#b8956a"

# Dramatic/Purple scheme
colorScheme:
  primary: "#5a3a7d"
  secondary: "#8b6fae"
```

## Chapter Markers

### Adding Chapter Breaks

In your story markdown, use `***` to mark chapter breaks:

```markdown
First chapter content here.

Lorem ipsum dolor sit amet...

***

Second chapter content starts here.

More story content...

***

Final chapter.
```

The `***` will automatically be replaced with the appropriate roundel SVG based on:
1. Story's `chapterMarker` parameter (if set)
2. Site's `defaultChapterMarker` (fallback)

### Chapter Marker Behavior

- Markers appear centered between sections
- 100×100px roundels with subtle opacity
- Automatically uses genre-appropriate design
- Progressive enhancement (shows as `<hr>` if JavaScript disabled)

## Story Cards

Story cards appear when readers click/tap a story in the table of contents.

### Card Content

Automatically populated from story frontmatter:

```yaml
---
title: "The Crystal Labyrinth"
authors: ["Elara Moonwhisper"]
genre: "fantasy"
abstract: "A young mage discovers a hidden realm..."
---
```

### Card Features

- **Mobile**: Full-screen overlay with swipe navigation
- **Desktop**: Hover preview, click to fix open
- Shows: title, author, genre badge, abstract
- Navigation: previous/next story buttons
- "READ" button links to full story

## Testing Your Issue

### Before Publishing

1. **Preview locally**: `hugo server`
2. **Check on mobile**: Use browser dev tools or real device
3. **Test story cards**: Click each story in TOC
4. **Verify chapter markers**: Ensure `***` converts to roundels
5. **Check colors**: Confirm scheme matches cover art

### Validation Checklist

- [ ] Issue frontmatter includes `layout: "nebula2026"`
- [ ] Color scheme has sufficient contrast
- [ ] All stories have `abstract` for preview cards
- [ ] Chapter breaks use `***` (three asterisks)
- [ ] Cover art path is correct
- [ ] Genre roundel matches issue theme

## Troubleshooting

### "My issue still shows the old design"

Check your `_index.md`:
```yaml
layout: "nebula2026"  # ← Must be exactly this
```

### "Chapter markers not appearing"

1. Ensure you're using `***` (three asterisks) on its own line
2. Check browser console for JavaScript errors
3. Verify `chapterMarker` genre exists in `/static/images/roundels/`

### "Colors not applying"

Color scheme must be indented correctly:

```yaml
colorScheme:
  primary: "#hex"
  secondary: "#hex"
```

NOT:

```yaml
colorScheme: {primary: "#hex", secondary: "#hex"}
```

### "Story cards broken"

Ensure each story has:
- `type: stock` in frontmatter
- `authors` array (even if single author)
- Valid `abstract` text

## Site-Wide Defaults

Configured in `config.yaml`:

```yaml
params:
  currentIssue: "Issue 43"
  defaultRoundel: "orbit"
  defaultChapterMarker: "orbit"
  colorScheme:
    primary: "#3a5f7d"
    secondary: "#8b6f4e"
```

These are fallbacks when issue doesn't specify values.

## Migration Strategy

### Recommended Approach

1. **Test with one issue first** - Use `issue-test-nebula` or similar
2. **Gather feedback** - Share with beta readers
3. **Refine colors/roundels** - Adjust based on feedback
4. **Roll out gradually** - Enable for new issues only
5. **Document learnings** - Note what works best

### Backward Compatibility

- All existing issues work unchanged
- No migration required for old content
- Can enable per-issue at your own pace
- Both designs maintained indefinitely

## Advanced: Custom Roundels

To add a new roundel genre:

1. Create two SVG files:
   - `/static/images/roundels/newgenre-100.svg`
   - `/static/images/roundels/newgenre-200.svg`

2. Use in issue frontmatter:
   ```yaml
   issueRoundel: "newgenre"
   ```

3. Or in story frontmatter:
   ```yaml
   chapterMarker: "newgenre"
   ```

## Support

For technical issues or questions:
- Check `/reference/architecture.md` for system design
- Review `/reference/design-system.md` for visual specs
- See Hugo server console for build errors

---

**Remember**: The nebula2026 design is opt-in. Enable it only when you're ready, and all your existing issues remain unchanged.
