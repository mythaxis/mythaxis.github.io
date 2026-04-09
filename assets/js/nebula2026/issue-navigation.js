/**
 * Nebula2026 Issue Navigation
 * ============================
 * Handles arrow key navigation between issues.
 * Catches ArrowLeft/ArrowRight events and navigates to prev/next issue URLs.
 */

(function() {
  'use strict';

  function initIssueNavigation() {
    // Only run on issue pages
    var bodyClasses = document.body.className;
    if (!bodyClasses.match(/\bissue-\d+\b/)) return;

    // Extract current issue number from body class
    var issueMatch = bodyClasses.match(/\bissue-(\d+)\b/);
    if (!issueMatch) return;

    var currentIssue = parseInt(issueMatch[1], 10);

    // Handle arrow key navigation
    document.addEventListener('keydown', function(e) {
      // Ignore if user is typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // Ignore if modifier keys are pressed
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;

      var targetIssue = null;

      if (e.key === 'ArrowLeft') {
        // Navigate to previous issue (older)
        targetIssue = currentIssue - 1;
      } else if (e.key === 'ArrowRight') {
        // Navigate to next issue (newer)
        targetIssue = currentIssue + 1;
      }

      if (targetIssue !== null && targetIssue > 0) {
        // Construct issue URL and navigate
        var targetUrl = '/issue-' + targetIssue + '/';
        window.location.href = targetUrl;
        e.preventDefault();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIssueNavigation);
  } else {
    initIssueNavigation();
  }

})();
