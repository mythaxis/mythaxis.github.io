# Nebula 2026 Theme Completion Plan
## Minimal Features, Frugal Documentation

**Goal:** Complete the retheme by adding only the essential features from the snarktank analysis to the current clean POC foundation.

---

## Current State (POC Branch)

✅ **Done:**
- Clean theme-switching architecture (`getThemeContext`, `theme-dispatch`)
- Minimal nebula2026 template partials (19 files)
- Basic CSS foundation (533 lines in `nebula2026.css`)
- Horizon2020 fully isolated with its own CSS

❌ **Missing (Essential):**
- Story card interactions (mobile swipe, desktop hover)
- Roundel system (SVGs + chapter marker replacement)
- Enhanced styling for modern design
- JavaScript infrastructure

---

## Minimum Viable Features

Based on comprehensive back-analysis, these are the ONLY essential features needed:

### 1. Story Card System
**Why:** Signature feature from wireframes, core user experience
- Mobile: Full-screen overlay with swipe navigation
- Desktop: Hover popup with keyboard nav
- TOC items trigger cards with story metadata

### 2. Roundel System
**Why:** Visual identity of nebula2026 theme
- 8 genre SVGs (100px chapter markers, 200px story-end markers)
- JavaScript to replace `<hr>` tags with roundels
- Genres: orbit, fantasy, scifi, horror, cosmic, dark, supernatural, psion

### 3. Enhanced CSS
**Why:** Current 533 lines missing card styles, animations, responsive design
- Story card overlay styles
- Animations and transitions
- Mobile/desktop responsive breakpoints
- Reading interface polish

### 4. Minimal JavaScript Infrastructure
**Why:** No JS currently exists in POC
- `story-card-interactions.js` - Card behaviors
- `chapter-markers.js` - HR replacement
- Theme-specific loading in scripts.html

---

## What We're NOT Doing (Deliberately Excluded)

- Day/Night toggle (nice to have, not MVP)
- Sticky audio player (future enhancement)
- SVG sprite optimization (premature optimization)
- Progressive header collapse (complex, low value)
- Extensive documentation (user wants frugal)
- SCSS refactoring (CSS works fine)

---

## Implementation Plan

### Phase 1: Roundel Assets
**Effort:** 15 minutes | **Risk:** Low

Copy roundel SVGs from snarktank branch:
```
static/images/roundels/
├── orbit-100.svg
├── orbit-200.svg
├── fantasy-100.svg
├── fantasy-200.svg
├── scifi-100.svg
├── scifi-200.svg
├── horror-100.svg
├── horror-200.svg
├── cosmic-100.svg
├── cosmic-200.svg
├── dark-100.svg
├── dark-200.svg
├── supernatural-100.svg
├── supernatural-200.svg
├── psion-100.svg
└── psion-200.svg
```

**Source:** Copy existing roundels from snarktank branch
- Roundels already exist and have been generated
- Designer will provide final designs later (just need web logic now)
- These are temporary placeholders that work with the system

**Action:**
```bash
# Copy roundels from snarktank branch
git show snarktank:static/images/roundels/ > /tmp/roundels
# Or manually copy from snarktank branch to current POC branch
```

**Files Created:** 16 SVG files (copied from snarktank)

---

### Phase 2: Chapter Markers JavaScript
**Effort:** 1 hour | **Risk:** Low

Create `static/js/nebula2026/chapter-markers.js`:
- Find all `<hr>` tags in `.story-content`
- Read `data-chapter-marker` attribute from article
- Replace with `<img>` pointing to appropriate roundel SVG
- Fallback to "orbit" if not specified

**Files Created:**
- `static/js/nebula2026/chapter-markers.js` (~40 lines)

**Files Modified:**
- `layouts/partials/themes/nebula2026/scripts.html` - Load chapter-markers.js

---

### Phase 3: Story Card HTML Structure
**Effort:** 2 hours | **Risk:** Medium

