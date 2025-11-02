/**
 * Story Card Interactions
 *
 * Handles story preview cards for both mobile and desktop.
 * Mobile: Full-screen overlay with swipe navigation
 * Desktop: Hover popup cards
 */

(function() {
  'use strict';

  // Detect mobile vs desktop
  const isMobile = () => {
    return window.matchMedia('(max-width: 767px)').matches;
  };

  // State
  let currentStoryIndex = 0;
  let stories = [];
  let overlay = null;

  /**
   * Initialize card system
   */
  function init() {
    overlay = document.querySelector('.story-card-overlay');
    if (!overlay) return;

    // Get all story items
    const storyItems = document.querySelectorAll('.toc-item[data-has-card]');
    stories = Array.from(storyItems);

    if (stories.length === 0) return;

    // Attach event listeners based on platform
    if (isMobile()) {
      initMobile();
    } else {
      initDesktop();
    }
  }

  /**
   * Initialize mobile interactions
   */
  function initMobile() {
    console.log('Initializing mobile card interactions');

    // Attach click listeners to TOC items
    stories.forEach((item, index) => {
      const link = item.querySelector('.story-link');
      if (!link) return;

      link.addEventListener('click', (e) => {
        e.preventDefault();
        showCard(index);
      });
    });
  }

  /**
   * Initialize desktop interactions
   */
  function initDesktop() {
    console.log('Initializing desktop card interactions');

    // Attach hover listeners to TOC items
    stories.forEach((item, index) => {
      const link = item.querySelector('.story-link');
      if (!link) return;

      link.addEventListener('mouseenter', () => {
        showCard(index);
      });
    });

    // Close card on mouse leave overlay
    overlay.addEventListener('mouseleave', () => {
      hideCard();
    });
  }

  /**
   * Show card for given story index
   */
  function showCard(index) {
    if (index < 0 || index >= stories.length) return;

    currentStoryIndex = index;
    const story = stories[index];

    // For now, just log - we'll implement card rendering next
    console.log('Show card for:', story.dataset.storyTitle);

    // Show overlay
    overlay.removeAttribute('hidden');
  }

  /**
   * Hide card
   */
  function hideCard() {
    overlay.setAttribute('hidden', '');
  }

  // Initialize on DOM content loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-initialize on window resize (mobile ↔ desktop)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 250);
  });

})();
