---
layout: post
title: Setup i2c on Raspberry Pi Zero W using Arch Linux
categories: Arch Linux
excerpt: A guide to setting up the I2C bus or the Raspberry Pi Zero W on Arch Linux
tags: [Arch Linux, pi, linux]
series: Raspberry Pi
image: 
    feature: arch-pi-splash.png
comments: true
custom_css:
custom_js: 
---

This article builds on the previous, where I ran us through setting up Arch Linux for the Raspberry Pi Zero W.

Let's not stop, let's get I2C going so we can interact with some cool hardware.


## 1. Install needed packages

```
pacman -S git python2 i2c-tools base-devel python2-distribute python2-pip
```

Use Python's Package Index (pip) to install Raspberry Pi GPIO support

```
pip2 install RPi.GPIO
```

## 2. Install raspi-config
```
sudo pacman -S xorg-xrandr libnewt
git clone https://aur.archlinux.org/raspi-config.git
cd raspi-config
makepkg -i
```
![](https://ladvien.com/images/rasp-config.png)
Use the Raspi-Config tool to enable I2C
```
sudo raspi-config
```

Select "Interfacing Options" and enable I2C.


## 3. Test the I2C Setup
We _should_ be all setup.  Try running
```
sudo i2cdetect -y 1
```

If all has went well then you should get
```
[alarm@alarmpi ~]$ sudo i2cdetect -y 1
     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00:          -- -- -- -- -- -- -- -- -- -- -- -- --
10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
20: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
40: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
70: -- -- -- -- -- -- -- --
```
Now, we just need to connect an I2C device to the bus and we should the hex address of where the device may be found.