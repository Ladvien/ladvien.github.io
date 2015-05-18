---
layout: article
title: Arduino to RPi -- Galvanically Isolated I2C
categories: robots
excerpt:
tags: [robots]
image:
  feature: IMG_0602.JPG
  teaser: IMG_0602.JPG
  thumb:
comments: true
---

Originally posted on [www.letsmakerobots.com](www.letsmakerobots.com)

<a class="btn" href="/files/ADUM1250ARZ_v.01.zip" target="">Breakout PCB</a>
<a class="btn" href="/files/Arduino_to_Pi_I2C_v2.zip" target="">Arduino Code</a>

<div class="flex-video">
  <iframe width="420" height="315" src="https://www.youtube.com/embed/P77ZGNKlc9M" frameborder="0" allowfullscreen></iframe>
</div>

I've waited to finish incorporating my Raspberry Pi into my bot for an ample bit.  But since I know so little about electricity, I swore to myself I wouldn't add my Pi to my [bot ](http://letsmakerobots.com/node/35922)until I was absolutely sure I wouldn't fry it.  

Well, I'm still not "absolutely" sure, but I feel this little optoisolator has brought me a lot closer.  This builds on [my post](http://letsmakerobots.com/node/36672) a week or so ago about making Eagle parts.

I plan to actually list out what tweaks a Wheezy image needs to get this optoisolator build to work.  It's actually pretty easy--but whatever you, don't be lured in by quick2wire.  Those buggers wasted most of my day :(

If anyone has questions let me know.

**Oh, one note.  When I populated the board I used 4.7k resistors on the Arduino side, but I pulled off everything on the Raspberry Pi side.  It seems the Pi has built in pull-ups that do the job rather well.**

[ADUM1250ARZ Datasheet](http://www.analog.com/static/imported-files/data_sheets/ADUM1250_1251.pdf)

Hope everyone is well :)
