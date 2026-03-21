# Nebula 2026 Design Specification

> Comprehensive design specification synthesized from original planning documents  
> and validated against three implementation branches.

---

## Vision & Philosophy

### Mobile-First, Desktop-Optimized
The new design prioritizes mobile reading experiences while ensuring layouts adapt gracefully for desktop viewing. The interface should be intuitive, visually striking, and optimized for both touch interactions and traditional navigation.

### The Roundel as Design System
The MYTH(O)AXIS roundel serves dual purposes: visual brand identity and functional navigation element. Different genre-specific roundels provide visual symbolism throughout the reading experience as chapter markers and story separators.

### Core User Journey
Readers move naturally from **cover art impact** → **curated table of contents** → **story selection** → **immersive reading**, with the roundel guiding them through each transition.

---

## Page Specifications

### 1. Site Frontpage (Mob_01)

**Visual Hierarchy:**
- Full-screen cover art of current issue (hero section)
- MYTH(O)AXIS branding with roundel as central element
- Minimal UI: Only roundel button and menu icon visible

**Interaction:**
- Tapping/clicking roundel scrolls to reveal TOC content
- Roundel remains visible/fixed during scroll
- Smooth scroll animation guides user to content section

**Content:**
- Always displays current/latest issue

### 2. Issue Landing Page (Mob_02)

**Visual Design:**
- Cover art shrinks to upper third of screen
- Roundel serves as visual separator between header and content
- Clean bullet list format for table of contents
- Zero-scroll TOC target (5 stories + 2 articles standard)

**TOC Format:**
- Simple bullet list: "[STORY TITLE] by [AUTHOR NAME]"
- No individual story roundels in TOC (keep uncluttered)
- Each item triggers story preview card

### 3. Story Preview Card (Mob_03)

**Mobile Interaction:**
- Tap story title → full-screen overlay card
- Swipe left/right → browse between stories
- Tap card → navigate to full story page
- Back button → return to TOC

**Desktop Interaction:**
- Hover story title → popup card (Wikipedia-style)
- Click story title → fixed overlay modal
- Arrow buttons (< >) → browse between stories
- ESC key or back button → close overlay

**Card Content:**
- Story title
- Author name(s)
- Issue reference
- Genre indicator
- Story-specific artwork (if available)
- Short abstract/teaser text

### 4. Story Reading Page (Mob_04)

**Progressive Interface:**
- Initially shows full story art and metadata
- As reader scrolls, header content slides off screen
- Clean reading experience emerges with story text in focus
- Minimal UI: only hamburger menu remains visible

**Chapter Markers:**
- Genre-specific roundels at section breaks
- JavaScript replaces `***` dividers with SVG roundels
- Based on story's `chapterMarker` frontmatter value

**Story Footer:**
- Large roundel at story end
- Author bio/footer
- Navigation back to issue

---

## Roundel System

### Genre Roundels

Professional roundel artwork by designer (source: `nebula2026-wireframes/roundels-png/` and `roundals.afphoto`). All designs are high-contrast black-and-white circular badges.

| Genre | Design file | Visual description | Use Case |
|-------|------------|-------------------|----------|
| `orbit` | `target.png` | Concentric circles with notches | Default, general use |
| `fantasy` | `braid.png` | Celtic knot pattern | Fantasy, magical stories |
| `scifi` | `ufo.png` | UFO abduction beam | Science fiction |
| `horror` | `eye.png` | Cracked eyeball | Horror, thriller |
| `cosmic` | `galaxy.png` | Spiral galaxy with stars | Cosmic horror, space |
| `dark` | `face.png` | Grinning skull face | Dark fantasy, gothic |
| `supernatural` | `swords.png` | Crossed katanas | Supernatural, action |
| `psion` | `hand.png` | Handprint silhouette | Psychic, mutation |
| `alien` | `alien.png` | Alien head silhouette | _TBD — new genre or alt scifi_ |
| `atom` | `atom.png` | Atomic orbital structure | _TBD — new genre or alt cosmic_ |

### Brand Roundel (MythaxisIcon)

The roundel also serves as the central element of the Mythaxis logotype: **MYTH(roundel)AXIS**. See wireframe `Example new logotype.jpg` — the roundel sits between "MYTH" and "AXIS" as a visual bridge, replacing the "O" in the original name.

**TBD:** Which roundel serves as the brand mark? Options:
- A dedicated brand roundel (the compass/sun design in the logotype wireframe)
- The issue's `issueRoundel` (changes per issue — brand identity shifts with content)
- The default `orbit` roundel (fixed brand mark)

### Format

**Preferred:** SVG (resolution-independent, smaller file size, matches current system).

Current system uses SVGs at two sizes. If designer provides vector originals or PNGs can be traced to SVG, maintain the SVG system. Otherwise, the template/JS paths must be updated to reference `.png`.

### Size Specifications

| Use | Size | Location |
|-----|------|----------|
| Chapter marker | 100×100px | `/images/roundels/[genre]-100.svg` |
| Story-end marker | 200×200px | `/images/roundels/[genre]-200.svg` |
| Nav panel | 40×40px | (rendered via CSS from `-100` file) |
| Logo inline | ~24–32px | (rendered inline in header logotype) |

### Configuration Cascade

**Priority Order:**
1. Story-level `chapterMarker` (highest)
2. Issue-level `issueRoundel`
3. Site-level `params.defaultRoundel` (lowest)

---

## Typography

### Font Stack

