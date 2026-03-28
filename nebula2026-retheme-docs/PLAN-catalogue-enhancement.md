# Catalogue Pages Enhancement Plan

## Context

The catalogue/taxonomy pages (Catalogue, Reviews, Editorials, Authors, Genres) have functional layouts but lack visual consistency with the story pages. Story pages have a feathered issue image at the bottom (`story-end`), issue roundels, and polished typography. The catalogue pages currently have a hero image at top with a feathered bottom edge, but nothing at the page bottom, no roundels, and the subtitle uses `.nebula-catalogue-count` instead of the established `.nebula-page-description` style.

Additionally, the long listing pages (Catalogue stories, Authors) need A-Z navigation for usability, and the Reviews listing needs clearer attribution.

## Tasks

### Task 1: Hero image — clean bottom edge on catalogue pages

Remove the feathered gradient overlay from the hero image on catalogue/taxonomy pages. Add a modifier class `.nebula-page-hero--clean` to the hero wrapper in all 5 catalogue/taxonomy layout files and add CSS that hides the overlay when this modifier is present.

### Task 2: Add feathered issue image to bottom of catalogue pages

Add a `story-end` style footer section to each catalogue content partial, reusing the same pattern from `page-single.html` (lines 82-103): parallax issue image, gradient fade, copyright. Remove existing `{{ partial "copyright" . }}` from each layout file since copyright is now inside the story-end block.

### Task 3: Add issue roundel below header on catalogue pages

Add the issue roundel (60px `.nebula-article-divider`) below the subtitle on each catalogue content partial, matching the pattern in `page-single.html` lines 42-51.

### Task 4: Restyle catalogue subtitle as `.nebula-page-description`

Change `.nebula-catalogue-count` to `.nebula-page-description` in all 5 content partials. Remove the now-unused `.nebula-catalogue-count` rule from `nebula2026.css`.

### Task 5: Add "reviewed by" to Reviews catalogue

In `reviews-content.html`, change author display to "reviewed by [author]".

### Task 6: A-Z navigation pills on Catalogue (stories) and Authors pages

Add alphabetical range pill navigation to the catalogue stories page and authors index. Group entries into ranges of 4 letters (A-D, E-H, I-L, M-P, Q-T, U-Z). Style pills like the existing `.nebula-genre-link` on the genres page. Restructure listings into alphabetical groups with `id` anchors.

### Task 7: "Back to top" icon in group headers

Add a small "back to top" arrow in each alphabetical group heading (and each genre section heading on the genres page). Style small and subtle.

## Verification

1. `hugo build` — clean build, no template errors
2. Visual check: clean hero edge, roundel below subtitle, A-Z pills, grouped listings, back-to-top arrows, feathered issue image at bottom
3. Mobile responsive check at 736px breakpoint
4. Verify existing catalogue-nav dot navigation still works
