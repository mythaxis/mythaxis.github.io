/**
 * Nebula2026 Chapter Markers
 * ===========================
 * Replaces <hr> tags with genre-specific roundel images
 */

(function() {
  'use strict';

  /**
   * Initialize chapter markers on page load
   */
  function initChapterMarkers() {
    // Find the article content container
    const article = document.querySelector('.nebula-article-content');
    if (!article) {
      return; // Not a story page, exit gracefully
    }

    // Get the chapter marker type from data attribute, default to 'orbit'
    const container = article.closest('[data-chapter-marker]');
    const markerType = container ? container.dataset.chapterMarker : 'orbit';

    // Find all <hr> tags within the article content
    const hrs = article.querySelectorAll('hr');

    if (hrs.length === 0) {
      return; // No chapter markers to replace
    }

    // Replace each <hr> with a roundel image
    hrs.forEach(function(hr) {
      const img = document.createElement('img');
      img.src = '/images/roundels/' + markerType + '-100.svg';
      img.className = 'chapter-marker';
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      img.style.display = 'block';
      img.style.margin = '2rem auto';
      img.style.width = '100px';
      img.style.height = 'auto';

      // Replace the <hr> with the image
      hr.parentNode.replaceChild(img, hr);
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChapterMarkers);
  } else {
    initChapterMarkers();
  }
})();
