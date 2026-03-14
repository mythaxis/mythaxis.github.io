/**
 * Nebula2026 Navigation
 * =====================
 * Handles:
 * - Burger toggle: opens/closes the slide-in nav panel
 * - Logotype click: also opens the nav panel
 * - Landing pages: header becomes sticky, burger appears when header is visible
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
    var isLanding = !!intro;
    var ticking = false;

    // --- Landing page setup ---
    // On landing pages (with intro hero), the header is sticky and
    // the burger only appears once the header is visible at the top.

    if (isLanding && header) {
      header.classList.add('nebula-header--sticky');
      burger.classList.add('nebula-burger--hidden');
    }

    // --- Scroll detection ---

    function handleScroll() {
      if (isOpen) return;

      if (isLanding && header) {
        // Show burger when header has reached the top (intro scrolled past)
        var headerRect = header.getBoundingClientRect();
        if (headerRect.top <= 0) {
          burger.classList.remove('nebula-burger--hidden');
        } else {
          burger.classList.add('nebula-burger--hidden');
        }
      }

      // Story pages: toggle minimal header
      if (minimalHeader && header) {
        var headerBottom = header.getBoundingClientRect().bottom;
        if (headerBottom <= 0) {
          minimalHeader.classList.add('visible');
        } else {
          minimalHeader.classList.remove('visible');
        }
      }
    }

    if (isLanding || minimalHeader) {
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
    }

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

    console.log('[nebula-nav] Initialized', isLanding ? '(landing page)' : '');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
