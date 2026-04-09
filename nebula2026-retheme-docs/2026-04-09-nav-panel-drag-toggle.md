# Nav Panel Drag Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the nav panel roundel into an interactive horizontal drag toggle switch with inertia-based state changes.

**Architecture:** Replace the static roundel at the bottom of the nav panel with a pill-shaped toggle switch containing a draggable roundel handle. The roundel can be dragged left/right (y-axis locked) to close the menu. A simple tap won't work — users must drag with momentum past a threshold to trigger the close action. The toggle uses physics-based inertia for natural feel.

**Tech Stack:** Vanilla JavaScript with pointer events (mouse + touch unified), CSS transforms for smooth 60fps animation, Hugo template updates for new HTML structure.

---

### Task 1: Update HTML Structure for Toggle Switch

**Files:**
- Modify: `layouts/partials/themes/nebula2026/nav.html:70-72`

- [ ] **Step 1: Replace roundel markup with toggle switch structure**

Replace the existing roundel div with a pill-shaped toggle container:

```html
    <div class="nebula-nav-toggle">
      <div class="nebula-nav-toggle__track" aria-hidden="true">
        <div class="nebula-nav-toggle__handle" id="nebula-nav-toggle-handle">
          <img src="/images/roundels/{{ $issueRoundel }}.svg" alt="" aria-hidden="true" />
        </div>
      </div>
      <span class="nebula-nav-toggle__label">Drag to close</span>
    </div>
```

- [ ] **Step 2: Verify template syntax**

Run: `hugo build 2>&1 | grep -E "ERROR|WARN"`
Expected: No template errors

- [ ] **Step 3: Commit structure change**

```bash
git add layouts/partials/themes/nebula2026/nav.html
git commit -m "feat(nav): add toggle switch HTML structure for drag interaction"
```

---

### Task 2: Add Base CSS for Toggle Switch

**Files:**
- Modify: `static/themes/nebula2026.css:613-634`

- [ ] **Step 1: Replace roundel CSS with toggle switch styles**

Remove `.nebula-nav-panel__roundel` styles (lines 613-634) and add:

```css
.nebula-nav-toggle {
    padding: 1.5rem 0.75rem 0.75rem;
    text-align: center;
}

.nebula-nav-toggle__track {
    position: relative;
    width: 100%;
    height: 60px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 30px;
    overflow: visible;
    cursor: grab;
    touch-action: pan-y;
}

.nebula-nav-toggle__track:active {
    cursor: grabbing;
}

.nebula-nav-toggle__handle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    will-change: transform;
}

.nebula-nav-toggle__handle img {
    width: 30px;
    height: 30px;
    opacity: 1;
    filter: grayscale(1) brightness(0);
}

.nebula-nav-toggle__label {
    display: block;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
```

- [ ] **Step 2: Build and verify CSS loads**

Run: `hugo build 2>&1 | grep -E "Total"`
Expected: Build completes successfully

- [ ] **Step 3: Commit CSS foundation**

```bash
git add static/themes/nebula2026.css
git commit -m "feat(nav): add toggle switch base CSS with pill track and centered handle"
```

---

### Task 3: Create Drag Interaction JavaScript

**Files:**
- Create: `assets/js/nebula2026/nav-toggle.js`

- [ ] **Step 1: Write drag interaction module with inertia**

Create new file with complete drag + velocity tracking:

