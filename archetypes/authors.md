---
date: {{ dateFormat "2006-01-02" .Date }}
authors:
- {{ replace .Name "-" " " | title }}
name: {{ replace .Name "-" " " | title }}
author: {{ replace .Name "-" " " | title }}
photo: 'images/{{ replace (replace .Name "-" " " | title ) " " "" }}.png'
avatar: 'images/{{ replace (replace .Name "-" " " | title ) " " "" }}.png'
copyright: "© {{ replace .Name "-" " " | title }} 2020 All Rights Reserved"
description: "***{{ replace .Name "-" " " | title }}*** *blah blah.*"
---