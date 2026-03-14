/**
 * Nebula2026 Story Card Interactions
 * ===================================
 * Mobile: tap to open overlay, swipe left/right to navigate, tap background or X to close
 * Desktop: hover for popup, click to fix popup in place, ESC to close
 * Keyboard: ESC closes, Arrow Left/Right navigate when overlay is open
 */

(function() {
  'use strict';

  var CONFIG = {
    MOBILE_BREAKPOINT: 736,
    DESKTOP_BREAKPOINT: 737,
    MIN_SWIPE_DISTANCE: 50,
    MAX_SWIPE_TIME: 300,
    SLIDE_DURATION: 100
  };

  var currentDevice = 'desktop';
  var storyCards = [];
  var currentStoryIndex = -1;
  var overlay = null;
  var popup = null;
  var isOverlayActive = false;

  // Swipe tracking
  var touchStartX = 0;
  var touchStartY = 0;
  var touchStartTime = 0;

  /**
   * Initialize story card interactions
   */
  function init() {
    overlay = document.getElementById('story-card-overlay');
    if (!overlay) return;

    var cardElements = document.querySelectorAll('[data-has-card="true"]');
    if (cardElements.length === 0) return;

    storyCards = Array.from(cardElements);
    updateDeviceType();
    addNavigationButtons();
    createPopupElement();
    bindEvents();
  }

  /**
   * Detect current device type based on screen width
   */
  function updateDeviceType() {
    currentDevice = window.innerWidth < CONFIG.DESKTOP_BREAKPOINT ? 'mobile' : 'desktop';
  }

  /**
   * Add prev/next navigation buttons to the existing overlay
   */
  function addNavigationButtons() {
    var storyCard = overlay.querySelector('.story-card');
    if (!storyCard) return;

    var prevBtn = document.createElement('button');
    prevBtn.className = 'story-overlay__prev';
    prevBtn.setAttribute('aria-label', 'Previous story');
    prevBtn.textContent = '\u2039';

    var nextBtn = document.createElement('button');
    nextBtn.className = 'story-overlay__next';
    nextBtn.setAttribute('aria-label', 'Next story');
    nextBtn.textContent = '\u203A';

    storyCard.appendChild(prevBtn);
    storyCard.appendChild(nextBtn);
  }

  /**
   * Create desktop hover popup element
   */
  function createPopupElement() {
    popup = document.createElement('div');
    popup.className = 'story-popup';
    popup.innerHTML =
      '<div class="story-popup__content">' +
        '<button class="story-popup__close" aria-label="Close">&times;</button>' +
        '<h3 class="story-card-title"></h3>' +
        '<p class="story-card-authors"></p>' +
        '<p class="story-card-description"></p>' +
        '<div class="story-card-actions">' +
          '<a href="#" class="story-card-read">READ STORY</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(popup);
  }

  /**
   * Bind all event listeners
   */
  function bindEvents() {
    // Resize handler
    window.addEventListener('resize', debounce(handleResize, 250));

    // Card events
    storyCards.forEach(function(card, index) {
      card.style.cursor = 'pointer';

      card.addEventListener('click', function(e) {
        if (e.target.closest('a')) return;
        e.preventDefault();

        if (currentDevice === 'mobile') {
          openOverlay(index);
        } else {
          if (popup.classList.contains('story-popup--active')) {
            popup.classList.add('story-popup--fixed');
          } else {
            showPopup(index, e.clientX, e.clientY);
            popup.classList.add('story-popup--fixed');
          }
        }
      });

      card.addEventListener('mouseenter', function(e) {
        if (currentDevice !== 'desktop') return;
        showPopup(index, e.clientX, e.clientY);
      });

      card.addEventListener('mouseleave', function() {
        if (currentDevice !== 'desktop') return;
        if (!popup.classList.contains('story-popup--fixed')) {
          hidePopup();
        }
      });
    });

    // Overlay: close on background click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeOverlay();
    });

    // Overlay: close button
    var closeBtn = overlay.querySelector('.story-card-close');
    if (closeBtn) closeBtn.addEventListener('click', closeOverlay);

    // Overlay: read button
    var readBtn = overlay.querySelector('.story-card-read');
    if (readBtn) {
      readBtn.addEventListener('click', function(e) {
        var url = readBtn.getAttribute('href');
        if (url && url !== '#') {
          window.location.href = url;
        }
        e.preventDefault();
      });
    }

    // Overlay: nav buttons
    var prevBtn = overlay.querySelector('.story-overlay__prev');
    var nextBtn = overlay.querySelector('.story-overlay__next');
    if (prevBtn) prevBtn.addEventListener('click', showPreviousStory);
    if (nextBtn) nextBtn.addEventListener('click', showNextStory);

    // Popup: close button
    if (popup) {
      popup.querySelector('.story-popup__close').addEventListener('click', hidePopup);
      popup.addEventListener('click', function(e) {
        if (e.target === popup) hidePopup();
      });
    }

    // Keyboard
    document.addEventListener('keydown', handleKeyDown);

    // Swipe detection on overlay
    overlay.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    });

    overlay.addEventListener('touchend', function(e) {
      var endX = e.changedTouches[0].clientX;
      var endY = e.changedTouches[0].clientY;
      var duration = Date.now() - touchStartTime;
      handleSwipe(touchStartX, touchStartY, endX, endY, duration);
    });
  }

  // ---- Mobile overlay ----

  /**
   * Open the mobile overlay for a story
   */
  function openOverlay(index) {
    if (isOverlayActive) return;

    currentStoryIndex = index;
    loadStoryContent(storyCards[index], overlay);

    overlay.classList.remove('hidden');
    document.body.classList.add('no-scroll');
    isOverlayActive = true;

    updateNavigationButtons();
  }

  /**
   * Close the mobile overlay
   */
  function closeOverlay() {
    if (!isOverlayActive) return;

    overlay.classList.add('hidden');
    document.body.classList.remove('no-scroll');
    isOverlayActive = false;
    currentStoryIndex = -1;
  }

  // ---- Desktop popup ----

  /**
   * Show the desktop hover popup
   */
  function showPopup(index, x, y) {
    loadStoryContent(storyCards[index], popup);
    positionPopup(x, y);
    popup.classList.add('story-popup--active');
    currentStoryIndex = index;
  }

  /**
   * Hide the desktop popup
   */
  function hidePopup() {
    popup.classList.remove('story-popup--active', 'story-popup--fixed');
    currentStoryIndex = -1;
  }

  /**
   * Position the desktop popup near the cursor with viewport boundary checks
   */
  function positionPopup(x, y) {
    var popupWidth = 400;
    var popupHeight = 300;
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;
    var offset = 20;

    var left = x + offset;
    var top = y + offset;

    if (left + popupWidth > viewportWidth) {
      left = x - popupWidth - offset;
    }
    if (top + popupHeight > viewportHeight) {
      top = y - popupHeight - offset;
    }

    left = Math.max(10, Math.min(left, viewportWidth - popupWidth - 10));
    top = Math.max(10, Math.min(top, viewportHeight - popupHeight - 10));

    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
  }

  // ---- Shared ----

  /**
   * Load story data from card's data-* attributes into a target container
   */
  function loadStoryContent(card, container) {
    var title = card.getAttribute('data-story-title') || '';
    var authors = card.getAttribute('data-story-authors') || '';
    var description = card.getAttribute('data-story-description') || '';
    var image = card.getAttribute('data-story-image') || '';
    var url = card.getAttribute('data-story-url') || '#';

    var titleEl = container.querySelector('.story-card-title');
    var authorsEl = container.querySelector('.story-card-authors');
    var descriptionEl = container.querySelector('.story-card-description');
    var imageContainer = container.querySelector('.story-card-image');
    var readBtn = container.querySelector('.story-card-read');

    if (titleEl) titleEl.textContent = title;
    if (authorsEl) authorsEl.textContent = authors ? 'by ' + authors : '';
    if (descriptionEl) descriptionEl.textContent = description;

    if (imageContainer) {
      if (image) {
        imageContainer.innerHTML = '<img src="' + image + '" alt="' + title + '">';
        imageContainer.style.display = 'block';
      } else {
        imageContainer.innerHTML = '';
        imageContainer.style.display = 'none';
      }
    }

    if (readBtn) readBtn.setAttribute('href', url);
  }

  // ---- Navigation ----

  /**
   * Update prev/next button enabled state
   */
  function updateNavigationButtons() {
    var prevBtn = overlay.querySelector('.story-overlay__prev');
    var nextBtn = overlay.querySelector('.story-overlay__next');
    if (!prevBtn || !nextBtn) return;

    prevBtn.disabled = currentStoryIndex <= 0;
    nextBtn.disabled = currentStoryIndex >= storyCards.length - 1;
  }

  function showPreviousStory() {
    if (currentStoryIndex > 0) {
      fadeToStory(currentStoryIndex - 1);
    }
  }

  function showNextStory() {
    if (currentStoryIndex < storyCards.length - 1) {
      fadeToStory(currentStoryIndex + 1);
    }
  }

  /**
   * Slide transition to a different story using CSS animation classes
   */
  function fadeToStory(newIndex) {
    var content = overlay.querySelector('.story-card');
    if (!content) return;

    var direction = newIndex > currentStoryIndex ? 'left' : 'right';

    // Slide out
    content.classList.add('story-card--slide-out-' + direction);

    setTimeout(function() {
      // Update content
      currentStoryIndex = newIndex;
      loadStoryContent(storyCards[newIndex], overlay);
      updateNavigationButtons();

      // Slide in from opposite direction
      content.classList.remove('story-card--slide-out-' + direction);
      var slideIn = direction === 'left' ? 'right' : 'left';
      content.classList.add('story-card--slide-in-' + slideIn);

      setTimeout(function() {
        content.classList.remove('story-card--slide-in-' + slideIn);
      }, CONFIG.SLIDE_DURATION);
    }, CONFIG.SLIDE_DURATION);
  }

  // ---- Input handlers ----

  /**
   * Handle keyboard navigation
   */
  function handleKeyDown(event) {
    var popupActive = popup && popup.classList.contains('story-popup--active');

    if (!isOverlayActive && !popupActive) return;

    switch (event.key) {
      case 'Escape':
        if (isOverlayActive) closeOverlay();
        if (popupActive) hidePopup();
        event.preventDefault();
        break;
      case 'ArrowLeft':
        if (isOverlayActive) {
          showPreviousStory();
          event.preventDefault();
        }
        break;
      case 'ArrowRight':
        if (isOverlayActive) {
          showNextStory();
          event.preventDefault();
        }
        break;
    }
  }

  /**
   * Handle swipe gestures on the overlay
   */
  function handleSwipe(startX, startY, endX, endY, duration) {
    if (!isOverlayActive || duration > CONFIG.MAX_SWIPE_TIME) return;

    var deltaX = endX - startX;
    var deltaY = endY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > CONFIG.MIN_SWIPE_DISTANCE) {
      if (deltaX > 0) {
        showPreviousStory();
      } else {
        showNextStory();
      }
    }
  }

  /**
   * Handle resize — close interactions on breakpoint change
   */
  function handleResize() {
    var oldDevice = currentDevice;
    updateDeviceType();

    if (oldDevice !== currentDevice) {
      closeOverlay();
      hidePopup();
    }
  }

  /**
   * Debounce utility
   */
  function debounce(func, wait) {
    var timeout;
    return function() {
      var args = arguments;
      var context = this;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
