# Mythaxis 2026 Retheme Project

## Technical Plan

The retheme uses conditional layout switching within the existing Massively theme. A single theme contains dual layout paths controlled by frontmatter, allowing both legacy (horizon2020) and new (nebula2026) designs to coexist. Old issues render via horizon2020 layouts unchanged; new issues opt into nebula2026 layouts.

## Layout Switching System

### Architecture Decision

**Single theme with dual layout paths:** The Massively theme remains as the base, with conditional template logic routing to either:
- **horizon2020 layouts:** Current/existing templates (preserved as-is)
- **nebula2026 layouts:** New templates implementing the redesigned interface

### Switching Mechanism

**Issue-level frontmatter control:**
```yaml
# In issue __index.md
layout: "nebula2026"  # or "horizon2020" (defaults to "horizon2020" if not specified)
```

**Template logic:**
```go-html-template
{{ if eq .Params.layout "nebula2026" }}
  {{ partial "nebula2026/issue-landing.html" . }}
{{ else }}
  {{ partial "horizon2020/issue-landing.html" . }}
{{ end }}
```

**Directory structure:**
```
layouts/
├── _default/
│   ├── baseof.html          # Base template with switching logic
│   └── single.html           # Story page with switching logic
├── partials/
│   ├── horizon2020/           # Existing layout partials
│   │   ├── header.html
│   │   ├── footer.html
│   │   └── issue-landing.html
│   └── nebula2026/            # New layout partials
│       ├── header.html
│       ├── footer.html
│       ├── issue-landing.html
│       ├── story-card.html
│       └── story-end.html
```

### Backward Compatibility

- All existing issues default to horizon2020 layouts (no frontmatter changes required)
- Migration to new design is opt-in per issue
- Both layout systems maintained independently within same theme

## Roundel System

### Chapter Markers (In-Story Dividers)

**Problem:** Hugo shortcodes require markup in editorial content, conflating layout with content.

**Solution:** Client-side JavaScript replacement of markdown dividers

**Implementation:**
```javascript
// On page load, find all <hr> elements (rendered from ***)
// Replace with appropriate genre-specific roundel SVG
document.addEventListener('DOMContentLoaded', function() {
  const genre = document.querySelector('article').dataset.genre;
  const hrs = document.querySelectorAll('article hr');
  hrs.forEach(hr => {
    const roundel = document.createElement('img');
    roundel.src = `/images/roundels/${genre}-100.svg`;
    roundel.className = 'chapter-marker';
    roundel.alt = '';
    hr.replaceWith(roundel);
  });
});
```

**Configuration:**
- Story frontmatter: `chapterMarker: "fantasy"`
- Maps to: `/static/images/roundels/fantasy-100.svg`
- Size: 100x100px SVG files
- Genres: Extensible via frontmatter (fantasy, horror, scifi, slipstream, etc.)

### Story End Markers (Large Roundels)

**Implementation:** Hugo partial template in story layout

**Hierarchy:**
1. Issue-level frontmatter: `issueRoundel: "orbit"` (in `__index.md`, optional)
2. Site-level default: `params.defaultRoundel: "orbit"` (in `config.yaml`)
3. Fallback renders issue's roundel if specified, otherwise site default

**Partial template (`nebula2026/story-end.html`):**
```go-html-template
{{ $roundel := .Site.Params.defaultRoundel }}
{{ with .Parent.Params.issueRoundel }}
  {{ $roundel = . }}
{{ end }}
<img src="/images/roundels/{{ $roundel }}-200.svg" 
     class="story-end-marker" 
     alt="">
```

**Configuration:**
- Format: 200x200px SVG files
- Location: `/static/images/roundels/[name]-200.svg`
- Single roundel per issue (consistent across all stories)

## Story Card System

### Shared Partial Template

**Story cards** are interactive preview elements displaying story metadata (title, author, genre, artwork, teaser) before readers navigate to the full story.

**Single source of truth:** `partials/nebula2026/story-card.html`

Used in two contexts:
1. **Mobile:** Full-screen overlay with swipe gestures
2. **Desktop:** Hover-triggered popup card / click-to-fix overlay modal

**Partial content:**
```go-html-template
<div class="story-card" data-genre="{{ .Params.genre }}">
  <img src="{{ .Params.storyArt }}" alt="{{ .Title }}" class="story-art">
  <div class="story-meta">
    <h2>{{ .Title }}</h2>
    <p class="author">by {{ .Params.author }}</p>
    <p class="issue">{{ .Parent.Title }}</p>
    <p class="genre">{{ .Params.genre }}</p>
    <p class="abstract">{{ .Params.abstract }}</p>
  </div>
</div>
```

### Platform-Specific Implementations

**Mobile (Touch Interface):**
- JavaScript: Full-screen overlay with swipe gestures (vanilla JS, no dependencies)
- Behavior: 
  - Tap TOC item → full-screen story card appears
  - Swipe left/right to navigate between stories
  - Tap card itself → navigate to story page
  - "Back" button returns to TOC