Enhance existing nebula2026 templates to support story cards:

**A. Update `list-item.html`** (currently 1487 bytes)
- Add data attributes to TOC items:
  ```html
  <li data-story-url="{{ .RelPermalink }}"
      data-story-title="{{ .Title }}"
      data-story-authors="{{ delimit .Params.authors ", " }}"
      data-story-genre="{{ .Params.genre }}"
      data-story-abstract="{{ .Params.abstract }}"
      data-story-image="{{ .Params.image }}"
      data-has-card="true">
  ```

**B. Create story card overlay HTML (Simplified)**
Add to bottom of `index.html` and `section.html`:
```html
<div id="story-card-overlay" class="story-card-overlay hidden">
  <div class="story-card">
    <button class="story-card-close" aria-label="Close">&times;</button>
    <div class="story-card-image"></div>
    <div class="story-card-content">
      <h2 class="story-card-title"></h2>
      <p class="story-card-authors"></p>
      <p class="story-card-abstract"></p>
      <div class="story-card-actions">
        <a href="#" class="story-card-read">READ STORY</a>
      </div>
    </div>
  </div>
</div>
```

**Files Modified:**
- `layouts/partials/themes/nebula2026/list-item.html` (add data attributes)
- `layouts/index.html` (add overlay container)
- `layouts/_default/section.html` (add overlay container)

---

### Phase 4: Story Card JavaScript (Simplified)
**Effort:** 1.5 hours | **Risk:** Low-Medium

Create `static/js/nebula2026/story-card-interactions.js`:

**Core Features (Simplified):**
- Click TOC item → show overlay with story data
- Click background or close button → close overlay
- "READ" button → navigate to story
- **Excluded:** Swipe gestures, keyboard navigation, card-to-card navigation

**Key Functions:**
1. `initStoryCards()` - Attach click handlers to [data-has-card] items
2. `showStoryCard(element)` - Populate and display overlay
3. `hideStoryCard()` - Close overlay

**Implementation:**
```javascript
// Simple click-to-show, click-to-hide
document.querySelectorAll('[data-has-card]').forEach(item => {
  item.addEventListener('click', (e) => {
    if (!e.target.closest('a')) { // Don't trigger if clicking link
      e.preventDefault();
      showStoryCard(item);
    }
  });
});

// Close on background click or close button
overlay.addEventListener('click', (e) => {
  if (e.target === overlay || e.target.closest('.story-card-close')) {
    hideStoryCard();
  }
});
```

**Files Created:**
- `static/js/nebula2026/story-card-interactions.js` (~80-100 lines)

**Files Modified:**
- `layouts/partials/themes/nebula2026/scripts.html` - Load story-card-interactions.js

---

### Phase 5: Story Card CSS (Simplified)
**Effort:** 1 hour | **Risk:** Low

Add to `static/themes/nebula2026.css`:

**Overlay Styles:**
```css
.story-card-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.story-card-overlay.hidden {
  display: none;
}

.story-card {
  background: white;
  max-width: 600px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  border-radius: 8px;
  position: relative;
  padding: 2rem;
}

.story-card-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
}

.story-card-image img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.story-card-title {
  margin: 1rem 0 0.5rem;
}

.story-card-authors {
  color: #666;
  font-style: italic;
  margin-bottom: 1rem;
}

.story-card-abstract {
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.story-card-read {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: #3a5f7d;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
}

.story-card-read:hover {
  background: #2a4f6d;
}
```

**Files Modified:**
- `static/themes/nebula2026.css` (add ~80-100 lines)

---

### Phase 6: Article Template Enhancement
**Effort:** 1 hour | **Risk:** Low

Enhance `article-single.html` to support chapter markers:

Add `data-chapter-marker` attribute to article wrapper:
```html
<article class="story-content"
         data-chapter-marker="{{ .Params.chapterMarker | default "orbit" }}">
  {{ .Content }}
</article>
```

