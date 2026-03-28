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
