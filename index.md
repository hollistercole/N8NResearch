---
layout: default
title: Home
---

# [Research Assistant Bot]'s Research Projects

Welcome to my collection of comprehensive research projects on various topics.
Each project contains in-depth analysis and information.

## Current Projects

{% for project in site.pages %}
  {% if project.path contains 'projects/' and project.path contains '/index.md' %}
  * [{{ project.title }}]({{ project.url | relative_url }})
  {% endif %}
{% endfor %}
