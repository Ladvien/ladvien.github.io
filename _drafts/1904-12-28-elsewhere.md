---
layout: post
title: Elsewhere -- iPrusa 3 Steel
categories: robot
series: Elsewhere
excerpt:
tags: [prussa, 3d-printer]
image: 
    feature: 
comments: true
custom_css:
custom_js: 
---


### Fixing Hotend stops Printing Halfway into Print

Tried:
1. Changing extruder motor -- no change
2. Reducing retract length and speed -- no change
3. Cold pulling the hotend -- no change
4. Cleaning hotend gears -- no change
5. Reducing print speed by half -- no change
6. Tighting extruder tensioner way down -- no change
7. Check filament-spool tension while printing
8. Clean between guide and tungsten-screw-thing (see image) -- no change
9. Switched temperature_control.hotend.thermistor to Semitec from RRRF100K
10. Recalibrated extruder -- no change
```
M92 Exxx
Formula:Input measurement/Actual **measurement** * Old M92 value = New M92 value
```
11. Changed Cura's nozzel size from 2.85 to 1.75 
12. M207 S3.0000 F2700.0000 Z0.0000 Q6000.0000 P57988 to M207 S0.8000 F350 Z0.5000 Q6000.000 -- print worked
https://e3d-online.dozuki.com/Answers/View/136/Retraction+speed+and+acceleration+settings
The retraction speed and length was the issue.  I think it was retracting the filament too far and fast.  This would result in a jam as the extruder tried to shove it back in.  The prints are looking clean.

One other note, it appears the Octoprint actually has an extruder default feedrate setting.  This as causing my extruder to go too fast and miss steps.  Changed it from 300 to 150.  It is is found in "Settings" -> Printer Profile -> Edit Printer (Wrench icon) -> Axes


### Retraction Calibration
Now I've solved the issue with the halfway-stop, I'm seeing a lot of stringing.  I'm going to attempt to increase the retraction speed and legnth.  I'm hoping to find a happy medium between the halfway-stop issue and stringing.  Here goes.

I've changed from:
M207 S0.8000 F350 Z0.5000 Q6000.000
To
M207 S1.2000 F700 Z0.5000 Q6000.000
No improvement -- Then to
M207 S1.4000 F1500 Z0.000 Q6000.000
Had the Oozer issue
Little improbment -- Then to
M207 S1.4000 F5000.0000 Z0.0000 

https://plus.google.com/107980634858406533725/posts/hgoqWhEVWTL
```
I have been running BLTouch with my MKS SBase board for a while, and this is the probing script I use. This script takes into account a calibrated Z offset of 3.2mm for my mounting. I have a cartesian machine, but that is irrelevant to the operation of the BLTouch.

BedLevel.gcode
--------------------------------------------
G91 ; relative positioning
G1 Z007 ; lift 7 mm to clear probe far enough above bed
G90 ; absolute positioning

M280 S10.6 ; Clear any BLTouch alarm
M280 S7.0 ; Stow probe

G28 ; Home XY

M280 S3.0 ; Deploy Probe
G32 ; Probe Bed for leveling (probes 3 point)
G1 X80 Y150 F6000; Center probe on bed (offset from print head)
G30 Z3.2 ;Move to Nozzle Offset True Zero (calibrated Z offset)
M280 S7 ; Stow probe

-----------------------------------------------

To calibrate Z height to input into the G30 command, I do this:

G1 X100 Y150 ;(Replace X and Y with your center)
M280 S3.0 ; Deploy Probe
G30 Z0 ;Probe point
M280 S7 ; retract probe

Then manually drop the Z in 0.1 increments until the nozzle grabs paper. For me, that was 3.2mm, so my script does a G30 Z3.2 to tell it that the BLTouch trigger point is really at Z=3.2mm.

The BLTouch has a behavior that after probing, it pushes the pin down again pretty quickly, so once you issue the G30, you should immediately retract the probe (via script). It's a pain to do line-by-line in a terminal.
```
Now, at this point, I've moved the value I got to a the script in place of `G30 Z3.2`.  Using octoprint I've put this script into `.octoprint/scripts/gcode/bed_level` and made a button.  **Note, if you need to fine tune it, the higher the G30 Z value the closer the hotend will be to the bed.**
```

-----------------------------------------------
Config parts that matter:

##Servo
switch.servo.enable                          true            #
switch.servo.input_on_command                M280 S3.0 switch.servo.input_off_command               M280 S7.0
switch.servo.output_pin                      1.23            
switch.servo.output_type                     hwpwm    
switch.servo.pwm_period_ms                   20        

# Levelling strategy
leveling-strategy.three-point-leveling.enable         true
leveling-strategy.three-point-leveling.point1         120.0,0.0
leveling-strategy.three-point-leveling.point2         200.0,230.0
leveling-strategy.three-point-leveling.point3         40.0,230.0  
leveling-strategy.three-point-leveling.home_first     true        
leveling-strategy.three-point-leveling.tolerance      0.03        
leveling-strategy.three-point-leveling.probe_offsets  40,0,0 
leveling-strategy.three-point-leveling.save_plane     true

## Z-probe
zprobe.enable                                true 
zprobe.probe_pin                             1.28v 
zprobe.slow_feedrate                         10   
zprobe.fast_feedrate                         100  
gamma_min_endstop                           nc    
```

### The Ooze

### The Thermistor

When I went to reassemble the thermistor on the Titan Areo head, the it wouldn't fit.  Note, if I did it again, I would have used a cigarette lighter or heatgun to heat the block up a whole lot first.  I think the trouble was a little bit of solid plastic from the ooze incident mentioned above.

Anyway, the f'er broke.

I had to buy some new ones.  But only 1 out of 3 worked. (So far.)

The new thermistors are HT100K
https://www.amazon.com/gp/product/B07D9LSKWK/ref=ppx_yo_dt_b_asin_title_o00_s00?ie=UTF8&psc=1

```
temperature_control.hotend.thermistor        HT100K	      # see http://smoothieware.org/temperaturecontrol#toc5
```


### The Tangled Filament


### Elsewhere parts

Extruder carriage.
https://www.thingiverse.com/thing:2567051

### Switched Extruder
https://www.thingiverse.com/thing:3162291

### X-Carraige I used 
https://www.thingiverse.com/thing:2088585

### M502 Sucks
It deletes everything.

#### Calibration from **Scratch**

#### Acceleration
Calibrate acceleration.  It was set to `500`, but this caused extremely slow acceleration.  The point of the steel is to increase rigidity and allow for a faster extruder acceleration.

I started by increasing it to 1000
```
M204 S1000
```
But the acceleration delay was still noticable.  I increased it again:
```
M204 S3000
```
And there was no visible delay when moving 100 mm on the X axis.


### Calibration of Extruder


#### New Y-Endstop
Easy to make.  

Adjustments to the endstop can be made with `M306 Yxxx Xxxx Zxxx`.  And adjustments to the probe offset made with `M565 Yxxx Xxxx Zxxx`