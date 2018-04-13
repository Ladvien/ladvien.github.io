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


I've got all my fans connected to D9 on the RAMPs board.  I want them to stay on all the time, to do this I changed

```c
/**
 * Extruder cooling fans
 *
 * Extruder auto fans automatically turn on when their extruders'
 * temperatures go above EXTRUDER_AUTO_FAN_TEMPERATURE.
 *
 * Your board's pins file specifies the recommended pins. Override those here
 * or set to -1 to disable completely.
 *
 * Multiple extruders can be assigned to the same pin in which case
 * the fan will turn on when any selected extruder is above the threshold.
 */
#define E0_AUTO_FAN_PIN 9
#define E1_AUTO_FAN_PIN -1
#define E2_AUTO_FAN_PIN -1
#define E3_AUTO_FAN_PIN -1
#define E4_AUTO_FAN_PIN -1
#define EXTRUDER_AUTO_FAN_TEMPERATURE 50
#define EXTRUDER_AUTO_FAN_SPEED   255  // == full speed

```
But to get this to work, you also have to add `#undef FAN_PIN` in `pins_RAMP.h`

``` c
#if ENABLED(IS_RAMPS_EFB)                      // Hotend, Fan, Bed
  #define FAN_PIN        RAMPS_D9_PIN
  #define HEATER_BED_PIN RAMPS_D8_PIN
#elif ENABLED(IS_RAMPS_EEF)                    // Hotend, Hotend, Fan
  #define HEATER_1_PIN   RAMPS_D9_PIN
  #define FAN_PIN        RAMPS_D8_PIN
#elif ENABLED(IS_RAMPS_EEB)                    // Hotend, Hotend, Bed
  #define HEATER_1_PIN   RAMPS_D9_PIN
  #define HEATER_BED_PIN RAMPS_D8_PIN
#elif ENABLED(IS_RAMPS_EFF)                    // Hotend, Fan, Fan
  #define FAN_PIN        RAMPS_D9_PIN
  #define FAN1_PIN       RAMPS_D8_PIN
#elif ENABLED(IS_RAMPS_SF)                     // Spindle, Fan
  #define FAN_PIN        RAMPS_D8_PIN
#else                                          // Non-specific are "EFB" (i.e., "EFBF" or "EFBE")
  #define FAN_PIN        RAMPS_D9_PIN
  #define HEATER_BED_PIN RAMPS_D8_PIN
  #if HOTENDS == 1
    #define FAN1_PIN     MOSFET_D_PIN
  #else
    #define HEATER_1_PIN MOSFET_D_PIN
  #endif
#endif
#undef FAN_PIN
```

Thanks to [Bob-the-Kuhn](https://github.com/MarlinFirmware/Marlin/issues/5940#issuecomment-36658067) for this fix.



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

//  // Kossel Mini
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_1_X 30.0
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_1_Y DELTA_PRINTABLE_RADIUS
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_1_Z 100.0
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_1_FEEDRATE XY_PROBE_SPEED

//  #define Z_PROBE_ALLEN_KEY_DEPLOY_2_X 0.0
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_2_Y DELTA_PRINTABLE_RADIUS
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_2_Z 100.0
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_2_FEEDRATE (XY_PROBE_SPEED/10)

//  #define Z_PROBE_ALLEN_KEY_DEPLOY_3_X Z_PROBE_ALLEN_KEY_DEPLOY_2_X * 0.75
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_3_Y Z_PROBE_ALLEN_KEY_DEPLOY_2_Y * 0.75
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_3_Z Z_PROBE_ALLEN_KEY_DEPLOY_2_Z
//  #define Z_PROBE_ALLEN_KEY_DEPLOY_3_FEEDRATE XY_PROBE_SPEED

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

//  #define Z_PROBE_ALLEN_KEY_STOW_4_X 0.0
//  #define Z_PROBE_ALLEN_KEY_STOW_4_Y 0.0
//  #define Z_PROBE_ALLEN_KEY_STOW_4_Z Z_PROBE_ALLEN_KEY_STOW_3_Z
//  #define Z_PROBE_ALLEN_KEY_STOW_4_FEEDRATE XY_PROBE_SPEED

// #endif // Z_PROBE_ALLEN_KEY
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


Something I noticed, before you can get M666 to work you have to activate it using:

```
M111 S32
```

Then, you should be able to send M666 codes.

```
M666 Z1.0 Y1.0 X1.0
```


To get my fan automatically going, I changed

pins_RAMPS.h

``` c
...
//
/**
 * Controller Fan
 * To cool down the stepper drivers and MOSFETs.
 *
 * The fan will turn on automatically whenever any stepper is enabled
 * and turn off after a set period after all steppers are turned off.
 */
#define USE_CONTROLLER_FAN
#if ENABLED(USE_CONTROLLER_FAN)
  #define CONTROLLER_FAN_PIN 9  // Set a custom pin for the controller fan
  #define CONTROLLERFAN_SECS 60          // Duration in seconds for the fan to run after all motors are disabled
  #define CONTROLLERFAN_SPEED 255        // 255 == full speed
#endif
...
```

This let's me set D9 to automatically come on here in configuration_adv.h

``` c
//#define USE_CONTROLLER_FAN
#if ENABLED(USE_CONTROLLER_FAN)
  #define CONTROLLER_FAN_PIN 9  // Set a custom pin for the controller fan
  #define CONTROLLERFAN_SECS 60          // Duration in seconds for the fan to run after all motors are disabled
  #define CONTROLLERFAN_SPEED 255        // 255 == full speed
#endif
```