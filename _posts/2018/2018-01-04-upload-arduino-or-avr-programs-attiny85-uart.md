---
layout: post
title: Upload Arduino or AVR Programs to ATtiny84/85 Over UART
desription: A tutorial showing how to setup an ATtiny85 or ATtiny84 to upload programs directly over UART.  No need for ISP.
categories: robots
series: lumi5
excerpt:
tags: [Arduino, ATtiny84, ATtiny85, tutorial, UART]
image: 
    feature: C_ARD.png
    teaser: 2017-06-09-upload-arduino-or-avr-programs-attiny85-uart/02_img_2017-06-09-upload-arduino-or-avr-programs-attiny85-uart.jpg
comments: true
custom_css: 
custom_js: 
---

Upload Arduino Sketches to ATtiny85 With UART
This article will show you how use a two-wire interface (UART) to upload Arduino sketches to the ATtiny85. In short, we will burn the [TinySafeBootloader](http://jtxp.org/tech/tinysafeboot_en.htm) onto the ATtiny85 using an [Arduino Uno as an ISP programmer](https://www.arduino.cc/en/Tutorial/ArduinoISP). After the initial burning of the bootloader, we can then program the ATtiny85 with any FTDI compatible USB-to-UART. And very similar steps may be followed to do the same for an ATtiny84.
<!-- more -->
There are a few requirements and a lot of setup needed:

#### Prerequisites:

* ATtiny85 / 84, or ATmega328P
* Windows 10
* Arduino Uno (or compatible, this will be used once to burn the bootloader to the ATtiny85)
* [FTDI or compatible UART](http://www.ebay.com/itm/NF-FTDI-FT232RL-USB-to-TTL-Serial-Converter-Adapter-Module-5V-3-3V-For-Arduino-/2218473463540)
* TinySafeBoot uploader
* [Arduino IDE](https://www.arduino.cc/en/Main/Software)
* [AVRDUDE](https://sourceforge.net/projects/winavr/)
 
#### Useful Components: ###

* Breadboardable Push Button
* 220-330 Ohm Resistor
* LED

## Why?

Many may ask, "Really, why would I want to go through all this trouble to install a bootloader on an ATtiny85 when it is less trouble just to use the Arduino ISP?" Good question.

This article was not meant to be independent. The entire purpose of the this is to prepare an ATtiny85 (actually, any ATtiny orATmega uCs) for wireless upload of Arduino sketches or AVR binaries.

## Step 1: Upload the ArduinoISP Sketch

![](/images/2017-06-09-upload-arduino-or-avr-programs-attiny85-uart/02_img_2017-06-09-upload-arduino-or-avr-programs-attiny85-uart.jpg)

Upload the ArduinoISP Sketch
There are several guides on how to use an Arduino as an ISP:

* [Programming AVR with Arduino](https://www.youtube.com/watch?v=muP1dp73Mdg)) (Video)
* [Using an Arduino as an AVR ISP (In-System Programmer)](https://www.arduino.cc/en/Tutorial/ArduinoISP)

But outline the steps briefly, just in case.

before wiring up the Arduino Uno to the ATtiny85 you will need to install the Arduino ISP sketch onto the Arduino Uno. This is built into the Arduino IDE.

* File --> Examples --> 11. ArduinoISP --> ArduinoISP

Then hit the Upload button. Wire up the ATtiny85 After the ArduinoISP sketch has been uploaded it is time to burn our bootloader to the ATtiny85. Go ahead and wire your ATtiny85 to the Arduino Uno as shown in the image above.

## Step 2: Wire Up the ATtiny85 and Arduino

![](/images/2017-06-09-upload-arduino-or-avr-programs-attiny85-uart/02_img_2017-06-09-upload-arduino-or-avr-programs-attiny85-uart.jpg)

Now the ArduinoISP sketch has been uploaded it is time to burn our bootloader to the ATtiny85. Go ahead and wire your ATtiny85 to the Arduino Uno as shown in the image.

## Step 3: Install AVRDUDE

![](/images/2017-06-09-upload-arduino-or-avr-programs-attiny85-uart/04_img_2017-06-09-upload-arduino-or-avr-programs-attiny85-uart.jpg)

Now, we will need to install WinAVR

* [WinAVR Download](https://sourceforge.net/projects/winavr/)

## Step 4: Burn TinySafeBootloader on ATtiny85

![](/images/2017-06-09-upload-arduino-or-avr-programs-attiny85-uart/05_img_2017-06-09-upload-arduino-or-avr-programs-attiny85-uart.jpg)

Burn TinySafeBootloader on ATtiny85
Once AVRDUDE has successfully installed, open it by going to the Start Menu and typing

* cmd

This should open the Windows command prompt. Now, let's make sure AVRDUDE is installed. Type:

* avrdude

And press return. You should see output similar to what's in the image.

_*Please hear my warning*_ what we are about to do has the potential of brick your ATtiny85. More specifically, if we set the fuses wrong on the ATtiny85 it might render the chip unusable. That stated, let's take a moment and talk through what we are doing.

At this point our Arduino Uno is setup as an ISP. We plan to use AVRDUDE to tell the ISP to burn the TinySafeBootloader onto our ATtiny85. In the process we will also set the fuses on the ATtiny85. These fuses are bits of memory which tell the ATtiny85 how to act. There are two will need to set to use TinySafeBoot on any ATtiny supported.

ATtiny85 & ATtiny84 (or any other ATtiny supported):

1. SELFPRGEN -- must be set to enable flash writes from firmware
2. BODLEVEL -- should be set to avoid flash corruption during unsafe device power-up.

If you are following this guide for the ATmega series the fuses need are:

1. BOOTRST -- activated lets the MCU jump into the Bootloader section with every hardware reset.
2. BODLEVEL -- should be set to avoid flash corruption during unsafe device power-up.
3. BOOTSZ=11 -- to reserve 512 bytes for a Bootloader Section.
4. BLB -- set to MODE 2 or 3 to protect Bootloader section from undesirable write access by firmware.

If you don't quite trust me or if you would like to read more about fuses, here's a great explanation.

* [AVR Fuses](https://embedderslife.wordpress.com/2012/08/20/fuse-bits-arent-that-scary/)

The fuse settings will be written to the ATtiny85 when when burn the bootloader by using AVRDUDE. You are welcome to calculate your own fuses using the nifty EngBedded web app:

* [AVR Fuse Calculator](http://www.engbedded.com/fusecalc/)

However, I've provided the two commands you will need for the to program the ATtiny 84, 85, and ATmega328P. Copy the first command and paste it to the Windows prompt. If the command is successful, copy the second command. If both commands are successful, you should now have the TSB setup on your ATtiny or ATmega chip.

AVRDUDE command to upload:

#### ATtiny85 at 1mhz

{% highlight bash %}
avrdude -P COM# -b 19200 -c avrisp -p t85 -v -e -U lfuse:w:0x62:m -U hfuse:w:0xdd:m -U efuse:w:0xfe:m
avrdude -P COM# -b 19200 -c avrisp -p t85 -v -e -U flash:w:tsb_tn85_b3b4_20150826.hex
ATtiny85 at 8mhz

avrdude -P COM# -b 19200 -c avrisp -p t85 -v -e -U lfuse:w:0xe2:m -U hfuse:w:0xdd:m -U efuse:w:0xfe:m
avrdude -P COM# -b 19200 -c avrisp -p t85 -v -e -U flash:w:tsb_tn85_b3b4_20150826.hex
{% endhighlight %}

#### ATtiny84 at 1mhz
{% highlight bash %}
avrdude -P COM# -b 19200 -c avrisp -p t84 -v -e -U lfuse:w:0x62:m -U hfuse:w:0xdf:m -U efuse:w:0xfe:m
avrdude -P COM# -b 19200 -c avrisp -p t84 -v -e -U flash:w:tsb_tn84_a0a1_20150826.hex
{% endhighlight %}

#### ATtiny84 at 8mhz
{% highlight bash %}
avrdude -P COM# -b 19200 -c avrisp -p t84 -v -e -U lfuse:w:0xe2:m -U hfuse:w:0xdf:m -U efuse:w:0xfe:m
avrdude -P COM# -b 19200 -c avrisp -p t84 -v -e -U flash:w:tsb_tn84_a0a1_20150826.hex
{% endhighlight %}

#### ATtmega328P at 8mhz
{% highlight bash %}
avrdude -P COM# -b 19200 -c avrisp -p m328p -v -e -U lfuse:w:0xFF:m -U hfuse:w:0xDA:m -U efuse:w:0x05:m
avrdude -P COM# -b 19200 -c avrisp -p m328p -v -e -U flash:w:tsb_m328p_d0d1_20150826.hex
{% endhighlight %}

#### ATmega328P at 16mhz
{% highlight bash %}
avrdude -P COM# -b 19200 -c avrisp -p m328p -v -e -U efuse:w:0x05:m -U hfuse:w:0xD6:m -U lfuse:w:0xFF:m
avrdude -P COM# -b 19200 -c avrisp -p m328p -v -e -U flash:w:tsb_m328p_d0d1_20150826.hex
{% endhighlight %}

If you have any issues, please leave any questions in the comments below.



## Step 5: Setup Arduino for ATtiny Boards -- 1

![](/images/2017-06-09-upload-arduino-or-avr-programs-attiny85-uart/06_img_2017-06-09-upload-arduino-or-avr-programs-attiny85-uart.jpg)

Setup Arduino for ATtiny Boards -- 1
You will need to add ATtiny board support to the Arduino IDE. This may be done by going to:

* File ---> Preferences

Then enter the following into the box marked "Additional Boards Manager URLs:"

*"https://raw.githubusercontent.com/damellis/attiny/ide-1.6.x-boards-manager/package_damellis_attiny_index.json"*

## Step 6: Setup Arduino for ATtiny Boards -- 2

![](/images/2017-06-09-upload-arduino-or-avr-programs-attiny85-uart/07_img_2017-06-09-upload-arduino-or-avr-programs-attiny85-uart.jpg)

Then go to,

* Tools ---> Boards ---> Board Manager

Now you have added the additional boards URL there should be an option:

* "attiny by David A. Mellis"

Install this package.

## Step 7: Select the ATtiny85

![](/images/2017-06-09-upload-arduino-or-avr-programs-attiny85-uart/08_img_2017-06-09-upload-arduino-or-avr-programs-attiny85-uart.jpg)

Select the ATtiny85
Now, you should have the ATtiny group listed under

* Tools --> Boards ---> ATtiny

Select the processor and speed you are working with, then, type out whatever program you would like to upload. Once you have finished your code go to:

* Sketch ---> Export Compiled Binary

Usually, the Arduino IDE takes care of the upload, however, it doesn't know how to interface with the TinySafeBootloader. This is where the Lumi Uploader comes in.

## Step 8: Download the Uploader

Download the Uploader
Download my Lumi Uploader (Windows 10). It only costs a bazillion-million dollars; nah, it's free.

Lumi Uploader

Warning: this uploader is a work in progress. If you would like to delve into the source it may be found here:

Lumi Uploader Source

Eventually, I'll probably re-write this app for Mac and iOS. But gotta get the bugs outta of the Windows version first.

## Step 9: Connect UART IC to ATtiny85

![](/images/2017-06-09-upload-arduino-or-avr-programs-attiny85-uart/09_img_2017-06-09-upload-arduino-or-avr-programs-attiny85-uart.jpg)

Connect UART IC to ATtiny85
Connect the UART IC to the ATtiny85 as shown.

## Step 10: Upload Arduino Sketch to ATtiny85


Time to upload the sketch!

Open the Lumi Uploader
Select COM port which your FTDI chip is connected
Set the baud rate between 9600-56700
Click"Connect"
Then click connect "Connect to TSB"
If the chip is found, it will display the information of the connect chip
Use the "Open File" to navigate to the binary we exported in step 8 (make sure to select the version that doesn't include the bootloader).
Once the file is fully loaded, click the button "Write File"
Congratulations, if all went well your sketch should now be on the ATtiny85!
If not, well, let's troubleshoot:

What happens if you click the "Reset" button? This should send the DTR line low, then high, essentially resetting the ATtiny85
Did you accidentally select the bootloader included version of your binary?
Was the correct COM port selected? Often, windows will list Bluetooth bridges as COM ports, which can make it confusing.
Did you try lower baud rates? The TSB uses software serial, which doesn't work too well on higher baud rates.
Did I make a mistake? If so, shoot me a line or leave a comment--I'll do my best.
