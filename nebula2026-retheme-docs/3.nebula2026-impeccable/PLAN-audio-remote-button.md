# Audio Remote Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a play/pause remote control to the sticky story header by turning the issue roundel into a CSS 3D flip card on pages with audio.

**Architecture:** The existing roundel in `.story-header-minimal` gets conditional markup wrapping it in a two-faced flip card (front: roundel, back: play/pause icon). A new JS module (`audio-remote.js`) manages the flip state machine and controls the existing `<audio>` element. CSS handles the 3D flip transition, playback pulse, and reduced-motion fallback.

**Tech Stack:** Hugo templates (Go), vanilla JS (IIFE), CSS 3D transforms

**Spec:** `nebula2026-retheme-docs/SPEC-audio-remote-button.md`

---

### File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `static/themes/nebula2026.css` | Modify | Flip card 3D styles, pulse animation, reduced-motion fallback, mobile breakpoint |
| `layouts/partials/themes/nebula2026/article-single.html` | Modify | Conditional audio-remote markup around roundel in minimal header |
| `static/js/nebula2026/audio-remote.js` | Create | Flip state machine, peek animation, playback control, MutationObserver |
| `layouts/partials/themes/nebula2026/scripts.html` | Modify | Conditional script loading when page has audio |

---

### Task 1: CSS — Flip card styles

**Files:**
- Modify: `static/themes/nebula2026.css` (insert new section before the `@media (prefers-reduced-motion: reduce)` block at ~line 2700)

- [ ] **Step 1: Add audio remote CSS**

Add a new section `/* Audio Remote Button */` to `nebula2026.css`. Insert it before the existing `@media (prefers-reduced-motion: reduce)` block. The styles include:

```css
/* Audio Remote Button
   ========================================================================== */

.audio-remote {
    perspective: 600px;
    cursor: pointer;
    width: 3.5rem;
    height: 3.5rem;
}

.audio-remote__card {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 400ms cubic-bezier(0.25, 1, 0.5, 1);
}

.audio-remote__card--reverting {
    transition-duration: 300ms;
}

.audio-remote__card--flipped {
    transform: rotateY(180deg);
}

.audio-remote__front,
.audio-remote__back {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.audio-remote__back {
    transform: rotateY(180deg);
    background: #1a1a1a;
    border-radius: 50%;
}

.audio-remote__icon {
    width: 60%;
    height: 60%;
    fill: #fff;
}

@keyframes audio-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.06); }
}

.audio-remote--playing .audio-remote__front {
    animation: audio-pulse 2s ease-in-out infinite;
}
```

- [ ] **Step 2: Add audio remote rules to the existing mobile breakpoint**

Find the existing `@media (max-width: 768px)` block that contains `.story-header-minimal__content` rules (around line 2558) and add alongside the existing `.story-header-minimal__issue-roundel` rule:

```css
    .audio-remote {
        width: 2.5rem;
        height: 2.5rem;
    }
```

- [ ] **Step 3: Add audio remote rules to the existing reduced-motion block**

Find the existing `@media (prefers-reduced-motion: reduce)` block (around line 2700) and add these rules inside it:

```css
    .audio-remote__card {
        transition: none !important;
    }

    .audio-remote--playing .audio-remote__front {
        animation: none !important;
    }

    .audio-remote__front,
    .audio-remote__back {
        backface-visibility: visible;
        transform: none;
    }

    .audio-remote__back {
        opacity: 0;
    }

    .audio-remote__card--flipped .audio-remote__front {
        opacity: 0;
    }

    .audio-remote__card--flipped .audio-remote__back {
        opacity: 1;
    }
```

- [ ] **Step 4: Commit**

```bash
git add static/themes/nebula2026.css
git commit -m "style: add audio remote flip card CSS"
```

---

### Task 2: HTML — Conditional flip card markup

**Files:**
- Modify: `layouts/partials/themes/nebula2026/article-single.html` (lines 94-97, the `.story-header-minimal__logotype` block)

- [ ] **Step 1: Replace the roundel markup with conditional audio/non-audio variants**

In `article-single.html`, replace the current logotype block (lines 94-97):

```html
      <div class="story-header-minimal__logotype">
        <img src="/images/roundels/{{ $issueRoundel }}.svg" class="story-header-minimal__issue-roundel" alt="" aria-hidden="true" />
      </div>
```

