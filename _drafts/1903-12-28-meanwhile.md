---
layout: post
title: Meanwhile -- Kossel Mini Build
categories: robot
series: Meanwhile
excerpt:
tags: [kossel mini, 3d-printer]
image: 
    feature: 
comments: true
custom_css:
custom_js: 
---

#### Replacing Wheel Bearings

623ZZ
https://www.amazon.com/dp/B07FW257LJ/ref=psdc_3116521_t1_B075CLMYRT


#### Calibration
1. Home -- G28
2. Walk the head down until it touches.  Run `M114` and take the Z value away from the existing `M665` amount.  Then set Z height to the new value`M665 Zxxx`.  Make sure to save it using `M500`.
3. Run auto-calibration using `G32`.  Make sure to save the results using `M500`
4. Repeat step two (as the height has probably changed).

##### Stupid Force Resistor
I had to change the followin in the firmware:
```
leveling-strategy.three-point-leveling.tolerance   0.06  # Changed from deault since force resistor resolution isn't high enough.
```
Since 0.03 is the default and the force resistor I was using doesn't have high enough resolution for it.  Each time it would fail with, "probe was not repeatable with 0.03mm. Calibration failed to complete...".