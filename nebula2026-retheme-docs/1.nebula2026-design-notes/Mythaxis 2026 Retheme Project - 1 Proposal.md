# Mythaxis 2026 Retheme Project

## Proposal

This project refreshes the Mythaxis Magazine website with a modern, mobile-first reading experience. The redesign focuses on the frontpage, issue landing pages, and story pages while preserving all existing published issues unchanged. A single theme with conditional layout switching enables both old (horizon2020) and new (nebula2026) designs to coexist—existing issues use legacy layouts, new issues opt into the redesigned interface.

## Vision & Design Philosophy

**Mobile-First, Desktop-Optimized:** The new design prioritizes mobile reading experiences while ensuring layouts adapt gracefully for desktop viewing. The interface should be intuitive, visually striking, and optimized for both touch interactions and traditional navigation. Responsive CSS ensures all designs work well across screen sizes.

**The Roundel as Design System:** The MYTH(O)AXIS roundel serves dual purposes: it's both the visual brand identity and a functional navigation element. Different genre-specific roundels provide visual symbolism throughout the reading experience. The roundel appears consistently across screens as an interactive button, genre marker, and story separator.

**Proposed Logotype:** The new MYTHAXIS logotype integrates the roundel as a central design element, with the roundel positioned between words to create visual balance and brand cohesion.

![MYTHAXIS logotype with integrated roundel](wireframes/Example%20new%20logotype.jpg)

**Core User Experience:** Readers move naturally from cover art impact → curated table of contents → story selection → immersive reading, with the roundel guiding them through each transition. Desktop layouts expand and reorganize these elements to take advantage of wider screens without losing the intentional flow.

## Design Specifications

### Site Frontpage

**Visual Hierarchy:**
- Full-screen cover art of current issue (hero section)
- MYTH(O)AXIS branding with the roundel (O) as the primary interactive element
- Minimal UI: Only the roundel-as-button and menu icon visible

**Interaction:**
- Tapping/clicking the roundel scrolls the page down to reveal the site content below
- Roundel remains visible/fixed during scroll
- Smooth scroll animation guides user to content section

**Content:**
- Frontpage always displays the current/latest issue

![Mobile frontpage hero displaying full-screen cover art with MYTHAXIS branding and central roundel navigation element](wireframes/Mob_01_Landing.png)

### Issue Landing Page (Table of Contents)

**Visual Design:**
- Cover art in header area (similar to frontpage hero treatment)
- Roundel serves as visual separator between header and content
- Clean bullet list format for table of contents
- Zero-scroll TOC target (5 stories + 2 articles standard)
- Responsive to handle variable content (up to 8+ items when needed)

**TOC Format:**
- Simple, clean bullet list
- Format: "[STORY TITLE] by [AUTHOR NAME]"
- No individual story roundels in TOC (keep it uncluttered)

**Navigation:**
- Each story/article item is clickable and opens a story preview card (overlay)
- Readers access individual issue landing pages via archive/back catalogue
- Each issue (including current issue) has its own dedicated landing page URL
- Site frontpage and current issue landing page have the same visual design but are separate pages

![Issue landing page with cover art header, roundel separator, MYTHAXIS branding, and table of contents displayed as clean bullet list items](wireframes/Mob_02_IssueTOC.png)

### Story Preview Card (Interactive Overlay)

**Mobile Interaction:**
- Tapping a story title in the TOC opens a full-screen overlay card
- Users can swipe left/right to browse between stories
- Tapping the card itself navigates to the full story page
- Back button closes the overlay and returns to TOC

**Desktop Interaction:**
- Hovering over a story title shows the card as a hover popup (Wikipedia-style)
- Clicking a story title opens the card as a fixed overlay modal
- Arrow buttons (< >) allow browsing between stories without closing
- Clicking the card navigates to the story page
- ESC key or back button closes the overlay

**Card Content:**
- Story title, author, issue, genre
- Story-specific artwork
- Short description/teaser text
- Genre indicator (name only, no roundel on card)

**Visual Transitions:**
- Smooth fade between story previews as users navigate
- Background colors and imagery update to match the selected story

![Story preview card overlay showing selected story with metadata (title, author, genre), story artwork, teaser text, navigation arrows for browsing between stories, and action buttons (BACK and READ)](wireframes/Mob_03_StorySelection.png)

### Story Page (Reading Screen)

**Progressive Interface:**
- Initially shows full story art and metadata (matching the preview card)
- As reader scrolls down, story art and header content slide off screen
- Clean reading experience emerges with story text in focus
- Minimal UI distraction: only fixed hamburger menu remains visible

**Chapter Markers (In-Story Roundels):**
- Genre-specific roundels automatically inserted at chapter/section breaks
- Detection: JavaScript finds markdown dividers (`***`) and replaces them with SVG roundels
- Roundel selection based on story's `chapterMarker` frontmatter value
- Keeps editorial content clean—no markup needed in markdown

**End-of-Story Treatment:**
- Large roundel displays at story end as part of page footer
- Roundel selection based on issue-level configuration

