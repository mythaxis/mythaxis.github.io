# Mythaxis Magazine

**Speculative Fiction Without Distraction**

[mythaxis.co.uk](https://mythaxis.co.uk) — a quarterly online magazine of science fiction, fantasy, and modern speculative fiction, edited by Andrew Leon Hudson. Published since 2008 and still going.

Built with [Hugo](https://gohugo.io/). Hosted on GitHub Pages.

---

## The Nebula2026 Theme

Mythaxis runs a custom dual-theme system. Each issue section can declare its own theme in frontmatter:

| Theme | Issues | Style |
|-------|--------|-------|
| **nebula2026** | 43+ | Bespoke design with chromatic typography, parallax heroes, and hand-drawn SVG roundels |
| **horizon2020** | 1–42 | Legacy theme based on HTML5 UP's *Massively* |

Themes coexist via a two-file dispatch system (`getThemeContext.html` + `theme-dispatch.html`) that routes templates per-section — the canonical Hugo approach for multi-theme sites.

### nebula2026 at a glance

- **Basalte Fond + Volume** — three-layer chromatic display font (shadow, base, outline overlay)
- **10 designer SVG roundels** — hand-picked per issue and story; used as chapter markers, dividers, and logotype inlays
- **Parallax heroes** — full-viewport cover art with object-position panning on scroll
- **Translucent sticky header** — frosted-glass backdrop-filter, reading progress bar
- **CSS-only frontpage** — two-column grid with scroll-snap, snake-corner transitions, no JavaScript overlays
- **Three content types** — stories (`stock`), reviews, and editorials, each with their own layout and frontpage card style
- **Per-issue colour schemes** — `colorScheme` frontmatter injects CSS custom properties (primary, secondary, accent)
- **9 bundled JS modules** — concatenated, minified, and fingerprinted via Hugo Pipes into a single `<script>`

## Project structure

```
content/
  issue-45/             # Current issue (branch with __index.md)
    __index.md          # Section frontmatter: theme, colours, roundels
    images/             # Story illustrations
    story-slug.md       # type: stock
    review-slug.md      # type: review
  catalogue/            # Reviews + editorials catalogue pages
  authors/              # Author taxonomy
layouts/
  partials/
    themes/nebula2026/  # 19 theme partials (intro, article-single, content-row, etc.)
    themes/horizon2020/ # 17 legacy partials
    functions/          # getThemeContext.html, theme-dispatch.html
assets/
  js/nebula2026/        # 9 JS modules (Hugo Pipes bundled)
static/
  themes/nebula2026.css # Theme stylesheet
  images/roundels/      # 10 SVG roundels
  assets/fonts/nebula2026/ # Alegreya + Basalte web fonts
```

## Local development

```sh
hugo server -D --disableFastRender
```

## Licence

Content (stories, artwork, author photos) is copyright of the respective authors.
Site code and templates are not currently under an open-source licence — please contact the editors before reuse.
