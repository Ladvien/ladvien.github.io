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

Not sure if this issue, but I had the Allen Key probe setting enabled.  However, this is probably better labeled "Allen Key Method"
``` c
/**
 * A Fix-Mounted Probe either doesn't deploy or needs manual deployment.
 *   (e.g., an inductive probe or a nozzle-based probe-switch.)
 */
#define FIX_MOUNTED_PROBE

```

Instead, if you are manually deploying the Allen Key, then use.

``` c
/**
 * A Fix-Mounted Probe either doesn't deploy or needs manual deployment.
 *   (e.g., an inductive probe or a nozzle-based probe-switch.)
 */
#define FIX_MOUNTED_PROBE
```

https://github.com/FLSun3dp/FLSun-Kossel-Mini/wiki/02.-Calibrate-your-printer

https://github.com/MarlinFirmware/Marlin/issues/7171

https://groups.google.com/forum/#!topic/deltabot/SrmxHMxdgBE%5B176-200%5D


Then, I commented out

``` c

//  // 2 or 3 sets of coordinates for deploying and retracting the spring loaded touch probe on G29,
//  // if servo actuated touch probe is not defined. Uncomment as appropriate for your printer/probe.
//
//  // Kossel Mini
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_1_X 30.0
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_1_Y DELTA_PRINTABLE_RADIUS
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_1_Z 100.0
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_1_FEEDRATE XY_PROBE_SPEED
//
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_2_X 0.0
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_2_Y DELTA_PRINTABLE_RADIUS
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_2_Z 100.0
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_2_FEEDRATE (XY_PROBE_SPEED/10)
//
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_3_X Z_PROBE_ALLEN_KEY_DEPLOY_2_X * 0.75
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_3_Y Z_PROBE_ALLEN_KEY_DEPLOY_2_Y * 0.75
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_3_Z Z_PROBE_ALLEN_KEY_DEPLOY_2_Z
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_3_FEEDRATE XY_PROBE_SPEED
//
//  #define Z_PROBE_ALLEN_KEY_STOW_DEPTH 20
//  // Move the probe into position
//  #define Z_PROBE_ALLEN_KEY_STOW_1_X -64.0
//  #define Z_PROBE_ALLEN_KEY_STOW_1_Y 56.0
//  #define Z_PROBE_ALLEN_KEY_STOW_1_Z 23.0
//  #define Z_PROBE_ALLEN_KEY_STOW_1_FEEDRATE XY_PROBE_SPEED
//  // Move the nozzle down further to push the probe into retracted position.
//  #define Z_PROBE_ALLEN_KEY_STOW_2_X  Z_PROBE_ALLEN_KEY_STOW_1_X
//  #define Z_PROBE_ALLEN_KEY_STOW_2_Y  Z_PROBE_ALLEN_KEY_STOW_1_Y
//  #define Z_PROBE_ALLEN_KEY_STOW_2_Z  (Z_PROBE_ALLEN_KEY_STOW_1_Z-Z_PROBE_ALLEN_KEY_STOW_DEPTH)
//  #define Z_PROBE_ALLEN_KEY_STOW_2_FEEDRATE (XY_PROBE_SPEED/10)
//  // Raise things back up slightly so we don't bump into anything
//  #define Z_PROBE_ALLEN_KEY_STOW_3_X  Z_PROBE_ALLEN_KEY_STOW_2_X
//  #define Z_PROBE_ALLEN_KEY_STOW_3_Y  Z_PROBE_ALLEN_KEY_STOW_2_Y
//  #define Z_PROBE_ALLEN_KEY_STOW_3_Z  (Z_PROBE_ALLEN_KEY_STOW_1_Z+Z_PROBE_ALLEN_KEY_STOW_DEPTH)
//  #define Z_PROBE_ALLEN_KEY_STOW_3_FEEDRATE (XY_PROBE_SPEED/2)
//
//  #define Z_PROBE_ALLEN_KEY_STOW_4_X 0.0
//  #define Z_PROBE_ALLEN_KEY_STOW_4_Y 0.0
//  #define Z_PROBE_ALLEN_KEY_STOW_4_Z Z_PROBE_ALLEN_KEY_STOW_3_Z
//  #define Z_PROBE_ALLEN_KEY_STOW_4_FEEDRATE XY_PROBE_SPEED
//
//#endif // Z_PROBE_ALLEN_KEY
```

There's also an error check to see if the Allen Key has been stowed.  So, I had to edit Marlin_main.ccp.  Editing out where it checked for the Allen Key being stowed.

``` c
  // // TRIGGERED_WHEN_STOWED_TEST can easily be extended to servo probes, ... if needed.
  // #if ENABLED(PROBE_IS_TRIGGERED_WHEN_STOWED_TEST)
  //   #if ENABLED(Z_MIN_PROBE_ENDSTOP)
  //     #define _TRIGGERED_WHEN_STOWED_TEST (READ(Z_MIN_PROBE_PIN) != Z_MIN_PROBE_ENDSTOP_INVERTING)
  //   #else
  //     #define _TRIGGERED_WHEN_STOWED_TEST (READ(Z_MIN_PIN) != Z_MIN_ENDSTOP_INVERTING)
  //   #endif
  // #endif

```