```javascript
/**
 * Nebula2026 Nav Toggle
 * =====================
 * Draggable toggle switch for nav panel. Handle can be dragged left/right
 * (y-axis locked) to close the menu. Requires momentum — simple taps do nothing.
 * Uses velocity-based inertia to determine if threshold is crossed.
 */

(function() {
  'use strict';

  function initNavToggle() {
    var track = document.querySelector('.nebula-nav-toggle__track');
    var handle = document.querySelector('.nebula-nav-toggle__handle');
    var panel = document.getElementById('nebula-nav-panel');

    if (!track || !handle || !panel) return;

    var isDragging = false;
    var startX = 0;
    var currentX = 0;
    var offsetX = 0;
    var trackWidth = 0;
    var maxOffset = 0;
    var velocityX = 0;
    var lastX = 0;
    var lastTime = 0;

    // Velocity tracking for inertia calculation
    var velocityHistory = [];
    var VELOCITY_HISTORY_SIZE = 5;

    // Thresholds
    var VELOCITY_THRESHOLD = 0.5; // pixels per ms — must drag with this speed
    var DISTANCE_THRESHOLD = 0.3; // Must drag at least 30% of track width

    function updateDimensions() {
      trackWidth = track.offsetWidth;
      maxOffset = (trackWidth - handle.offsetWidth) / 2;
    }

    function getEventX(e) {
      return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    }

    function updateVelocity(x, time) {
      velocityHistory.push({ x: x, time: time });
      if (velocityHistory.length > VELOCITY_HISTORY_SIZE) {
        velocityHistory.shift();
      }

      if (velocityHistory.length >= 2) {
        var first = velocityHistory[0];
        var last = velocityHistory[velocityHistory.length - 1];
        var deltaX = last.x - first.x;
        var deltaT = last.time - first.time;
        velocityX = deltaT > 0 ? deltaX / deltaT : 0;
      }
    }

    function handlePointerDown(e) {
      isDragging = true;
      startX = getEventX(e);
      currentX = startX;
      offsetX = 0;
      velocityX = 0;
      velocityHistory = [];
      lastX = startX;
      lastTime = Date.now();

      updateDimensions();

      track.style.cursor = 'grabbing';
      e.preventDefault();
    }

    function handlePointerMove(e) {
      if (!isDragging) return;

      var nowX = getEventX(e);
      var nowTime = Date.now();

      currentX = nowX;
      offsetX = currentX - startX;

      // Lock to y-axis: clamp horizontal movement
      offsetX = Math.max(-maxOffset, Math.min(maxOffset, offsetX));

      // Update velocity tracking
      updateVelocity(nowX, nowTime);
      lastX = nowX;
      lastTime = nowTime;

      // Apply transform
      handle.style.transform = 'translate(calc(-50% + ' + offsetX + 'px), -50%)';

      e.preventDefault();
    }

    function handlePointerUp(e) {
      if (!isDragging) return;

      isDragging = false;
      track.style.cursor = 'grab';

      // Calculate final metrics
      var distance = Math.abs(offsetX);
      var distanceRatio = distance / trackWidth;
      var absVelocity = Math.abs(velocityX);

      // Determine if threshold crossed (velocity OR distance)
      var shouldClose = absVelocity > VELOCITY_THRESHOLD || distanceRatio > DISTANCE_THRESHOLD;

      if (shouldClose) {
        // Close the nav panel
        var closeEvent = new CustomEvent('nav-toggle-close');
        document.dispatchEvent(closeEvent);
      }

      // Animate handle back to center
      handle.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
      handle.style.transform = 'translate(-50%, -50%)';

      setTimeout(function() {
        handle.style.transition = '';
      }, 300);

      e.preventDefault();
    }

    function handlePointerCancel(e) {
      if (!isDragging) return;
      handlePointerUp(e);
    }

    // Unified pointer events (mouse + touch)
    track.addEventListener('mousedown', handlePointerDown);
    track.addEventListener('touchstart', handlePointerDown, { passive: false });

    document.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('touchmove', handlePointerMove, { passive: false });

    document.addEventListener('mouseup', handlePointerUp);
    document.addEventListener('touchend', handlePointerUp);

    document.addEventListener('touchcancel', handlePointerCancel);

    // Listen for custom close event and trigger menu close
    document.addEventListener('nav-toggle-close', function() {
      // Find and trigger existing close function
      var backdrop = document.getElementById('nebula-nav-backdrop');
      if (backdrop) backdrop.click();
    });

    // Reset handle position when panel opens
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          var isOpen = panel.classList.contains('nebula-nav-panel--open');
          if (isOpen) {
            handle.style.transition = '';
            handle.style.transform = 'translate(-50%, -50%)';
            offsetX = 0;
            velocityHistory = [];
          }
        }
      });
    });

    observer.observe(panel, { attributes: true });

    // Update dimensions on resize
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavToggle);
  } else {
    initNavToggle();
  }

})();
```

