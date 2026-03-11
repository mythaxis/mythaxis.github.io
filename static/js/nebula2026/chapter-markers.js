/**
 * Nebula2026 Chapter Markers
 * ===========================
 * Replaces <hr> tags with genre-specific roundel images.
 * Validates genre against whitelist; falls back to orbit on invalid
 * genre or missing image.
 */

(function() {
  'use strict';

  var DEFAULT_ROUNDEL = 'orbit';

  var VALID_GENRES = [
    'fantasy', 'scifi', 'horror', 'supernatural',
    'dark', 'cosmic', 'psion', 'orbit'
  ];

  /**
   * Initialize chapter markers on page load
   */
  function initChapterMarkers() {
    // Find the article content container
    var article = document.querySelector('.nebula-article-content');
    if (!article) {
      return;
    }

    // Get the chapter marker type from data attribute, default to orbit
    var container = article.closest('[data-chapter-marker]');
    var rawGenre = container ? container.dataset.chapterMarker : DEFAULT_ROUNDEL;
    var genre = VALID_GENRES.indexOf(rawGenre) !== -1 ? rawGenre : DEFAULT_ROUNDEL;

    // Find all <hr> tags within the article content
    var hrs = article.querySelectorAll('hr');
    if (hrs.length === 0) {
      return;
    }

    // Replace each <hr> with a roundel image
    hrs.forEach(function(hr) {
      replaceWithRoundel(hr, genre);
    });
  }

  /**
   * Replace an <hr> element with a roundel image
   */
  function replaceWithRoundel(hrElement, genre) {
    var img = document.createElement('img');
    img.src = '/images/roundels/' + genre + '-100.svg';
    img.className = 'chapter-marker';
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');

    // Fall back to orbit if the image fails to load
    img.onerror = function() {
      if (this.src.indexOf(DEFAULT_ROUNDEL) === -1) {
        this.src = '/images/roundels/' + DEFAULT_ROUNDEL + '-100.svg';
      }
    };

    hrElement.parentNode.replaceChild(img, hrElement);
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChapterMarkers);
  } else {
    initChapterMarkers();
  }
})();
