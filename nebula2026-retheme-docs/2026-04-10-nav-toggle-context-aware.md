# Nav Toggle Context-Aware Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement context-aware navigation for the nav panel drag toggle, with different behaviors for stories vs. site-level pages.

**Architecture:** The toggle track will receive Hugo-calculated data attributes containing next/prev URLs and labels based on page context. JavaScript reads these attributes instead of calculating URLs from the pathname.

**Navigation Contexts:**

1. **Stock/Review Pages (stories within issue):**
   - Navigate through filtered story sequence (type: stock + review, weight-ordered)
   - At first story + drag LEFT → TOC (contents.md)
   - At last story + drag RIGHT → Issue Home (_index.md)

2. **TOC, Issue Home, Site-Level Pages:**
   - Drag LEFT → previous issue landing page
   - Drag RIGHT → archives page
   - Edge cases: from issue-1 or newest issue → archives in both directions

---

## Task 1: Add Hugo Navigation Logic to nav.html

**Files:**
- Modify: `layouts/partials/themes/nebula2026/nav.html`

- [ ] **Step 1: Calculate navigation context and URLs**

Add navigation logic before the toggle markup (around line 70). Insert this Hugo template code:

```go-html-template
{{- /* Calculate context-aware navigation URLs for toggle */ -}}
{{- $navLeftUrl := "" -}}
{{- $navLeftLabel := "" -}}
{{- $navRightUrl := "" -}}
{{- $navRightLabel := "" -}}

{{- if or (eq $page.Type "stock") (eq $page.Type "review") -}}
  {{- /* Story/Review pages: navigate through filtered sequence */ -}}
  {{- $currentSection := $page.Section -}}
  {{- $currentWeight := $page.Weight -}}

  {{- /* Build filtered story sequence: stock + review types, weight-ordered */ -}}
  {{- $stories := sort (where (where site.RegularPages "Section" $currentSection) ".Type" "in" (slice "stock" "review")) "Weight" "asc" -}}

  {{- /* Find current position in sequence */ -}}
  {{- $currentIndex := -1 -}}
  {{- range $idx, $story := $stories -}}
    {{- if eq $story.RelPermalink $page.RelPermalink -}}
      {{- $currentIndex = $idx -}}
    {{- end -}}
  {{- end -}}

  {{- /* Calculate prev/next with fallbacks */ -}}
  {{- $prevIndex := sub $currentIndex 1 -}}
  {{- $nextIndex := add $currentIndex 1 -}}

  {{- if ge $prevIndex 0 -}}
    {{- /* Previous story exists */ -}}
    {{- $prevStory := index $stories $prevIndex -}}
    {{- $navLeftUrl = $prevStory.RelPermalink -}}
    {{- $navLeftLabel = $prevStory.Title -}}
  {{- else -}}
    {{- /* First story: fallback to TOC (contents.md) */ -}}
    {{- $toc := $section.GetPage "contents.md" -}}
    {{- if $toc -}}
      {{- $navLeftUrl = $toc.RelPermalink -}}
      {{- $navLeftLabel = "Contents" -}}
    {{- else -}}
      {{- /* Fallback to section home if no contents.md */ -}}
      {{- $navLeftUrl = $section.RelPermalink -}}
      {{- $navLeftLabel = $section.Title -}}
    {{- end -}}
  {{- end -}}

  {{- if lt $nextIndex (len $stories) -}}
    {{- /* Next story exists */ -}}
    {{- $nextStory := index $stories $nextIndex -}}
    {{- $navRightUrl = $nextStory.RelPermalink -}}
    {{- $navRightLabel = $nextStory.Title -}}
  {{- else -}}
    {{- /* Last story: fallback to Issue Home (_index.md) */ -}}
    {{- $navRightUrl = $section.RelPermalink -}}
    {{- $navRightLabel = $section.Title -}}
  {{- end -}}

{{- else -}}
  {{- /* TOC, Issue Home, Site-Level Pages: issue-to-issue navigation */ -}}
  {{- $archives := site.GetPage "/archives.md" -}}
  {{- $archivesUrl := "" -}}
  {{- if $archives -}}
    {{- $archivesUrl = $archives.RelPermalink -}}
  {{- else -}}
    {{- $archivesUrl = "/archives/" -}}
  {{- end -}}

  {{- if $section -}}
    {{- /* Extract current issue number */ -}}
    {{- $currentIssueNum := replaceRE "^issue-" "" $section.Section | int -}}
    {{- $prevIssueNum := sub $currentIssueNum 1 -}}

    {{- /* Find previous issue section */ -}}
    {{- $prevIssueSection := printf "issue-%d" $prevIssueNum -}}
    {{- $prevIssue := site.GetPage $prevIssueSection -}}

    {{- if and (gt $prevIssueNum 0) $prevIssue -}}
      {{- /* Previous issue exists */ -}}
      {{- $navLeftUrl = $prevIssue.RelPermalink -}}
      {{- $navLeftLabel = printf "i%d" $prevIssueNum -}}
    {{- else -}}
      {{- /* Issue 1 or no prev: fallback to archives */ -}}
      {{- $navLeftUrl = $archivesUrl -}}
      {{- $navLeftLabel = "Archives" -}}
    {{- end -}}

    {{- /* Right always goes to archives (pseudo-future issue) */ -}}
    {{- $navRightUrl = $archivesUrl -}}
    {{- $navRightLabel = "Archives" -}}
  {{- else -}}
    {{- /* Site-level page (no section): both directions go to archives */ -}}
    {{- $navLeftUrl = $archivesUrl -}}
    {{- $navLeftLabel = "Archives" -}}
    {{- $navRightUrl = $archivesUrl -}}
    {{- $navRightLabel = "Archives" -}}
  {{- end -}}
{{- end -}}
```

