---
layout: article
title: Lab Controlle PCB
categories: robots
excerpt:
tags: [robots]
color: "#152a55"
image:
  feature: Lab%20Controller%20Board%20Top%20and%20Bottom(1)
  teaser: aLab%20Controller%20Board%20Top%20and%20Bottom(1)
  thumb:
comments: true
---
![](/images/Lab%20Controller%20Board%20Top%20and%20Bottom(1).PNG)

A little lab controller PCB I'm working on.  It centers around four high-power constant current circuits meant to be driven by an Atmega328's PWM.

I _hate_ working on anything mechanical in dim light; comes from dropping parts down under the engine when working on cars.  I'm also pretty particular about my type of light.  The "Cool White" or CFLs really bother me. I feel like I'm a bug headed towards a bug-zapper.  

I have a few design goals,

1.  Warm white is the way to go.  I'm shooting for four 1k lumen warm-white LEDs at 12v at ~1A.
2.  I've a plug for an Arduino Pro Mini (APM).  It's hard to fight the APM when it comes to small footprint and versatility, oh, and price.  They are super cheap if you buy them on eBay.
3.  I want to make a BLE serial interface using my HM-10\.  This would allow me to control my LEDs using my iOS devices.  A few supporting posts,
    1.  [iOS to µC Using an HM-1X](http://ladvien.github.io/robots/connect-an-arduino-to-iphone/)
    2.  [HM-10](http://ladvien.github.io/robots/HM10/)
    3.  [Advanced(ish) HM-10](http://ladvien.github.io/robots/advancedish-hm-10/)
4.  The A4 and A5 pins are broken out, this is meant to make the boards chainable using I2C.

The heart of the circuit is around a high-power constant current driver.  I ripped the circuit from this fellows, somewhat, excellent post:

*   [High Power LED Driver Circuits](http://www.instructables.com/id/Circuits-for-using-High-Power-LED-s/step8/a-little-micro-makes-all-the-difference/)

Here is my go at adding the circuit to a controller board,

[![](/images/Lab%20Controller%20Schem%20image.PNG)](https://github.com/Ladvien/ladvien.github.io/blob/master/images/Lab%20Controller%20Board%20v01.pdf)

Regarding how the circuit it works....black magic.  Well, at least, that's how I understand it.  I tried reading this excellent article but ended up deciding it was attempting to reason away what was obviously black magic.

*   [The Transistor -- MOSFET Constant Current Driver](http://www.pcbheaven.com/userpages/LED_driving_and_controlling_methods/)

![](/sites/default/files//users/Ladvien/images/IMG_0133.JPG)

I originally designed a minimal PCB to hold the circuit.  I was hoping a small little board would allow me to attach it wherever needed,

![5V regulator](/sites/default/files//users/Ladvien/images/5v_regulator_lab_controller_labeled.jpeg)

Here's where it gets fun.  See that red alligator clip so neatly gripping the leg of the 5V regulator, well, just keep it in mind when looking at our next exhibit.

![](/sites/default/files//users/Ladvien/images/IMG_0134.jpeg)

 Gross and note safe, right? _C'est la vie,_ it has been working for a about a year this way.

BOM Time!

1.  4 x [2N5088](http://http//www.farnell.com/datasheets/46867.pdf)
2.  4 x [FQP40N06L](http://https//www.fairchildsemi.com/datasheets/FQ/FQP30N06L.pdf)
3.  4 x [0.47 ohm resistor ](http://www.ebay.com/itm/271453283354?ru=http%3A%2F%2Fwww.ebay.com%2Fsch%2Fi.html%3F_from%3DR40%26_sacat%3D0%26_nkw%3D271453283354%26_rdc%3D1) or 0.75ohm.
4.  4 x [12v, 900mA](https://www.fasttech.com/products/0/10001245/2119700-10w-3s3p-1000-lumen-6000-6500k-integrated-led) (0.47ohm) or [12v, 600m](https://www.fasttech.com/products/1822403)A (0.75ohm)
5.  1 x Arduino Pro Mini
6.  1 x Big (size TBD) Electrolytic Capacitor
7.  5 x [2-Pin Plug-in Screw Terminal Block Connector 5mm Pitch Panel PCB Mount](http://www.ebay.com/itm/111373399144?_trksid=p2057872.m2749.l2649&ssPageName=STRK%3AMEBIDX%3AIT)
8.  2 x 4.7k ohm 0805 resistor
9.  4 x 10k ohm 0805 resistor
10.  1 x 470 ohm 0805 resistor
11.  2 x 330 ohm 0805 resistor
12.  1 x [50-50 SMD RGB LED](http://www.ebay.com/itm/100-pcs-New-RGB-PLCC-6-5050-3-CHIPS-SMT-SMD-LED-Light-NEW-/191674244800?hash=item2ca0acdec0)
13.  1 x 5V SMD linear regulator [MC7805CD2TR4](http://www.ebay.com/itm/400262003608?_trksid=p2057872.m2749.l2649&ssPageName=STRK%3AMEBIDX%3AIT) D2PAK 

Anyway, the boards are at the fabricator, so I'll report back when I've populated and test them.  I've already got ideas for iteration v2.
