/**
 * Nebula2026 Reading Progress Bar
 *
 * Displays a thin gradient progress bar at the top of story pages
 * showing how far the user has scrolled through the story.
 */

(function() {
  'use strict';

  function initReadingProgress() {
    // Only on story pages
    if (!document.querySelector('.nebula2026-story-single')) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Create progress bar container
    const progressContainer = document.createElement('div');
    progressContainer.className = 'reading-progress';
    progressContainer.innerHTML = '<div class="reading-progress__bar"></div>';

    // Insert at top of body
    document.body.insertBefore(progressContainer, document.body.firstChild);

    const progressBar = progressContainer.querySelector('.reading-progress__bar');

    let ticking = false;

    function updateProgress() {
      // Calculate scroll progress
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;

      // Update progress bar width
      progressBar.style.width = scrolled + '%';

      ticking = false;
    }

    // Listen to scroll events
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });

    // Initial update
    updateProgress();

    // Debug info (only in development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Reading progress bar initialized');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReadingProgress);
  } else {
    initReadingProgress();
  }

})();