- [ ] **Step 2: Update toggle track with data attributes**

Replace the existing toggle markup (lines 70-95) with:

```go-html-template
    <div class="nebula-nav-toggle">
      <div class="nebula-nav-toggle__track"
           role="button"
           tabindex="0"
           aria-label="Drag to navigate"
           data-nav-left-url="{{ $navLeftUrl }}"
           data-nav-left-label="{{ $navLeftLabel }}"
           data-nav-right-url="{{ $navRightUrl }}"
           data-nav-right-label="{{ $navRightLabel }}">
        <span class="nebula-nav-toggle__hint nebula-nav-toggle__hint--left" aria-hidden="true">
          {{ $navLeftLabel }}
        </span>
        <span class="nebula-nav-toggle__hint nebula-nav-toggle__hint--right" aria-hidden="true">
          {{ $navRightLabel }}
        </span>
        <div class="nebula-nav-toggle__handle" id="nebula-nav-toggle-handle">
          <img src="/images/roundels/{{ $issueRoundel }}.svg" alt="" aria-hidden="true" />
        </div>
      </div>
      <span class="nebula-nav-toggle__label">Drag to navigate</span>
    </div>
```

- [ ] **Step 3: Verify template syntax**

Run: `hugo build 2>&1 | grep -E "ERROR|WARN"`
Expected: No template errors

- [ ] **Step 4: Test data attributes in browser**

Run: `hugo server -D --disableFastRender`
Open browser DevTools, inspect `.nebula-nav-toggle__track`
Expected: See `data-nav-*` attributes with correct URLs

- [ ] **Step 5: Commit template changes**

```bash
git add layouts/partials/themes/nebula2026/nav.html
git commit -m "feat(nav): add context-aware navigation URLs via data attributes"
```

---

## Task 2: Update JavaScript to Read Data Attributes

**Files:**
- Modify: `assets/js/nebula2026/nav-toggle.js`

- [ ] **Step 1: Replace URL calculation with data attribute reading**

Replace the `handlePointerUp` function (lines 121-192) with:

