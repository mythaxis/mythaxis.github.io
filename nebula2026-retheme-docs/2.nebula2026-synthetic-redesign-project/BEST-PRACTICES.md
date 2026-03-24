# Best Practices

> Coding standards and patterns derived from all three implementations

---

## Hugo Template Patterns

### Use Helper Functions for Shared Logic

```go-html-template
{{/* ✅ Good: Reusable helper function */}}
{{ $layout := partial "functions/resolveLayout.html" . }}
{{ $colors := partial "functions/resolveColorScheme.html" . }}

{{/* ❌ Bad: Inline logic repeated everywhere */}}
{{ $layout := .Params.layout | default .Parent.Params.layout | default "horizon2020" }}
```

### Prefer `{{ with }}` for Optional Fields

```go-html-template
{{/* ✅ Good: Clean handling of optional fields */}}
{{ with .Params.abstract }}
  <p class="abstract">{{ . }}</p>
{{ end }}

{{/* ❌ Bad: Renders empty elements */}}
<p class="abstract">{{ .Params.abstract }}</p>
```

### Use Block Templates for Shared Structure

```go-html-template
{{/* ✅ Good: Base template with blocks (superskilled pattern) */}}
{{/* base.html */}}
<!DOCTYPE HTML>
<html>
<head>...</head>
<body>
  {{ block "nebula-content" . }}{{ end }}
</body>
</html>

{{/* story-page.html */}}
{{ define "nebula-content" }}
  <article>...</article>
{{ end }}
{{ partial "nebula2026/base.html" . }}
```

### Explicit Routing Over Magic

```go-html-template
{{/* ✅ Good: Clear conditional routing */}}
{{ if eq $layout "nebula2026" }}
  {{ partial "nebula2026/story-page.html" . }}
{{ else }}
  {{ partial "horizon2020/story-page.html" . }}
{{ end }}

{{/* ❌ Bad: Dynamic partial name (harder to debug) */}}
{{ partial (printf "%s/story-page.html" $layout) . }}
```

---

## CSS/SCSS Organization

### Use CSS Custom Properties for Theming

```css
/* ✅ Good: Variables from frontmatter */
:root {
  --color-primary: {{ $colors.primary }};
  --color-secondary: {{ $colors.secondary }};
}

.button {
  background: var(--color-primary);
}
```

### Mobile-First Breakpoints

```scss
/* ✅ Good: Mobile-first */
.card {
  width: 100%;
  
  @media (min-width: 768px) {
    width: 50%;
  }
  
  @media (min-width: 1024px) {
    width: 33.33%;
  }
}

/* ❌ Bad: Desktop-first */
.card {
  width: 33.33%;
  
  @media (max-width: 1023px) {
    width: 50%;
  }
}
```

### BEM Naming Convention

```css
/* ✅ Good: BEM structure */
.story-card { }
.story-card__title { }
.story-card__author { }
.story-card--featured { }

/* ❌ Bad: Deep nesting */
.story-card .content .title { }
```

---

## JavaScript Patterns

### Vanilla JS Only (No Dependencies)

```javascript
// ✅ Good: Vanilla event handling
element.addEventListener('click', handler);

// ❌ Bad: jQuery dependency
$('.element').click(handler);
```

### Passive Event Listeners for Scroll/Touch

```javascript
// ✅ Good: Passive for better performance
element.addEventListener('touchstart', handler, { passive: true });
element.addEventListener('scroll', handler, { passive: true });

// ❌ Bad: Blocking scroll
element.addEventListener('scroll', handler);
```

### Debounce Resize Handlers

```javascript
// ✅ Good: Debounced resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(handleResize, 250);
});

// ❌ Bad: Fires on every pixel
window.addEventListener('resize', handleResize);
```

### Feature Detection

```javascript
// ✅ Good: Check before using
if ('IntersectionObserver' in window) {
  // Use IntersectionObserver
} else {
  // Fallback
}

// ❌ Bad: Assume support
const observer = new IntersectionObserver(...);
```

---

## Accessibility

### Always Include ARIA Labels

```html
<!-- ✅ Good: Descriptive labels -->
<button class="card-close" aria-label="Close preview card">×</button>
<button class="nav-prev" aria-label="Previous story">‹</button>

<!-- ❌ Bad: No context -->
<button class="card-close">×</button>
```

### Hide Decorative Elements

```html
<!-- ✅ Good: Hidden from screen readers -->
<img src="roundel.svg" alt="" aria-hidden="true">

<!-- ❌ Bad: Announced as "image" -->
<img src="roundel.svg">
```

### Maintain Focus Management

```javascript
// ✅ Good: Return focus on close
const triggerElement = document.activeElement;
openModal();
// ... later ...
closeModal();
triggerElement.focus();
```

### Respect Motion Preferences

```css
/* ✅ Good: Respect user preference */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Performance

### Lazy Load Images

```html
<!-- ✅ Good: Native lazy loading -->
<img src="story-art.jpg" loading="lazy" alt="...">
```

### Defer Non-Critical JavaScript

```html
<!-- ✅ Good: Non-blocking -->
<script src="script.js" defer></script>

<!-- ❌ Bad: Blocks rendering -->
<script src="script.js"></script>
```

### Avoid Layout Shifts

```css
/* ✅ Good: Reserve space for images */
.story-art {
  aspect-ratio: 16 / 9;
}

/* ❌ Bad: Height unknown until load */
.story-art img {
  width: 100%;
}
```

---

## File Organization

### Keep Related Files Together

```
layouts/partials/nebula2026/
├── base.html           # Shared wrapper
├── frontpage.html      # Page: frontpage
├── section-landing.html # Page: issue TOC
├── story-single.html   # Page: story reading
├── story-card.html     # Component: preview card
└── story-end-marker.html # Component: roundel footer
```

### Separate Functions from Templates

```
layouts/partials/
├── functions/          # Pure logic, return values
│   ├── resolveLayout.html
│   ├── resolveColorScheme.html
│   └── resolveRoundel.html
├── nebula2026/         # Templates, render HTML
└── horizon2020/        # Legacy templates
```

### Clear Asset Organization

```
static/
├── js/nebula2026/      # JS for new layout only
├── images/roundels/    # All roundel SVGs
└── fonts/              # Custom fonts (if any)

assets/
├── scss/nebula2026/    # SCSS for new layout
└── css/                # Compiled CSS
```

---

## Documentation

### Use Kimi's Phase Format

```markdown
# Phase X – [Name]
**Sprint length:** X days | **Owner:** Name | **Status:** ✅/⚠️/❌

## Definition of Done
- [ ] Specific, measurable criteria

## Work-breakdown
- [ ] X.1 Task description

## Artifacts Produced
path/to/file.html

## Quick QA
```bash
# Verification commands
```
```

### Document All Configuration

```yaml
# ✅ Good: Inline comments
params:
  # Used by frontpage to determine layout
  currentIssue: "Issue 44"
  
  # Fallback roundel when not specified
  defaultRoundel: "orbit"
```

---

## Git Workflow

### Commit by Feature/Phase

```bash
# ✅ Good: Atomic commits
git commit -m "feat: add resolveLayout helper function"
git commit -m "feat: implement story card swipe gestures"

# ❌ Bad: Monolithic commits
git commit -m "Add nebula2026 layout system"
```

### Tag Milestones

```bash
git tag -a v0.1.0-alpha -m "Phase 1: Layout Foundation complete"
git tag -a v1.0.0-rc1 -m "Release candidate 1"
```

---

**Sources:** Patterns derived from snarktank, superskilled, and kimi-gemini branches