With the conditional version:

```html
      {{ if $page.Params.audio }}
      <div class="story-header-minimal__logotype audio-remote"
           role="button" tabindex="0"
           aria-label="Audio controls">
        <div class="audio-remote__card">
          <div class="audio-remote__front">
            <img src="/images/roundels/{{ $issueRoundel }}.svg" class="story-header-minimal__issue-roundel" alt="" aria-hidden="true" />
          </div>
          <div class="audio-remote__back">
            <svg class="audio-remote__icon" viewBox="0 0 48 48" aria-hidden="true">
              <polygon class="audio-remote__play" points="18,12 38,24 18,36" />
              <g class="audio-remote__pause" style="display:none">
                <rect x="14" y="12" width="6" height="24" />
                <rect x="28" y="12" width="6" height="24" />
              </g>
            </svg>
          </div>
        </div>
      </div>
      {{ else }}
      <div class="story-header-minimal__logotype">
        <img src="/images/roundels/{{ $issueRoundel }}.svg" class="story-header-minimal__issue-roundel" alt="" aria-hidden="true" />
      </div>
      {{ end }}
```

- [ ] **Step 2: Verify Hugo build**

Run: `hugo build 2>&1 | tail -5`
Expected: Clean build, no template errors.

- [ ] **Step 3: Commit**

```bash
git add layouts/partials/themes/nebula2026/article-single.html
git commit -m "feat: add conditional audio remote markup to sticky header"
```

---

### Task 3: JavaScript — Audio remote module

**Files:**
- Create: `static/js/nebula2026/audio-remote.js`

- [ ] **Step 1: Create the audio-remote.js module**

Write the complete file at `static/js/nebula2026/audio-remote.js`:

```javascript
/**
 * Audio Remote Button
 * ===================
 * Turns the issue roundel in the sticky header into a flip-card
 * play/pause remote for the page's HTML5 audio player.
 *
 * Only loaded on pages with audio: frontmatter.
 * Respects prefers-reduced-motion (skips flip/pulse animations).
 */
(function() {
  'use strict';

  function initAudioRemote() {
    var audioEl = document.querySelector('.nebula-audio-player audio');
    var remote = document.querySelector('.audio-remote');
    var minimalHeader = document.getElementById('story-header-minimal');

    if (!audioEl || !remote || !minimalHeader) return;

    var card = remote.querySelector('.audio-remote__card');
    var playIcon = remote.querySelector('.audio-remote__play');
    var pauseIcon = remote.querySelector('.audio-remote__pause');
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var isFlipped = false;
    var isPeeking = false;
    var revertTimer = null;
    var peekTimer = null;
    var REVERT_DELAY = 7000;
    var PEEK_DELAY = 1000;
    var PEEK_SHOW_DURATION = 400;

    // --- Icon state ---
    function updateIcon() {
      var playing = !audioEl.paused;
      playIcon.style.display = playing ? 'none' : '';
      pauseIcon.style.display = playing ? '' : 'none';
      remote.setAttribute('aria-label', playing ? 'Pause audio' : 'Play audio');
    }

    // --- Pulse state ---
    function updatePulse() {
      if (!audioEl.paused) {
        remote.classList.add('audio-remote--playing');
      } else {
        remote.classList.remove('audio-remote--playing');
      }
    }

    // --- Flip control ---
    function flipToBack() {
      isFlipped = true;
      card.classList.remove('audio-remote__card--reverting');
      card.classList.add('audio-remote__card--flipped');
      updateIcon();
      startRevertTimer();
    }

    function flipToFront() {
      isFlipped = false;
      isPeeking = false;
      card.classList.add('audio-remote__card--reverting');
      card.classList.remove('audio-remote__card--flipped');
      clearRevertTimer();
      card.addEventListener('transitionend', function onEnd() {
        card.removeEventListener('transitionend', onEnd);
        card.classList.remove('audio-remote__card--reverting');
      });
    }

    function startRevertTimer() {
      clearRevertTimer();
      revertTimer = setTimeout(flipToFront, REVERT_DELAY);
    }

    function clearRevertTimer() {
      if (revertTimer) {
        clearTimeout(revertTimer);
        revertTimer = null;
      }
    }

    // --- Peek animation ---
    function peek() {
      if (prefersReducedMotion) return;
      isPeeking = true;
      flipToBack();
      clearRevertTimer();
      revertTimer = setTimeout(flipToFront, PEEK_SHOW_DURATION);
    }

    // --- Header visibility observer ---
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          var isVisible = minimalHeader.classList.contains('visible');
          if (isVisible) {
            clearTimeout(peekTimer);
            peekTimer = setTimeout(peek, PEEK_DELAY);
          } else {
            clearTimeout(peekTimer);
            clearRevertTimer();
            isFlipped = false;
            isPeeking = false;
            card.classList.remove('audio-remote__card--flipped');
            card.classList.remove('audio-remote__card--reverting');
          }
        }
      });
    });
    observer.observe(minimalHeader, { attributes: true });

    // --- Click/tap handler ---
    remote.addEventListener('click', function() {
      if (isPeeking) {
        isPeeking = false;
        clearRevertTimer();
        startRevertTimer();
        return;
      }
      if (!isFlipped) {
        flipToBack();
      } else {
        if (audioEl.paused) {
          audioEl.play().catch(function() { /* autoplay blocked */ });
        } else {
          audioEl.pause();
        }
        updateIcon();
        updatePulse();
        startRevertTimer();
      }
    });

    // --- Keyboard support ---
    remote.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        remote.click();
      }
    });

    // --- Audio event listeners ---
    audioEl.addEventListener('play', function() {
      updateIcon();
      updatePulse();
    });
    audioEl.addEventListener('pause', function() {
      updateIcon();
      updatePulse();
    });
    audioEl.addEventListener('ended', function() {
      updateIcon();
      updatePulse();
    });

    // Initial state
    updateIcon();
    updatePulse();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAudioRemote);
  } else {
    initAudioRemote();
  }
})();
```