- [ ] **Step 2: Verify JavaScript syntax**

Run: `node --check assets/js/nebula2026/nav-toggle.js`
Expected: No syntax errors

- [ ] **Step 3: Commit drag interaction**

```bash
git add assets/js/nebula2026/nav-toggle.js
git commit -m "feat(nav): add drag interaction with velocity-based inertia detection"
```

---

### Task 4: Bundle Nav Toggle Script

**Files:**
- Modify: `layouts/partials/themes/nebula2026/scripts.html:16-23`

- [ ] **Step 1: Add nav-toggle to bundle**

Update the bundle slice to include nav-toggle:

```html
<!-- Nebula2026 Scripts (bundled) -->
{{- $chapterMarkers   := resources.Get "js/nebula2026/chapter-markers.js" -}}
{{- $roundelAnims     := resources.Get "js/nebula2026/roundel-animations.js" -}}
{{- $readingProgress  := resources.Get "js/nebula2026/reading-progress.js" -}}
{{- $parallaxHero     := resources.Get "js/nebula2026/parallax-hero.js" -}}
{{- $nebulaNav        := resources.Get "js/nebula2026/nebula-nav.js" -}}
{{- $frontpageNav     := resources.Get "js/nebula2026/frontpage-nav.js" -}}
{{- $storyHeroNav     := resources.Get "js/nebula2026/story-hero-nav.js" -}}
{{- $pageNav          := resources.Get "js/nebula2026/page-nav.js" -}}
{{- $navToggle        := resources.Get "js/nebula2026/nav-toggle.js" -}}
{{- $bundle := slice $chapterMarkers $roundelAnims $readingProgress $parallaxHero $nebulaNav $frontpageNav $storyHeroNav $pageNav $navToggle | resources.Concat "js/nebula2026.bundle.js" | minify | fingerprint -}}
<script src="{{ $bundle.RelPermalink }}" defer></script>
```

- [ ] **Step 2: Build and verify bundle**

Run: `hugo build 2>&1 | grep -E "ERROR|WARN|Total"`
Expected: Build succeeds, bundle includes nav-toggle.js

- [ ] **Step 3: Commit bundle update**

```bash
git add layouts/partials/themes/nebula2026/scripts.html
git commit -m "feat(nav): bundle nav-toggle script with nebula2026 assets"
```

---

### Task 5: Remove Old Roundel Click Handler

**Files:**
- Modify: `assets/js/nebula2026/nebula-nav.js:144-148`

- [ ] **Step 1: Comment out old roundel click handler**

The old `.nebula-nav-panel__roundel` click handler will break because the element no longer exists. Remove it:

```javascript
    // Panel logotype closes the menu on click
    var panelLogotype = panel.querySelector('.nebula-nav-panel__logotype');
    if (panelLogotype) panelLogotype.addEventListener('click', closePanel);

    // Roundel is now a drag toggle — remove old click handler
    // var panelRoundel = panel.querySelector('.nebula-nav-panel__roundel');
    // if (panelRoundel) panelRoundel.addEventListener('click', closePanel);
```

- [ ] **Step 2: Verify JavaScript syntax**

Run: `node --check assets/js/nebula2026/nebula-nav.js`
Expected: No syntax errors

- [ ] **Step 3: Commit cleanup**

```bash
git add assets/js/nebula2026/nebula-nav.js
git commit -m "refactor(nav): remove old roundel click handler (now drag toggle)"
```

---

### Task 6: Add Visual Feedback CSS