**Standard Menu Pages:**
- About Issue pages, archive pages, submissions page use the same basic layout
- Without story-specific elements (no progress indicator, different footer treatment)

![Reading screen showing progressive interface: header with story metadata collapses on scroll, revealing clean reading text area. Genre-specific roundel chapter markers appear at section breaks. Persistent footer contains audio player controls and day/night mode toggle](wireframes/Mob_04_ReadingScreen.png)

## Content & Frontmatter

**Note:** This specification focuses on the retheme project scope. A comprehensive frontmatter documentation will follow project completion, covering all fields, inheritance hierarchy, and editor guidelines.

### Issue Frontmatter (`__index.md`)

```yaml
title: "Issue 42"
season: "Summer"
year: "2025"
layout: "nebula2026"           # Switches to new design (defaults to "horizon2020")
issueRoundal: "orbit"         # Large end-of-story roundel (optional, site default if not set)
coverArt: "images/issue42-cover.jpg"
colorScheme:
  primary: "#3a5f7d"
  secondary: "#8b6f4e"
```

### Story Frontmatter

```yaml
title: "Story Title"
author: "Author Name"
genre: "fantasy"              # Genre taxonomy
chapterMarker: "fantasy"      # Determines in-story section roundel
storyArt: "images/story-art.jpg"
abstract: "Story teaser text..."
```

## Genre Roundel System

The roundel design system includes genre-specific visual markers that appear throughout the reading experience as chapter dividers and story separators. Each genre has a distinctive iconographic style reflecting its thematic content.

![Genre-specific roundels: Sci-Fi (UFO abduction scene), Orbit (concentric circles), Fantasy (Celtic knot), Psion (mutated hand), Horror (haunted eye), Supernatural (crossed swords), Dark Fantasy (skull smile), Cosmic (swirling galaxy), and Orbit variant (atomic structure)](wireframes/Sample%20Roundals.jpg)

### Supported Genres

The visible roundels above correspond to the following genres available for categorization:

- **scifi** - Science fiction and speculative technology stories
- **orbit** - Space exploration and cosmic adventure
- **fantasy** - Traditional fantasy and magical worlds
- **psion** - Mutation, transformation, and psychic phenomena
- **horror** - Psychological and supernatural horror
- **supernatural** - Paranormal and mystical elements
- **dark** - Dark fantasy and gothic themes
- **cosmic** - Eldritch and cosmic horror themes
- Additional genres can be added by creating new SVG roundel assets

## Project Phases & Milestones

### Phase 1: Foundation & Architecture Setup
**Deliverable:** Dual layout system working; both horizon2020 and nebula2026 designs render correctly
- Restructure theme to support horizon2020 and nebula2026 layouts independently
- Establish fallback and configuration hierarchy (site → issue)
- Verify backward compatibility with existing issues

**Success:** Can toggle between layouts via frontmatter; no existing issues affected

### Phase 2: Design System Components
**Deliverable:** All visual design systems implemented and configurable
- Roundel system functional (chapter markers and story-end markers)
- Color scheme system working with site/issue-level overrides
- Story preview cards rendering with all metadata

**Success:** Design is consistent across stories and issues; easy to customize per issue

### Phase 3: Interactive Features
**Deliverable:** All interactive behaviors working on mobile and desktop
- Story preview cards fully interactive (swipe on mobile, hover on desktop)
- Page navigation and transitions smooth and polished
- Progressive interface working (hero → reading view)

**Success:** Readers can navigate intuitively; no janky animations or delayed interactions

### Phase 4: Polish & Launch Preparation
**Deliverable:** Production-ready with documentation
- Cross-browser testing complete; performance optimized
- Create pilot issue demonstrating new design
- Documentation and editor guidelines ready
- Migration path established for future issues

**Success:** Design is ready to deploy; team has clear process for new issues

**Target Completion:** [To be determined]

## Technical Requirements

### Dependencies
- Hugo CMS (current version)
- SVG support for roundels
- CSS3 for animations and transitions
- JavaScript for interactive elements

### Browser Compatibility
- Modern mobile browsers (iOS Safari, Chrome, Firefox)
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Progressive enhancement approach for older browsers

### Performance Goals
- Fast page loads (< 2 seconds on 3G)
- Smooth animations
- Optimized image delivery
- Minimal JavaScript bundle

## Success Criteria

1. New design significantly enhances reader engagement and first impression
2. Readers navigate intuitively without instructions
3. All existing issues continue working unchanged
4. Easy to configure individual issues with custom colors and roundels
5. Seamless reading experience on mobile
6. Simple process for adding new issues with new design

## Future Enhancements

- Dynamic genre/roundel configuration system
- Animated transitions between story artworks
- Reading progress indicators
- Bookmark/save reading position
- Back issues archive design refresh
- Widescreen-specific layout optimizations

## Open Questions for Refinement

1. What happens on widescreen—single column, two column, or different layout entirely?
2. Should story preview card always require story art, or is it optional?
3. How to handle issues with more than standard 5 stories + 2 articles in zero-scroll TOC?
4. Should animated transitions be CSS-only or JavaScript-enhanced?

---

**Project Owner:** Andrew  
**Technical Lead:** Marty
