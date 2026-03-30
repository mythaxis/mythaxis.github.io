/**
 * Nebula2026 Story Hero Navigation
 *
 * Arrow Up/Down navigate between story hero and reading content,
 * but only at the top threshold. Once the user is scrolled into
 * the reading area, arrows behave normally.
 */

(function() {
  'use strict';

  function initStoryHeroNav() {
    var hero = document.querySelector('.story-header');
    var reading = document.querySelector('.story-reading');
    if (!hero || !reading) return;

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function getScrollBehavior() {
      return prefersReducedMotion.matches ? 'auto' : 'smooth';
    }

    function shouldSkip() {
      if (document.querySelector('.nebula-nav-panel--open')) return true;
      var tag = (document.activeElement || {}).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
      if (document.activeElement && document.activeElement.isContentEditable) return true;
      return false;
    }

    function isNearHero() {
      // "Near hero" means the reading area's top edge is still below
      // the viewport top (accounting for the sticky header).
      var headerH = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h')
      ) || 0;
      // Convert rem to px
      var headerPx = headerH * parseFloat(getComputedStyle(document.documentElement).fontSize);
      var rect = reading.getBoundingClientRect();
      // If reading top is more than half a viewport height below the
      // sticky header line, we're still in the hero zone
      return rect.top > headerPx + window.innerHeight * 0.25;
    }

    function isAtTop() {
      return window.scrollY < 10;
    }

    document.addEventListener('keydown', function(e) {
      if (shouldSkip()) return;

      if (e.key === 'ArrowDown' && isNearHero()) {
        e.preventDefault();
        reading.scrollIntoView({
          behavior: getScrollBehavior(),
          block: 'start'
        });
      } else if (e.key === 'ArrowUp' && !isNearHero() && !isAtTop()) {
        // Only intercept ArrowUp when close to the top of reading area
        var rect = reading.getBoundingClientRect();
        var headerH = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--header-h')
        ) || 0;
        var headerPx = headerH * parseFloat(getComputedStyle(document.documentElement).fontSize);
        // If reading top is near the sticky header line, jump back to hero
        if (rect.top > headerPx - 10 && rect.top < headerPx + window.innerHeight * 0.25) {
          e.preventDefault();
          hero.scrollIntoView({
            behavior: getScrollBehavior(),
            block: 'start'
          });
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStoryHeroNav);
  } else {
    initStoryHeroNav();
  }

})();
