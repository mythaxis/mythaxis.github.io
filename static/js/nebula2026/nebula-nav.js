/**
 * Nebula2026 Navigation
 * =====================
 * Handles:
 * - Menu triggers: header logotype and story-header logotype both open the nav panel
 * - Non-story pages: header becomes sticky (always accessible menu trigger)
 * - Landing pages: logotype fades in on scroll (hidden initially behind intro)
 * - Story pages: shows the sticky minimal header on scroll
 * - Backdrop click and ESC key to close
 * - Body scroll lock when panel is open
 */

(function() {
  'use strict';

  function init() {
    var panel = document.getElementById('nebula-nav-panel');
    var backdrop = document.getElementById('nebula-nav-backdrop');
    var header = document.getElementById('header');
    var intro = document.getElementById('intro');
    var minimalHeader = document.getElementById('story-header-minimal');
    var headerLogo = document.getElementById('nebula-menu-trigger');

    if (!panel || !backdrop) return;

    // All menu triggers (header logotype + story-header logotype)
    var triggers = document.querySelectorAll('#nebula-menu-trigger, .nebula-menu-trigger');

    var isOpen = false;
    var ticking = false;
    var snapTimer = null;
    var triggerElement = null;
    var isMobile = window.matchMedia('(max-width: 736px)').matches;

    // Make header sticky on all pages except story pages (which use the minimal header)
    if (!minimalHeader && header) {
      header.classList.add('nebula-header--sticky');
    }

    // Landing pages: hide logotype initially (big intro version visible)
    if (intro && headerLogo) {
      headerLogo.classList.add('nebula-header__logo--hidden');
    }

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

        // Story pages: toggle minimal header when main header scrolls out
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
      document.body.classList.add('no-scroll');
      var firstLink = panel.querySelector('.nebula-nav-panel__link');
      if (firstLink) firstLink.focus();
    }

    function closePanel() {
      isOpen = false;
      panel.classList.remove('nebula-nav-panel--open');
      panel.setAttribute('aria-hidden', 'true');
      backdrop.classList.remove('nebula-nav-backdrop--visible');
      document.body.classList.remove('no-scroll');
      if (triggerElement) triggerElement.focus({ preventScroll: true });
    }

    function togglePanel() {
      if (isOpen) closePanel();
      else openPanel();
    }

    // --- Event listeners ---

    triggers.forEach(function(trigger) {
      trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        togglePanel();
      });
    });

    backdrop.addEventListener('click', closePanel);

    // Panel logotype and bottom roundel close the menu on click
    var panelLogotype = panel.querySelector('.nebula-nav-panel__logotype');
    var panelRoundel = panel.querySelector('.nebula-nav-panel__roundel');
    if (panelLogotype) panelLogotype.addEventListener('click', closePanel);
    if (panelRoundel) panelRoundel.addEventListener('click', closePanel);

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
