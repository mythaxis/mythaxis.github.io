/**
 * Nebula2026 Navigation
 * =====================
 * Handles:
 * - Scroll detection: shows burger button when header/nav scroll out of view
 * - Story pages: also shows the sticky minimal header on scroll
 * - Burger toggle: opens/closes the slide-in nav panel
 * - Backdrop click and ESC key to close
 * - Body scroll lock when panel is open
 * - Respects prefers-reduced-motion
 */

(function() {
  'use strict';

  function init() {
    var burger = document.getElementById('nebula-burger');
    var panel = document.getElementById('nebula-nav-panel');
    var backdrop = document.getElementById('nebula-nav-backdrop');
    var nav = document.getElementById('nav');
    var minimalHeader = document.getElementById('story-header-minimal');

    if (!burger || !panel || !backdrop) {
      return;
    }

    var isOpen = false;
    var ticking = false;

    // --- Scroll detection ---

    function handleScroll() {
      if (isOpen) return; // Don't toggle visibility while panel is open

      var scrolledPast = false;

      if (nav) {
        var navBottom = nav.getBoundingClientRect().bottom;
        scrolledPast = navBottom <= 0;
      } else {
        // Fallback: 300px threshold if nav element missing
        scrolledPast = (window.pageYOffset || document.documentElement.scrollTop) > 300;
      }

      if (scrolledPast) {
        burger.classList.add('nebula-burger--visible');
      } else {
        burger.classList.remove('nebula-burger--visible');
      }

      // Story pages: toggle minimal header
      if (minimalHeader) {
        if (scrolledPast) {
          minimalHeader.classList.add('visible');
        } else {
          minimalHeader.classList.remove('visible');
        }
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

    // Initial check
    handleScroll();

    // --- Panel open/close ---

    function openPanel() {
      isOpen = true;
      panel.classList.add('nebula-nav-panel--open');
      panel.setAttribute('aria-hidden', 'false');
      backdrop.classList.add('nebula-nav-backdrop--visible');
      burger.classList.add('nebula-burger--open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('no-scroll');
    }

    function closePanel() {
      isOpen = false;
      panel.classList.remove('nebula-nav-panel--open');
      panel.setAttribute('aria-hidden', 'true');
      backdrop.classList.remove('nebula-nav-backdrop--visible');
      burger.classList.remove('nebula-burger--open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('no-scroll');
    }

    function togglePanel() {
      if (isOpen) {
        closePanel();
      } else {
        openPanel();
      }
    }

    // --- Event listeners ---

    burger.addEventListener('click', function(e) {
      e.stopPropagation();
      togglePanel();
    });

    backdrop.addEventListener('click', closePanel);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) {
        closePanel();
      }
    });

    console.log('[nebula-nav] Initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
