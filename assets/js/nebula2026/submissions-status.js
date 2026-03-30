/**
 * Nebula2026 Submissions Status
 * ==============================
 * Reads submission window dates from the page content and
 * toggles the open/closed status message automatically.
 * Styles date ranges: bold if current (open), strikethrough if past.
 * Appends a "See how to submit" link when open.
 */

(function() {
  'use strict';

  var ulElement = document.querySelector('.post ul');
  if (!ulElement) return;

  var currentDate = new Date();
  var currentMonth = currentDate.getMonth();
  var currentDay = currentDate.getDate();
  var submissionStatus = 'CLOSED';
  var dateRegex = /(\w+)\s(\d{1,2})..-(\d{1,2})/;

  ulElement.querySelectorAll('li').forEach(function(li) {
    var matches = li.textContent.match(dateRegex);
    if (!matches) return;

    var windowMonth = monthToIndex(matches[1]);
    var startDay = parseInt(matches[2]);
    var endDay = parseInt(matches[3]);

    if (windowMonth === currentMonth &&
        currentDay >= startDay && currentDay <= endDay) {
      // Current window — bold, mark open, add submit link
      submissionStatus = 'OPEN';
      li.style.fontWeight = 'bold';
      li.innerHTML += ' \u2013 <a href="#how-to-submit">See how to submit</a>';
    } else if (windowMonth < currentMonth ||
               (windowMonth === currentMonth && currentDay > endDay)) {
      // Past window — strikethrough
      li.style.textDecoration = 'line-through';
      li.style.opacity = '0.6';
    }
    // Future windows left unchanged
  });

  var firstParagraph = document.querySelector('.post p strong');
  if (!firstParagraph) return;

  var newText = firstParagraph.textContent.replace(/closed/gi, submissionStatus);
  firstParagraph.textContent = newText;


  function monthToIndex(monthName) {
    return ['January', 'February', 'March',
            'April', 'May', 'June', 'July',
            'August', 'September', 'October',
            'November', 'December'].indexOf(monthName);
  }

})();