**Files:**
- Modify: `static/themes/nebula2026.css` (append after toggle styles)

- [ ] **Step 1: Add drag state and animation refinements**

Add enhanced visual feedback for drag interactions:

```css
/* Drag feedback: subtle glow when dragging */
.nebula-nav-toggle__track:active .nebula-nav-toggle__handle {
    box-shadow: 0 2px 12px rgba(255, 255, 255, 0.3),
                0 0 0 2px rgba(255, 255, 255, 0.1);
}

/* Label fades during drag */
.nebula-nav-toggle__track:active ~ .nebula-nav-toggle__label {
    opacity: 0.3;
    transition: opacity 0.15s ease;
}

/* Smooth transition when not dragging */
.nebula-nav-toggle__handle {
    transition: box-shadow 0.2s ease;
}

/* Mobile: increase track height for better touch target */
@media (max-width: 736px) {
    .nebula-nav-toggle__track {
        height: 70px;
    }

    .nebula-nav-toggle__handle {
        width: 60px;
        height: 60px;
    }

    .nebula-nav-toggle__handle img {
        width: 36px;
        height: 36px;
    }
}
```

- [ ] **Step 2: Build and verify styles**

Run: `hugo build 2>&1 | grep Total`
Expected: Build completes

- [ ] **Step 3: Commit visual feedback**

```bash
git add static/themes/nebula2026.css
git commit -m "feat(nav): add drag feedback and mobile touch target improvements"
```

---

### Task 7: Add Accessibility Attributes

**Files:**
- Modify: `layouts/partials/themes/nebula2026/nav.html:70-78`

- [ ] **Step 1: Add ARIA attributes for toggle**

Update the toggle markup with proper accessibility:

```html
    <div class="nebula-nav-toggle">
      <div class="nebula-nav-toggle__track"
           role="button"
           aria-label="Drag to close navigation menu"
           tabindex="-1"
           aria-hidden="true">
        <div class="nebula-nav-toggle__handle" id="nebula-nav-toggle-handle">
          <img src="/images/roundels/{{ $issueRoundel }}.svg" alt="" aria-hidden="true" />
        </div>
      </div>
      <span class="nebula-nav-toggle__label" aria-hidden="true">Drag to close</span>
    </div>
```

Note: tabindex="-1" prevents focus (drag-only interaction), aria-hidden="true" on decorative elements.

- [ ] **Step 2: Verify template**

Run: `hugo build 2>&1 | grep -E "ERROR|WARN"`
Expected: No errors

- [ ] **Step 3: Commit accessibility**

```bash
git add layouts/partials/themes/nebula2026/nav.html
git commit -m "feat(nav): add accessibility attributes to toggle switch"
```

---

### Task 8: Test and Document

**Files:**
- Create: `docs/superpowers/testing/nav-toggle-test-plan.md`

- [ ] **Step 1: Create manual test plan**

```markdown
# Nav Toggle Test Plan

## Desktop Tests

### Mouse Drag
1. Open nav panel
2. Click and drag roundel left — verify handle follows cursor (x-axis only)
3. Drag right — verify handle follows cursor
4. Drag < 30% width, release — verify handle snaps back, menu stays open
5. Drag > 30% width, release — verify handle snaps back, menu closes
6. Drag slowly > 30% — verify menu closes (distance threshold)
7. Drag quickly (flick) < 30% — verify menu closes (velocity threshold)

### Edge Cases
1. Drag beyond track bounds — verify handle clamps to max offset
2. Drag vertically — verify no y-axis movement
3. Click without drag — verify nothing happens (no close)
4. Drag, release outside track — verify closes if threshold met

## Mobile Tests (Touch)

### Touch Drag
1. All desktop drag tests using touch
2. Verify touch target size comfortable (70px track height)
3. Test with large/small hands
4. Verify no scroll interference (touch-action: pan-y)

### Performance
1. Open dev tools performance tab
2. Drag handle rapidly
3. Verify 60fps during drag (no jank)
4. Check console for errors

## Accessibility

1. Verify toggle not in tab order (tabindex="-1")
2. Verify screen reader doesn't announce decorative elements
3. Verify ESC still closes panel (existing behavior)
4. Verify backdrop click still works (existing behavior)

## Cross-Browser

- [ ] Chrome (desktop + mobile)
- [ ] Firefox (desktop + mobile)
- [ ] Safari (desktop + iOS)
- [ ] Edge (desktop)

## Pass Criteria

All drag interactions work smoothly with natural inertia feel. No regressions to existing nav panel behavior (ESC, backdrop, keyboard nav).
```

