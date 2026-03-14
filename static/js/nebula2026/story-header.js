/**
 * Nebula2026 Story Header
 * =======================
 * Progressive header scroll behavior for story pages.
 * Shows a minimal sticky header when the user scrolls past the hero.
 * Respects prefers-reduced-motion.
 */

(function() {
  'use strict';

  var THRESHOLD = 300;

  function init() {
    // Only run on story single pages
    if (!document.querySelector('.nebula2026-story-single')) {
      return;
    }

    var header = document.getElementById('story-header');
    var minimalHeader = document.getElementById('story-header-minimal');

    if (!header || !minimalHeader) {
      console.warn('[story-header] Missing header elements');
      return;
    }

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ticking = false;

    function handleScroll() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > THRESHOLD) {
        minimalHeader.classList.add('visible');
      } else {
        minimalHeader.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial check in case page loads scrolled
    handleScroll();

    console.log('[story-header] Initialized (reduced-motion: ' + prefersReducedMotion + ')');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
