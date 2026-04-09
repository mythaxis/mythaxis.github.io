/**
 * Nebula2026 Navigation
 * =====================
 * Handles:
 * - Menu triggers: header logotype and story-header logotype both open the nav panel
 * - All pages: header is sticky (translucent, content scrolls behind)
 * - Landing pages: logotype fades in on scroll (hidden initially behind intro)
 * - Story pages: minimal header descends when hero image scrolls out of view
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
    var storyHeader = document.getElementById('story-header');
    var headerLogo = document.getElementById('nebula-menu-trigger');

    if (!panel || !backdrop) return;

    // All menu triggers (header logotype + story-header logotype)
    var triggers = document.querySelectorAll('#nebula-menu-trigger, .nebula-menu-trigger');

    var isOpen = false;
    var ticking = false;
    var snapTimer = null;
    var triggerElement = null;
    var isMobile = window.matchMedia('(max-width: 736px)').matches;
    var prevScrollY = window.scrollY;

    // All pages: make header sticky (translucent, content scrolls behind)
    if (header) {
      header.classList.add('nebula-header--sticky');
    }

    // Landing pages: hide logotype initially (big intro version visible)
    if (intro && headerLogo) {
      headerLogo.classList.add('nebula-header__logo--hidden');
    }

    // --- Scroll detection ---

    function handleScroll() {
      if (isOpen) return;

      // iOS fix: disable mandatory snap on scroll-to-top gesture
      // Detect by large upward jump (programmatic) or landing near top
      var scrollDelta = prevScrollY - window.scrollY;
      prevScrollY = window.scrollY;

      if (intro && isMobile && (scrollDelta > window.innerHeight || window.scrollY < 5)) {
        document.documentElement.style.scrollSnapType = 'none';
        clearTimeout(snapTimer);
        snapTimer = setTimeout(function() {
          if (window.scrollY < 50 && intro) {
            intro.scrollIntoView({ behavior: 'auto', block: 'start' });
          }
          document.documentElement.style.scrollSnapType = '';
        }, 1200);
      }

      // Story pages: show minimal header when the hero image scrolls out of view
      // Hide main header so it doesn't peek below the shorter minimal header
      if (minimalHeader && storyHeader) {
        var heroBottom = storyHeader.getBoundingClientRect().bottom;
        var headerHeight = header ? header.offsetHeight : 0;
        if (heroBottom <= headerHeight) {
          minimalHeader.classList.add('visible');
          if (header) header.style.visibility = 'hidden';
        } else {
          minimalHeader.classList.remove('visible');
          if (header) header.style.visibility = '';
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

    // Panel logotype closes the menu on click
    var panelLogotype = panel.querySelector('.nebula-nav-panel__logotype');
    if (panelLogotype) panelLogotype.addEventListener('click', closePanel);

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
