---
layout: article
title: "C#: Refactoring"
categories: misc
excerpt:
tags: [philosophy]
image:
  feature: csharper-ladvien-learning-journal.png
  teaser: C#-ladvien-learning-journal.png
  thumb:
---

## Lumi Uploader

I've been working on writing my own uploader since May 2014.  Originally, I was trying to write an uploader in C using the GCC compiler.  The idea was to upload a Intel HEX file compiled for the LPC1114 to the uC remotely, using a Bluetooth LE connection.  Here's a description of the custom circuit board designed for the project:

* [Valdez Mutant Board](http://ladvien.github.io/robots/valdez-mutant-board/)

Unfortunately, the project was _way_ out of my league.  After spending months, after months writing C code there was nothing complete.  Of course, learned a lot about C, though.

Well, fast-forward a couple of years.  I started on a code base to upload compiled Atmel ATMega and ATtiny programs using the same method outlined in the Valdez Mutant article.  But this time, the uploader would be written in C# on Windows.  And it would interface with the [TinySafeBootloader]() on the Atmel chips.
