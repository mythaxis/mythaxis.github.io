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
