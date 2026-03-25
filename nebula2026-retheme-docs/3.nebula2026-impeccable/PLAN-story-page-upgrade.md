# Plan: Bring snarktank story page elements into poc

## Context

The poc branch has a minimal `article-single.html` (simple header, image, content, author footer, roundel). The snarktank branch has a rich story page with a full hero header, a sticky minimal header that appears on scroll, a story footer, and prev/next navigation. The user wants to bring these four elements across, adapted to poc's conventions.

**Key adaptation decisions:**
- Use poc's front matter (`image` not `storyArt`, `.Description` not `.Params.abstract`)
- Use `data-genre` attribute (matching user's recent chapter-markers.js rewrite)
- All CSS goes in `nebula2026.css` (not inline in template)
- Scroll behavior JS goes in a new `story-header.js` file (not inline)
- Keep poc's existing `authorfooter` partial and support text

## Files to modify

1. **`layouts/partials/themes/nebula2026/article-single.html`** — rewrite with new structure
2. **`static/themes/nebula2026.css`** — add story page CSS (~200 lines, extracted from snarktank inline styles)
3. **`static/js/nebula2026/story-header.js`** — new file for sticky header scroll behavior
4. **`layouts/partials/themes/nebula2026/scripts.html`** — load new JS file
5. **`nebula2026-retheme-docs/TASKS.md`** — add task entry

## Step 1: Rewrite `article-single.html`

Replace current template with this structure (adapted from snarktank to poc conventions):

```
<article class="nebula2026-story-single" data-genre="{{ chapterMarker | default "orbit" }}">

  <!-- 1. Story Header (hero section) -->
  <header class="story-header" id="story-header">
    {{ if image }}
      <div class="story-header__hero">
        <img class="story-header__image" ...>
        <div class="story-header__overlay"></div>
      </div>
    {{ else }}
      <div class="story-header__hero story-header__hero--fallback" data-genre="..."></div>
    {{ end }}
    <div class="story-header__content">
      <div class="story-header__metadata">
        <h1 class="story-header__title">Title</h1>
        <div class="story-header__byline">by Author(s)</div>
        {{ if .Description }}<div class="story-header__abstract">...</div>{{ end }}
        <div class="story-header__publication">Issue / Date</div>
      </div>
    </div>
  </header>

  <!-- 2. Minimal Sticky Header (appears on scroll) -->
  <div class="story-header-minimal" id="story-header-minimal">
    <div class="story-header-minimal__content">
      <div class="story-header-minimal__info">
        <h2 class="story-header-minimal__title">Title</h2>
        <span class="story-header-minimal__author">Author</span>
      </div>
    </div>
  </div>

  <!-- 3. Reading Area -->
  <div class="story-content">
    <div class="story-content__container">
      {{ .Content }}
    </div>
  </div>

  <!-- 4. Author Footer (existing partial) -->
  {{ partial "authorfooter" $page }}

  <!-- 5. Story Footer (roundel + support text) -->
  <footer class="story-footer">
    <div class="story-divider">
      <img class="story-divider__roundel roundel-animate" ...>
    </div>
    <p class="nebula-support-text">...</p>
  </footer>

  <!-- 6. Navigation Footer (prev/next + back to TOC) -->
  <nav class="story-navigation">
    <div class="story-navigation__container">
      <div class="story-navigation__toc">Back to Table of Contents</div>
      <div class="story-navigation__prevnext">
        {{ with .PrevInSection }}...{{ end }}
        {{ with .NextInSection }}...{{ end }}
      </div>
    </div>
  </nav>

</article>
```

**Dropped from snarktank:** genre badge (poc doesn't expose genre in UI), hamburger menu (poc has nav partial already), author bio section (poc uses `authorfooter`), audio player (keep if poc stories use it — check).

## Step 2: Add CSS to `nebula2026.css`

Add a new section `/* Story Single Page */` with styles for:
- `.story-header` — hero layout (relative, min-height 60vh, flex)
- `.story-header__hero` — absolute fill, genre fallback gradients
- `.story-header__image` — cover, scale(1.1) for parallax
- `.story-header__overlay` — gradient overlay for text readability
- `.story-header__content` / `__metadata` — positioned content
- `.story-header__title`, `__byline`, `__abstract`, `__publication`
- `.story-header-minimal` — fixed, translateY(-100%), transitions
- `.story-header-minimal.visible` — translateY(0)
- `.story-content` / `__container` — max-width 700px, reading typography
- `.story-divider` / `__roundel`
- `.story-footer`
- `.story-navigation` — dark background, grid layout
- `.nav-button` — all variants (toc, prev, next, disabled)
- Responsive breakpoints (980px, 768px, 480px)
- Reduced motion, print styles

## Step 3: Create `story-header.js`

Extract the inline `<script>` from snarktank into a standalone file:
- IntersectionObserver or scroll listener for showing/hiding `.story-header-minimal`
- Threshold: show after scrolling 300px past story header
- Respects `prefers-reduced-motion`
- Dev console logging

## Step 4: Update `scripts.html`

Add `<script src="js/nebula2026/story-header.js"></script>`

## Step 5: Update TASKS.md

Add task 9.3 entry under the fixes section.

## Verification

1. `node --check static/js/nebula2026/story-header.js` — syntax check
2. `hugo build` — no template errors
3. **Manual browser check:** story page hero header renders with image, scrolling reveals sticky minimal header, footer has roundel + support text, prev/next navigation works, responsive at mobile/tablet/desktop
