/**
 * Nebula2026 Roundel Scroll-Into-View Animations
 *
 * Uses Intersection Observer API to detect when roundels scroll into view
 * and triggers fade-in + scale animation (400ms ease-out from _animations.scss)
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRoundelAnimations);
  } else {
    initRoundelAnimations();
  }

  function initRoundelAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // User prefers reduced motion: show all roundels immediately without animation
      const roundels = document.querySelectorAll('.roundel-animate');
      roundels.forEach(function(roundel) {
        roundel.classList.add('roundel-animate--visible');
      });
      return;
    }

    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all roundels immediately without animation
      const roundels = document.querySelectorAll('.roundel-animate');
      roundels.forEach(function(roundel) {
        roundel.classList.add('roundel-animate--visible');
      });
      return;
    }

    // Configure Intersection Observer
    const observerOptions = {
      root: null, // Use viewport as root
      rootMargin: '0px 0px -100px 0px', // Trigger when element is 100px from bottom of viewport
      threshold: 0.1 // Trigger when 10% of element is visible
    };

    // Create observer callback
    const observerCallback = function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          // Element is in view, add visible class to trigger animation
          entry.target.classList.add('roundel-animate--visible');

          // Optional: Stop observing once animation is triggered (one-time animation)
          // Comment out the line below if you want animation to repeat on scroll
          observer.unobserve(entry.target);
        }
      });
    };

    // Create the observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Find all roundels that should animate on scroll
    const roundels = document.querySelectorAll('.roundel-animate');

    // Observe each roundel
    roundels.forEach(function(roundel) {
      observer.observe(roundel);
    });

  }

})();
