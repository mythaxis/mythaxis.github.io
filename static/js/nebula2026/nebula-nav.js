/**
 * Nebula2026 Navigation
 * =====================
 * Handles:
 * - Burger toggle: opens/closes the slide-in nav panel
 * - Logotype click: also opens the nav panel
 * - Burger visibility: appears when header scrolls out of view
 * - Landing pages: header becomes sticky (never scrolls out)
 * - Story pages: shows the sticky minimal header on scroll
 * - Backdrop click and ESC key to close
 * - Body scroll lock when panel is open
 */

(function() {
  'use strict';

  function init() {
    var burger = document.getElementById('nebula-burger');
    var menuTrigger = document.getElementById('nebula-menu-trigger');
    var panel = document.getElementById('nebula-nav-panel');
    var backdrop = document.getElementById('nebula-nav-backdrop');
    var header = document.getElementById('header');
    var intro = document.getElementById('intro');
    var minimalHeader = document.getElementById('story-header-minimal');

    if (!burger || !panel || !backdrop) {
      return;
    }

    var isOpen = false;
    var ticking = false;

    // Landing pages: make header sticky
    if (intro && header) {
      header.classList.add('nebula-header--sticky');
    }

    // Burger starts hidden on all pages — appears when header scrolls out
    burger.classList.add('nebula-burger--hidden');

    // --- Scroll detection ---

    function handleScroll() {
      if (isOpen) return;

      if (header) {
        var headerBottom = header.getBoundingClientRect().bottom;
        var scrolledPast = headerBottom <= 0;

        // Show/hide burger based on header visibility
        if (scrolledPast) {
          burger.classList.remove('nebula-burger--hidden');
        } else {
          burger.classList.add('nebula-burger--hidden');
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

    if (menuTrigger) {
      menuTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        togglePanel();
      });
    }

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
