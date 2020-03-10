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
```
M92 Exxx
Formula:Input measurement/Actual **measurement** * Old M92 value = New M92 value
```



#### New Y-Endstop
Easy to make.  

Adjustments to the endstop can be made with `M306 Yxxx Xxxx Zxxx`.  And adjustments to the probe offset made with `M565 Yxxx Xxxx Zxxx`

### Hotend Won't Hit Target and Auto PID
When I started using TPU (flexible filament) I ran into an issue where Elsewhere would autodisconnect in ambient temperature 18c (65f).  It irked me to none other, because the error reads as "Temperature took too long to be reached	Check the heater is alright, and if it is, you need to adjust your temperature safety parameters." (Smoothieware Error 32.)  But the word made it seem as if the temperature probe was malfunctioning.

I tried using hte Auto PID.  This is meant to calibrate the temperature settings and hotend output.  It would not complete the autotune cycle if the part fan was blowing.
```
M303 E0 S190
```

I did a bit of Googling and found it was the hotend sock which was the issue.

#### Hotend Sock
Pretty much the first hit on Google was the answer I needed:

From [3D Printing Stack Exchange](https://3dprinting.stackexchange.com/questions/8041/unable-to-hit-hot-end-temperature-with-part-cooler-on)


> This is a test to simulate the issue. The first drop is the fan kicking on, then the last bump is me turning the fan off. It's almost as if the set point drops when the fan kicks in. Any ideas? The PID is tuned (I ran the autotune) and works well without the fan on. This is a RepRap Guru Prusa clone

This guy's response made sense to me, as I didn't have my hotend silicon sock on the hotend.

> This effect you describe is a commonly known problem that occurs when the print part cooling fan is not correctly positioned, i.e. if it blows air directly onto the nozzle or heater block and is best solved by printing an alternative part cooling fan duct. Alternatively you could insulate the heater block with some insulation cotton or silicone socks that fit over the heater block.

Well, luckily, I had some extra hotend condemns, er, I mean "socks."  I threw one on the hotend and reran the AutoPID command.  Problem solved.

# Setting Probe Offsets
```
# M565 X  Y  Z (I don't think Z is used on Cartesian prints.)
M565 X42.0 Y-38.0 Z0.0
# Save the new settings
M500
# Show our new settings
M501
```


```
# Changed:
# delta_current 1.5 -> 1.8 -> 1.5
# retract_feedrate 45 -> 30
# extruder.hotend.steps_per_mm 90 -> 837
# extruder.hotend.default_feed_rate               600 -> 400              # Default rate ( mm/minute ) for moves where only the extruder moves
# extruder.hotend.acceleration                    500 -> 400  

# NOTE Lines must not exceed 132 characters
# Robot module configurations : general handling of movement G-codes and slicing into moves
default_feed_rate                            10000             # Default rate ( mm/minute ) for G1/G2/G3 moves
default_seek_rate                            10000             # Default rate ( mm/minute ) for G0 moves
mm_per_arc_segment                           0.5              # Arcs are cut into segments ( lines ), this is the length for
                                                              # these segments.  Smaller values mean more resolution,
                                                              # higher values mean faster computation
mm_per_line_segment                          5                # Lines can be cut into segments ( not usefull with cartesian
                                                              # coordinates robots ).

# Arm solution configuration : Cartesian robot. Translates mm positions into stepper positions
alpha_steps_per_mm                           78.7402               # Steps per mm for alpha stepper
beta_steps_per_mm                            78.7402               # Steps per mm for beta stepper
gamma_steps_per_mm                           400             # Steps per mm for gamma stepper

# Planner module configuration : Look-ahead and acceleration configuration
planner_queue_size                           32               # DO NOT CHANGE THIS UNLESS YOU KNOW EXACTLY WHAT YOU ARE DOING
acceleration                                 7000             # Acceleration in mm/second/second.
z_acceleration                               7000             # Acceleration for Z only moves in mm/s^2, 0 uses acceleration which is the default. DO NOT SET ON A DELTA
acceleration_ticks_per_second                1000             # Number of times per second the speed is updated
junction_deviation                           0.02             # Similar to the old "max_jerk", in millimeters,
                                                              # see https://github.com/grbl/grbl/blob/master/planner.c
                                                              # and https://github.com/grbl/grbl/wiki/Configuring-Grbl-v0.8
                                                              # Lower values mean being more careful, higher values means being
                                                              # faster and have more jerk
#z_junction_deviation                        0.0              # for Z only moves, -1 uses junction_deviation, zero disables junction_deviation on z moves DO NOT SET ON A DELTA
#minimum_planner_speed                       0.0              # sets the minimum planner speed in mm/sec





# Stepper module configuration
microseconds_per_step_pulse                  1                # Duration of step pulses to stepper drivers, in microseconds
base_stepping_frequency                      100000           # Base frequency for stepping, higher gives smoother movement

# Cartesian axis speed limits
x_axis_max_speed                             15000            # mm/min
y_axis_max_speed                             15000            # mm/min
z_axis_max_speed                             25000            # mm/min

# Stepper module pins ( ports, and pin numbers, appending "!" to the number will invert a pin )
alpha_step_pin                               2.0              # Pin for alpha stepper step signal
alpha_dir_pin                                0.5!              # Pin for alpha stepper direction
alpha_en_pin                                 0.4              # Pin for alpha enable pin
alpha_current                                1.2             # X stepper motor current
alpha_max_rate                               10000.0          # mm/min

beta_step_pin                                2.1              # Pin for beta stepper step signal
beta_dir_pin                                 0.11             # Pin for beta stepper direction
beta_en_pin                                  0.10             # Pin for beta enable
beta_current                                 1.2             # Y stepper motor current
beta_max_rate                                10000.0          # mm/min

gamma_step_pin                               2.2              # Pin for gamma stepper step signal
gamma_dir_pin                                0.20!             # Pin for gamma stepper direction
gamma_en_pin                                 0.19             # Pin for gamma enable
gamma_current                                1.2              # Z stepper motor current
gamma_max_rate                               10000.0            # mm/min

# Serial communications configuration ( baud rate default to 9600 if undefined )
uart0.baud_rate                              250000           # Baud rate for the default hardware serial port
second_usb_serial_enable                     true            # This enables a second usb serial port (to have both pronterface
                                                              # and a terminal connected)
#leds_disable                                true             # disable using leds after config loaded
#play_led_disable                            true             # disable the play led
pause_button_enable                          true             # Pause button enable
#pause_button_pin                            2.12             # pause button pin. default is P2.12
#kill_button_enable                           false            # set to true to enable a kill button
#kill_button_pin                              2.12             # kill button pin. default is same as pause button 2.12 (2.11 is another good choice)
#msd_disable                                 false            # disable the MSD (USB SDCARD) when set to true (needs special binary)
#dfu_enable                                  false            # for linux developers, set to true to enable DFU

# Extruder module configuration
extruder.hotend.enable                          true             # Whether to activate the extruder module at all. All configuration is ignored if false
extruder.hotend.steps_per_mm                    837              # Steps per mm for extruder stepper
extruder.hotend.default_feed_rate               400              # Default rate ( mm/minute ) for moves where only the extruder moves
extruder.hotend.acceleration                    400              # Acceleration for the stepper motor, as of 0.6, arbitrary ratio
extruder.hotend.max_speed                       50               # mm/s

extruder.hotend.step_pin                        2.3              # Pin for extruder step signal
extruder.hotend.dir_pin                         0.22!             # Pin for extruder dir signal
extruder.hotend.en_pin                          0.21             # Pin for extruder enable signal

# extruder offset
#extruder.hotend.x_offset                        0                # x offset from origin in mm
#extruder.hotend.y_offset                        0                # y offset from origin in mm
#extruder.hotend.z_offset                        0                # z offset from origin in mm

# firmware retract settings when using G10/G11, these are the defaults if not defined, must be defined for each extruder if not using the defaults
#extruder.hotend.retract_length                  3               # retract length in mm
#extruder.hotend.retract_feedrate                25              # retract feedrate in mm/sec
#extruder.hotend.retract_recover_length          0               # additional length for recover
#extruder.hotend.retract_recover_feedrate        8               # recover feedrate in mm/sec (should be less than retract feedrate)
#extruder.hotend.retract_zlift_length            0               # zlift on retract in mm, 0 disables
#extruder.hotend.retract_zlift_feedrate          6000            # zlift feedrate in mm/min (Note mm/min NOT mm/sec)

delta_current                                1.5             # First extruder stepper motor current

# Second extruder module configuration
#extruder.hotend2.enable                          true             # Whether to activate the extruder module at all. All configuration is ignored if false
#extruder.hotend2.steps_per_mm                    140              # Steps per mm for extruder stepper
#extruder.hotend2.default_feed_rate               600              # Default rate ( mm/minute ) for moves where only the extruder moves
#extruder.hotend2.acceleration                    500              # Acceleration for the stepper motor, as of 0.6, arbitrary ratio
#extruder.hotend2.max_speed                       50               # mm/s

#extruder.hotend2.step_pin                        2.8              # Pin for extruder step signal
#extruder.hotend2.dir_pin                         2.13             # Pin for extruder dir signal
#extruder.hotend2.en_pin                          4.29             # Pin for extruder enable signal

#extruder.hotend2.x_offset                        0                # x offset from origin in mm
#extruder.hotend2.y_offset                        25.0             # y offset from origin in mm
#extruder.hotend2.z_offset                        0                # z offset from origin in mm
#epsilon_current                              1.5              # Second extruder stepper motor current


# Laser module configuration
laser_module_enable                          false            # Whether to activate the laser module at all. All configuration is
                                                              # ignored if false.
#laser_module_pin                             2.5             # this pin will be PWMed to control the laser. Only P2.0 - P2.5, P1.18, P1.20, P1.21, P1.23, P1.24, P1.26, P3.25, P3.26
                                                              # can be used since laser requires hardware PWM
#laser_module_max_power                       0.8             # this is the maximum duty cycle that will be applied to the laser
#laser_module_tickle_power                    0.0             # this duty cycle will be used for travel moves to keep the laser
                                                              # active without actually burning
#laser_module_pwm_period                      20              # this sets the pwm frequency as the period in microseconds

# Hotend temperature control configuration
temperature_control.hotend.enable            true             # Whether to activate this ( "hotend" ) module at all.
                                                              # All configuration is ignored if false.
temperature_control.hotend.thermistor_pin    0.24             # Pin for the thermistor to read
temperature_control.hotend.heater_pin        2.7              # Pin that controls the heater, set to nc if a readonly thermistor is being defined   2.7
temperature_control.hotend.thermistor        HT100K	      # see http://smoothieware.org/temperaturecontrol#toc5
#temperature_control.hotend.beta             3990             # or set the beta value
temperature_control.hotend.set_m_code        104              #
temperature_control.hotend.set_and_wait_m_code 109            #
temperature_control.hotend.designator        T                #

#temperature_control.hotend.p_factor         13.7             # permanently set the PID values after an auto pid
#temperature_control.hotend.i_factor         0.097            #
#temperature_control.hotend.d_factor         24               #

#temperature_control.hotend.max_pwm          255               # max pwm, 64 is a good value if driving a 12v resistor with 24v.

# Hotend2 temperature control configuration
#temperature_control.hotend2.enable            true             # Whether to activate this ( "hotend" ) module at all.
                                                              # All configuration is ignored if false.

#temperature_control.hotend2.thermistor_pin    0.25             # Pin for the thermistor to read
#temperature_control.hotend2.heater_pin        2.6             # Pin that controls the heater
#temperature_control.hotend2.thermistor        RRRF100K        # see http://smoothieware.org/temperaturecontrol#toc5
##temperature_control.hotend2.beta             4066             # or set the beta value
#temperature_control.hotend2.set_m_code        884              #
#temperature_control.hotend2.set_and_wait_m_code 889            #
#temperature_control.hotend2.designator        T1               #

#temperature_control.hotend2.p_factor          13.7           # permanently set the PID values after an auto pid
#temperature_control.hotend2.i_factor          0.097          #
#temperature_control.hotend2.d_factor          24             #

#temperature_control.hotend2.max_pwm          64               # max pwm, 64 is a good value if driving a 12v resistor with 24v.

temperature_control.bed.enable               true             #
temperature_control.bed.thermistor_pin       0.23             #
temperature_control.bed.heater_pin           2.5              #  2.5
temperature_control.bed.thermistor           RRRF100K    # see http://smoothieware.org/temperaturecontrol#toc5
#temperature_control.bed.beta                3960             # or set the beta value

temperature_control.bed.set_m_code           140              #
temperature_control.bed.set_and_wait_m_code  190              #
temperature_control.bed.designator           B                #

#temperature_control.bed.bang_bang            false           # set to true to use bang bang control rather than PID
#temperature_control.bed.hysteresis           2.0             # set to the temperature in degrees C to use as hysteresis
                                                              # when using bang bang

# Switch module for fan control
switch.fan.enable                            true             #
switch.fan.input_on_command                  M106             #
switch.fan.input_off_command                 M107             #
switch.fan.output_pin                        2.4              #
switch.fan.output_type                       pwm              # pwm output settable with S parameter in the input_on_comand
#switch.fan.max_pwm                           255              # set max pwm for the pin default is 255

#switch.misc.enable                           true             #
#switch.misc.input_on_command                 M42              #
#switch.misc.input_off_command                M43              #
#switch.misc.output_pin                       2.4              #
#switch.misc.output_type                      digital          # just an on or off pin

# automatically toggle a switch at a specified temperature. Different ones of these may be defined to monitor different temperatures and switch different swithxes
# useful to turn on a fan or water pump to cool the hotend
temperatureswitch.hotend.enable	             true             #
temperatureswitch.hotend.designator          T                # first character of the temperature control designator to use as the temperature sensor to monitor
temperatureswitch.hotend.switch              fan             # select which switch to use, matches the name of the defined switch
temperatureswitch.hotend.threshold_temp      60.0             # temperature to turn on (if rising) or off the switch
temperatureswitch.hotend.heatup_poll         15               # poll heatup at 15 sec intervals
temperatureswitch.hotend.cooldown_poll       60               # poll cooldown at 60 sec intervals

# Switch module for spindle control
#switch.spindle.enable                        false            #

# Endstops
endstops_enable                              true             # the endstop module is enabled by default and can be disabled here
#corexy_homing                               false            # set to true if homing on a hbit or corexy
alpha_min_endstop                            1.24^!            # add a ! to invert if endstop is NO connected to ground
alpha_max_endstop                            1.25^            # NOTE set to nc if this is not installed
alpha_homing_direction                       home_to_min      # or set to home_to_max and set alpha_max
alpha_min                                    0                # this gets loaded after homing when home_to_min is set
alpha_max                                    250              # this gets loaded after homing when home_to_max is set
beta_min_endstop                             1.26^!            #
beta_max_endstop                             1.27^            #
beta_homing_direction                        home_to_min      #
beta_min                                     0                #
beta_max                                     250              #
gamma_min_endstop                            1.28^!            #
gamma_max_endstop                            1.29^            #
gamma_homing_direction                       home_to_min      #
gamma_min                                    0                #
gamma_max                                    120              #

# optional order in which axis will home, default is they all home at the same time,
# if this is set it will force each axis to home one at a time in the specified order
#homing_order                                 XYZ              # x axis followed by y then z last

# optional enable limit switches, actions will stop if any enabled limit switch is triggered
#alpha_limit_enable                          false            # set to true to enable X min and max limit switches
#beta_limit_enable                           false            # set to true to enable Y min and max limit switches
#gamma_limit_enable                          false            # set to true to enable Z min and max limit switches

alpha_fast_homing_rate_mm_s                  50               # feedrates in mm/second
beta_fast_homing_rate_mm_s                   50               # "
gamma_fast_homing_rate_mm_s                  4                # "
alpha_slow_homing_rate_mm_s                  25               # "
beta_slow_homing_rate_mm_s                   25               # "
gamma_slow_homing_rate_mm_s                  2                # "

alpha_homing_retract_mm                      5                # distance in mm
beta_homing_retract_mm                       5                # "
gamma_homing_retract_mm                      1                # "

#endstop_debounce_count                       100              # uncomment if you get noise on your endstops, default is 100

# optional Z probe
#zprobe.enable                                false           # set to true to enable a zprobe
#zprobe.probe_pin                             1.28!^          # pin probe is attached to if NC remove the !
#zprobe.slow_feedrate                         5               # mm/sec probe feed rate
#zprobe.debounce_count                       100             # set if noisy
#zprobe.fast_feedrate                         100             # move feedrate mm/sec
#zprobe.probe_height                          5               # how much above bed to start probe
#gamma_min_endstop                           nc              # normally 1.28. Change to nc to prevent conflict,


############ BLTOUCH ############

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
leveling-strategy.three-point-leveling.probe_offsets  58,-38,0 
leveling-strategy.three-point-leveling.save_plane     true

## Z-probe
zprobe.enable                                true 
zprobe.probe_pin                             1.29v 
zprobe.slow_feedrate                         10   
zprobe.fast_feedrate                         100  
gamma_min_endstop                            nc 

####################################

# associated with zprobe the leveling strategy to use
#leveling-strategy.three-point-leveling.enable         true        # a leveling strategy that probes three points to define a plane and keeps the Z parallel to that plane
#leveling-strategy.three-point-leveling.point1         100.0,0.0   # the first probe point (x,y) optional may be defined with M557
#leveling-strategy.three-point-leveling.point2         200.0,200.0 # the second probe point (x,y)
#leveling-strategy.three-point-leveling.point3         0.0,200.0   # the third probe point (x,y)
#leveling-strategy.three-point-leveling.home_first     true        # home the XY axis before probing
#leveling-strategy.three-point-leveling.tolerance      0.03        # the probe tolerance in mm, anything less that this will be ignored, default is 0.03mm
#leveling-strategy.three-point-leveling.probe_offsets  0,0,0       # the probe offsets from nozzle, must be x,y,z, default is no offset
#leveling-strategy.three-point-leveling.save_plane     false       # set to true to allow the bed plane to be saved with M500 default is false

# Panel
panel.enable                                 true             # set to true to enable the panel code
#panel.lcd                                    smoothiepanel     # set type of panel
#panel.encoder_a_pin                          3.25!^            # encoder pin
#panel.encoder_b_pin                          3.26!^            # encoder pin

# Example for reprap discount GLCD
# on glcd EXP1 is to left and EXP2 is to right, pin 1 is bottom left, pin 2 is top left etc.
# +5v is EXP1 pin 10, Gnd is EXP1 pin 9
#panel.lcd                                   reprap_discount_glcd     #
#panel.spi_channel                           0                 # spi channel to use  ; GLCD EXP1 Pins 3,5 (MOSI, SCLK)
#panel.spi_cs_pin                            0.16              # spi chip select     ; GLCD EXP1 Pin 4
#panel.encoder_a_pin                         3.25!^            # encoder pin         ; GLCD EXP2 Pin 3
#panel.encoder_b_pin                         3.26!^            # encoder pin         ; GLCD EXP2 Pin 5
#panel.click_button_pin                      1.30!^            # click button        ; GLCD EXP1 Pin 2
#panel.buzz_pin                              1.31              # pin for buzzer      ; GLCD EXP1 Pin 1
#panel.back_button_pin                       2.11!^            # back button         ; GLCD EXP2 Pin 8
#panel.external_sd                     true              # set to true if there is an extrernal sdcard on the panel
#panel.external_sd.spi_channel         1                 # set spi channel the sdcard is on
#panel.external_sd.spi_cs_pin          0.28              # set spi chip select for the sdcard (or any spare pin)
#panel.external_sd.sdcd_pin            0.27!^            # sd detect signal (set to nc if no sdcard detect) (or any spare pin)



# pins used with other panels
#panel.up_button_pin                         0.1!              # up button if used
#panel.down_button_pin                       0.0!              # down button if used
#panel.click_button_pin                      0.18!             # click button if used

panel.menu_offset                            0                 # some panels will need 1 here

panel.alpha_jog_feedrate                     6000              # x jogging feedrate in mm/min
panel.beta_jog_feedrate                      6000              # y jogging feedrate in mm/min
panel.gamma_jog_feedrate                     200               # z jogging feedrate in mm/min

panel.hotend_temperature                     185               # temp to set hotend when preheat is selected
panel.bed_temperature                        60                # temp to set bed when preheat is selected

# Example of a custom menu entry, which will show up in the Custom entry.
# NOTE _ gets converted to space in the menu and commands, | is used to separate multiple commands
custom_menu.power_on.enable                true              #
custom_menu.power_on.name                  Power_on          #
custom_menu.power_on.command               M80               #

custom_menu.power_off.enable               true              #
custom_menu.power_off.name                 Power_off         #
custom_menu.power_off.command              M81               #

# Only needed on a smoothieboard
currentcontrol_module_enable                  true             #


return_error_on_unhandled_gcode              false            #

# network settings
network.enable                               true            # enable the ethernet network services
network.webserver.enable                     true             # enable the webserver
network.telnet.enable                        true             # enable the telnet server
#network.ip_address                           auto             # use dhcp to get ip address
# uncomment the 3 below to manually setup ip address
network.ip_address                           192.168.3.221    # the IP address
network.ip_mask                              255.255.255.0    # the ip mask
network.ip_gateway                           192.168.3.1      # the gateway address
#network.mac_override                         xx.xx.xx.xx.xx.xx  # override the mac address, only do this if you have a conflict
```