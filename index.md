---
layout: archive
permalink: /
title: "Latest Posts"
---

<div class="post-list-wrapper">
{% for post in site.posts %}
	{% include post-simple-list.html %}
{% endfor %}
</div><!-- /.tiles -->