- [ ] **Step 2: Run manual tests**

Test drag interactions in browser (desktop + mobile device or emulator).
Expected: All tests pass, smooth 60fps drag

- [ ] **Step 3: Commit test plan**

```bash
git add docs/superpowers/testing/nav-toggle-test-plan.md
git commit -m "docs: add manual test plan for nav toggle drag interaction"
```

---

### Task 9: Update Memory and Architecture Docs

**Files:**
- Modify: `/Users/marty/.claude/projects/-Users-marty-Sites-mythaxis-github-io/memory/MEMORY.md` (append to "Key Architecture Notes")

- [ ] **Step 1: Document toggle in memory**

Add to MEMORY.md under navigation section:

```markdown
### Nav Panel Toggle
- Drag-interactive toggle at bottom of nav panel (replaces static roundel)
- Roundel handle centered in pill-shaped track, draggable left/right (y-axis locked)
- Closes menu when drag exceeds threshold:
  - Distance: > 30% of track width
  - Velocity: > 0.5 pixels/ms (flick gesture)
- Simple tap does nothing — requires momentum
- Physics: velocity tracking over 5-sample history for natural inertia
- Mobile: 70px track height for comfortable touch target
- Accessibility: tabindex="-1" (drag-only, not keyboard interactive)
```

- [ ] **Step 2: Verify memory updated**

Run: `cat /Users/marty/.claude/projects/-Users-marty-Sites-mythaxis-github-io/memory/MEMORY.md | grep -A 5 "Nav Panel Toggle"`
Expected: Shows new documentation

- [ ] **Step 3: Commit memory update**

```bash
git add /Users/marty/.claude/projects/-Users-marty-Sites-mythaxis-github-io/memory/MEMORY.md
git commit -m "docs: document nav toggle architecture in project memory"
```

---

## Verification Checklist

After completing all tasks:

- [ ] Nav panel opens/closes normally with all existing triggers (header logo, backdrop, ESC)
- [ ] Toggle handle drags smoothly left/right with no y-axis drift
- [ ] Simple tap/click on handle does nothing
- [ ] Slow drag > 30% width closes menu
- [ ] Fast flick < 30% width closes menu
- [ ] Handle snaps back to center with bounce animation
- [ ] Mobile touch targets comfortable (70px track)
- [ ] No JavaScript errors in console
- [ ] 60fps during drag (check performance tab)
- [ ] Works across Chrome, Firefox, Safari, Edge

---

## Configuration Notes

**Tuning Thresholds:**

If drag feel needs adjustment, modify these constants in `nav-toggle.js`:

```javascript
var VELOCITY_THRESHOLD = 0.5; // pixels per ms — lower = easier to trigger
var DISTANCE_THRESHOLD = 0.3; // ratio — lower = easier to trigger
var VELOCITY_HISTORY_SIZE = 5; // samples — more = smoother but less responsive
```

**Visual Customization:**

Track and handle styles in `nebula2026.css`:

```css
.nebula-nav-toggle__track {
    background: rgba(255, 255, 255, 0.1); /* Track pill color */
    height: 60px; /* Track height (desktop) */
}

.nebula-nav-toggle__handle {
    width: 50px; /* Handle size (desktop) */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); /* Handle shadow */
}
```

Mobile sizes automatically adjust via `@media (max-width: 736px)` rules.
