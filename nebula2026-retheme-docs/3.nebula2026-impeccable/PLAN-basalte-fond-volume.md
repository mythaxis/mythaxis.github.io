# Basalte Fond + Volume Implementation Plan

**Goal:** Fix the iOS Safari chromatic font rendering by replacing Basalte Multicolor with Basalte Volume as the overlay layer, introduce a third colour (accent) for depth/shadow, and extend the chromatic treatment to all frontpage Basalte headings.

**Reference:** [basalte-two-colour-font.md](basalte-two-colour-font.md)

---

## Background

The current implementation uses Basalte Fond (base) + Basalte Multicolor (overlay via `::after`). Multicolor is a COLR/CPAL colour font with diamond-shaped cutouts. On desktop browsers, these cutouts are transparent, creating a two-tone effect. On iOS Safari, COLR support is limited and Multicolor renders as solid glyphs, covering the base layer entirely.

**The fix:** Replace Multicolor with Volume. Volume is a standard outline font (not COLR) that provides depth/embossed strokes. It renders identically across all platforms.

**The enhancement:** Add a third layer using Volume again (or `text-shadow`) as a shadow/border behind the Fond, in a new accent colour. This creates a trichromatic effect: shadow → base → overlay.

---

## Task 1: Register Basalte Volume in CSS

Add a `@font-face` declaration for Basalte Volume. The file already exists at `static/assets/fonts/nebula2026/Basalte-Volume.woff2`.

**File:** `static/themes/nebula2026.css`

After the existing Basalte Multicolor `@font-face` (line 61-67), add:

```css
@font-face {
    font-family: 'Basalte Volume';
    src: url('../assets/fonts/nebula2026/Basalte-Volume.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}
```

Update the comment block (line 49-51) to reflect three registered variants.

**Verify:** `hugo build` — no errors. Font file loads in browser DevTools Network tab.

---

## Task 2: Add `--color-accent` to the colour scheme

Add a third colour token for the shadow/depth layer.

### 2a. CSS default token

**File:** `static/themes/nebula2026.css` — `:root` block (near lines 73-116)

Add after `--color-secondary`:

```css
--color-accent: #1a1a2e;    /* Shadow/depth layer — dark base for Basalte Volume shadow */
```

### 2b. Dynamic injection from frontmatter

**File:** `layouts/partials/themes/nebula2026/styles.html`

Add `accent` alongside `primary` and `secondary` in both the section-level and page-level colour blocks:

```html
{{ with .accent }}--color-accent: {{ . }};{{ end }}
```

### 2c. Example frontmatter

Update issue-45 `__index.md` to include an accent colour:

```yaml
colorScheme:
  primary: "#28c53d"
  secondary: "#5d1212"
  accent: "#0a1628"
```

**Design note:** The accent should be darker than primary — it's the shadow behind the letterform. For most issues, a very dark shade of the primary or a near-black will work. If omitted, it falls back to the CSS default `#1a1a2e`.

**Verify:** `hugo server` — inspect computed styles on `.theme-nebula2026`, confirm `--color-accent` appears.

---

## Task 3: Replace Multicolor with Volume on the intro logotype

The logotype (MYTH·AXIS) currently uses `::after` with Basalte Multicolor. Replace with a two-pseudo-element stack: `::before` for shadow (Volume, accent colour, offset) and `::after` for the overlay (Volume, secondary colour, no offset).

**File:** `static/themes/nebula2026.css`

### 3a. Change the existing `::after` rule (lines 323-332)

From:
```css
.nebula-title__myth::after,
.nebula-title__axis::after {
    content: attr(data-text);
    font-family: 'Basalte Multicolor', var(--font-secondary);
    color: var(--color-secondary);
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
}
```

To:
```css
/* Chromatic layering: Volume shadow behind, Volume overlay on top of Fond */
.nebula-title__myth::before,
.nebula-title__axis::before {
    content: attr(data-text);
    font-family: 'Basalte Volume', var(--font-secondary);
    color: var(--color-accent);
    position: absolute;
    left: 2px;
    top: 2px;
    pointer-events: none;
}

.nebula-title__myth::after,
.nebula-title__axis::after {
    content: attr(data-text);
    font-family: 'Basalte Volume', var(--font-secondary);
    color: var(--color-secondary);
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
}
```

