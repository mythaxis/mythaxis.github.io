/**
 * Chapter Marker Replacement
 *
 * Replaces <hr> tags in story content with genre-specific roundel SVGs.
 * Progressive enhancement: if JS fails, hr tags remain visible.
 */

(function() {
  'use strict';

  /**
   * Replace hr tags with chapter marker roundels
   */
  function replaceChapterMarkers() {
    // Find the story article
    const article = document.querySelector('article.story-content');
    if (!article) return;

    // Get the chapter marker genre from data attribute
    const genre = article.dataset.chapterMarker || 'orbit';

    // Find all hr tags in the article
    const hrs = article.querySelectorAll('hr');

    hrs.forEach(hr => {
      // Create img element for roundel
      const roundel = document.createElement('img');
      roundel.src = `/images/roundels/${genre}-100.svg`;
      roundel.className = 'chapter-marker';
      roundel.alt = 'Chapter break';
      roundel.width = 100;
      roundel.height = 100;

      // Replace hr with roundel
      hr.replaceWith(roundel);
    });

    console.log(`Replaced ${hrs.length} chapter markers with ${genre} roundels`);
  }

  // Run on DOM content loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', replaceChapterMarkers);
  } else {
    replaceChapterMarkers();
  }

})();