```javascript
    function handlePointerUp(e) {
      if (!isDragging) return;

      isDragging = false;
      track.style.cursor = 'grab';

      // Hide directional hints
      if (hintLeft) hintLeft.classList.remove('visible');
      if (hintRight) hintRight.classList.remove('visible');

      // Calculate final metrics
      var distance = Math.abs(offsetX);
      var distanceRatio = distance / trackWidth;
      var absVelocity = Math.abs(velocityX);

      // Determine if threshold crossed (velocity OR distance)
      var thresholdCrossed = absVelocity > VELOCITY_THRESHOLD || distanceRatio > DISTANCE_THRESHOLD;

      console.log('[nav-toggle] Drag release:', {
        offsetX: offsetX,
        distance: distance,
        distanceRatio: distanceRatio,
        velocity: velocityX,
        absVelocity: absVelocity,
        thresholdCrossed: thresholdCrossed,
        velocityThreshold: VELOCITY_THRESHOLD,
        distanceThreshold: DISTANCE_THRESHOLD
      });

      if (thresholdCrossed) {
        // Read navigation URLs from data attributes
        var navLeftUrl = track.getAttribute('data-nav-left-url');
        var navRightUrl = track.getAttribute('data-nav-right-url');
        var targetUrl = offsetX < 0 ? navLeftUrl : navRightUrl;

        console.log('[nav-toggle] Navigation triggered:', {
          dragDirection: offsetX < 0 ? 'left' : 'right',
          navLeftUrl: navLeftUrl,
          navRightUrl: navRightUrl,
          targetUrl: targetUrl
        });

        if (targetUrl && targetUrl !== '') {
          window.location.href = targetUrl;
        } else {
          console.warn('[nav-toggle] No target URL found in data attributes');
        }
      }

      // Animate handle back to center
      handle.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
      handle.style.transform = 'translate(-50%, -50%)';

      setTimeout(function() {
        handle.style.transition = '';
      }, 300);

      e.preventDefault();
    }
```

- [ ] **Step 2: Verify JavaScript syntax**

Run: `node --check assets/js/nebula2026/nav-toggle.js`
Expected: No syntax errors

- [ ] **Step 3: Commit JavaScript changes**

```bash
git add assets/js/nebula2026/nav-toggle.js
git commit -m "feat(nav): read navigation URLs from data attributes instead of URL parsing"
```

---

## Task 3: Test Navigation Contexts

**Files:**
- Create: `nebula2026-retheme-docs/testing/nav-toggle-context-test-plan.md`

- [ ] **Step 1: Create comprehensive test plan**

