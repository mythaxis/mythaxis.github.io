# Nebula2026 Design Context

> Generated 2026-03-22 via impeccable:teach-impeccable

## Users
Readers and writers of speculative fiction — people who value literary craft and take short fiction seriously. They arrive to read stories, browse the archive, or check submission guidelines. The site should feel like a credible literary magazine, not a hobby project. Audience skews literate, curious, and aesthetically aware.

## Brand Personality
**Bold, Curious, Precise.**
- Confident editorial voice with strong typographic presence
- Intellectually adventurous — speculative fiction "without distraction"
- Attention to craft in every detail, from drop caps to roundel placement

## Emotional Goals
Literary credibility first. The site should feel like opening a well-designed print journal — considered, authoritative, and worth your time. Each issue has its own visual identity via color scheme and roundel, giving a sense of curated editorial seasons.

## Aesthetic Direction
- **Visual tone:** Modern literary magazine — clean but not sterile, elegant but not precious
- **Typography-led:** Alegreya serif body + Basalte display font carry the personality. Type hierarchy matters more than decoration.
- **Roundels as identity:** 10 custom SVG roundels serve as the visual signature — used as chapter markers, article dividers, logotype element, and decorative anchors. They replace generic icons entirely.
- **Per-issue color:** Each issue gets a primary/secondary color pair via frontmatter, making every issue feel distinct while sharing the same structural DNA.
- **White space is structural:** Generous margins and constrained content widths (700px reading, 800px pages, 1200px grids) create focus.

## Anti-References
- **Not a blog:** This is a magazine with editorial seasons, not a reverse-chronological feed. No WordPress/Substack aesthetic.
- **Not corporate:** No SaaS gradients, no rounded-corner card grids, no startup landing page patterns.
- **Not cluttered:** No sidebar widgets, no tag clouds, no social share buttons competing with content.
- **Not generic AI:** No bland pastels, no over-rounded everything, no stock illustration style. The Basalte display font and hand-designed roundels are the antidote.

## Design Principles
1. **Content is the design.** Typography, spacing, and hierarchy do the work. Decoration is reserved for the roundels and per-issue color accents.
2. **Each issue is a season.** Color schemes, roundels, and hero images give each issue its own character. The system supports variety without losing coherence.
3. **Precision over flash.** Every element should feel considered — drop cap sizing, roundel placement, reading line length. Subtlety signals quality.
4. **Magazine, not app.** Reading experience over interactivity. Scroll-based discovery, minimal JavaScript, no modals or popovers competing for attention.
5. **Accessibility is baseline.** WCAG AA contrast, keyboard navigation, screen reader semantics, reduced motion support — built in, not bolted on.

## Technical Stack
- **Generator:** Hugo static site
- **CSS:** Single-file vanilla CSS (`nebula2026.css`, ~2000 lines), CSS custom properties for theming
- **JS:** 5 vanilla JS modules (chapter markers, roundel animations, reading progress, parallax, nav)
- **Fonts:** Alegreya (serif, self-hosted WOFF2), Basalte (display, 3 variants, self-hosted WOFF2)
- **Layout:** CSS Grid + Flexbox, mobile-first breakpoints at 737px / 1200px
- **Theme switching:** Hugo frontmatter `theme: nebula2026` or `theme: horizon2020` per section

## Key Design Tokens
```
Fonts:        --font-primary (Alegreya), --font-secondary (Basalte)
Colors:       --color-primary, --color-secondary (dynamic per issue)
              --color-text (#333), --color-text-light (#666), --color-text-muted (#999)
              --color-background (#fff), --color-surface (#f8f9fa), --color-border (#e9ecef)
Spacing:      --space-1 (0.25rem) through --space-20 (5rem)
Transitions:  --transition-fast (150ms), --transition-base (250ms), --transition-slow (350ms)
Z-index:      --z-progress (9999), header (1001), nav (1100), burger (1101)
Radius:       --radius-base (0.25rem)
Breakpoints:  Mobile <737px, Desktop 737px+, Wide 1200px+
```

## Component Inventory

### Header & Navigation
- **Main Header** (`.nebula-header`) — Sticky on landing, dark gradient + blur, issue badge, logotype
- **Burger Menu** (`.nebula-burger`) — 44x44px, animated three-line → X, appears on scroll
- **Nav Panel** (`.nebula-nav-panel`) — 280px slide-in from right, focus trap, issue roundel
- **Nav Backdrop** (`.nebula-nav-backdrop`) — Semi-transparent overlay, click to close

### Hero Sections
- **Landing Hero** (`.landing-header__hero`) — Full-screen parallax, gradient overlay, logotype
- **Story Hero** (`.story-header`) — 60vh min, image + overlay, title/byline/abstract
- **Minimal Header** (`.story-header-minimal`) — Sticky on scroll, roundel + title + progress bar

### Content Components
- **Featured Article** (`.nebula-split-lead`) — Two-column grid, image left / text right
- **Story Row** (`.nebula-split-row`) — Alternating 2:3 grid, even rows reversed
- **Article Content** (`.nebula-article-content`) — 700px max, 1.125rem, line-height 1.8
- **Drop Caps** — CSS `::first-letter`, Basalte font, 3.5em, on first/post-hr/post-marker paragraphs

### Roundel System
- **10 SVGs:** MythaxisAbduction, Eye, Galaxy, Grey, Hand, Icon, Knot, Monster, Swords, Target
- **Brand roundel** = MythaxisIcon (atom) — logotype, header, nav, non-story footer
- **Issue roundel** = per-issue frontmatter — story footer, dividers, minimal header
- **Chapter marker** = per-story frontmatter — replaces `<hr>` tags via JS
- **CSS mask technique** for inline brand roundels: `background: currentColor; mask: url(...)`

### Footer Components
- **Story Footer** (`.story-footer`) — Roundel divider (240px), support text
- **Author Footer** (`.nebula-author-footer`) — Full-width, photo + bio, dark background
- **Nav Strip** (`.story-nav-strip`) — Prev/Contents/Next, weight-based ordering
- **Copyright Footer** (`.nebula-copyright`) — Dark secondary, small text

### Taxonomy/Catalogue
- **Catalogue Nav** — Pill-style breadcrumbs: Archives / Authors / Catalogue / Editorials / Genres
- **Catalogue List** — Title + author, flex space-between
- **Authors List** — Author name (right-aligned desktop), works with dates
- **Genre Display** — Dark pill tags, sectioned story lists

### Interactive Behaviors (JS)
- **Parallax** — Landing/story heroes translate on scroll, minimal header pans object-position
- **Roundel Animations** — Intersection Observer fade-in + scale(0.9→1)
- **Reading Progress** — 3px gradient bar at bottom of minimal header
- **Nav System** — Scroll detection, burger visibility, panel open/close, focus trap
- **Chapter Markers** — HR replacement with validated roundel images + error fallback
