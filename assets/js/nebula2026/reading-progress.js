/**
 * Nebula2026 Reading Progress Bar
 *
 * Displays a thin gradient progress bar at the bottom edge of the
 * sticky minimal header on story pages, showing scroll progress.
 */

(function() {
  'use strict';

  function initReadingProgress() {
    // Only on story pages
    if (!document.querySelector('.nebula2026-story-single')) return;

    var minimalHeader = document.getElementById('story-header-minimal');
    if (!minimalHeader) return;

    // Check if user prefers reduced motion
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Create progress bar and append inside the minimal header
    var progressBar = document.createElement('div');
    progressBar.className = 'reading-progress__bar';
    minimalHeader.appendChild(progressBar);

    var ticking = false;

    function updateProgress() {
      var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var scrolled = (winScroll / height) * 100;

      progressBar.style.width = scrolled + '%';
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });

    updateProgress();

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReadingProgress);
  } else {
    initReadingProgress();
  }

})();