- [ ] **Step 2: Syntax check**

Run: `node --check static/js/nebula2026/audio-remote.js`
Expected: No output (clean syntax).

- [ ] **Step 3: Commit**

```bash
git add static/js/nebula2026/audio-remote.js
git commit -m "feat: add audio remote JS module"
```

---

### Task 4: Script loading — Conditional inclusion

**Files:**
- Modify: `layouts/partials/themes/nebula2026/scripts.html` (append after existing script tags)

- [ ] **Step 1: Add conditional audio-remote script tag**

After the last `<script>` tag in `scripts.html` (the `frontpage-nav.js` line), add:

```go
{{ with .Page }}{{ if .Params.audio }}
<script src="{{ "js/nebula2026/audio-remote.js" | relURL }}" defer></script>
{{ end }}{{ end }}
```

- [ ] **Step 2: Verify Hugo build**

Run: `hugo build 2>&1 | tail -5`
Expected: Clean build, no template errors.

- [ ] **Step 3: Commit**

```bash
git add layouts/partials/themes/nebula2026/scripts.html
git commit -m "feat: conditionally load audio-remote.js for pages with audio"
```

---

### Task 5: Manual verification

- [ ] **Step 1: Start dev server**

Run: `hugo server -D --disableFastRender`

- [ ] **Step 2: Test page WITH audio**

Navigate to a story page with audio (e.g. `/issue-45/the-witness/`). Verify:
- Scroll down past the hero image until the sticky header appears
- The roundel does a peek flip ~1 second after the header slides in
- Tap/click the roundel — it flips to show play icon
- Tap/click the play icon — audio starts, icon changes to pause
- Wait 7 seconds — card flips back to roundel face
- Roundel shows a gentle pulse while audio plays
- Tap roundel again — reveals pause icon; tap pause — audio stops, pulse stops
- Scroll up so header hides, scroll back down — peek animation replays

- [ ] **Step 3: Test page WITHOUT audio**

Navigate to a story page without audio. Verify:
- Roundel in sticky header is a normal static image (no flip behaviour)
- No JS errors in the browser console

- [ ] **Step 4: Test keyboard accessibility**

On a page with audio, Tab to the roundel in the sticky header. Press Enter or Space. Verify the flip and playback toggle work identically to click.

- [ ] **Step 5: Final commit (if any tweaks needed)**

```bash
git add -A && git commit -m "fix: audio remote adjustments from manual testing"
```
