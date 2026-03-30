# Task 37.0 — Hugo Theme Refactor Assessment

**Date:** 2026-03-30
**Status:** Research complete — recommendation: **keep current architecture**

---

## Question

Should nebula2026 be extracted into its own Hugo theme module? Does Hugo support per-section theme switching natively?

---

## Current Architecture

Mythaxis uses a **custom theme dispatch system** that routes templates based on per-section frontmatter. This is implemented in two core files:

| File | Role |
|------|------|
| `layouts/partials/functions/getThemeContext.html` | Resolves theme name from section → site config → fallback |
| `layouts/partials/theme-dispatch.html` | Routes partial calls to `themes/{themeName}/{partialName}.html` |

### Resolution order
1. Section `__index.md` frontmatter: `theme: "horizon2020"` or `theme: "nebula2026"`
2. Site config: `params.defaultTheme: nebula2026`
3. Hardcoded fallback: `"nebula2026"`

### File inventory

| Category | Nebula2026 | Horizon2020 |
|----------|-----------|-------------|
| Template partials | 19 files in `layouts/partials/themes/nebula2026/` | 17 files in `layouts/partials/themes/horizon2020/` |
| JavaScript | 9 files in `assets/js/nebula2026/` (Hugo Pipes bundled) | 1 pre-compiled jQuery bundle in `static/assets/js/bundle.js` |
| CSS | 1 file: `static/themes/nebula2026.css` | 1 file: `static/themes/horizon2020.css` + Massively SCSS |
| Fonts | 8 woff2 files in `static/assets/fonts/nebula2026/` | Legacy fonts via Massively theme |
| Images | 10 SVG roundels in `static/images/roundels/` | 2 SVGs in `static/themes/horizon2020/` |

### Shared infrastructure (used by both themes)
- `layouts/partials/theme-dispatch.html` — the router
- `layouts/partials/functions/getThemeContext.html` — theme resolver
- `layouts/index.html` — homepage (branches per theme)
- `layouts/stock/single.html`, `review/single.html`, `editorial/single.html` — content type layouts
- `layouts/_default/single.html`, `list.html`, `section.html`
- All wrapper partials (`authorfooter.html`, `copyright.html`, `header.html`, `nav.html`, etc.)
- Shortcodes (`random-button`, `glyph`, `details`, `back-issues-list`)
- `config.yaml`

---

## What Hugo Supports Natively

### Theme Modules (Hugo Modules)
Hugo's modern component system. You declare imports in config:

```toml
[module]
imports = [
  { path = "github.com/user/theme-a" },
  { path = "github.com/user/theme-b" }
]
```

Modules can contain layouts, assets, static files, data, and content. **Import precedence is top-down** — first module wins when files conflict.

### Theme Composition
Multiple themes can be layered via `theme = ["base", "custom"]`. Hugo searches for files in the project first, then through each theme in listed order. This provides inheritance-like behaviour.

### Per-Section Theme Switching
**Hugo does NOT support this natively.** A site uses one theme stack. The community-endorsed workarounds are:

1. **Type-based layout dispatch** — use Hugo's `type:` frontmatter + template lookup order to route different content types to different templates. **This is what Mythaxis does.**
2. **Conditional rendering** — branch within templates using `{{ .Type }}` or `{{ .Section }}`.
3. **Nested Hugo projects** — run separate builds for different sections. Complex and fragile.

### Modules vs themes/ directory
Both can coexist but it's not recommended. Official best practice: pick one approach per project. Modules add `go.mod` dependency management and versioning. The `themes/` directory is simpler for single-repo projects.

---

## Refactor Assessment

### What extraction would look like

To make nebula2026 a standalone Hugo module:

**Move to module:**
- `layouts/partials/themes/nebula2026/*` (19 files)
- `assets/js/nebula2026/*` (9 files)
- `static/themes/nebula2026.css`
- `static/assets/fonts/nebula2026/*` (8 fonts)
- `static/images/roundels/*` (10 SVGs)

**Keep in main repo (shared):**
- `layouts/partials/theme-dispatch.html`
- `layouts/partials/functions/getThemeContext.html`
- All content type layouts (`stock/single.html`, etc.)
- All wrapper partials
- `config.yaml`
- All content

### Benefits
- **Clean separation** — nebula2026 becomes a self-contained package
- **Reusability** — could theoretically be used on another Hugo site
- **Versioning** — module versions via `go.mod` provide rollback capability

### Costs
- **Added complexity** — `go.mod`, module resolution, vendoring
- **Path resolution** — fonts, images, and CSS referenced by relative paths would need updating for cross-module boundaries
- **Shared dispatch coupling** — `theme-dispatch.html` and `getThemeContext.html` must remain in the main repo, tightly coupled to both themes
- **Development friction** — editing a module requires either local path overrides or publish-then-update cycles
- **No architectural change** — the dispatch pattern stays identical; files just live in a different location

### Risks
- Font/image URL breakage during migration
- Hugo Pipes asset resolution across module boundaries (documented gotchas with `resources.Get` in modules)
- The `themes/massively` directory (horizon2020's base) complicates a clean module setup

---

## Recommendation

**Keep the current architecture. Do not extract into a module.**

The custom theme dispatch system Mythaxis uses is the **canonical Hugo approach** for per-section theming. Hugo does not provide a better built-in mechanism. Extracting nebula2026 into a module would:

- Move files around without changing how anything works
- Add dependency management overhead (`go.mod`, module versioning)
- Introduce asset path resolution risks
- Make local development more complex

The current structure is clean, well-organised, and easy to maintain:
- Theme-specific files are already namespaced under `themes/nebula2026/` and `themes/horizon2020/` directories
- The dispatch system is two small files
- Everything lives in one repo with no external dependencies

### When a module WOULD make sense
- If Mythaxis needed to share nebula2026 across multiple separate Hugo sites
- If a third theme were added and the monorepo became unwieldy
- If multiple developers needed to work on themes independently with version control

None of these conditions currently apply.

### Optional improvement
If tidiness is desired without the module overhead, the CSS could be moved from `static/themes/nebula2026.css` to `assets/themes/nebula2026.css` and processed via Hugo Pipes (minify + fingerprint), matching what we already did for JS. This is a small optimisation, not a refactor.

---

## Summary

| Question | Answer |
|----------|--------|
| Does Hugo support per-section theme switching? | No — custom dispatch is the standard approach |
| Should we extract into a Hugo module? | No — adds complexity with no functional benefit |
| Is the current architecture good? | Yes — it's the idiomatic Hugo pattern |
| Any recommended changes? | Optional: pipe CSS through Hugo Pipes for minification |
