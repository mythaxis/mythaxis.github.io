# Nav Toggle Test Plan

## Feature Overview
Draggable toggle switch for closing the nav panel. Requires momentum-based drag interaction (velocity OR distance threshold). Y-axis locked.

## Test Cases

### Visual Feedback
- [ ] Hover: Track background brightens (0.1 → 0.15 alpha)
- [ ] Drag start: Handle glows with white shadow, label fades to 50%
- [ ] Drag release: Handle bounces back to center with cubic-bezier easing

### Drag Interaction
- [ ] Light tap: Does NOT close menu
- [ ] Fast flick (>0.5 px/ms): Closes menu
- [ ] Slow drag (>30% width): Closes menu
- [ ] Y-axis locked: Handle only moves horizontally
- [ ] Clamp to bounds: Handle doesn't exceed track edges

### Cross-Device
- [ ] Desktop: Mouse drag works smoothly
- [ ] Touch: Touch drag works smoothly
- [ ] Mobile: Larger touch targets (70px track, 60px handle)
- [ ] Performance: 60fps during drag (no jank)

### Accessibility
- [ ] Screen reader: Toggle has aria-label "Drag to close navigation"
- [ ] Keyboard: Tabindex="0" allows focus, role="button" for semantics
- [ ] Alt close: Backdrop click still works
- [ ] Alt close: ESC key still works

### Regression Tests
- [ ] Header logotype opens panel
- [ ] Story header logotype opens panel (story pages)
- [ ] Panel logotype closes panel
- [ ] Focus trap works (Tab cycles within panel)
- [ ] Body scroll lock works when panel open
- [ ] Panel resets handle position on open

## Manual Testing Steps

1. Start Hugo server:
   ```bash
   hugo server -D --disableFastRender
   ```

2. Navigate to a nebula2026 page (e.g., `/issue-45/`)

3. Open nav panel by clicking header logotype

4. Test drag interactions:
   - Light tap on handle → menu stays open
   - Drag handle slowly right > 30% width → menu closes
   - Reopen, drag handle quickly (flick) left < 30% → menu closes
   - Reopen, drag handle < 30% slowly → menu stays open, handle bounces back

5. Verify visual feedback:
   - Hover over track → background brightens
   - During drag → handle glows, label fades
   - After release → handle animates back with bounce

6. Test mobile (DevTools mobile mode or real device):
   - Touch drag works smoothly
   - Touch targets feel comfortable
   - No interference with page scrolling

7. Test accessibility:
   - Tab to toggle → verify focus visible
   - Screen reader → verify announces "Drag to close navigation"
   - ESC key → verify closes panel
   - Backdrop click → verify closes panel

8. Check performance:
   - Open DevTools Performance tab
   - Record during drag
   - Verify 60fps, no layout thrashing

9. Test browsers:
   - Chrome (desktop + mobile)
   - Firefox (desktop + mobile)
   - Safari (desktop + iOS)
   - Edge (desktop)

## Results Template

**Test Date:** [YYYY-MM-DD]
**Browser:** [name/version]
**Device:** [desktop/mobile]
**Tester:** [name]

### Summary
- **Status:** [PASS / FAIL / PARTIAL]
- **Total Tests:** [X]
- **Passed:** [X]
- **Failed:** [X]

### Issues Found
1. [Issue description]
   - **Severity:** [Critical / High / Medium / Low]
   - **Steps to reproduce:**
   - **Expected:**
   - **Actual:**

### Notes
[Any additional observations]

## Implementation Details

### Files Modified
- `layouts/partials/themes/nebula2026/nav.html` - Toggle HTML structure
- `static/themes/nebula2026.css` - Toggle styles and visual feedback
- `assets/js/nebula2026/nav-toggle.js` - Drag interaction logic
- `layouts/partials/themes/nebula2026/scripts.html` - Script bundling
- `assets/js/nebula2026/nebula-nav.js` - Removed obsolete roundel handler

### Technical Specifications
- **Velocity threshold:** 0.5 px/ms
- **Distance threshold:** 30% of track width
- **Velocity tracking:** 5-sample rolling history
- **Animation:** cubic-bezier(0.34, 1.56, 0.64, 1) bounce (300ms)
- **Mobile touch targets:** 70px track height, 60px handle diameter
- **Desktop touch targets:** 60px track height, 50px handle diameter

### Event Flow
1. User drags handle (pointerdown → pointermove → pointerup)
2. JavaScript tracks velocity over 5-sample history
3. On release: check velocity (>0.5 px/ms) OR distance (>30%)
4. If threshold met: dispatch 'nav-toggle-close' custom event
5. Event listener triggers backdrop click to close panel
6. Handle animates back to center with bounce easing
7. MutationObserver resets handle when panel reopens

### Threshold Tuning

If drag feel needs adjustment, modify constants in `nav-toggle.js`:

```javascript
var VELOCITY_THRESHOLD = 0.5;       // pixels per ms — lower = easier to trigger
var DISTANCE_THRESHOLD = 0.3;       // ratio — lower = easier to trigger
var VELOCITY_HISTORY_SIZE = 5;      // samples — more = smoother but less responsive
```

### Known Limitations
- Drag-only interaction (no click to close on handle)
- Not keyboard-interactive for closing (use ESC or backdrop instead)
- Requires modern browser with pointer events support