```markdown
# Nav Toggle Context-Aware Navigation Test Plan

## Test Environment Setup

1. Start Hugo dev server: `hugo server -D --disableFastRender`
2. Open browser DevTools → Console tab (for debug logs)
3. Test on desktop + mobile (or responsive mode)

---

## Context 1: Stock/Review Pages (Story Sequence)

### Test Pages
- First story in issue-45
- Middle story in issue-45
- Last story in issue-45

### Test Cases

#### TC1.1: Middle Story Navigation
1. Navigate to a middle story in issue-45
2. Open nav panel, inspect toggle track data attributes
   - Verify `data-nav-left-url` = previous story URL
   - Verify `data-nav-right-url` = next story URL
   - Verify labels = story titles (truncated OK)
3. Drag toggle left (> 30% or flick)
   - Expected: Navigate to previous story
4. Go back, drag toggle right
   - Expected: Navigate to next story

#### TC1.2: First Story Navigation
1. Navigate to first story in issue-45 (lowest weight)
2. Open nav panel, inspect toggle track
   - Verify `data-nav-left-url` = contents.md URL
   - Verify `data-nav-left-label` = "Contents"
   - Verify `data-nav-right-url` = next story URL
3. Drag toggle left
   - Expected: Navigate to TOC (contents.md)
4. Go back to first story, drag toggle right
   - Expected: Navigate to next story (normal)

#### TC1.3: Last Story Navigation
1. Navigate to last story in issue-45 (highest weight)
2. Open nav panel, inspect toggle track
   - Verify `data-nav-left-url` = previous story URL
   - Verify `data-nav-right-url` = issue home (_index.md)
   - Verify `data-nav-right-label` = issue title
3. Drag toggle left
   - Expected: Navigate to previous story (normal)
4. Go back to last story, drag toggle right
   - Expected: Navigate to issue home (_index.md)

---

## Context 2: TOC and Issue Home Pages

### Test Pages
- /issue-45/contents/ (TOC)
- /issue-45/ (Issue Home)
- /issue-1/ (Edge case: first issue)

### Test Cases

#### TC2.1: TOC Navigation (Middle Issue)
1. Navigate to /issue-45/contents/
2. Open nav panel, inspect toggle track
   - Verify `data-nav-left-url` = /issue-44/ (prev issue home)
   - Verify `data-nav-left-label` = "i44"
   - Verify `data-nav-right-url` = /archives/ (or resolved archives URL)
   - Verify `data-nav-right-label` = "Archives"
3. Drag toggle left
   - Expected: Navigate to /issue-44/
4. Go back, drag toggle right
   - Expected: Navigate to archives page

#### TC2.2: Issue Home Navigation (Middle Issue)
1. Navigate to /issue-45/
2. Verify same data attributes as TC2.1
3. Test left/right drag navigation
   - Expected: Same behavior as TOC

#### TC2.3: Issue 1 Edge Case
1. Navigate to /issue-1/ or /issue-1/contents/
2. Open nav panel, inspect toggle track
   - Verify `data-nav-left-url` = /archives/
   - Verify `data-nav-left-label` = "Archives"
   - Verify `data-nav-right-url` = /archives/
3. Drag toggle left or right
   - Expected: Both navigate to archives

#### TC2.4: Newest Issue Edge Case
1. Navigate to newest issue (e.g., /issue-45/)
2. Verify right drag goes to archives
3. Verify left drag goes to /issue-44/

---

## Context 3: Site-Level Pages

### Test Pages
- /about/
- /archives/
- Editorial pages without cardLayout

### Test Cases

#### TC3.1: About Page Navigation
1. Navigate to /about/
2. Open nav panel, inspect toggle track
   - Verify data attributes (may default to archives on both sides)
3. Drag toggle left/right
   - Expected: Navigate to archives (or configured behavior)

#### TC3.2: Editorial Page Navigation
1. Navigate to an editorial page (e.g., in issue-45 but type: editorial)
2. Verify same behavior as issue home pages
   - Left → prev issue, Right → archives

---

## Edge Cases and Error Handling

### TC4.1: Missing contents.md
1. If an issue section has no contents.md:
   - First story left drag should fallback to issue home (_index.md)
2. Verify fallback logic works

### TC4.2: Missing archives.md
1. If /archives.md doesn't exist:
   - Verify fallback to `/archives/` URL

### TC4.3: Single Story Issue
1. If an issue has only one story:
   - Verify left drag → contents.md
   - Verify right drag → issue home (_index.md)

### TC4.4: Empty Data Attributes
1. Artificially remove data attributes in DevTools
2. Drag toggle
   - Expected: Console warning, no navigation

---

## Cross-Browser Testing

Test all contexts on:
- [ ] Chrome (desktop + mobile)
- [ ] Firefox (desktop)
- [ ] Safari (desktop + iOS)
- [ ] Edge (desktop)

---

## Pass Criteria

- ✅ All story sequences navigate correctly (prev/next/TOC/home)
- ✅ All TOC/issue home pages navigate to prev issue/archives
- ✅ Edge cases (issue-1, newest issue) fallback to archives
- ✅ Site-level pages use issue-to-issue navigation
- ✅ No JavaScript errors in console
- ✅ Data attributes populated correctly on all page types
- ✅ Hint labels match navigation targets
```

- [ ] **Step 2: Run manual tests**

Execute test plan systematically, document any failures.

- [ ] **Step 3: Commit test plan**

```bash
git add nebula2026-retheme-docs/testing/nav-toggle-context-test-plan.md
git commit -m "docs: add context-aware navigation test plan for nav toggle"
```

---

## Task 4: Handle Edge Cases and Fallbacks

**Files:**
- Review: `layouts/partials/themes/nebula2026/nav.html` (from Task 1)

- [ ] **Step 1: Add defensive checks for missing pages**

Review the Hugo navigation logic from Task 1. Ensure:
- If `contents.md` doesn't exist, fallback to section home
- If `archives.md` doesn't exist, fallback to `/archives/` string
- If prev issue doesn't exist, fallback to archives
- If story sequence is empty, provide sensible defaults

The code in Task 1 already includes these checks. Verify during testing.

- [ ] **Step 2: Add console warnings for missing URLs**

The JavaScript in Task 2 already includes a warning if `targetUrl` is empty. No changes needed.

- [ ] **Step 3: Test all edge cases**

Run edge case tests from TC4.1-4.4 in the test plan.
Expected: Graceful fallbacks, no broken navigation

