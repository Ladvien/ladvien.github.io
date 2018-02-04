---
layout: post
title: Upload Arduino or AVR Programs to ATtiny84/85 Over UART
desription: Code walkthrough of Lumi5 -- a Chrome based AVR / Arduino wireless uploader.
categories: robots
excerpt:
tags: [Arduino, ATtiny84, ATtiny85, tutorial, BLE, Google API, Chrome]
image: 
    feature: 
comments: true
custom_css: 
custom_js: 
---

![](https://ladvien.com/images/attiny-hm-10-prep-tsb-1.jpg)
## Lumi5 -- AVR / Arduino Wireless Uploader
This article will focus on setting up the Bluetooth 4.0 module, preparing the uploader, and uploading sketches over Bluetooth 4.0

Prerequisites:

This article builds off:

Upload Arduino Sketches to ATtiny85 with UART

The above article will need to be followed to prepare your ATtiny85 and Windows computer.

1. ATtiny85 (or any ATtiny or ATmega chip)
2. Windows 10
3. Arduino Uno (or compatible, this will be used once to burn the bootloader to the ATtiny85).
4. [FTDI](http://www.ebay.com/itm/NF-FTDI-FT232RL-USB-to-TTL-Serial-Converter-Adapter-Module-5V-3-3V-For-Arduino-/221847346354) (or compatible UART).
6. Lumi (a browser based uploader for TinySafeBoot).
7. [Arduino IDE](https://www.arduino.cc/en/Main/Software)
8. [AVRDUDE](https://sourceforge.net/projects/winavr/)
9. [HM-10 or HM-11 Breakout](http://www.ebay.com/itm/Tinysine-Serial-Bluetooth-4-0-BLE-Module-iBeacon-IOS-Iphone-Andorid-/221390932333?hash=item338bed896d:g:abcAAMXQ1d1THXrR)*
10. 1k Resistor
11. Soldering iron

*Note: There are much cheaper versions of the [breakout listed on eBay](http://www.ebay.com/sch/i.html?_odkw=hm-10&_sop=15&_osacat=12576&_from=R40&_trksid=p2045573.m570.l1313.TR0.TRC0.H0.Xhm-10+breakout.TRS0&_nkw=hm-10+breakout&_sacat=12576), but beware, there are many clones which will not work with this project. The one I've listed I've verified as working. Of course, I always recommend you [roll your own breakout](https://www.instructables.com/id/How-to-Create-an-Arduino-Compatible-Bluetooth-40-M/) :)

Why?

Over-the-air uploading of programs to embedded devices is one of the more useful implementations in the history of embedded hardware. It allows the post-production and delivery of gadgets to have their behavior tweaked in reaction to end-user feedback.

Likewise, the Arduino phenomenon probably needs little explanation in this venue. However, I've personally not found many solutions for over-the-air uploading of Arduino sketches which have acceptable trade-offs. This article, along with the preceding, are nothing more than attempts to share what I've found.

## Overview:

![](https://ladvien.com/images/attiny-hm-10-prep-tsb-2.jpg)

This is simply for those who are curious on how this works, it may be skipped.

This tutorial will show you how to wirelessly upload Arduino sketches to an ATtiny85 over a PC's built in Bluetooth 4.0 hardware and an HM-10. The concept is fairly simple.

The HM-10 has firmware which allow it to monitor all incoming serial data for AT commands. It can then intercept these commands from the stream, allowing the user to remotely control the behavior of the HM-10. In short, the HM-10 allows you to send a command to send a pin HIGH or LOW.

Now, the TinySafeBootloader is a serial bootloader for the ATtiny and ATmega AVR chip sets (these are the heart of Arduino). The most important difference between the TinySafeBootloader and others is it allows serial control over the bootloader behavior, this allows programmers to write uploader software for it, which is what I've done for this project.

To the point, we will wire up an HM-10 and an ATtiny with the TSB bootloader. One of the HM-10's IO pins will be connected to the ATtiny's RESET line. This will allow us to send a command to the remote HM-10, sending the ATtiny85 into bootloader mode, upload a sketch over the Bluetooth connection, then send another command to the HM-10 to send the ATtiny85 back into program execution mode.

## Setup

### Select a Pin
You will need to select a IO pin on the HM-10 to connect the 1k resistor. Any of the pins listed above should be supported.
![](https://ladvien.com/images/attiny-hm-10-prep-tsb-3.jpg)

### Solder the 1k Resistor
![](https://ladvien.com/images/attiny-hm-10-prep-tsb-4.jpg)
![](https://ladvien.com/images/attiny-hm-10-prep-tsb-9.jpg)