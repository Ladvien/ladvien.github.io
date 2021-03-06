---
layout: post
title: Mega Mini Motor Shield (M^3)
categories: robots
series: Custom PCBs
excerpt:
tags: [robots, SN755410]
color: "#152a55"
color: "#152a55"

image:
  feature: IMG_8629.JPG
  teaser: IMG_8629.JPG
  thumb:
comments: true
---

Originally posted on [www.letsmakerobots.com](www.letsmakerobots.com)


<div class="flex-video">
  <iframe width="50%" height="50%" src="https://www.youtube.com/embed/Ny9dN20BRA4" frameborder="0" allowfullscreen></iframe>
</div>

I finally got in my Mega Mini Motor (M3) shield that I designed.  I was surprised, after populating the board: It actually worked.  The board came about after making the [Arduino Mega Mini](http://letsmakerobots.com/node/36273).  I noticed I wouldn't really be reducing the bulk of my [bot](http://letsmakerobots.com/node/35922) because of the amount of wiring it would take to get logic to the Arduino Motor Driver shield I was using.  Therefore, I set out to design a motor driver shield that would plug right into the MegaMini.  I broke out Eagle and some datasheets on an assortment of ICs.

I started out working with the L298D chip, but quickly got frustrated with the way it set on the MegaMini footprint.  Plus, the flyback diodes were pissing me off.  I had remembered reading that the [SN754410](http://www.ti.com/lit/ds/symlink/sn754410.pdf) had internal ESD diodes.  I started playing with the chip layout and got a board design I was pretty happy with.  

I'll attempt a full write up later;I'm pretty mentally fatigued from learning html/css (I know, easy.  But as many know by now, cognitively, I'm as slow as a snail on salt.)
