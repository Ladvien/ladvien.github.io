---
layout: post
title: Lab Controller v05-09
categories: robots
series: Custom PCBs
excerpt:
tags: [robots, High Power LED, Atmega328P, PCB]
color: "#152a55"
image:
  feature: lab-led-controllerpcb-v09.png
  teaser: lab-led-controllerpcb-v09.png
  thumb:
comments: true
---

### Revising Board

This is an extension of previous work.  I had finished a LED driver for the lab, hooked it up, and found it was a fire hazard.  For the amount of lumen I wanted out of them I was having to set the current resistor to .47ohm.  This was pushing nearly 2amps of current through the little [FQP40N06L](http://https//www.fairchildsemi.com/datasheets/FQ/FQP30N06L.pdf).  The LEDs were bright, but immediately the TO-220 became too hot to touch.  Two choices, either redesign or use less current, resulting in dimmer LEDs.  Easy choice, redesign.

The first thing I realized was I need a heat-sink.  Ironically, I had gone with TO-220s, a through-hole package, because I felt they would do better handling the heat.  Ended up using the [BS103AL](http://pccomponents.com/datasheets/INF-BUZ103AL.PDF), which is in an TO-263 package.  This is an SMD package that lies on its belly exposing its back for heatsink placement.

This heatsink looked beefy enough and had the correct dimensions (5CM).

![](https://img.fasttechcdn.com/135/1351906/1351906-3.jpg)

The notch on the heatsink will lie against the array of TO-263s, hopefully, drawing all excessive heat.  However, the contingency is to place a fan on the back of the heatsink.

There is also an ESP8266 on the board.  I decided it was a better option for controlling the LEDs, since they wouldn't be used outside the house and would always be connected to mains.  Of course, I've never turned on an ESP8266, so I'm hoping I strung it correctly.  It does have level conversion for TX, RX, and RESET lines.

I have also added a CH340G for USB-to-UART.  The CH340G SOIC chips were ordered awhile back, but before I put them into this board I threw it on an ATTiny84 breakout and tested it.  I didn't hold much hope for it, but it worked like a charm.  Huh.

![](https://ladvien.com/images/CH340G_test.jpg)

These little chips only cost me like $.65

[CH340G](http://www.ebay.com/itm/381476894812?_trksid=p2057872.m2749.l2649&ssPageName=STRK%3AMEBIDX%3AIT) $5 / 10 = .50

[12mhz Crystal](http://www.ebay.com/itm/251550015572?_trksid=p2057872.m2749.l2649&ssPageName=STRK%3AMEBIDX%3AIT) 1.42 / 01 = .14

The last piece of interest added to this board was a DS18B20.  This is a one wire temperature probe, which I plan to thermal-paste on the heatsink as an auto-shutdown measure.  Or perhaps, to reduce the amount of time a fan makes noise by kicking it on-and-off.

![](https://ladvien.com/images/ds18b20.jpg)

<a href="https://ladvien.com/images/LED_lab_Controller_2.pdf"><img height="735" width="630" style="margin: 10px;" src="https://ladvien.com/images/led-lab-controller-schematic-v09-drivers.png"></a>

<a href="https://ladvien.com/images/LAB_LED_Controller_schematic_v09.pdf"><img height="700" width="617" style="margin: 10px;" src="https://ladvien.com/images/led-lab-controller-schematic-v09-main.png"></a>

<div class="flex-video">
<iframe width="560" height="315" src="https://www.youtube.com/embed/KYiagQ0kjwc" frameborder="0" allowfullscreen></iframe>
</div>


The design files can be found,

[Lab LED Controller v09](https://github.com/Ladvien/Ladviens-Eagle-Files/tree/master/Lab%20Controller%20Board)