| Role | Font | Use |
|------|------|-----|
| Body / reading | **Alegreya** (serif) | Story content, descriptions, bylines, nav links, metadata |
| Headings / display | **Basalte** (Degheest Family, Velvetyne Type Foundry) | Page titles, story titles, logotype, card titles |

### Basalte Variants

Basalte is a display typeface with three visual styles (not weights):

| Variant | File | Character |
|---------|------|-----------|
| **Fond** | `Basalte-Fond.woff2` | Clean base form — the default heading style |
| **Multicolor** | `Basalte-Multicolor.woff2` | Striped/layered fill — decorative accent |
| **Volume** | `Basalte-Volume.woff2` | 3D shadow effect — high impact for hero moments |

**Usage strategy TBD:** See AUDIT-TASKS.md Group H for discussion on which variant applies where.

### CSS Custom Properties

```css
:root {
  --font-primary: 'Alegreya', Georgia, "Times New Roman", serif;
  --font-secondary: 'Basalte', 'Alegreya', Georgia, serif;
}
```

### Heading Hierarchy

| Element | Font | Context |
|---------|------|---------|
| Hero title (`.nebula-title`) | `--font-secondary` | Landing page "Mythaxis" |
| Story title (`.story-header__title`) | `--font-secondary` | Story page hero |
| Card title (`.nebula-card-title`) | `--font-secondary` | Issue grid |
| Featured title (`.nebula-featured-title`) | `--font-secondary` | Featured story card |
| Page title (`.nebula-page-title`) | `--font-secondary` | About, submissions, etc. |
| Body text | `--font-primary` | Story reading area |
| Nav / UI | `--font-primary` | Links, buttons, metadata |

### Font Sources

- Alegreya: deployed as `.woff2` in `static/assets/fonts/nebula2026/`
- Basalte: deployed as `.woff2` in `static/assets/fonts/nebula2026/`
- Source files archived in `nebula2026-retheme-docs/nebula2026-webfonts/`

---

## Color System

### Selective Theming
Issue-specific colors create visual connection to cover art without overwhelming design. Only key elements use issue colors:
- Story card backgrounds
- Interactive button accents
- Section separators

### CSS Custom Properties
```css
:root {
  --color-primary: #3a5f7d;    /* From frontmatter */
  --color-secondary: #8b6f4e;  /* From frontmatter */
}
```

### Configuration
```yaml
# Site default (config.yaml)
params:
  colorScheme:
    primary: "#3a5f7d"
    secondary: "#8b6f4e"

# Issue override (__index.md)
colorScheme:
  primary: "#5a7fa0"
  secondary: "#a68b5e"
```

---

## Responsive Breakpoints

| Name | Width | Behavior |
|------|-------|----------|
| Mobile | <768px | Full-screen cards, swipe navigation |
| Tablet | 768-1023px | Hybrid layout |
| Desktop | ≥1024px | Hover cards, keyboard navigation |

---

## Animation Specifications

### Card Transitions
- **Duration:** 300ms
- **Easing:** ease-in-out
- **Effect:** Fade + slight scale

### Progressive Header
- **Trigger:** 200px scroll
- **Duration:** 300ms
- **Effect:** Slide up and fade

### Swipe Navigation
- **Threshold:** 50px minimum swipe
- **Snap:** 100ms to next card

---

## Accessibility Requirements

### Keyboard Navigation
- Tab: Move between interactive elements
- Enter: Activate focused element
- ESC: Close overlays
- Arrow keys: Navigate cards when overlay open

### Screen Reader Support
- Proper heading hierarchy (h1→h2→h3)
- ARIA labels on all buttons
- `aria-hidden` on decorative roundels
- Skip links for main content

### Motion Sensitivity
- Respect `prefers-reduced-motion`
- Provide instant transitions alternative

### Color Contrast
- Text: 4.5:1 minimum (WCAG AA)
- UI elements: 3:1 minimum

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Page Load | <2s on 3G |
| LCP | <2.5s |
| FID | <100ms |
| CLS | <0.1 |
| Lighthouse Score | >90 all categories |

---

## Browser Support

### Primary (Must Work)
- Safari iOS 15+
- Chrome 100+
- Firefox 100+
- Safari macOS 14+
- Edge 100+

### Secondary (Should Work)
- Chrome Android
- Samsung Internet
- Opera

---

## Future Enhancements

Not in v1.0, but documented for later:

1. **Day/Night Mode** — Toggle in footer per wireframe (token system is ready for this)
2. ~~**Reading Progress**~~ — ✅ Implemented (reading-progress.js)
3. **Bookmarks** — Save reading position
4. **Audio Player** — Sticky footer player (basic `<audio controls>` exists, not sticky)
5. **Cover Art Transitions** — Fade between issue/story art

---

### Logotype Concept

The wireframe `Example new logotype.jpg` shows the Mythaxis brand rendered as:

```
MYTH [roundel] AXIS
```

The roundel sits inline between "MYTH" and "AXIS", replacing the "O" of the original MYTH(O)AXIS name. This should be implemented in the header bar using Basalte font + inline roundel image. See AUDIT-TASKS.md Group I for implementation details.

---

**Source Documents:**
- Mythaxis 2026 Retheme Project - 1 Proposal.md
- Mythaxis 2026 Retheme Project - 2 Technical plan.md
- Andrew's designs.md
- Wireframes: Mob_01-04, Sample Roundals
- Designer roundels: `nebula2026-wireframes/roundels-png/` + `roundals.afphoto`
- Degheest/Basalte fonts: `nebula2026-webfonts/degheest-types-master/`
