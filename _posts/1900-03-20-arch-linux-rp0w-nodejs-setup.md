---
layout: post
title: Setup NodeJS Project Space on Raspberry Pi Zero W
categories: Arch Linux
excerpt: How to setup NodeJS on Raspberry Pi Zero W
tags: [Arch Linux, Raspberry Pi Zero W, linux, nodejs]
series: Raspberry Pi
image: 
    feature: arch-pi-splash.png
comments: true
custom_css:
custom_js: 
---

### Setup the Arch Linux SD Card

This article will be building off a previous article, where I walked through a headless setup of Arch Linux on the Raspberry Pi Zero W (rp0w).  And if you aren't familiar with the term "headless setup," essentially, we are talking about setting up the SD card so you don't have to plug it into a monitor.  You can plug it in to your rp0w, boot it, and SSH in.

* [Installing Arch Linux on a Raspberry Pi with Immediate WiFi Access](https://ladvien.com/installing-arch-linux-raspberry-pi-zero-w/)

Now you've setup the Arch Linux card and SSH'ed lets go through setting up a NodeJS environment on the rp0w.  Luckily, there have been people smarter than me who've already done some heavy lifting for us.

### SSH'ing into Pi
Alright, from a Linux or Mac command prompt type


### Running a NodeJS Install Script

https://github.com/audstanley/NodeJs-Raspberry-Pi

* [Setup i2c on Raspberry Pi Zero W using Arch Linux](https://ladvien.com/arch-linux-i2c-setup/)