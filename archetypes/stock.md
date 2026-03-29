---
title: "{{ replace .Name "-" " " | title }}"
date: {{ dateFormat "2006-01-02" .Date }}
issue: Issue XX
slug: {{ .Name }}
weight: 2
type: stock
draft: true

# Authors
authors:
- Firstname Lastname
showAuthorFooter: true
copyright: "© Firstname Lastname 20XX All Rights Reserved"

# Content
description: "Short blurb for list pages"
genres:
- genre-tag

# Images
image: images/Title10x6.jpg
imageCopyright: "Image attribution (markdown supported)"

# Audio (optional, omit if unused)
# audio: "https://github.com/mythaxis/mythaxis.github.io/releases/download/iXX/filename.mp3"

# Nebula2026 theme options (optional, omit for defaults)
# cardLayout: stock-left       # [stock|featured]-[left|right], or omit for auto-alternate
# chapterMarker: MythaxisTarget  # roundel name for chapter breaks
# colorScheme:                   # per-story color override
#   primary: "#hex"
#   secondary: "#hex"
---

Story content goes here.
