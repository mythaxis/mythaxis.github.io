# Developer Reference

> Architecture and technical details for the Mythaxis theme system

---

## Architecture Overview

The site uses a theme dispatch system: every page determines its active theme, then loads theme-specific partials for all UI components. The two themes are fully isolated — they share no CSS or JavaScript.

```
Page request
    ↓
layouts/partials/functions/getCurrentTheme.html
    ↓ returns "nebula2026" or "horizon2020"
layouts/partials/theme-dispatch.html
    ↓
layouts/partials/themes/{theme}/*.html
```

### Theme Detection (`getCurrentTheme.html`)
1. Checks `theme` param in page/section frontmatter
2. Falls back to `params.defaultTheme` in `config.yaml`
3. Returns the theme name string

### Theme Dispatch (`theme-dispatch.html`)
- Central router used by all layout templates
- Calls `{{ partial "themes/nebula2026/foo.html" . }}` or `{{ partial "themes/horizon2020/foo.html" . }}`
- Falls back to shared partials when no theme-specific version exists

---

## File Structure

### Layout Partials

```
layouts/partials/
├── theme-dispatch.html
├── functions/
│   └── getCurrentTheme.html
└── themes/
    ├── horizon2020/          ← legacy theme (issues 23–43)
    │   └── *.html
    └── nebula2026/           ← new theme (issue 44+)
        ├── article-single.html
        ├── list-item.html
        ├── scripts.html      ← loads JS
        ├── styles.html       ← loads CSS
        └── *.html
```

### Static Assets

```
static/
├── themes/
│   ├── horizon2020.css       ← complete, self-contained (includes fonts)
│   └── nebula2026.css        ← complete, self-contained (~710 lines)
├── js/nebula2026/
│   ├── chapter-markers.js    ← replaces <hr> with roundel SVGs
│   └── story-card-interactions.js  ← preview overlay behavior
└── images/roundels/
    ├── orbit-100.svg
    ├── orbit-200.svg
    └── [genre]-[100|200].svg  ← 16 files total
```

---

## CSS Architecture

Each theme loads its own complete stylesheet — no shared CSS between themes.

**horizon2020** loads: `horizon2020.css` + Massively SCSS (`main.css`, `noscript.css`) + jQuery bundle

**nebula2026** loads: `nebula2026.css` only (plain CSS, no SCSS, no jQuery)

Dynamic page-specific styles (background images from frontmatter) are injected as inline `<style>` in each theme's `styles.html` partial.

---

## JavaScript: Chapter Markers

`chapter-markers.js` runs on page load on story pages:

1. Finds all `<hr>` tags inside `.nebula-article-content`
2. Reads the `data-chapter-marker` attribute from the article wrapper
3. Replaces each `<hr>` with an `<img>` pointing to `/images/roundels/[genre]-100.svg`
4. Falls back to `orbit` if the genre file doesn't exist

The article template sets the data attribute from frontmatter:
```html
<article class="nebula-article-content" data-chapter-marker="{{ .Params.chapterMarker | default "orbit" }}">
```

---

## JavaScript: Story Cards

`story-card-interactions.js` handles the preview overlay on issue/section pages:

- Each TOC item has `data-*` attributes with story metadata (title, authors, abstract, image, URL)
- Clicking a TOC item populates the overlay and shows it
- Clicking the background or ✕ button hides it
- READ button navigates to the story URL

Data attributes are set in `list-item.html`:
```html
<li data-story-url="{{ .RelPermalink }}"
    data-story-title="{{ .Title }}"
    data-story-authors="{{ delimit .Params.authors ", " }}"
    data-story-genre="{{ .Params.genre }}"
    data-story-abstract="{{ .Params.abstract }}"
    data-story-image="{{ .Params.image }}"
    data-has-card="true">
```

---

## Adding a New Issue

1. Set `theme: nebula2026` in `__index.md`
2. Add `issueRoundel`, `colorScheme`, and `image` if customising
3. For each story, add `chapterMarker`, `abstract`, and `image` where available
4. Run `hugo server` and verify

---

## Creating a New Theme

1. Create `layouts/partials/themes/mytheme/` — copy an existing theme's partials as a starting point
2. Create `static/themes/mytheme.css` — self-contained, no dependencies on other theme files
3. Create `layouts/partials/themes/mytheme/scripts.html` — load any JS the theme needs
4. Set `theme: mytheme` in an issue's frontmatter to test

**Last Updated:** March 2026
