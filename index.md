---
layout: default
title: Home
---

# Research Projects Collection

Welcome to this collection of comprehensive research projects on various topics.
Each project contains in-depth analysis and information.

## Current Projects

{% for project in site.pages %}
  {% if project.path contains 'projects/' and project.name == 'index.md' %}
  * [Project {{ project.dir | split: '/' | last }}]({{ site.baseurl }}{{ project.url }})
  {% endif %}
{% endfor %}
