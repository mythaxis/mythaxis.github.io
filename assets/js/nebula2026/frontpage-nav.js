/**
 * Nebula2026 Frontpage Keyboard Navigation
 *
 * Arrow Up/Down navigate between snap targets (intro + story cards)
 * on the frontpage. Uses scrollIntoView with scroll-padding-top
 * handled by CSS. Respects prefers-reduced-motion.
 */

(function() {
  'use strict';

  function initFrontpageNav() {
    // Only activate on pages with the posts grid (landing/section pages)
    if (!document.querySelector('.posts')) return;

    // Collect snap targets in DOM order
    var intro = document.getElementById('intro');
    var rows = Array.prototype.slice.call(
      document.querySelectorAll('.nebula-content-row')
    );

    var targets = [];
    if (intro) targets.push(intro);
    targets = targets.concat(rows);

    if (targets.length < 2) return;

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var scrollPadding = parseFloat(
      getComputedStyle(document.documentElement).scrollPaddingTop
    ) || 0;

    // Threshold in px — target must be this far past the snap line
    // to count as "not yet current"
    var THRESHOLD = 10;

    function getScrollBehavior() {
      return prefersReducedMotion.matches ? 'auto' : 'smooth';
    }

    function shouldSkip() {
      // Skip when nav panel is open
      if (document.querySelector('.nebula-nav-panel--open')) return true;

      // Skip when focus is in an interactive element
      var tag = (document.activeElement || {}).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
      if (document.activeElement && document.activeElement.isContentEditable) return true;

      return false;
    }

    function findCurrentIndex() {
      // The "current" target is the last one whose top edge is at or above
      // the snap line (viewport top + scroll-padding)
      var snapLine = scrollPadding + THRESHOLD;
      var current = 0;

      for (var i = 0; i < targets.length; i++) {
        var rect = targets[i].getBoundingClientRect();
        if (rect.top <= snapLine) {
          current = i;
        }
      }

      return current;
    }

    document.addEventListener('keydown', function(e) {
      if (shouldSkip()) return;

      var direction;
      if (e.key === 'ArrowDown') {
        direction = 1;
      } else if (e.key === 'ArrowUp') {
        direction = -1;
      } else {
        return;
      }

      var currentIndex = findCurrentIndex();
      var nextIndex = currentIndex + direction;

      // Clamp to valid range
      if (nextIndex < 0 || nextIndex >= targets.length) return;

      e.preventDefault();

      targets[nextIndex].scrollIntoView({
        behavior: getScrollBehavior(),
        block: 'start'
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFrontpageNav);
  } else {
    initFrontpageNav();
  }

})();
