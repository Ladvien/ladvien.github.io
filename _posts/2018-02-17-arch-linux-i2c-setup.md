---
layout: post
title: Setup i2c on Raspberry Pi Zero W using Arch Linux
categories: Arch Linux
excerpt: A guide to setting up the I2C bus or the Raspberry Pi Zero W on Arch Linux
tags: [Arch Linux, pi, linux, i2c]
series: Raspberry Pi
image: 
    feature: arch-pi-splash.png
comments: true
custom_css:
custom_js: 
---

This article builds on the previous, where I ran us through setting up Arch Linux for the Raspberry Pi Zero W.

Let's not stop, let's get I2C going so we can interact with some cool hardware.

## 0. Installing sudo
If you've followed my previous guide on installing Arch Linux on a Raspberry Pi then you'll have ended up with a bare bones system, which is good.  No unneeded fat.  But sometimes fat is needed, it's what gives us curves, and curves are beautiful.  I feel this metaphor is breaking.  In short, we need extra packages to get work done.

The first package we need is `sudo`

* [Install Sudo on Arch Linux*](https://wiki.archlinux.org/index.php/sudo#Installation)

It will allow us to more easily manage file permissions.

First, make sure your system is up to date.  To do this we are going to need to login as the root user.  You can do this be typing `su` followed by the root user's password, which for a barebone Arch Linux installation is `root`.
```
$ su
Password: root
```

Next we need to update the package libraries and system.
```
pacman -Syu

root@alarmpi alarm]# pacman -Syu
:: Synchronizing package databases...
 core                                                        179.0 KiB   448K/s 00:00 [#################################################] 100%
 extra                                                      1982.8 KiB  1279K/s 00:02 [#################################################] 100%
 community                                                     4.0 MiB  1689K/s 00:02 [#################################################] 100%
 alarm                                                        35.0 KiB   583K/s 00:00 [#################################################] 100%
 aur                                                           6.0 KiB  0.00B/s 00:00 [#################################################] 100%
:: Starting full system upgrade...
resolving dependencies...
looking for conflicting packages...
```
It should give you a list of packages with update and upgrade candidates and prompting you to confirm the updates.  Go ahead and say yes.

Now we should be good to install `sudo`

```
$ pacman -S sudo
```

Even after sudo is installed, we still need to add the main user, which is `alarm` to the sudo'er group.  This in effect gives the `alarm` user root user super-powers.

Oh, and if you haven't figured out yet, `alarm` stands for _A_rch _Linux_ _ARM_

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

Use the Raspi-Config tool to enable I2C
```
sudo raspi-config
```

![](https://ladvien.com/images/rasp-config.png)


Select "Interfacing Options" and enable I2C.

Note: Going back through these instructions I did notice when I started `raspi-config` I received this warning:

`/usr/bin/raspi-config: line 997: warning: command substitution: ignored null byte in input`

And when I attempted to enable I2C it gave this error.

`* Failed to read active DTB`

But it still seemed to do the job. I'll investigate more when I've time.


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