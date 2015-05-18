---
layout: article
title: A Friendly Overlord
categories: robots
excerpt:
tags: [robots]
image:
  feature: Friendly_Overlord.jpg
  teaser: Friendly_Overlord.jpg
  thumb:
comments: true
---

Originally posted on [www.letsmakerobots.com](www.letsmakerobots.com)

I've been working on this one in silence for a bit.  

Awhile back it hit me, before I started growing my [Overlord project](http://letsmakerobots.com/node/38208) in complexity I wanted to refine it for ease-of-use. Therefore, I began translating my Overlord project into a Python module I could build off.

<a class="btn" href="https://github.com/Ladvien/Overlord" target="">A Friendly Overlord</a>

I figure, this would make it easier for anyone to use. This includes myself, I've not forgotten my identity as a hack, nor will anyone who pops the hood on this module :)  

But, at its core, there are few essential inputs:

1.  Color to track.
2.  Compass reading.

So, I spent some time translating the code into a callable module.  This experiment was mainly for my own use, yet I knew it'd grow healthier if I had LMR's feedback, elder or noob.

When I started _I actually planned_ (gasp) out what would make this code more user friendly.  I didn't think long; the two things that have taken the most time tweaking to get this code useful are:

1.  Adjusting the compass heading.
2.  Selecting the color to track.

To address the first issue, I developed a "auto-compass calibration function."

{% highlight python %}
def mapper(x, in_min, in_max, out_min, out_max):
    #This will map numbers onto others.
    return ((x-in_min)*(out_max -out_min)/(in_max - in_min) + out_min)

def compass(headingDegrees):
    global compassInitFlag
    global initialRawHeading
    global intRx

    #This sets the first compass reading to our 0*.
    if compassInitFlag == False:
       initialRawHeading = headingDegrees
       compassInitFlag = True
       print initialRawHeading
       exit

    #This is the function that actually maps offsets the compass reading.
    global intialRawHeading
    if headingDegrees >= initialRawHeading:
        adjHeading = mapper(headingDegrees, initialRawHeading, 360, 0, (360-initialRawHeading))
    elif headingDegrees <= initialRawHeading:
        adjHeading = mapper(headingDegrees, 0, (initialRawHeading-1),(360-initialRawHeading), 360)

    #Here, our compass reading is loaded into intRx
    intRx = adjHeading
{% endhighlight %}

Basically, this function takes the very first compass reading and adjusts all other readings.  So, all you have to do is put your robot in the direction you want it to consider "North," start your code, and this function will convert all other readings.

![](/images/Friendly_Overlord_--_Color_Selector.jpg)

The second issue took me a little longer to deal with: easy color selection.  In short, I rewrote most of the color detection parts of the code to take advantage of the OpenCV's [CamShift](http://docs.opencv.org/trunk/doc/py_tutorials/py_video/py_meanshift/py_meanshift.html) algorithm.  This function is more resilient to lighting changes or other near color objects, but it is also more CPU intensive.  At some point, I'll probably go back and write a variant that sticks with the old largest-target-color-mass method.  

Ok, what this means for the user?  When the code starts you select the color you'd like by left-click and dragging a selection box over an area.  The mean color of the selected area will be tracked and this will also start the rest of the code.

What does Friendly Overlord give you?

Well, a lot.  And when I finish writing the damn thing, more than alot.

Here's a list, and only one bit is untrue.

1.  It tracks your robot, providing its x and y relative to your webcam.
2.  It will provide a target coordinates, which I'll later make addressable in case someone wants to do something cool, rather than have their robot drive around and catch virtual dots. Lame.
3.  It will take the compass reading you provide, translate it to a heading relative to the camera, then, it will send commands to your robot telling it to turn until it is in alignment, then move towards the target.
4.  Make you a cuppa (CP, DanM, did I use that right?)
5.  It will allow you to tweak pretty much any element of the code (e.g., overlord.targetProximity = 5)

What does it **not** do?

1.  Take care of your serial data.  You're own your on, bud.
2.  Write your robot uC code for you.
3.  Provide you with your robot's heading (though, when I delve into two-color detection this could be done with two-dots on your bot.  But really, it'd be easier and near cheaper to get an HMC5883L).

Alright, so let's talk code.  How little code does it take to use it?

{% highlight python linenos %}
import serial
from time import sleep
import threading
import overlord

