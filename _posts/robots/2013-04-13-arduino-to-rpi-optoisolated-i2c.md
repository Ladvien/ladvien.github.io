---
layout: article
title: Populating and Programming and APM
categories: robots
excerpt:
tags: [robots]
image:
  feature: IMG_0602.JPG
  teaser: IMG_0602.JPG
  thumb:
comments: true
---

I've waited to finish incorporating my Raspberry Pi into my bot for an ample bit.  But since I know so little about electricity, I swore to myself I wouldn't add my Pi to my [bot ](http://letsmakerobots.com/node/35922)until I was absolutely sure I wouldn't fry it.  

Well, I'm still not "absolutely" sure, but I feel this little optoisolator has brought me a lot closer.  This builds on [my post](http://letsmakerobots.com/node/36672) a week or so ago about making Eagle parts.

I plan to actually list out what tweaks a Wheezy image needs to get this optoisolator build to work.  It's actually pretty easy--but whatever you, don't be lured in by quick2wire.  Those buggers wasted most of my day :(

If anyone has questions let me know.

**Oh, one note.  When I populated the board I used 4.7k resistors on the Arduino side, but I pulled off everything on the Raspberry Pi side.  It seems the Pi has built in pull-ups that do the job rather well.**

[ADUM1250ARZ Datasheet](http://www.analog.com/static/imported-files/data_sheets/ADUM1250_1251.pdf)

Hope everyone is well :)
