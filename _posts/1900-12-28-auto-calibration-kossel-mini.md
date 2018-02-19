---
layout: post
title: Robber Board v3
categories: robot
series: Custom PCBs
excerpt:
tags: [robot, PCB, SMD, ATtiny84, HM-11, BLE]
image: 
    feature: Robber-T%20v01.PNG
comments: true
custom_css:
custom_js: 
---
 * M502 Resets to factory settings.  While using EEPROM this must be done every time the firmware is changed and uploaded.
 * G33 is auto-calibration.  It assumes the probe is in the right place and calculates offsets for everything else.  It is the opposite from g29, which assumes everything is in the right place and the calculates where the probe is, which is used with an offset to find the nozzel head.
 * [It doesn't look like G33 currently has support for probe offset](https://github.com/LVD-AC/Marlin-AC/issues/18).
``` c
/**
 * A Fix-Mounted Probe either doesn't deploy or needs manual deployment.
 *   (e.g., an inductive probe or a nozzle-based probe-switch.)
 */
#define FIX_MOUNTED_PROBE

```