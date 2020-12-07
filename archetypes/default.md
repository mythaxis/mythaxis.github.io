---
title: "{{ replace .Name "-" " " | title }}"
date: {{ dateFormat "2006-01-02" .Date }}
image: 'images/picXXX.jpg'
issue: Issue XX

type: page
slug: {{ .Name }}

draft: true
---

This is the default type of 'page'.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at ex lacus. Vestibulum interdum dapibus sapien, ac sagittis ex lacinia non. In quis tortor sed ipsum viverra pharetra a id nisl.