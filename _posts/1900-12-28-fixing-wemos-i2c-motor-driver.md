---
layout: post
title: Fixing $2.50 Wemos I2C Motor Driver
categories: robot
series: 
excerpt:
tags: [robot, I2C, STM32, motor]
image: 
    feature: 
comments: true
custom_css:
custom_js: 
---

Fixing Wemos I2C motor driver.

1.[Deshipu Motor Driver](https://hackaday.io/project/18439-motor-shield-reprogramming)
2. [STM32Link](https://sourceforge.net/projects/stm32flash/files/latest/download)

Pinout for Use

* D1 = SCL
* D2 = SDA
* 3.3V = Module Power
* GND = GND

Pinout for programming
* Jumper RTS and 3V
* D1 = RX
* D2 = TX
* GND = GND
* 3.3V = VCC

Installing STM32 toolchain on Arch Linux:

```bash
sudo pacman -S gcc-arm-none-eabi
sudo pacman -S arm-none-eabi-binutils
sudo pacman -S arm-none-eabi-newlib
sudo pacman -S arm-none-eabi-gdb

# General template (for any STM)
#git clone https://github.com/szczys/stm32f0-discovery-basic-template.git
# For building just the Wemos Motor Driver Firmware (this is the untested firmware for using solder jumpers to choose address)
git clone https://github.com/NathanJPhillips/wemos_motor_shield.git
```