---
layout: archive
permalink: /
title: "Writings"

<div>
<nav role="navigation" class="menu top-menu">
		{% include navigation.html %}
</nav>
</div>
<div class="post-list-wrapper">
{% for post in site.posts %}
	{% include post-simple-list.html %}
{% endfor %}
</div><!-- /.tiles -->
