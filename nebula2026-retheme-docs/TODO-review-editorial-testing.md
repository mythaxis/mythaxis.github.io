# Review & Editorial — Outstanding Testing

## Status
Committed as `d05caabe` (2026-03-26). Archive/catalogue pages confirmed good.
User flagged "issues to test" but didn't specify — visual regression testing still needed.

## To Resume
1. Run `hugo server -D --disableFastRender`
2. Check these areas visually:
   - **Review pages** (issues 43-45): sticky header, reading progress bar, nav strip present
   - **Editorial pages** (issues 43-45): simpler page-single layout, no nav strip
   - **Frontpage**: stock+reviews auto-alternate; editorials hidden unless they have explicit `cardLayout`
   - **Nav strip**: paginates stock+review only, skips editorials
   - **Shared images**: `/images/shared/` paths resolve correctly on review pages
   - **Catalogue pages**: `/reviews.html`, `/editorials.html`, `/authors/` include new types
   - **Center card variant**: if any content uses `cardLayout: editorial-center` or similar

## Optional Cleanup
- Remove duplicate images from issue folders once shared images confirmed working
  (e.g. `content/issue-43/ShortReviews01_10x6.jpg` duplicated in `/static/images/shared/`)

## Key Files
- Plan: `nebula2026-retheme-docs/PLAN-review-editorial-types.md`
- Layouts: `layouts/review/single.html`, `layouts/editorial/single.html`
- Frontpage queries: `layouts/_default/section.html`, `layouts/index.html`
- Nav strip: `layouts/partials/themes/nebula2026/article-single.html`
- CSS: `static/themes/nebula2026.css` (search for "center" and "editorial")
