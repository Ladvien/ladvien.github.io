---
layout: article
title: Homemade Pulse Sensor
categories: robots
excerpt:
tags: [robots]
image:
  feature: IMG_9109.JPG
  teaser: IMG_9109.JPG
  thumb:
comments: true
---

Originally posted on [www.letsmakerobots.com](www.letsmakerobots.com)

<div class="flex-video">
<iframe width="560" height="315" src="https://www.youtube.com/embed/llYuknlc3uk?list=UUKodYd0Fj3TSHzXg7aOJYYQ" frameborder="0" allowfullscreen></iframe>
</div>

I've been working on re-making the the [Open Hardware Pulse Sensor](http://pulsesensor.com/open-hardware/) so it'd be easy to send off to OSHPark and to make at home. I'm not sure, but I think I started this project in March and I've just now finished it.

The bit of encouragement I needed was when hackaday.com put it up as their "[Fail of the Week.](http://hackaday.com/2013/09/19/fail-of-the-week-smoking-pulse-sensor-and-ble-dissappointment/)"  I thought I was going to be mature about it.  But those four red letters started eating at me, so I gave it another go.  Weirdly, I got it working.  

I believe there were three problems:

1.  I had mixed up the op-amps _again_.  In my defense, I've got 5 different ICs flying about in the same package as the op-amp.
2.  The Arduino I'd been plugging into was sitting on a surface that provided enough conductivity to create noise between the 3.3v pin on the underside and A0, which I was using for the op-amp in.
3.  Every time I touched the sensor the exposed vias were shorted through my own conductivity.  Stupid mineral water.

**VIDEO:**

**[![](/images/u19048/Pulse_Sensor_Play_Button.jpg)](http://www.youtube.com/watch?v=llYuknlc3uk&feature=share&list=UUKodYd0Fj3TSHzXg7aOJYYQ)
**

I've already detailed how I [went about making it](http://letsmakerobots.com/node/37815); so, I'll try to stick to repeatability.

**1. Order the parts.**

*   Op-amp:  **.29**  ([**Digi-Key**](http://www.digikey.com/product-detail/en/MCP6001T-I%2FOT/MCP6001T-I%2FOTCT-ND/697158))
*   Light Photo Sensor: **1.23 ([Digi-Key](http://www.digikey.com/product-detail/en/APDS-9008-020/516-2662-1-ND/3909167))**
*   LED:  **.79   ([Digi-Key](http://www.digikey.com/product-detail/en/AM2520ZGC09/754-1423-1-ND/2163781))**
*   0603 Schottky Diode**: .50 ([Digi-Key](http://www.digikey.com/product-detail/en/CD0603-B0130L/CD0603-B0130LCT-ND/3438043?WT.mc_id=PLA_3438043))**
*   Passives:  ~**2.50** **- Resistors: 1 x 470k, 1 x 12k, 2 x 100k, 1 x 10k, 1 x 3.3Meg - Capacitors: 3 x 4.7uF, 2 x 2.2uF**
*   [OSHPark Boards](http://www.oshpark.com/shared_projects/e3W0qHzw)**: **$**.67 **(minimum 3 boards, costing $2.00. 3/2.00 = ~.67)

 **Total (approximate): $ 5.98**

2. **Make sure you have theses tools.**

*  Clothes iron.
*  Solder at least .022"
*  Flux.
*  [A soldering iron with a "precision" tip](http://www.amazon.com/ZITRADE-5pcs-Soldering-tips-ZITRADES/dp/B009YSPGAS/ref=sr_1_2?s=hi&ie=UTF8&qid=1375550915&sr=1-2&keywords=soldering+tip+.5).
*  [Tacky-putty](http://www.amazon.com/Scotch-Adhesive-Putty-Removable-860/dp/B000AN7EW4).
*  [Precision tweezers.](http://www.fasttech.com/products/0/10002626/1195600-precision-tweezers-3-piece-set)

3. **Solder the light-sensor.**

The light sensor is the hardest bit, so take your time.  I put a little bit of solder on each pad with my soldering-iron, then, cover the soldered pads in flux.  Next, I attempt to align the light-sensor with the pads as close as possible.  After, I put the board with the backside on an over-turned clothes iron.  Let the iron heat up until the solder reflows and the sensor is attached.

![](/images/u19048/IMG_0673.jpg)

4. Flip the sensor and lock it to your surface with tacky-putty to solder the LED, passives, and op-amp.  I won't detail this, since my [video](http://www.youtube.com/watch?v=llYuknlc3uk&feature=share&list=UUKodYd0Fj3TSHzXg7aOJYYQ) shows the entire process.

![](/images/u19048/Overlays_on_HR.jpg)

5. **Wrap it with tape, cutting a small hole for the LED and light-sensor.**  (I'll come up with a better solution, and a way it to clip it to your body, on the next iteration).

6. **Wire it up to the Arduino **

Left ---- Middle ---- Right

A0 ------ 3.3v --------GND

7. **Run the [Arduino](https://pulse-sensor.googlecode.com/files/PulseSensorAmped_Arduino_1dot2.zip) and [Processing](http://pulse-sensor.googlecode.com/files/PulseSensorAmpd_Processing_1dot1.zip) sketches these [amazing guys](http://pulsesensor.myshopify.com/pages/about-us) provided.**

8. Yell at me if you have problems.
