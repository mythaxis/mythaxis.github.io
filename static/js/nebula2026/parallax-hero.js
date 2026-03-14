/**
 * Nebula2026 Parallax Hero Effect
 *
 * Adds parallax scrolling effect to hero images on issue landing and story pages.
 * Hero images move at 50% scroll speed, creating depth and visual interest.
 */

(function() {
  'use strict';

  function initParallax() {
    // Find hero images (issue landing or story pages)
    const heroImages = document.querySelectorAll('.landing-header__image, .story-header__image');
    if (heroImages.length === 0) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    function updateParallax() {
      const scrolled = window.pageYOffset;

      heroImages.forEach(hero => {
        const rect = hero.getBoundingClientRect();
        const elementTop = rect.top + scrolled;

        // Only apply parallax when element is in view
        if (scrolled + window.innerHeight > elementTop && scrolled < elementTop + rect.height) {
          // Move at 50% speed (creates parallax effect)
          const rate = scrolled * 0.5;
          hero.style.transform = `translateY(${rate}px) scale(1.1)`;
        }
      });

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    // Initial update
    updateParallax();

    // Debug info (only in development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Parallax hero initialized:', heroImages.length, 'hero images found');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParallax);
  } else {
    initParallax();
  }

})();
