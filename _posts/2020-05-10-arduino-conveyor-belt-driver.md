---
layout: post
title: Arduino RAMPs 1.4 Custom Firmware
categories: robot
series: LEGO Classifier
excerpt:
tags: [raspberry pi, arduino, ramps, stepper motor]
image: 
    feature: lego_mess.jpg
    credit: Photo by Markus Spiske
comments: true
custom_css:
custom_js: 
---
This article is part of a series documenting an attempt to create a LEGO sorting machine.  This portion covers the Arduino Mega2560 firmware I've written to control a RAMPS 1.4 stepper motor board.

## Goal
To move forward with the LEGO sorting machine I needed a way to drive a conveyor belt.  Stepper motors were a fairly obvious choice.  They provide plenty of torque and finite control.  This was great, as several other parts of the LEGO classifier system would need steppers motors as well-e.g.,turn table and dispensing hopper.  Of course, one of the overall goals of this project is to keep the tools accessible.  After some research I decided to meet both goals by purchasing an Ardunio / RAMPs combo package intended for 3D printers.

![ramps-kits-on-amazon](../raw_images/lego_classifier/conveyor_belt/ramps-kit.png)

* [Amazon RAMPs Kits](https://www.amazon.com/s?k=CNC+3D+Printer+Kit+for+Arduino+Mega+2560+R3+RAMPS+1.4&ref=nb_sb_noss)

At the time of the build, these kits were around $28-35 and included:
* Arduino Mega2560
* 4 x Endstops
* 5 x Stepers Drivers
* RAMPSs 1.4 board
* Display
* Cables & wires

Seemed like a good deal.  I bought a couple of them. 

I would eventually need:
* 3 x NEMA17 stepper motors
* 12v, 10A Power Supply Unit (PSU)

Luckily, I had the PSU and a few stepper motors lying about the house. 

### Physical Adjustments
Wiring everything up wasn't too bad.  You follow pretty much any RAMPs wiring diagram.  I did need to make two adjustments before starting on the firmware.

First, underneath each of the stepper drivers there are three drivers for setting the microsteps of the respective driver.  Having all three jumpers enables maximum microsteps, but would cause the speed of the motor to be limited by the clock cycles of the Arduino--more on that soon.

![removing-stepper-jump-on-ramps](../raw_images/lego_classifier/conveyor_belt/removing-stepper-jump-on-ramps.jpg)

I've also increased the amperage to the stepper.  This allowed me to drive the entire belt from one NEMA17.  Setting the amperage on these cheap ramps boards is straightforward.  You get a small phillips screwdriver, two alligator clips, and a multimeter.  Power on your RAMPs board **and carefully** attach the negative probe to the RAMPs `GND`.  Attach the positive probe to an alligator clip and attach the other end to the shaft of your screwdriver.  Use the screwdriver to turn the small potentiometer on the stepper driver which will be driving the conveyor belt.  Watch the voltage on the multimeter--we want to use the lowest amperage which effectively drives the conveyor belt.  We are watching the voltage, as it is related to the amperage we are feeding the motors.

Anyway, I found the lowest point for my motor, without skipping steps, was around ~`0.801v`.  This voltage will _definitely_ vary depending on the drag of your conveyor belt and the quality of your stepper motor.

![setting-stepper-driver-amperage](../raw_images/lego_classifier/conveyor_belt/setting-stepper-driver-amperage.jpg)

## Arduino Code
When I bought the RAMPs board I started thinking, "I should see if we could re-purpose Marlin to drive the conveyor belt easily."  I took one look at the source and said, "Oh hell no."  Learning how to hack Marlin to drive a conveyor belt seemed like learning heart surgery to get your heart to pump gas.

So, I decided to write a striped down version of a stepper driver.

Here were my design goals for my Arduino / RAMPs firmware:
* Uses serial communication
* Accessible to a Python script
* Keep the serial command packets small
* Simple commands: motor number, direction, speed, duration

After much head scratching and realization I didn't know jack about stepper motors, or the code driving them.

### Motor

### Communication

