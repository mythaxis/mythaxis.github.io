# Audio Remote Button — Design Spec

**Date:** 2026-03-28
**Branch:** `poc`
**Status:** Approved design, pending implementation

## Summary

A play/pause remote control embedded in the sticky story header's issue roundel. When a story has audio, the roundel becomes a two-faced flip card: front face shows the decorative roundel, back face shows a play/pause icon. This lets readers control audio playback after scrolling past the in-page HTML5 audio player.

Pages without `audio:` frontmatter are unaffected — the roundel stays purely decorative.

## Interaction Model

### Entry Animation (Peek)
When the sticky header (`.story-header-minimal`) slides into view (`.visible` class added by `nebula-nav.js`), the roundel performs a "peek" flip after a **1-second delay**: front → back → front (~800ms total). This signals to the reader that the roundel is interactive.

The peek plays every time the header transitions to visible. If the user scrolls up (header hides) then back down (header reappears), the peek plays again.

### Two-Step Interaction
1. **First tap:** Flips the card to the back face, revealing the play or pause icon (reflecting current playback state).
2. **Second tap:** Toggles audio playback (play ↔ pause). The icon updates to reflect the new state.

### Auto-Revert Timer
**7 seconds** after the card flips to back, it automatically flips back to the roundel face. The timer resets on each tap while the back face is showing. Subsequent interactions always follow the two-step model — tap to reveal, tap to toggle.

### Playback Pulse
While audio is playing and the roundel shows its front (decorative) face, a gentle CSS pulse animation plays on the roundel. This reuses the visual language of the existing roundel hover pulse. The pulse stops when audio is paused or the track ends.

## Technical Design

### Approach: CSS 3D Card Flip
- Container uses `perspective: 600px`
- Inner card uses `transform-style: preserve-3d`
- Front and back faces use `backface-visibility: hidden`
- Back face pre-rotated `rotateY(180deg)`
- Flip-to-back: **400ms**, `cubic-bezier(0.25, 1, 0.5, 1)` (ease-out-quart)
- Flip-to-front (revert): **300ms** (75% of entry duration)

### HTML Changes — `article-single.html`

When `audio:` frontmatter exists, the roundel markup in the minimal header wraps in a flip container:

```html
<!-- Without audio (unchanged): -->
<div class="story-header-minimal__logotype">
  <img src="/images/roundels/{{ $issueRoundel }}.svg"
       class="story-header-minimal__issue-roundel"
       alt="" aria-hidden="true" />
</div>

<!-- With audio: -->
<div class="story-header-minimal__logotype audio-remote"
     role="button" tabindex="0"
     aria-label="Audio controls">
  <div class="audio-remote__card">
    <div class="audio-remote__front">
      <img src="/images/roundels/{{ $issueRoundel }}.svg"
           class="story-header-minimal__issue-roundel"
           alt="" aria-hidden="true" />
    </div>
    <div class="audio-remote__back">
      <svg class="audio-remote__icon" viewBox="0 0 48 48" aria-hidden="true">
        <!-- Play icon (default) — filled triangle -->
        <polygon class="audio-remote__play" points="18,12 38,24 18,36" />
        <!-- Pause icon (hidden by default) — two vertical bars -->
        <g class="audio-remote__pause" style="display:none">
          <rect x="14" y="12" width="6" height="24" />
          <rect x="28" y="12" width="6" height="24" />
        </g>
      </svg>
    </div>
  </div>
</div>
```

### CSS — `nebula2026.css`

New section: "Audio Remote Button"

```css
/* Container: perspective for 3D flip, explicit dimensions */
.audio-remote {
  perspective: 600px;
  cursor: pointer;
  width: 3.5rem;
  height: 3.5rem;
}

/* Card: preserves 3D space, transitions for flip */
.audio-remote__card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 400ms cubic-bezier(0.25, 1, 0.5, 1);
}

/* Revert flip is faster */
.audio-remote__card--reverting {
  transition-duration: 300ms;
}

/* Flipped state */
.audio-remote__card--flipped {
  transform: rotateY(180deg);
}

/* Both faces: fill container, hide backface */
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

/* Back face: pre-rotated */
.audio-remote__back {
  transform: rotateY(180deg);
  background: #1a1a1a;
  border-radius: 50%;
}

/* Play/pause icon */
.audio-remote__icon {
  width: 60%;
  height: 60%;
  fill: #fff;
}

/* Playback pulse — gentle scale pulse while audio is playing */
@keyframes audio-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}

.audio-remote--playing .audio-remote__front {
  animation: audio-pulse 2s ease-in-out infinite;
}

/* Reduced motion: disable flip and pulse */
@media (prefers-reduced-motion: reduce) {
  .audio-remote__card {
    transition: none !important;
  }

  .audio-remote--playing .audio-remote__front {
    animation: none !important;
  }

  /* Instant swap via opacity instead of flip */
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
}
```