Add story-end marker at footer:
```html
<footer class="nebula-article-footer">
  <img src="/images/roundels/{{ $issueRoundel }}-200.svg"
       class="story-end-marker"
       alt=""
       aria-hidden="true" />
</footer>
```

**Files Modified:**
- `layouts/partials/themes/nebula2026/article-single.html`

---

### Phase 7: Configuration & Frontmatter Support
**Effort:** 30 minutes | **Risk:** Low

Ensure config.yaml has necessary defaults:
```yaml
params:
  currentIssue: "Issue 44"
  defaultRoundel: "orbit"
  defaultChapterMarker: "orbit"
```

**Files Modified:**
- `config.yaml` (if not already present)

---

### Phase 8: Minimal Documentation
**Effort:** 1 hour | **Risk:** Low

Create ONE concise guide (not multiple docs):

**File:** `NEBULA2026-GUIDE.md` (~100 lines total)

**Sections:**
1. **Quick Start** (for editors)
   - How to enable nebula2026 for an issue
   - Issue frontmatter example
   - Story frontmatter example

2. **Roundels Reference** (for editors)
   - List of 8 available genres
   - When they appear (chapter markers vs story-end)

3. **Developer Notes** (for future maintainers)
   - JavaScript files and what they do
   - Where styles live
   - How story cards work (1 paragraph)

4. **Troubleshooting** (3-4 common issues)
   - Cards not appearing → check data attributes
   - Roundels not showing → check genre spelling
   - Swipe not working → check touch events

**Files Created:**
- `NEBULA2026-GUIDE.md` (~100 lines)

---

## Testing Checklist

**Manual Testing (20-30 minutes):**
- [ ] Create test issue with `theme: nebula2026`
- [ ] Add 3 test stories with different genres
- [ ] Verify story cards open on click
- [ ] Verify cards close on background click or X button
- [ ] Verify "READ STORY" button navigates correctly
- [ ] Verify chapter markers replace `<hr>` tags
- [ ] Verify story-end markers appear
- [ ] Check responsive design (mobile, tablet, desktop)
- [ ] Test in Chrome and Safari (minimum)

**Regression Testing:**
- [ ] Old issues (without nebula2026) still render correctly
- [ ] horizon2020 theme unaffected
- [ ] No console errors on any page

---

## Summary

**Total Effort Estimate:** 7-8 hours (1 day)

**Files to Copy:** 16
- 16 SVG roundels (from snarktank branch)

**Files to Create:** ~3
- 2 JavaScript files (simplified)
- 1 documentation file

**Files to Modify:** ~7
- `nebula2026.css` (add ~150 lines)
- `list-item.html` (add data attributes)
- `index.html` (add overlay container)
- `section.html` (add overlay container)
- `article-single.html` (add chapter marker support)
- `scripts.html` (load JS files)
- `config.yaml` (add defaults if missing)

**Critical Path:**
1. Roundels (required for markers)
2. Chapter markers JS (depends on roundels)
3. Story card HTML structure (required for JS)
4. Story card JS (depends on HTML)
5. Story card CSS (depends on HTML)
6. Testing & polish

---

## Risk Assessment

**Low Risk:**
- Roundel SVGs (static assets)
- Chapter markers JS (isolated feature)
- CSS additions (won't break existing)
- Documentation (no code impact)

**Medium Risk:**
- Story card HTML (template changes)
- Story card JS (complex interaction logic)

**Mitigation:**
- Test incrementally after each phase
- Keep old horizon2020 completely isolated
- Use feature detection for touch events
- Graceful degradation if JS fails to load

---

## Post-Launch Future Enhancements

(Not part of this plan, but noted for later)
- Day/Night mode toggle
- Sticky audio player
- Progressive header collapse on scroll
- SCSS refactoring for better maintainability
- Improved keyboard accessibility
- Lighthouse performance optimization