**Design decisions to iterate on:**
- Shadow offset: `2px 2px` is a starting point — may need `1px 1px` or `3px 3px` depending on font size
- Whether `::before` shadow should scale with font size (use `0.05em` instead of `px`?)
- Whether to use `text-shadow` on the base layer instead of a `::before` pseudo-element for the shadow (simpler, one fewer layer)

**Alternative — text-shadow instead of ::before for shadow:**
```css
.nebula-title__myth,
.nebula-title__axis {
    position: relative;
    text-shadow: 2px 2px 0 var(--color-accent);
}

.nebula-title__myth::after,
.nebula-title__axis::after {
    content: attr(data-text);
    font-family: 'Basalte Volume', var(--font-secondary);
    color: var(--color-secondary);
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
    text-shadow: none;
}
```

This is simpler (two layers not three) and `text-shadow` with blur `0` matches the "old theme dropshadow without blur" reference. The `text-shadow: none` on `::after` prevents the shadow from doubling.

**Verify:** Check in browser — logotype should show three colours: dark shadow (accent), green base (primary), burgundy depth strokes (secondary/Volume). Check on iOS Safari simulator or device.

---

## Task 4: Replace Multicolor with Volume on featured titles

Same treatment for the split-lead featured title and content-row featured title.

**File:** `static/themes/nebula2026.css`

### 4a. Split-lead title (lines 722-731)

Change `::after` from Basalte Multicolor to Basalte Volume. Add `text-shadow` for the accent/shadow layer on the base element.

```css
.nebula-split-lead__title a {
    color: var(--color-primary);
    text-decoration: none;
    position: relative;
    text-shadow: 2px 2px 0 var(--color-accent);
}

.nebula-split-lead__title a::after {
    content: attr(data-text);
    font-family: 'Basalte Volume', var(--font-secondary);
    color: var(--color-secondary);
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
    text-shadow: none;
}
```

### 4b. Content-row featured title (lines 894-903)

Same pattern:

```css
.nebula-content-row__title--featured a {
    position: relative;
    text-shadow: 2px 2px 0 var(--color-accent);
}

.nebula-content-row__title--featured a::after {
    content: attr(data-text);
    font-family: 'Basalte Volume', var(--font-secondary);
    color: var(--color-secondary);
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
    text-shadow: none;
}
```

**Verify:** Featured titles on frontpage show the trichromatic effect. Check that hover underline still works.

---

## Task 5: Extend chromatic treatment to regular content-row titles

Currently, regular (non-featured) content-row titles at line 43 of `content-row.html` use:
```html
<h3 class="nebula-content-row__title"><a href="...">{{ $page.Title }}</a></h3>
```

No `data-text` attribute, so `::after` with `content: attr(data-text)` won't work.

### 5a. Add `data-text` to template

**File:** `layouts/partials/themes/nebula2026/content-row.html` (line 43)

Change:
```html
<h3 class="nebula-content-row__title"><a href="{{ $page.Permalink }}">{{ $page.Title }}</a></h3>
```

To:
```html
<h3 class="nebula-content-row__title"><a href="{{ $page.Permalink }}" data-text="{{ $page.Title }}">{{ $page.Title }}</a></h3>
```

### 5b. Add CSS for regular title chromatic layering

**File:** `static/themes/nebula2026.css` — after the existing `.nebula-content-row__title a` rules (lines 855-863)

```css
.nebula-content-row__title a {
    color: var(--color-primary);
    text-decoration: none;
    position: relative;
    text-shadow: 1px 1px 0 var(--color-accent);
}

.nebula-content-row__title a::after {
    content: attr(data-text);
    font-family: 'Basalte Volume', var(--font-secondary);
    color: var(--color-secondary);
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
    text-shadow: none;
}
```

**Note:** Shadow offset for regular titles should be smaller (`1px 1px`) since the font size is smaller (`clamp(1.2rem, ...)` vs `clamp(1.75rem, ...)` for featured). May need tuning.

**Verify:** Regular story titles on frontpage show the chromatic effect at smaller scale.

---

## Task 6: Scale shadow offset proportionally

