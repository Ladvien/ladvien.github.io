---
layout: archive
permalink: /
title: "Writings"
---
<nav role="navigation" class="menu top-menu">
		{% include navigation.html %}
</nav>
<div class="post-list-wrapper">
{% for post in site.posts %}
	{% include post-simple-list.html %}
{% endfor %}
</div><!-- /.tiles -->
