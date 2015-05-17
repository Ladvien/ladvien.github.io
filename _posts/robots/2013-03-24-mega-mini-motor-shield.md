---
layout: article
title: Mega Mini Motor Shield (M^3)
categories: robots
excerpt:
tags: [robots]
image:
  feature: IMG_0356.jpg
  teaser: IMG_0356_5.png
  thumb:
---
I finally got in my Mega Mini Motor (M3) shield that I designed.  I was surprised, after populating the board: It actually worked.  The board came about after making the [Arduino Mega Mini](http://letsmakerobots.com/node/36273).  I noticed I wouldn't really be reducing the bulk of my [bot](http://letsmakerobots.com/node/35922) because of the amount of wiring it would take to get logic to the Arduino Motor Driver shield I was using.  Therefore, I set out to design a motor driver shield that would plug right into the MegaMini.  I broke out Eagle and some datasheets on an assortment of ICs.

I started out working with the L298D chip, but quickly got frustrated with the way it set on the MegaMini footprint.  Plus, the flyback diodes were pissing me off.  I had remembered reading that the [SN754410](http://www.ti.com/lit/ds/symlink/sn754410.pdf) had internal ESD diodes.  I started playing with the chip layout and got a board design I was pretty happy with.  

I'll attempt a full write up later;I'm pretty mentally fatigued from learning html/css (I know, easy.  But as many know by now, cognitively, I'm as slow as a snail on salt.)
