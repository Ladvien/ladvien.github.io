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

Solves the corrupted image problems
```
su
```
Enter the root password, which is also `root`
```
pacman-key --init
pacman-key --populate archlinuxarm
```

Then attempt an upgrade.  When you see `Replace ca-certificates-cacert with core/ca-certificates? [Y/n]` reply `Y`.

https://archlinuxarm.org/forum/viewtopic.php?f=65&t=12796