The hard pixel offsets (`2px 2px` for large titles, `1px 1px` for small) may not scale well across `clamp()` sizes. Consider using `em`-based offsets instead:

```css
text-shadow: 0.04em 0.04em 0 var(--color-accent);
```

This scales proportionally with font size. Test across breakpoints.

**File:** `static/themes/nebula2026.css` — all `text-shadow` declarations from Tasks 3-5.

**Verify:** Check at mobile (320px), tablet (768px), and desktop (1200px+) widths. Shadow should be proportional at all sizes.

---

## Task 7: Clean up Multicolor references

Once Volume is confirmed working:

### 7a. Remove Basalte Multicolor `@font-face`

**File:** `static/themes/nebula2026.css` — lines 61-67

Delete the `@font-face` for `'Basalte Multicolor'`.

### 7b. Update `--font-secondary`

**File:** `static/themes/nebula2026.css` — line 86

Currently: `--font-secondary: 'Basalte', 'Alegreya', Georgia, "Times New Roman", serif;`

This is fine — it references Basalte (Fond), not Multicolor.

### 7c. Optionally remove the Multicolor font file

**File:** `static/assets/fonts/nebula2026/Basalte-Multicolor.woff2`

Can be deleted if no longer referenced anywhere. Saves 14 KB.

### 7d. Update comment blocks

Update the CSS comment (line 49-51) to reflect the new two-variant setup (Fond + Volume).

**Verify:** `hugo build` clean. No references to `'Basalte Multicolor'` remain in CSS. Grep across all files.

---

## Task 8: Update remaining issues' frontmatter with accent colour

Add `accent` to `colorScheme` in all issue `__index.md` files that have a `colorScheme`. Start with issue-45 and any issues with custom colour schemes.

**Files:** `content/issue-*/___index.md`

The accent colour should be:
- A very dark shade of the primary, or
- A near-black that complements the primary/secondary pair
- Darker than both primary and secondary

If an issue doesn't define `accent`, the CSS default (`#1a1a2e`) applies — which is a safe dark navy.

**Verify:** Navigate between issues. Each issue's logotype and titles should show a distinct accent shadow.

---

## Task 9: Visual QA and iteration

This is the "look at it and tune it" task. Open the site in browser and iterate:

1. **Logotype (MYTH·AXIS):** Does the three-colour stack read clearly? Is the shadow too heavy or too subtle?
2. **Featured titles:** Same check at the larger display size
3. **Regular titles:** Does the chromatic effect work at the smaller body-heading size, or is it too noisy? (If too noisy, revert regular titles to Fond-only)
4. **Mobile:** Check at 320px, 375px, 736px. Shadows should scale proportionally
5. **iOS Safari:** Primary verification — does Volume render correctly? (It should, since it's not COLR)
6. **Per-issue colours:** Switch between issues with different colourSchemes. Does the accent colour work for all palettes?
7. **Dark text on light background:** The logotype on the intro (hero) is typically light text on dark image. But page titles (`.nebula-page-title`) are dark text on white. The shadow direction and colour need to work in both contexts — or the shadow should only apply to light-on-dark contexts.

**Decision point:** After visual QA, decide:
- Keep three colours (shadow + base + overlay) or simplify to two (base + overlay, no shadow)?
- Apply to regular titles or featured-only?
- Shadow via `text-shadow` or `::before` pseudo-element?
- Border/stroke approach instead of shadow offset? (`-webkit-text-stroke` or paint-order trick)

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Register Volume @font-face | `nebula2026.css` |
| 2 | Add `--color-accent` token + frontmatter | `nebula2026.css`, `styles.html`, `__index.md` |
| 3 | Replace Multicolor → Volume on logotype | `nebula2026.css` |
| 4 | Replace Multicolor → Volume on featured titles | `nebula2026.css` |
| 5 | Extend chromatic to regular titles | `content-row.html`, `nebula2026.css` |
| 6 | Scale shadow offset with `em` | `nebula2026.css` |
| 7 | Clean up Multicolor references | `nebula2026.css`, font file |
| 8 | Add accent to issue frontmatter | `content/issue-*/__index.md` |
| 9 | Visual QA and iteration | Browser testing |
