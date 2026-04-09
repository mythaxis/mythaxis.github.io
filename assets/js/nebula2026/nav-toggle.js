/**
 * Nebula2026 Nav Toggle
 * =====================
 * Draggable toggle switch for nav panel. Handle can be dragged left/right
 * (y-axis locked) to close the menu. Requires momentum — simple taps do nothing.
 * Uses velocity-based inertia to determine if threshold is crossed.
 */

(function() {
  'use strict';

  function initNavToggle() {
    var track = document.querySelector('.nebula-nav-toggle__track');
    var handle = document.querySelector('.nebula-nav-toggle__handle');
    var panel = document.getElementById('nebula-nav-panel');

    if (!track || !handle || !panel) return;

    var isDragging = false;
    var startX = 0;
    var currentX = 0;
    var offsetX = 0;
    var trackWidth = 0;
    var maxOffset = 0;
    var velocityX = 0;
    var lastX = 0;
    var lastTime = 0;

    // Velocity tracking for inertia calculation
    var velocityHistory = [];
    var VELOCITY_HISTORY_SIZE = 5;

    // Thresholds
    var VELOCITY_THRESHOLD = 0.5; // pixels per ms — must drag with this speed
    var DISTANCE_THRESHOLD = 0.3; // Must drag at least 30% of track width

    function updateDimensions() {
      trackWidth = track.offsetWidth;
      maxOffset = (trackWidth - handle.offsetWidth) / 2;
    }

    function getEventX(e) {
      return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    }

    function updateVelocity(x, time) {
      velocityHistory.push({ x: x, time: time });
      if (velocityHistory.length > VELOCITY_HISTORY_SIZE) {
        velocityHistory.shift();
      }

      if (velocityHistory.length >= 2) {
        var first = velocityHistory[0];
        var last = velocityHistory[velocityHistory.length - 1];
        var deltaX = last.x - first.x;
        var deltaT = last.time - first.time;
        velocityX = deltaT > 0 ? deltaX / deltaT : 0;
      }
    }

    function handlePointerDown(e) {
      isDragging = true;
      startX = getEventX(e);
      currentX = startX;
      offsetX = 0;
      velocityX = 0;
      velocityHistory = [];
      lastX = startX;
      lastTime = Date.now();

      updateDimensions();

      track.style.cursor = 'grabbing';
      e.preventDefault();
    }

    function handlePointerMove(e) {
      if (!isDragging) return;

      var nowX = getEventX(e);
      var nowTime = Date.now();

      currentX = nowX;
      offsetX = currentX - startX;

      // Lock to y-axis: clamp horizontal movement
      offsetX = Math.max(-maxOffset, Math.min(maxOffset, offsetX));

      // Update velocity tracking
      updateVelocity(nowX, nowTime);
      lastX = nowX;
      lastTime = nowTime;

      // Apply transform
      handle.style.transform = 'translate(calc(-50% + ' + offsetX + 'px), -50%)';

      e.preventDefault();
    }

    function handlePointerUp(e) {
      if (!isDragging) return;

      isDragging = false;
      track.style.cursor = 'grab';

      // Calculate final metrics
      var distance = Math.abs(offsetX);
      var distanceRatio = distance / trackWidth;
      var absVelocity = Math.abs(velocityX);

      // Determine if threshold crossed (velocity OR distance)
      var shouldClose = absVelocity > VELOCITY_THRESHOLD || distanceRatio > DISTANCE_THRESHOLD;

      if (shouldClose) {
        // Close the nav panel
        var closeEvent = new CustomEvent('nav-toggle-close');
        document.dispatchEvent(closeEvent);
      }

      // Animate handle back to center
      handle.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
      handle.style.transform = 'translate(-50%, -50%)';

      setTimeout(function() {
        handle.style.transition = '';
      }, 300);

      e.preventDefault();
    }

    function handlePointerCancel(e) {
      if (!isDragging) return;
      handlePointerUp(e);
    }

    // Unified pointer events (mouse + touch)
    track.addEventListener('mousedown', handlePointerDown);
    track.addEventListener('touchstart', handlePointerDown, { passive: false });

    document.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('touchmove', handlePointerMove, { passive: false });

    document.addEventListener('mouseup', handlePointerUp);
    document.addEventListener('touchend', handlePointerUp);

    document.addEventListener('touchcancel', handlePointerCancel);

    // Listen for custom close event and trigger menu close
    document.addEventListener('nav-toggle-close', function() {
      // Find and trigger existing close function
      var backdrop = document.getElementById('nebula-nav-backdrop');
      if (backdrop) backdrop.click();
    });

    // Reset handle position when panel opens
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          var isOpen = panel.classList.contains('nebula-nav-panel--open');
          if (isOpen) {
            handle.style.transition = '';
            handle.style.transform = 'translate(-50%, -50%)';
            offsetX = 0;
            velocityHistory = [];
          }
        }
      });
    });

    observer.observe(panel, { attributes: true });

    // Update dimensions on resize
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavToggle);
  } else {
    initNavToggle();
  }

})();
