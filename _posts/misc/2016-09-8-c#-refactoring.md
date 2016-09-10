---
layout: article
title: "C# Learning Journal: Refactoring Lumi"
categories: misc
excerpt:
tags: [philosophy]
image:
  feature: csharper-ladvien-learning-journal.png
  teaser:
  thumb:
---

## Lumi Uploader

I've been working on writing my own uploader since May 2014.  Originally, I was trying to write an uploader in C using the GCC compiler.  The idea was to upload a Intel HEX file compiled for the LPC1114 to the uC remotely, using a Bluetooth LE connection.  Here's a description of the custom circuit board designed for the project:

* [Valdez Mutant Board](http://ladvien.github.io/robots/valdez-mutant-board/)

Unfortunately, the project was _way_ out of my league.  After spending months, after months writing C code there was nothing complete.  Of course, learned a lot about C, though.

Well, fast-forward a couple of years.  I started on a code base to upload compiled Atmel ATMega and ATtiny programs using the same method outlined in the Valdez Mutant article.  But this time, the uploader would be written in C# on Windows.  And it would interface with the [TinySafeBootloader](http://ladvien.github.io/robots/tsb/) on the Atmel chips.

Strangely, I actually finished the project.  The first code base was written as a [C# Forms application](https://msdn.microsoft.com/en-us/library/360kwx3z(v=vs.90).aspx).  This worked out great!  I was actually able to use the `System.Devices.Ports` to access a CH340G or FTDI chip.  The USB-to-UART then shook hands with the bootloader on either an ATMega328P, ATtiny84, or ATtiny85 (others should be supported, but these were the only tested due to the simplicity of the Arduino HAL).

![](http://ladvien.github.io/images/lumi_blink_upload2.PNG){:class="ll-image-fl width="320px" height="320px""}

Here's the code base:

* [Lumi Uploader -- Windows Forms Version](https://github.com/Ladvien/Lumi_TinySafeBoot_Uploader)

Of course, there is are a lot of problems with the code.  Most center around inexperience writing object-oriented code properly.  Here are some of the problems I identified:

| Error  |
|---|
| [Too many god objects](https://en.wikipedia.org/wiki/God_object) |
| [C# Conventions were not followed](https://msdn.microsoft.com/en-us/library/ff926074.aspx) | 

--I ended being able to upload to ATtiny chips and ATMega chips over Bluetooth LE.

* [Lumi Uploader Proof of Concept](https://www.youtube.com/watch?v=mLfFbrijakc)

![](http://ladvien.github.io/images/pooh.png){:class="ll-image-fl"}

However, when I Started trying to setup the code base for adding ESP8266 support--well, things went to the poo-house.

The problem resided around the BLE write functions in C#.  There were several issues.  First, the API for Bluetooth LE is found within the newer Windows Universal App.  This API has plenty of issues.  On example would be the following:

{% highlight c# %}

{% endhighlight %}
