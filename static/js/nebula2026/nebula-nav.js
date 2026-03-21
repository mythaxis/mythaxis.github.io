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

    var headerLogo = document.getElementById('nebula-menu-trigger');
    var isOpen = false;
    var ticking = false;
    var snapTimer = null;
    var triggerElement = null;
    var isMobile = window.matchMedia('(max-width: 736px)').matches;

    // Landing pages: make header sticky, hide logotype initially (big intro version visible)
    if (intro && header) {
      header.classList.add('nebula-header--sticky');
      if (headerLogo) {
        headerLogo.classList.add('nebula-header__logo--hidden');
      }
    }

    // Burger starts hidden on all pages — appears when header scrolls out
    burger.classList.add('nebula-burger--hidden');

    // --- Scroll detection ---

    function handleScroll() {
      if (isOpen) return;

      // iOS fix: disable mandatory snap near top so scroll-to-top gesture works
      if (intro && isMobile && window.scrollY < 10) {
        document.documentElement.style.scrollSnapType = 'none';
        clearTimeout(snapTimer);
        snapTimer = setTimeout(function() {
          document.documentElement.style.scrollSnapType = '';
        }, 400);
      }

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

      // Landing pages: fade header logotype in when intro scrolls away
      if (intro && headerLogo) {
        var introBottom = intro.getBoundingClientRect().bottom;
        var headerHeight = header ? header.offsetHeight : 0;
        if (introBottom <= headerHeight) {
          headerLogo.classList.remove('nebula-header__logo--hidden');
        } else {
          headerLogo.classList.add('nebula-header__logo--hidden');
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
      triggerElement = document.activeElement;
      isOpen = true;
      panel.classList.add('nebula-nav-panel--open');
      panel.setAttribute('aria-hidden', 'false');
      backdrop.classList.add('nebula-nav-backdrop--visible');
      burger.classList.add('nebula-burger--open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('no-scroll');
      var firstLink = panel.querySelector('.nebula-nav-panel__link');
      if (firstLink) firstLink.focus();
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
      if (triggerElement) triggerElement.focus();
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
        return;
      }
      // Focus trap: keep Tab cycling within the open panel
      if (e.key === 'Tab' && isOpen) {
        var focusable = panel.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