Mobile breakpoint mirrors existing roundel sizing:

```css
/* Mobile: match existing roundel size */
@media (max-width: 768px) {
  .audio-remote {
    width: 2.5rem;
    height: 2.5rem;
  }
}
```

### JavaScript — `static/js/nebula2026/audio-remote.js`

New self-contained IIFE module:

```
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
    var REVERT_DELAY = 7000;       // 7s auto-revert
    var PEEK_DELAY = 1000;         // 1s after header appears
    var PEEK_SHOW_DURATION = 400;  // peek: show back for 400ms

    // --- Icon state ---
    function updateIcon() {
      var playing = !audioEl.paused;
      playIcon.style.display = playing ? 'none' : '';
      pauseIcon.style.display = playing ? '' : 'none';
      // Update aria-label
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
      // Clean up --reverting after transition completes
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
      // Override the normal revert timer with a short peek duration
      clearRevertTimer();
      revertTimer = setTimeout(flipToFront, PEEK_SHOW_DURATION);
    }

    // --- Header visibility observer ---
    // Watch for .visible class toggling on minimal header
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          var isVisible = minimalHeader.classList.contains('visible');
          if (isVisible) {
            // Header just appeared — schedule peek
            clearTimeout(peekTimer);
            peekTimer = setTimeout(peek, PEEK_DELAY);
          } else {
            // Header disappeared — reset state
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
        // Tap during peek: cancel peek, hold on back face as a reveal
        isPeeking = false;
        clearRevertTimer();
        startRevertTimer();
        return;
      }
      if (!isFlipped) {
        // First tap: reveal controls
        flipToBack();
      } else {
        // Second tap: toggle playback
        if (audioEl.paused) {
          audioEl.play().catch(function() { /* autoplay blocked */ });
        } else {
          audioEl.pause();
        }
        updateIcon();
        updatePulse();
        // Reset revert timer
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

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAudioRemote);
  } else {
    initAudioRemote();
  }
})();
```

### Script Loading — `scripts.html`

Conditional loading based on page context. The script tag is only emitted when the page has audio:

```go
{{ with .Page }}{{ if .Params.audio }}
<script src="{{ "js/nebula2026/audio-remote.js" | relURL }}" defer></script>
{{ end }}{{ end }}
```

## Files Touched

| File | Change |
|------|--------|
| `layouts/partials/themes/nebula2026/article-single.html` | Conditional audio-remote markup around roundel |
| `static/js/nebula2026/audio-remote.js` | New module |
| `static/themes/nebula2026.css` | Flip card styles, pulse animation, reduced-motion fallback |
| `layouts/partials/themes/nebula2026/scripts.html` | Conditional script loading |

## Accessibility

- `role="button"` and `tabindex="0"` for keyboard access
- Enter/Space triggers same interaction as click
- `aria-label` updates dynamically: "Audio controls" → "Play audio" / "Pause audio"
- `prefers-reduced-motion`: flip disabled (instant opacity swap), pulse disabled, peek skipped
- Audio button only present when audio exists — no dead controls

## Edge Cases

- **Track ends:** Pulse stops, icon reverts to play. Next interaction follows normal two-step flow.
- **User plays via in-page player:** Audio events fire, pulse starts, icon state stays in sync.
- **Multiple rapid taps:** Revert timer resets on each tap, preventing accidental revert during interaction.
- **Browser autoplay restrictions:** `audioEl.play()` returns a promise; if blocked, the rejected promise is caught silently. State stays at "paused."
- **Tap during peek:** Cancels the peek auto-revert, holds the back face visible with the normal 7-second timer. Maintains the two-step model — the next tap toggles playback.
