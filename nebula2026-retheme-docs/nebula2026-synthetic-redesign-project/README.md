# Nebula 2026 Project Notes

> Design and implementation documentation for the Mythaxis Magazine 2026 retheme

---

## Status: Implementation Complete — Testing Remaining

The `poc` branch of the site repo contains the full implementation. All planned features are built.

**Site repo:** `/Users/marty/Sites/mythaxis.github.io/` (branch: `poc`)

---

## What Was Built

A new visual theme (`nebula2026`) that coexists with the legacy theme (`horizon2020`) via frontmatter:

- **Dual theme system** — `theme: nebula2026` in an issue's `__index.md` opts it into the new design; all older issues continue using `horizon2020` unchanged
- **Story preview cards** — clicking a TOC item shows a full-screen overlay with story art, abstract, and a READ button
- **Roundel system** — 8 genre-specific SVG roundels replace `<hr>` tags in stories, plus a large story-end marker
- **CSS and JS fully isolated** — nebula2026 loads its own stylesheet and JS; horizon2020 is untouched

---

## Remaining Tasks

See **[`TASKS.md`](../TASKS.md)** in `nebula2026-retheme-docs/`.

That file is structured for Claude Code to work through directly. It covers testing the current build, then harvesting the richer JS from the `nebula2026-snarktank` and `nebula2026-synth` branches, then deploying.

---

## Document Index

| Document | Purpose |
|----------|---------|
| [BRANCH-COMPARISON.md](./BRANCH-COMPARISON.md) | What's in each branch, what to cherry-pick into `poc`, and how |
| [DESIGN-SPEC.md](./DESIGN-SPEC.md) | Original design intent — wireframe analysis, UX specs |
| [EDITOR-GUIDE.md](./EDITOR-GUIDE.md) | How to publish an issue using nebula2026 |
| [FRONTMATTER-REFERENCE.md](./FRONTMATTER-REFERENCE.md) | All frontmatter fields, types, and defaults |
| [DEVELOPER-REFERENCE.md](./DEVELOPER-REFERENCE.md) | Architecture, file structure, how the theme system works |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Common issues and fixes |
| [BEST-PRACTICES.md](./BEST-PRACTICES.md) | Coding standards for future work |

---

## Key File Locations in Site Repo

```
layouts/partials/themes/nebula2026/   ← Hugo template partials
static/js/nebula2026/                 ← chapter-markers.js, story-card-interactions.js
static/images/roundels/               ← 16 SVGs (8 genres × 2 sizes)
static/themes/nebula2026.css          ← all theme styles
```

---

## Post-Launch Ideas (Not Urgent)

- Day/Night mode toggle
- Sticky audio player footer
- Progressive header collapse on scroll
- SCSS refactoring for maintainability
- Lighthouse performance audit
