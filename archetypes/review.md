---
title: "Review Title, by Author Name"
date: {{ dateFormat "2006-01-02" .Date }}
issue: Issue XX
slug: {{ .Name }}
weight: 7
type: review
draft: true

# Authors
authors:
- Firstname Lastname
showAuthorFooter: true
copyright: "© Firstname Lastname 20XX All Rights Reserved"

# Content
description: "Short blurb for list pages"
genres:
- review

# Images (use /images/shared/ for reusable images, or issue-local path)
image: /images/shared/ShortReviews01_10x6.jpg
imageCopyright: "Image attribution"

# Nebula2026 theme options (optional)
# cardLayout: review-left   # [review]-[left|right|center], or omit for auto-alternate
# colorScheme:
#   primary: "#hex"
#   secondary: "#hex"
---

Review content goes here.
