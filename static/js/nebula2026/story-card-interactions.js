/**
 * Nebula2026 Story Card Interactions
 * ===================================
 * Simplified story card preview system
 * - Click card to show overlay
 * - Click background or X to close
 * - Click "READ STORY" to navigate
 */

(function() {
  'use strict';

  let overlay = null;
  let currentStoryUrl = null;

  /**
   * Initialize story card interactions
   */
  function initStoryCards() {
    overlay = document.getElementById('story-card-overlay');

    if (!overlay) {
      return; // Overlay not present (not an issue page)
    }

    // Find all cards with story data
    const cards = document.querySelectorAll('[data-has-card="true"]');

    if (cards.length === 0) {
      return; // No story cards on page
    }

    // Attach click handlers to each card
    cards.forEach(function(card) {
      card.addEventListener('click', function(e) {
        // Don't trigger if clicking a link directly
        if (e.target.closest('a')) {
          return;
        }

        e.preventDefault();
        showStoryCard(card);
      });

      // Add visual feedback
      card.style.cursor = 'pointer';
    });

    // Close on background click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        hideStoryCard();
      }
    });

    // Close button handler
    const closeBtn = overlay.querySelector('.story-card-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', hideStoryCard);
    }

    // Read button handler
    const readBtn = overlay.querySelector('.story-card-read');
    if (readBtn) {
      readBtn.addEventListener('click', function(e) {
        if (currentStoryUrl) {
          window.location.href = currentStoryUrl;
        }
      });
    }
  }

  /**
   * Show story card overlay with data from clicked element
   */
  function showStoryCard(element) {
    if (!overlay) return;

    // Extract data from element
    const storyUrl = element.dataset.storyUrl;
    const storyTitle = element.dataset.storyTitle;
    const storyAuthors = element.dataset.storyAuthors;
    const storyAbstract = element.dataset.storyAbstract;
    const storyImage = element.dataset.storyImage;

    // Store current URL
    currentStoryUrl = storyUrl;

    // Populate overlay content
    const titleEl = overlay.querySelector('.story-card-title');
    const authorsEl = overlay.querySelector('.story-card-authors');
    const abstractEl = overlay.querySelector('.story-card-abstract');
    const imageContainer = overlay.querySelector('.story-card-image');
    const readBtn = overlay.querySelector('.story-card-read');

    if (titleEl) titleEl.textContent = storyTitle || '';
    if (authorsEl) authorsEl.textContent = storyAuthors ? 'by ' + storyAuthors : '';
    if (abstractEl) abstractEl.textContent = storyAbstract || '';

    // Handle image
    if (imageContainer) {
      if (storyImage) {
        imageContainer.innerHTML = '<img src="' + storyImage + '" alt="' + (storyTitle || 'Story') + '">';
        imageContainer.style.display = 'block';
      } else {
        imageContainer.innerHTML = '';
        imageContainer.style.display = 'none';
      }
    }

    // Update read button href
    if (readBtn && storyUrl) {
      readBtn.href = storyUrl;
    }

    // Show overlay
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  /**
   * Hide story card overlay
   */
  function hideStoryCard() {
    if (!overlay) return;

    overlay.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
    currentStoryUrl = null;
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStoryCards);
  } else {
    initStoryCards();
  }
})();
