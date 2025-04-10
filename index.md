---
layout: default
title: Home
---

# Research Projects Collection

Welcome to this collection of comprehensive research projects on various topics.
Each project contains in-depth analysis and information.

## Current Projects

{% assign sorted_pages = site.pages | where_exp: "page", "page.path contains 'projects/' and page.name == 'index.md'" | sort: "date" | reverse %}
{% for project in sorted_pages %}
  * [Project {{ project.dir | split: '/' | last }}]({{ site.baseurl }}{{ project.url }}) - Created: {{ project.date | date: "%B %d, %Y" }}
{% endfor %}