**Desktop (Mouse Interface):**
- CSS + JavaScript: Hover-triggered popup positioned near cursor or as fixed overlay
- Behavior:
  - Mouseover TOC item → card appears as hover popup
  - Click TOC item → card becomes fixed overlay modal
  - Click < > buttons to navigate between stories
  - Click card → navigate to story page
  - "Back" or ESC closes modal

**Technical approach:**
- Media queries determine which behavior loads
- Same HTML structure styled/positioned differently
- Shared JavaScript logic with platform-specific event listeners

![Story preview card on mobile displaying full-screen overlay with story metadata, genre-specific artwork, teaser text, navigation arrows for browsing stories, and action buttons to return to TOC or read the full story](wireframes/Mob_03_StorySelection.png)

## Color System

### Configuration Hierarchy

**Two levels (priority order):**
1. **Issue-level** (highest): Issue `__index.md` frontmatter
2. **Site-level** (fallback): `config.yaml` defaults

**Frontmatter structure:**
```yaml
# config.yaml (site defaults)
params:
  colorScheme:
    primary: "#3a5f7d"
    secondary: "#8b6f4e"
    
# Issue __index.md
colorScheme:
  primary: "#5a7fa0"
  secondary: "#a68b5e"
```

### Template Implementation

**CSS Custom Properties approach:**
```go-html-template
{{ $primary := .Site.Params.colorScheme.primary }}
{{ $secondary := .Site.Params.colorScheme.secondary }}

{{ with .Parent.Params.colorScheme }}
  {{ $primary = .primary }}
  {{ $secondary = .secondary }}
{{ end }}

<style>
  :root {
    --color-primary: {{ $primary }};
    --color-secondary: {{ $secondary }};
  }
</style>
```

**Usage in CSS:**
```css
.story-card { background-color: var(--color-primary); }
.story-card .meta { color: var(--color-secondary); }
```

**Purpose:** Match issue's color scheme to issue cover artwork.

## Implementation Phases (1-6)

### Phase 1: Layout Foundation (Switching Mechanism)

**Goal:** Establish dual layout system with basic HTML templates

**Tasks:**
1. Restructure `layouts/` directory into horizon2020/nebula2026 partials
2. Implement conditional logic in base templates (`baseof.html`, `single.html`)
3. Create minimal nebula2026 layout templates (plain white HTML, no styling)
4. Test switching mechanism:
   - Default behavior (no frontmatter = horizon2020 layouts)
   - Explicit `layout: "nebula2026"` switching
   - Issue-by-issue independence
5. Verify backward compatibility (existing issues unchanged)

**Success Criteria:**
- [ ] Can toggle between layout systems via frontmatter
- [ ] Both systems render without errors
- [ ] No styling required yet (focused on architecture)
- [ ] Existing issues render unchanged when layout not specified

**Exit Condition:** Architecture tested and validated; ready for feature implementation

---

### Phase 2: Configuration & Defaults

**Goal:** Establish metadata hierarchy and configuration system

**Tasks:**
1. Add site-level defaults to `config.yaml`:
   - `params.defaultRoundel`
   - `params.colorScheme.primary`
   - `params.colorScheme.secondary`
2. Create issue-level frontmatter template with overrides
3. Implement cascade logic in templates (site → issue)
4. Test configuration inheritance with multiple issues

**Success Criteria:**
- [ ] Defaults work when nothing specified
- [ ] Issue overrides work correctly
- [ ] Configuration cascade prioritizes correctly (issue > site)
- [ ] Template variables render correctly with overrides

**Exit Condition:** Configuration system complete and tested; ready for roundel implementation

---

### Phase 3: Roundel System

**Goal:** Implement both chapter markers and story-end markers

**Tasks:**
1. Create SVG roundel assets (100px and 200px versions)
2. Implement story-end partial template with hierarchy logic
3. Write client-side JavaScript for chapter marker replacement
4. Test with various genres and configurations
5. Document roundel naming conventions and extensibility

**Success Criteria:**
- [ ] Chapter markers auto-replace `***` dividers
- [ ] Story-end markers respect issue/site defaults
- [ ] All genre roundels render correctly
- [ ] Easy to add new genres without code changes
- [ ] No layout shifts during chapter marker replacement

**Exit Condition:** Roundel system complete and tested; ready for card component

---

### Phase 4: Story Card Partial

**Goal:** Create shared card component for mobile/desktop use

**Tasks:**
1. Build `story-card.html` partial with all required elements
2. Style for mobile-first (vertical card layout)
3. Implement desktop hover styling (popup positioning)
4. Test card rendering in isolation
5. Ensure color scheme variables apply correctly

**Success Criteria:**
- [ ] Card renders with all story metadata (title, author, genre, artwork, teaser)
- [ ] Colors apply from frontmatter (issue or site defaults)
- [ ] Responsive styling works on all screen sizes
- [ ] Card displays correctly when story art is missing (fallback handling)

**Exit Condition:** Card partial complete and styled; ready for interaction behaviors

---

### Phase 5: Interactive Behaviors