#Initialize Overlord variables.
overlord.dVariables()

#Open COM port to tether the bot.
ser = serial.Serial('COM34', 9600)

def OpenCV():
    #Execute the Overlord.
    overlord.otracker()

def rx():
    while(True):
        # Read the newest output from the Arduino
        if ser.readline() != "":
            rx = ser.readline()
            rx = rx[:3]
            rx = rx.strip()
            rx = rx.replace(".", "")
            #Here, you pass Overlord your raw compass data.  
            overlord.compass(int(rx))

def motorTimer():
    while(1):
        #This is for threading out the motor timer.  Allowing for control
        #over the motor burst duration.  There has to be both, something to write and
        #the motors can't be busy.
        if overlord.tranx_ready == True and overlord.motorBusy == False:
            ser.write(overlord.tranx)
            ser.flushOutput() #Clear the buffer?
            overlord.motorBusy = True
            overlord.tranx_ready = False
        if overlord.motorBusy == True:
            sleep(.2) #Sets the motor burst duration.
            ser.write(overlord.stop)
            sleep(.3) #Sets time inbetween motor bursts.
            overlord.motorBusy = False

#Threads OpenCV stuff.
OpenCV = threading.Thread(target=OpenCV)
OpenCV.start()

#Threads the serial functions.
rx = threading.Thread(target=rx)
rx.start()

#Threads the motor functions.
motorTimer = threading.Thread(target=motorTimer)
motorTimer.start()
{% endhighlight %}

This is fully functional code.  You'll notice that really, only about 10 lines get Friendly Overlord going, the rest handle Serial functions and motor firing.  Be warned, the motor firing code will change, since it is written how I like it right now, eventually will be designed to be as flexible as possible.

Walkthrough:

1.  overlord.dVariables() #Sets the Friendly Overlord variables.
2.  overlord.otracker() # The module's heart.  Handles color tracking, angle calculation, etc.
3.  overlord.compass(x) # You pass it an compass heading as an integer in degrees (0-360) and it does the rest.
4.  overlord.tranx_ready # Simple flag to indicate last bit of serial data has be sent.
5.  <span style="line-height: 1.231;">overlord.tranx # Variable that contains the serial command to be sent to the robot.</span>
6.  <span style="line-height: 1.231;">overlord.motorBusy # Flag to indicate if the robot is still in the middle of a movement.</span>

That's about it.  In the module? 399 lines of code, or so.  Still relatively small for a program but not something I want to wade through without a damned good reason.

Ok.  So, where am I going with this?

Hell if I know.  I want to make it as versatile as possible.  Eventually, I'd like to be tracking nth number of robots.  I envision a swarm of [Yahmez' Baby bots](http://letsmakerobots.com/node/39306) flying all over the place, Friendly Overlord tracking them, and communicating with them via IR.

But in the more immediate future, I'd like to make every variable tweakable.  Especially, variables useful to others.  For instance, the overlord.tX and overlord.tY are currently controlled by the module.  They are simply randomized numbers.  But, I'll make a flag in the next two days to take control of them from your own code.  You can decide where you'd like your robot to go.  Whether it be to your mouse pointer (overlord.targetY = overlord.mouseY) or a complex set of way-points to lead him through a maze.  Really, I'll probably code around the feedback I get.

Now, some obligatory stuff.

Here are some of the current variables addressable from your program:

{% highlight python %}
#How close to does the robot need to be? Greater is less accurate.
#Defaults to 5.
overlord.targetProximity = 5

#GUI X, Y
#Defaults to 0, 0
overlord.guiX = 440
overlord.guiY = 320

#Random target constraint; so target doesn't get placed too far from center.
#Defaults to 1, 640, 1, 480
overlord.targetLeftLimit = 20
overlord.targetRightLimit = 400
overlord.targetBottomLimit = 320
overlord.targetTopLimit = 20
{% endhighlight %}

But I'd like to make every variable needed by the user available.

Ok.  So, here's what I need: **Someone to use it and provide feedback.**  I'm getting too close to it and bleary of thought.

I've thought of doing a few things to get some feedback:

1.  Setup a challenge (I've got some surplus).
2.  Offer to mail one person a month a setup (two Bluetooth PCBs and a cheap webcam).

Any suggestions?

I think I'll make a walkthrough video pretty soon (kinda miss making stupid videos) but I'm a little worn out right now.
