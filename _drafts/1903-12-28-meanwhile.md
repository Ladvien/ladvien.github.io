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
Following information found:
http://smoothieware.org/delta

1. Measure arm length and arm radius.  Save these values using `M665 Larm_length Rarm_radius`
2. Home -- G28
3. Walk the head down until it touches.  Run `M114` and take the Z value away from the existing `M665` amount.  Then set Z height to the new value`M665 Zxxx`.  Make sure to save it using `M500`.
4. Run auto-calibration using `G32`.  Make sure to save the results using `M500`
5. Repeat step two (as the height has probably changed).
6. Calibrate the extrusion.