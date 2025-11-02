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

    // Render card HTML
    const cardHTML = renderCard(index);
    const wrapper = overlay.querySelector('.story-card-wrapper');
    wrapper.innerHTML = cardHTML;

    // Attach event listeners to card controls
    attachCardListeners();

    // Show overlay
    overlay.removeAttribute('hidden');
  }

  /**
   * Hide card
   */
  function hideCard() {
    overlay.setAttribute('hidden', '');
  }

  /**
   * Render card HTML for given story
   */
  function renderCard(index) {
    if (index < 0 || index >= stories.length) return '';

    const story = stories[index];
    const data = story.dataset;

    return `
      <div class="story-card" data-story-id="${data.storyId}" data-genre="${data.storyGenre || ''}">
        <button class="card-close" aria-label="Close card">×</button>

        <div class="card-content">
          <p class="card-issue">${data.storyIssue || ''}</p>
          <h3 class="card-title">
            <a href="${data.storyUrl}" class="card-link">${data.storyTitle}</a>
          </h3>
          <p class="card-author">by ${data.storyAuthors}</p>
          ${data.storyGenre ? `<p class="card-genre">${data.storyGenre}</p>` : ''}
          ${data.storyAbstract ? `<p class="card-abstract">${data.storyAbstract}</p>` : ''}
        </div>

        <div class="card-nav">
          <button class="card-nav-prev" aria-label="Previous story">‹</button>
          <button class="card-nav-next" aria-label="Next story">›</button>
        </div>

        <div class="card-actions">
          <a href="${data.storyUrl}" class="card-read-button">READ</a>
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners to card controls
   */
  function attachCardListeners() {
    const card = overlay.querySelector('.story-card');
    if (!card) return;

    // Close button
    const closeBtn = card.querySelector('.card-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', hideCard);
    }

    // Navigation buttons
    const prevBtn = card.querySelector('.card-nav-prev');
    const nextBtn = card.querySelector('.card-nav-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => navigateCard('prev'));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => navigateCard('next'));
    }
  }

  /**
   * Navigate to previous or next card
   */
  function navigateCard(direction) {
    const newIndex = direction === 'prev'
      ? currentStoryIndex - 1
      : currentStoryIndex + 1;

    // Wrap around
    if (newIndex < 0) {
      showCard(stories.length - 1);
    } else if (newIndex >= stories.length) {
      showCard(0);
    } else {
      showCard(newIndex);
    }
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
