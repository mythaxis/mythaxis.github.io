/**
 * Nebula2026 Chapter Markers
 * ===========================
 * Replaces <hr> tags with roundel images.
 * Validates roundel name against whitelist; falls back to
 * MythaxisTarget on invalid name or missing image.
 */

(function() {
  'use strict';

  var DEFAULT_ROUNDEL = 'MythaxisTarget';

  var VALID_ROUNDELS = [
    'MythaxisAbduction', 'MythaxisEye', 'MythaxisGalaxy', 'MythaxisGrey',
    'MythaxisHand', 'MythaxisIcon', 'MythaxisKnot', 'MythaxisMonster',
    'MythaxisSwords', 'MythaxisTarget'
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

    // Get the chapter marker type from data attribute
    var container = article.closest('[data-chapter-marker]');
    var rawGenre = container ? container.dataset.chapterMarker : DEFAULT_ROUNDEL;
    var genre = VALID_ROUNDELS.indexOf(rawGenre) !== -1 ? rawGenre : DEFAULT_ROUNDEL;

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
    img.src = '../images/roundels/' + genre + '.svg';
    img.className = 'chapter-marker roundel-animate';
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');

    // Fall back to default if the image fails to load
    img.onerror = function() {
      if (this.src.indexOf(DEFAULT_ROUNDEL) === -1) {
        this.src = '../images/roundels/' + DEFAULT_ROUNDEL + '.svg';
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
