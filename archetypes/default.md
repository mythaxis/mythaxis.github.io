---
title: "{{ replace .Name "-" " " | title }}"
date: {{ dateFormat "2006-01-02" .Date }}
issue: Issue XX
slug: {{ .Name }}
type: page
draft: true

# Optional
# description: "Page description"
# image: images/filename.jpg
# imageCopyright: "Attribution"
---

Page content goes here.
