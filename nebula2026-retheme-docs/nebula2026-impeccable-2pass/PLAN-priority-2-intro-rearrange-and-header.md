# Plan: Intro Rearrange, Positioning & Header Restyle (Priority 2)

> **Status: PLANNED** — Pending approval.

## Context

Priority 2 from the impeccable 2-pass critique: the hero-to-content transition. Rather than adding a transitional element, the approach is to **rearrange the intro itself** — remove the issue badge, reorder elements, make intro content clickable to scroll to stories, and add a 9-position frontmatter system for positioning intro content over cover art. Additionally, restyle the sticky header to drop the gradient pill badge and use simpler typography with theme colors.

## Files to Modify

1. **`layouts/partials/themes/nebula2026/intro.html`** — template changes
2. **`layouts/partials/themes/nebula2026/header.html`** — drop badge pill, simplify typesetting
3. **`static/themes/nebula2026.css`** — intro positioning system, header restyle
4. **`content/issue-45/__index.md`** — add `scrollLineText`, `introPosition` frontmatter
5. **`static/js/nebula2026/nebula-nav.js`** — no changes expected (scroll handling stays)

## Changes

### A. Intro Template Rearrange (`intro.html`)

Current order: badge → MYTH(roundel)AXIS → subtitle → headline → scroll indicator

New order: subtitle → MYTH(roundel)AXIS → headline → scroll indicator (conditional)

- **Remove** `.nebula-issue-badge` entirely
- **Move subtitle above title** — swap `<h2>` before `<h1>`
- **Scroll indicator from frontmatter** — use `.Params.scrollLineText` instead of hardcoded "Explore this issue". If `scrollLineText` is absent from frontmatter, omit the scroll indicator entirely.
- **Clickable elements** — subtitle becomes `<a href="#main" class="scrolly">`, scroll indicator targets `#main`. Title (MYTH(roundel)AXIS) stays inert — it's the brand.
- **Change scroll target** from `#header` to `#main` — scrolls directly to the story grid
- **9-position class** — add `introPosition` from frontmatter as a CSS class on `.nebula-intro-content`, defaulting to `center`

Template becomes:
```html
<div id="intro" class="nebula-intro">
    {{/* Hero image */}}
    {{ if .Params.image }}
    <div class="landing-header__hero">
      <img src="{{ path.Join .Section .Params.image | relURL }}"
           alt="{{ .Params.issue }}"
           class="landing-header__image"
           loading="eager"
           decoding="sync" />
      <div class="landing-header__overlay"></div>
    </div>
    {{ end }}

    <div class="nebula-intro-content nebula-intro-content--{{ .Params.introPosition | default "center" }}">
        <a href="#main" class="nebula-subtitle scrolly">{{ .Params.subhead }}</a>
        <h1 class="nebula-title">
            <span class="nebula-title__myth">Myth</span>
            <span class="nebula-title__roundel" aria-hidden="true"></span>
            <span class="nebula-title__axis">axis</span>
        </h1>
        {{ if .Params.headline }}
        <p class="nebula-headline">{{ .Params.headline }}</p>
        {{ end }}
        {{ with .Params.scrollLineText }}
        <div class="nebula-scroll-indicator">
            <a href="#main" class="scrolly">
                <span>{{ . }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
            </a>
        </div>
        {{ end }}
    </div>
</div>
```

### B. 9-Position CSS System

The `.nebula-intro` is already a flexbox column. Override `align-items` and `justify-content` per position. The content block also gets `text-align` adjusted.

| Position | justify-content | align-items | text-align |
|----------|----------------|-------------|------------|
| top-left | flex-start | flex-start | left |
| top-center | flex-start | center | center |
| top-right | flex-start | flex-end | right |
| center-left | center | flex-start | left |
| center (default) | center | center | center |
| center-right | center | flex-end | right |
| bottom-left | flex-end | flex-start | left |
| bottom-center | flex-end | center | center |
| bottom-right | flex-end | flex-end | right |

CSS approach — use `:has()` on the parent so the intro's flexbox properties stay centralized:
```css
.nebula-intro:has(.nebula-intro-content--top-left) {
    justify-content: flex-start;
    align-items: flex-start;
    text-align: left;
}
/* ... etc for all 9 positions */
```

For left/right-aligned positions, `.nebula-title` (which uses `justify-content: center`) also needs to switch to `flex-start` or `flex-end` so the logotype aligns with the text.

**Mobile override:** All positions reset to center on `max-width: 736px`.

**Padding:** Non-center positions get generous padding on their near edge (e.g. `top-left` keeps content away from viewport edges). Current `padding: 2rem` may need increasing to `4rem` or `clamp(2rem, 5vw, 4rem)` for edge positions.

### C. Header Restyle (`header.html` + CSS)

Current header left side: gradient pill badge (`Issue 45-test`) + subhead (`Spring 2026`)

New: Plain typeset text, no pill. Issue name in `--color-primary`, subhead in white/light.

Template change — rename class from `__badge` to `__issue-name`:
```html
<a href="{{ $section.RelPermalink }}" class="nebula-header__issue">
  {{ with $section.Params.issue }}<span class="nebula-header__issue-name">{{ . }}</span>{{ end }}
  {{ with $section.Params.subhead }}<span class="nebula-header__subhead">{{ . }}</span>{{ end }}
</a>
```

CSS — replace gradient pill with plain type:
```css
.nebula-header__issue-name {
    font-family: var(--font-secondary);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.8rem;
    color: var(--color-primary);
}

.nebula-header__subhead {
    font-size: 0.8rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.7);
}
```

### D. Frontmatter Update (`__index.md`)

Add new fields:
```yaml
introPosition: center                    # 9-position system
scrollLineText: "Explore this issue"     # omit to hide scroll indicator
```

Remove the old `intro:` flexbox block (justify_content, align_items, logo, subheading, actions) — no longer used.

### E. CSS Cleanup

- **Remove** `.nebula-issue-badge` styles (lines 272-283)
- **Update** `.nebula-subtitle` — change from `<h2>` to `<a>` styling: keep appearance, add `text-decoration: none`, hover state
- **Remove** `.nebula-header__badge` styles (lines 391-401)
- **Keep** `.nebula-scroll-indicator` styles (they still apply when scroll indicator is present)

## What Doesn't Change

- Parallax hero behavior — untouched
- Header logotype scroll fade — still works (intro disappears → logotype appears)
- Burger/nav panel — untouched
- Story pages — unaffected (no intro)
- jQuery `.scrolly` plugin — still handles smooth scroll, just targets `#main` now
- MYTH(roundel)AXIS title styling — unchanged
- `nebula-nav.js` — no changes needed

## Verification

1. `hugo server -D --disableFastRender` — check issue-45 landing page
2. Confirm subtitle appears above title, no issue badge
3. Confirm clicking subtitle scrolls to story grid (`#main`)
4. Set `introPosition: top-left` in frontmatter, confirm content moves to top-left
5. Remove `scrollLineText` from frontmatter, confirm scroll indicator disappears
6. Add `scrollLineText: "Read the stories"`, confirm it appears
7. Resize to mobile — confirm position resets to center
8. Check sticky header — plain text, issue name in primary color, no pill
9. Check header on story pages (non-landing) — still works normally