---

## Task 5: Update Memory Documentation

**Files:**
- Modify: `/Users/marty/.claude/projects/-Users-marty-Sites-mythaxis-github-io/memory/MEMORY.md`

- [ ] **Step 1: Update Nav Panel Toggle section**

Replace the existing "Nav Panel Toggle" section with:

```markdown
### Nav Panel Toggle
- Drag-interactive toggle at bottom of nav panel (replaces static roundel click)
- Roundel handle centered in pill-shaped track, draggable left/right (y-axis locked)
- Closes menu when drag exceeds threshold (dual threshold: velocity OR distance)
  - **Distance threshold:** > 30% of track width
  - **Velocity threshold:** > 0.5 pixels/ms (flick gesture)
- Simple tap does nothing — requires momentum drag
- Physics: velocity tracking over 5-sample rolling history for natural inertia
- Animation: cubic-bezier(0.34, 1.56, 0.64, 1) bounce on release (300ms)
- Mobile: 70px track height for comfortable touch target (60px desktop)
- Visual feedback: track brightens on hover, handle glows + label fades during drag
- Custom event: dispatches 'nav-toggle-close' → triggers backdrop click
- MutationObserver resets handle position when panel reopens
- Accessibility: role="button", tabindex="0", aria-label (visual interaction primary)
- Files: `nav-toggle.js`, updated `nav.html` and `nebula2026.css`

#### Context-Aware Navigation
- **Stock/Review Pages:** Navigate through filtered story sequence (type: stock + review, weight-ordered)
  - First story + drag LEFT → TOC (contents.md)
  - Last story + drag RIGHT → Issue Home (_index.md)
- **TOC/Issue Home/Site Pages:** Issue-to-issue navigation
  - Drag LEFT → previous issue home
  - Drag RIGHT → archives page
  - Edge: issue-1 or newest issue → archives both directions
- Navigation URLs calculated by Hugo, stored in data attributes on toggle track
- JavaScript reads `data-nav-left-url` / `data-nav-right-url` instead of parsing URL
```

- [ ] **Step 2: Verify memory updated**

Run: `cat /Users/marty/.claude/projects/-Users-marty-Sites-mythaxis-github-io/memory/MEMORY.md | grep -A 20 "Nav Panel Toggle"`
Expected: Shows updated documentation

- [ ] **Step 3: Commit memory update**

```bash
git add /Users/marty/.claude/projects/-Users-marty-Sites-mythaxis-github-io/memory/MEMORY.md
git commit -m "docs: document context-aware navigation in nav toggle memory"
```

---

## Verification Checklist

After completing all tasks:

- [ ] Story pages navigate through sequence correctly (left = prev, right = next)
- [ ] First story + left drag goes to contents.md (TOC)
- [ ] Last story + right drag goes to _index.md (issue home)
- [ ] TOC and issue home pages: left = prev issue, right = archives
- [ ] Issue-1 pages: both directions go to archives
- [ ] Site-level pages use issue-to-issue navigation
- [ ] Data attributes populated correctly on all page types
- [ ] Hint labels match navigation targets
- [ ] No JavaScript errors in console
- [ ] All edge cases handled gracefully (missing contents.md, archives.md, etc.)
- [ ] Works across Chrome, Firefox, Safari, Edge

---

## Configuration Notes

**Story Sequence Filtering:**

The story sequence uses the same filtering as the nav strip:

```go-html-template
{{- $stories := sort (where (where site.RegularPages "Section" $currentSection) ".Type" "in" (slice "stock" "review")) "Weight" "asc" -}}
```

This ensures consistency between nav strip and toggle navigation.

**Fallback Hierarchy:**

1. **First story left drag:**
   - Try: contents.md → Fallback: section home (_index.md)

2. **Prev issue navigation:**
   - Try: /issue-{{N-1}}/ → Fallback: archives

3. **Archives page:**
   - Try: resolved link from /archives.md → Fallback: "/archives/" string

**Tuning Thresholds:**

Same as original nav toggle implementation. See `nav-toggle.js` constants:
- `VELOCITY_THRESHOLD = 0.5` (pixels per ms)
- `DISTANCE_THRESHOLD = 0.3` (30% of track width)
