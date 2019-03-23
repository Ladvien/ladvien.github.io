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

1. [Deshipu Motor Driver](https://hackaday.io/project/18439-motor-shield-reprogramming)
2. [stm32flash](https://aur.archlinux.org/stm32flash.git)

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

```
stm32flash -k /dev/ttyUSB0
stm32flash /dev/ttyUSB0 -u
stm32flash /dev/ttyUSB0 -v -w motor_shield.bin
```

Firmware for different addresses
https://github.com/pbugalski/wemos_motor_shield/issues/3

* [Address 0x2D](http://ladvien.com/images/files/motor_shield_2D.bin)
* [Address 0x2E](http://ladvien.com/images/files/motor_shield_2E.bin)
* [Address 0x2F](http://ladvien.com/images/files/motor_shield_2F.bin)
* [Address 30](http://ladvien.com/images/files/motor_shield_30.bin)

Wemos Motor (v1) Schematic
https://wiki.wemos.cc/_media/products:d1_mini_shields:mini_motor.pdf

TB6612FNG Datasheet
https://www.sparkfun.com/datasheets/Robotics/TB6612FNG.pdf

![](https://ladvien/images/labeled_wemos.png)