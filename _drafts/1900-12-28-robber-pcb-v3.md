---
layout: post
title: Robber Board v3
categories: robot
series: Custom PCBs
excerpt:
tags: [robot, PCB, SMD, ATtiny84, HM-11, BLE]
image: 
    feature: Robber-T%20v01.PNG
comments: true
custom_css:
custom_js: 
---

# 2017-12-24 -- v3

This is an update on the Robber Board I've been slowly working on. Its a small little bells-and-whistles board which is meant to be a test platform for my Lumi wireless AVR uploder.

* [Lumi](https://ladvien.com/robber-pcb/)

I've almost finished testing the Robber board v3.  A few changes:

### ISP Key

I've added a special ISP header to the board.  It works with [Tiny AVR-ISP pogo-pin programming adapter](https://www.tindie.com/products/madworm/tiny-avr-isp-pogo-pin-programming-adapter/)

It's a bit of a pain to solder, but it's pretty darn sweet once it's in place.  Of course, the header is backwards. I'm going to be humble and blame myself for not checking the pinout, but I ended up vertically switching the pins.  This caused a few hours of frustration.  

Besides that, the rest of the board works.



![](/images/isp-key.png)



## Footprint

![](/images/robber-board-v3-top.png)


![](/images/robber-board-v3-bottom.png)