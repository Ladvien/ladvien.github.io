---
layout: post
title: Raspberry Pi Zero W Arch Linux Image
desription: Using a prebuilt Arch Linx Raspberry Pi Zero image for headless immediate wifi access.
categories: robots
excerpt:
tags: [Raspberry Pi, Arch Linux]
image: 
    feature: 
comments: true
custom_css: 
custom_js: 
---

[Arch Linux for Raspberry Pi Zero W](https://ladvien.com/downloads/2018-09-09-ladviens-rp0w-arch-linux-with-node-i2c-headless-wifi.img.dd.gz)

Solves the corrupted image problems
```
su
```
Enter the root password, which is also `root`
```
pacman-key --init
pacman-key --populate archlinuxarm
pacman -Syu
```

Then attempt an upgrade.  When you see `Replace ca-certificates-cacert with core/ca-certificates? [Y/n]` reply `Y`.

https://archlinuxarm.org/forum/viewtopic.php?f=65&t=12796