**Goal:** Implement platform-specific card interactions

**Tasks:**
1. **Mobile implementation:**
   - Full-screen overlay modal
   - Swipe gesture detection (left/right)
   - Story navigation (prev/next)
   - Close/back functionality
2. **Desktop implementation:**
   - Hover trigger on TOC items
   - Click-to-fix-overlay (stays open on click)
   - Keyboard navigation (arrow keys, ESC)
   - Mouse-based prev/next buttons
3. Media query detection for behavior switching
4. Smooth transitions between story cards
5. Test across browsers (Chrome, Firefox, Safari, Edge, iOS Safari)

**Success Criteria:**
- [ ] Touch interactions work on mobile
- [ ] Mouse interactions work on desktop
- [ ] Card content updates smoothly during navigation
- [ ] Consistent behavior across target browsers
- [ ] No JavaScript errors in console
- [ ] Keyboard navigation works (arrow keys, ESC)

**Exit Condition:** All interactions working and tested; ready for visual design

---

### Phase 6: Page Templates & Visual Design

**Goal:** Complete the 2026 layouts with full visual design

**Tasks:**
1. Frontpage hero and TOC list
2. Issue landing page with cover art integration
3. Story page progressive interface (hero → reading view)
4. Standard menu pages (About, Archive, Submissions)
5. CSS animations and transitions
6. Responsive layout refinements for tablet/desktop
7. Image optimization and performance tuning

**Success Criteria:**
- [ ] All pages render per design specifications
- [ ] Smooth animations throughout (no jank)
- [ ] Mobile and desktop experiences both polished
- [ ] Page load time < 2 seconds on 3G
- [ ] Images optimized and properly sized
- [ ] No console errors or warnings

**Exit Condition:** All pages complete and polished; ready for testing and launch preparation

---

## Phase 7: Launch & Transition

This phase occurs **after** the main implementation (Phases 1-6) is complete. It focuses on validation, migration, and handoff.

### Testing & Validation

**Goal:** Ensure production readiness and no regressions

**Tasks:**
1. Cross-browser compatibility testing:
   - Mobile: iOS Safari, Chrome, Firefox
   - Desktop: Chrome, Firefox, Safari, Edge
2. Device testing:
   - Phone (iOS, Android)
   - Tablet (iPad, Android tablet)
   - Desktop (various screen sizes)
3. Performance optimization:
   - Measure page load times (target: < 2 seconds on 3G)
   - Optimize image sizes and formats
   - Minimize/bundle CSS and JavaScript
   - Audit and optimize SVG roundel sizes
4. Accessibility audit:
   - Keyboard navigation
   - Screen reader testing
   - Color contrast verification
5. Content validation:
   - Test with pilot issue using `layout: "nebula2026"`
   - Verify all frontmatter fields render correctly
   - Check fallback behavior when optional fields missing

**Success Criteria:**
- [ ] No regressions in existing (horizon2020) layout issues
- [ ] New design works across all target browsers
- [ ] Performance meets goals
- [ ] Accessibility standards met
- [ ] Pilot issue renders correctly with all design elements

---

### Migration Planning

**Goal:** Establish process for future issues and document for the team

**Tasks:**
1. Document migration process:
   - How to enable new design for an issue (`layout: "nebula2026"`)
   - Required and optional frontmatter fields
   - Color scheme and roundel customization
   - Asset requirements (cover art sizing, story art specs)
2. Create editor/content guide:
   - Frontmatter field reference
   - Best practices for story art and cover art
   - Genre and roundel selection
   - Customization examples
3. Create developer troubleshooting guide:
   - Common issues and solutions
   - How to add new genres/roundels
   - Performance debugging
   - Browser-specific quirks and workarounds
4. Establish deployment process:
   - Testing before pushing live
   - Rollback procedures
   - How to revert an issue to horizon2020 layout if needed

**Success Criteria:**
- [ ] Clear, step-by-step migration guide exists
- [ ] Editor can follow guide to publish new issue with new design
- [ ] Developer can troubleshoot common issues
- [ ] Team confident in deployment process

---

### Deliverables Summary

- **Deployed 2026 design** live on production
- **Pilot issue** published using new design
- **Editor migration guide** (frontmatter, customization, best practices)
- **Developer troubleshooting guide** (common issues, extensibility, performance)
- **Deployment checklist** for future issues

## Open Questions

- **Q:** Should roundel genre categories be easily extensible (add new genres via configuration)?
  - **Technical consideration:** Genre is currently a site taxonomy. Could expand with configuration mapping (e.g., in `config.yaml`). Should not be hardcoded in JavaScript.

- **Q:** Chapter marker replacement timing—should this happen immediately or wait for images to load?
  - **Technical consideration:** Replace progressively as page loads to avoid layout shift and improve perceived performance.

- **Q:** Hover card library—custom JavaScript or use existing library (Tippy.js, Popper.js)?
  - **Technical consideration:** Decision deferred to implementation phase. Will evaluate cost/benefit of vanilla JS vs. lightweight libraries.
