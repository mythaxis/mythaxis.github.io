## Mythaxis Retime requirements

#### notes for Claude



Use @martysteer/ai-dev-tasks/snarktank/create-prd.mdc Here's the feature I want to build: 

A set of new hugo templates for the mythoaxis hugo website. New frontpage template, new issue homepage template (customisable per issue's frontmatter, so old issues can be set to the existing page templates), new story item page template.

Each issue's story page has a chapter marker/seperator. Those are currently implemented using an image in markdown (e.g. ![Orbit-sml ><](images/Orbit.svg)) but I'd like the chapter marker to be configurable using the story frontmatter. I have a list of roundals that map to the story category. e.g. [fantasy|horror|scifi|slipstream|etc...]

At the end of each story template, we use a large roundal image to end the story (before the author metadata/footer). It is also in the markdown as `![Orbit-lrg](images/Orbit.svg)`. This large roundal should also be configurable in the metdata, but not at the story level, at the issue __index.md content file.

For the main site frontpage, it currenlty is a two column list of thumbnails, title, abstract... but i would like this to look more like a table of contents bullet list, and when you hover over the story title a popup card appears, which summarises the story (thumnbnail, title, authro, abstract). etc.

The theme architecture we currently use is the 'massively' theme, with customised 'layouts' to override templates. I'd like to preserve the current templates/layouts for each of the existing issues. So, we need a issue-NUM/__index.md frontmatter way to say which group of layouts/partials to use for each hugo issue/subdirectory. The existing theme should be called 'mythaxis-massively-2020'. The new theme should be called 'mythaxis-massively-2026'.



1. I have a complete list of story categories, but just use a static list for the moment. (we can swap that list out by a data query later. The roundal images are all SVG files, so we can resize them. Use 100x100px for the small size chapter markers.
2. Yes, it should be a sinlge roundal per issue (and default to the site's main roundal - which we will set in the site config.yaml). The roundals are SVG files and will be stored in the same location as the other chapter marker roundals at siteroot/content/images/roundals/XXXX.svg. The size of large roundals at the end of story pages is 200x200px.
3. Great question! Just make the frontpage list show the latest issue stories. The bullet list should be subheaded with the "Issue XX Summer 2025", then each item "[STORY TITLE] by [STORY AUTHOR]". No other metadata to include for the popup card, but make sure the card uses a partial template (so it can be configured/themed/tweaked). The visual style should be to fade in and out quite fast, but pleasingly.
4. Another great question! They should be completely different layout/[DIRECTORIES]. Yes, continue to use the currentl setup to override the massively theme. Yes, the frontmatter property name should be theme. (unless using the default hugo 'layout' frontmatter template will suffice?)
5. The frontmatter for story templates should be chapterMarker:.
6. Backwards compatibility should be explicit in the __index.md file. Yes.
7. I didn't mention using a feature branch! where did you get this idea from? (It's a good idea... please call the feature branch 'mythaxis-massively-2026'.