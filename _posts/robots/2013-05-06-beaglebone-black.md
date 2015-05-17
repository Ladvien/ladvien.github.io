---
layout: article
title: Beaglebone Black
categories: robots
excerpt:
tags: [robots]
image:
  feature: 6312263717_932956b10c_o.jpg
  teaser: 6312263717_932956b10c_o.jpg
  thumb:
comments: true
---

Originally posted on [www.letsmakerobots.com](www.letsmakerobots.com)

<div class="flex-video">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/99WxBqoRHk0" frameborder="0" allowfullscreen></iframe>
</div>
<div class="flex-video">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/pdXAGdvuocI" frameborder="0" allowfullscreen></iframe>
</div>
<div class="flex-video">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/99WxBqoRHk0" frameborder="0" allowfullscreen></iframe>
</div>
8/25/13:

This fellow here has made some pretty nifty walkthroughs on the rtl8192 and the Chronodot (DS3231) RTC on the Arch Linux.  Though I've not attempted his instructions (been burnt out on this board) I believe his instructions will get a reliable WiFi connection with the rtl8192, using Arch Linux, on the B^3.

*   [rtl8192 with Arch Linux](http://blog.lemoneerlabs.com/post/The-fruits-of-my-labor)
*   [Chronodot](http://blog.lemoneerlabs.com/post/time-y-wimey-stuff) (eBay: [DS3231](http://www.ebay.com/itm/Mini-RTCpro-DS3231-High-Precision-Clock-Module-Temperature-Measure-Arduino-/390645038556?pt=LH_DefaultDomain_0&hash=item5af4423ddc))

Also, when I get the energy, the pinout at the bottom of this page has a mistake or two.  As [Zaius](http://letsmakerobots.com/node/37063#comment-105076) pointed out.

EDIT: Ok. Don't use the pinout until I research more.  I'm getting conflicting information on what pins are what in Mode 7\. The reference manual is stating one thing, but other sources are agreeing with me.  I'm guessing Zaius is dead on; version issues. When I've got it sorted I'll update.

7/3/13:

Not much yet, still working on stable wifi.  I thought I might as well share my work log; embarrassing as it may be.  

If there are some Linux wise in the crowd (especially those knowing Arch Linux) would you mind taking a look at my work flow? I've got the wifi module working, though, it's not as stable as I'd like.

[http://cthomasbrittain.wordpress.com/2013/07/03/installing-8192cu-module-on-the-b3-running-arch-linux/](http://cthomasbrittain.wordpress.com/2013/07/03/installing-8192cu-module-on-the-b3-running-arch-linux/)

6/22/13

Wow.  Sorry all, been more than a month since I updated this post.  

I've not given up on the BBB as a robot platform; I realized I didn't know Linux well enough to begin tweaking it on embedded devices (well, devices lacking community support, at least).  I've spent the last month reading about Linux and trying to wrap my head around it (that and fixing _all of our_ bust-a-mucated cars).  

I grew up Microsoft and over this last month all household computers have switched to dual-booting Ubuntu 12.04 and Microsoft X.  And router will soon make the switch to OpenWRT.




Back to the BBB; the Realtek WiFi dongle that drove me mad has been solved by [these guys](https://groups.google.com/d/msg/beagleboard/lKjxmSaxR1I/UfE-iQWuPmMJ). I've not had time to attempt their walkthroughs, but it is on the agenda.

*   <span style="font-size: 13px; line-height: 1.231; text-align: center;">Walkthrough to setup the [rtl8192cu](http://www.codealpha.net/864/how-to-set-up-a-rtl8192cu-on-the-beaglebone-black-bbb/) drivers

I haven't found an Arch Linux image file, so I thought I'd cook one and post it for anyone who needs it.

![](/images/arch-linux-logo.png) [Arch Linux for the Beaglebone Black -- 6-20-13](http://www.ubermentis.com/files/Arch-Linux-BBB-%206-20-13.rar)

If anyone actually downloads the image, will you confirm it works for you?

Off topic a bit, I'm not sure if anyone else uses iDevices; but I did run into this app that I greatly enjoy.

[ServerAuditor](https://itunes.apple.com/us/app/server-auditor-ssh-client/id549039908?mt=8)

![](http://a3.mzstatic.com/us/r1000/085/Purple2/v4/66/bb/71/66bb7158-9ce6-66c8-a5f2-ebf6fd38f9f6/mzl.dimivwbc.320x480-75.jpg)It'll let you tunnel (SSH) into your Linux devices from either from an iPhone or iPad X.  I've enjoyed this for two reasons: I can keep an eye on how a program is compiling on the Raspberry Pi while watching a movie with the family, and, I like the feeling of running Linux on a closed system.  I understand it's a falsity, but it's still comforting.

I hope all are well.

5/20/13

Well, I think I could best describe this point in economic terms. It's the where I've realized my productive efficiency is being restricted due to the [current inabilities of technology.](http://en.wikipedia.org/wiki/Productive_efficiency)

**Figure 1**

![](/images/Production_Possibilities_Frontier_Curve_svg.jpg)

In essence, this graph shows that I cannot reach my desired productive efficiency (getting the B^3 to do the tricks I want it).  Really, I'd be happy at point C (even though point D is probably better for me and my family).  The problem is technology limitations are restricting me from getting to point C on the curve.  And it's bugging the hell out of me.  At first, I thought this was completely due to my ineptitude (which is partially true), but there is another barrier, a seemingly hidden one.  

**The current Beaglebone driver technology is a hidden barrier to this productivity point.**

I've read the warnings TinHead gave on treating embedded devices like computers.  But if they don't carry some extrordinary functions then what separates them from really, _really_ fast microcontrollers?  No.  I'm pushing to have some basic PC functionality.

For instance,

1.  WiFi capability.
2.  Easy access to a graphical interface (note, I'm not stating GUI).
3.  Ability to utilize higher-level programming languages (Python, C++, etc).

Really, that's it.  A few features to allow rapid prototyping while haranessing the power of open software.

To me, if these three features are achieved, then I feel like the device is complete.  Though, I should state, I've realize these three features are no simple feat.

So, where's the Beaglebone Black?  **Not there.**

Some things not supported that will need to be for me to get to point C (Fig. 1).

1.  **Ability to plug in cheap, low-power WiFi dongles and get them going in under an hour**.  Let's be honest.  Cheap is what 90% of us will go with.  It allows us to do more with our budgets.  Therefore, if an embedded device in anyway can utilize cheap peripherals, then let's focus on making it happen. [1](https://groups.google.com/d/msg/beagleboard/AvVtq2uOxlc/XBrq5ZS4ygwJ)
2.  **Better power-management on the software side**. Several distros will shutdown the board during boot-up, as the peak above 500mA. The designers suggestion?  Don't plug anything in until the board is up.  Sounds ok, right?  Well, don't forget there is no hot-plugging on the USB, microSD, or HDMI.  The drivers haven't been written yet.  I'm pretty sure this is due to drivers, since I've read through the BBB datasheet and the power supply hardware seems sound.
3.  **Ability to adjust the HDMI output**.  At one point, I had one point, I was trying to get Arch Linux up and I couldn't get in via SSH.  So, I plugged it into the only HDMI monitor I have and tried to adjust the ssh.config file.  The problem?  I couldn't see what was commented out due to the overscan.  I dig through Google group where the board designers rest; guess what?  There is no current way to adjust the video output. [2](https://groups.google.com/forum/#!starred/beagleboard/noddoRqaG5g)

Therefore, my conclusion (though, my insanity is rising), is:

**Figure 2**

![](/images/Hardware_Driver_limitations.jpg)

All this to say, my wife has taken away my Beaglebone Black until that green line moves farther out.

Yes, I am little-cat whipped, but she has said, "You're doing this to relax, not work a second job.  I'd rather you work on some other projects for awhile."  Hey, being married is the only thing keeping me sane.  Well, her and you guys (and girls, if Max didn't run them off :P).

5/16/13:

I've finally got the Black Bone near where I've got my Pi.  Here, the old Bone is running an **updated** [Angstrom](http://beagleboard.org/latest-) (4gb) build, using [WiFi dongle](http://www.fasttech.com/products/0/10000380/1054503-edup-ep-n8508-nano-150mbps-80211n-wireless-n-usb-w), and is connected to a 1A wall-wart (connected to microUSB not barrel-jack).  When I'm off work today I'll try to complete a "Box to Wireless" walkthrough for good 'ole Angstrom.

(Question, anyone else feel like there's a [Mason's](http://en.wikipedia.org/wiki/Free_mason) conspiracy going on in the embedded world?)

![](/images/Angstrom_VNC_Style.jpg)

I think I got near understanding TinHead's post: Don't treat an embedded device like a PC?  I dunno.

5/15/13

I was able to get my WiFi dongle up by adding the realtek8192 kernel.  Not sure all I did, but it works.  So, as soon as I can get some repeatable steps, I'll post a walkthrough of setting the Beaglebone Black up with PuTTY, VNC, and WiFi dongle.

5/14/13:b

Was able to get RealVNC to pick up Angstrom.  Working on getting WiFi dongle up.

5/14/13:a

I added some links to Bonescript GPIO walkthroughs (PWM, Analog, Blinking).

5/12/13:b

I've created a visual guide to mode 7 pinout (added below).

5/12/13:a

I'm pretty frustrated.  So, I'm going to back off working on the board until Tuesday when my 8gb microSD comes in.  At that point, I'll **[use this to reflash my eMMC boot partition](http://circuitco.com/support/index.php?title=Updating_The_Software)** and start working two different projects: Getting Arch Linux going well, and giving in and update && upgrade my Angstrom.  Both, I'll try to write up.

[Jerz](http://letsmakerobots.com/user/18705), or anyone else with a BBB, if you have any notes to add, if you don't mind shooting me an email I'll update this post.

Hope everyone had an awesome mother's day.

5/11/13:c

May I encourage anyone who has yet to order their B^3: **Wait.**

There are several intense issues being worked out on a hardware-software level.  Until then, I feel you'll be as frustrated as me.  Bdk6's pun says it all: **This board is being a bitch.**

**Some updates:**

*   The package manager that came with Angstrom was actually broken for awhile, and no one bothered mentioning it to the community.  Instead, there were many posts titled "why won't opkg work?"  Now, I believe it will work if you run update && upgrade, of course, to do that you must have an SD card since it will be larger than 2gb.
*   I got Arch Linux up, briefly (it takes both eMMC and SD).
*   I lost the appropriate boot file for my eMMC.  (While attempting Arch Linux).
*   There doesn't seem to be an easy way to flash eMMC back to stock (I've got to wait for a bigger card).
*   One of the only cool things I've seen yet is a [one wire(ish) pc.](http://digitaldiner.blogspot.com/2013/05/quick-hint-for-beaglebone-black-user.html)
*   The developers are pretty stressed out.  I don't see solid support for a bit.  And already seems like a us vs. them between the developers and open community
*   I'm tired.  Who's taking over?

5/11/13:b

So, I attempted getting my WiFi dongle setup (again) using Angstrom's [package manager](http://www.linuxtogo.org/gowiki/AngstromManual#InstallingSoftwareandPackageManagement).  I found that everything I tried installing using their package manager would shoot back an error.  I read, and I believe the problem is the following must be run to catch the Angstrom stock package manager up with desired packages.

**opkg update **
**opkg upgrade **

I ran them, and guess what? The eMMC does not have enough space to hold the updates.  Mother-of-a-Beagle!

![](/images/Upgrading_Angstrom_2.jpg)


Sadly, I'm using a microSD card from an old phone, which is only 2gb.  My 8gb is on order.

This, in my opinion, puts the **Beaglebone Black on the same level as the Raspberry Pi**; that is, it must have a SD card before you can use it (a card larger than 2gb).  If someone else finds a way to install things on the B^3 without updating it, let me know, I'll correct this critique.

5/11/13:a

Wrote up a [guide to restore Angstrom to the eMMC](http://letsmakerobots.com/node/37106).

5/10/13

I screwed up the eMMC partition while trying to get Arch Linux on the Beagle.

5/9/13: Oh, dear lord. It's true. Lack of community support kills the Beaglebone.

It took me nearly 9 hours to setup an OS on an MicroSD.  

I'll write it up tomorrow night, after some rest.

Ubuntu on Beaglebone Black:

**![](/images/IMG_0048.jpg)**

5/6/13

I got my Beaglebone Black (BBB, B^3) in today.  I thought I'd share my unboxing and general thoughts.  

Please don't take this as Mr. Jones on a Sunday drive, rather, I want to provide the touch-n-feel information for every robot builder here.  In short, I don't want everybody to waste $45 if the BBB is going to turn out to be Beagle sh..., well, you get it.

(Hey, Raspbery Pi puns could fill a library, I can't make one BBB pun.  Shesh.)

**BBB Development Group:**

[https://groups.google.com/forum/?fromgroups=#!categories/beagleboard/beaglebone-black](https://groups.google.com/forum/?fromgroups=#!categories/beagleboard/beaglebone-black)

This is a good place to find info to your specific problem.

**Beaglebone Black Educational Material** (aka, bathroom reading):

B^3 Manual:

[http://circuitco.com/support/index.php?title=BeagleBoneBlack#Hardware_Files](http://circuitco.com/support/index.php?title=BeagleBoneBlack#Hardware_Files)

Original Beaglebone tutorials

(these were **found by [JerZ](http://letsmakerobots.com/user/18705)**, thank you sir).

[http://www.youtube.com/playlist?list=PLF4A1A7E09E5E260A](http://www.youtube.com/playlist?list=PLF4A1A7E09E5E260A)

Hardware interfacing:

[http://www.nathandumont.com/node/250](http://www.nathandumont.com/node/250)

**Robot Support for B^3:**

This was found by [Vishu](http://letsmakerobots.com/user/17771),

"[Robotic Operating Software for BBB](http://letsmakerobots.com/links/goto/37129/412/links_weblink "http://www.ros.org/wiki/cturtle/Installation/Ubuntu/SVN")"

Get Vishu or MaxHirez to explain it; I'm still trying to make a light blink :(

**RPi vs BBB discussions:**

[http://www.element14.com/community/thread/23575?tstart=0](http://www.element14.com/community/thread/23575?tstart=0)

[http://www.raspberrypi.org/phpBB3/viewtopic.php?t=41489&p=336995](http://www.raspberrypi.org/phpBB3/viewtopic.php?t=41489&p=336995)

**Beaglebone Pinout: **

[JerZ](http://letsmakerobots.com/user/18705) was trying to explain to me there are several modes for the B^3 pins (he's run Hello World on it, and I'm sure by this moment he's run Blink),   Regardless, I thought I'd try to whip up a visual for robot building on the B^3\.  

**Keep in mind, these are the pin names --** you'll have to look up on page 69-73 of the reference manual to know how they might be used.  Although, almost every pin can be used, regardless of its intended function.  Their functions are defined by the software, each pin having 8 modes (0-7).

[http://circuitco.com/support/index.php?title=BeagleBoneBlack#Hardware_Files](http://circuitco.com/support/index.php?title=BeagleBoneBlack#Hardware_Files)

For example, if your bot is a quadrocopter: You find a [real time kernel for Linux](https://rt.wiki.kernel.org/index.php/Main_Page) and **you'd probably set the pins to MODE 7 turning the non-essential pins into GPIO (i.e., sacrificing HDMI, eMMC, etc. lines to GPIO).**

**[JerZ](http://letsmakerobots.com/user/18705) also found this site:**

[http://blog.pignology.net/2013/05/getting-uart2-devttyo1-working-on.html](http://blog.pignology.net/2013/05/getting-uart2-devttyo1-working-on.html)

Which seems to be an excellent guide on accessing the mux'ed pins (haven't worked through it yet).

I found this robotics group that put some walkthroughs together on using the GPIOs by way of Bonescript.

1.  **[Blinking a Led](http://www.phys-x.org/rbots/index.php?option=com_content&view=article&id=104:lesson-1-beaglebone-black-blink-led&catid=46:beaglebone-black&Itemid=81)**
2.  **[Analog](http://www.phys-x.org/rbots/index.php?option=com_content&view=article&catid=46%3Abeaglebone-black&id=105%3Alesson-2-beaglebone-black-read-analog-&Itemid=81)**
3.  **[PWM](http://www.phys-x.org/rbots/index.php?option=com_content&view=article&id=106:lesson-3-beaglebone-black-pwm&catid=46:beaglebone-black&Itemid=81)**

If anyone else following this, **please double-check me, I'll make corrections if needed.**

![](/images/B_3PinOut3.png)

**Beaglebone Black and Raspberry Pi:**

These are some of the differences I've noticed between the Beaglebone Black and the Raspberry Pi.

 ![](/images/6312263717_932956b10c_o.jpg) | ![](/images/20121210222414_Raspberry_Pi_Logo.png) |
| Est. to Upgrade Rpi or BBB | Est. Difficulty to Add |
| Real Time Clock | **1** | **0** |
 | $[2.30](http://www.fasttech.com/products/0/10000007/1012004-tiny-i2c-rtc-ds1307-at24c32-real-time-clock-shield) | Medium |
| Processor Speed | **1GHZ** | **700MHZ** |
 | $[4.76](http://www.ebay.com/itm/Brushless-DC-Cooling-Fan-5-Blade-5V-12V-0-1A-25mm-x25mmx10mm-2510s-2-PIN-/250942547846?pt=LH_DefaultDomain_0&hash=item3a6d576786) | Medium |
| Power Switch | **1** | **0** |
 | $[0.83](http://www.pi-supply.com/buy-it-now/) | Easy |
| Reset Switch | **1** | **0** |
 | $0.83 | Easy |
| Boot Switch | **1** | **0** |
 | $0.83 | Easy |
| GPIO | **65** | **26** |
 | $[8.85](http://adafruit.com/products/732) | Medium |
| Flash Memory | **2GB** | **0** |
 | $[5.66](http://www.fasttech.com/products/0/10004411/1336900-ld-microsd-memory-card-2gb) | Easy |
| MicroSD (smaller footprint) | **1** | **0** |
 | $[4.35](http://www.fasttech.com/products/0/10001230/1131403-sd-to-microsd-card-adapter-for-the-raspberry-pi) | Easy |
| Serial Ports | **4** | **1 (that's accessible)** |
 | $1.50 | Hard |
| Barrel-jack and MicroUSB power | Yes | **No (just microUSB)** |
 | $[2.95](https://www.sparkfun.com/products/8734) | Easy |
| Highest Screen Resolution | **1280 x 1024** | **1920 x 1200** |
 | **~** | **~** |
| Peak Power Requirement | 460mA | **475mA** |
 | ~ | ~ |
| Supply Current to USB | **500mA** | **700mA** |
 | $[5.50](http://letsmakerobots.com/node/36923) | Hard |
| USB Host (devices used by BBB or Rpi) | **1** | **2** |
 | $[1.87](http://www.ebay.com) | Easy |
| USB Client (lets BBB or Rpi be a device) | 1 | **0** |
 | ~ | ~ |
| Plastic Headers for GPIO | 65 | **0** |
 | $[1.95](http://www.adafruit.com/products/1112) | Easy |
| USB Cable | 1 (Mini USB) | **None** |
 | $[1.07](http://www.fasttech.com/products/0/10000090/1013401-usb-am-to-mini-usb-male-adapter-cable-75cm) | Easy |

**The Hardware:**

First impressions in a sentence: The hardware looks sound.

Several things make it stand out:

*   It uses a Micro SD card instead of a SD.  This allows for a smaller overall size without using an [Adafruit Adapter](http://www.adafruit.com/products/966).

![](/images/MicroSD2.png)

*   It has three tactic switches: (1) power, (2), reset, and (3) a mystery switch.  I'm hoping the third is software accessible.  The built in powerswitch is a real winner.  It means you can tell [this guy](http://www.pi-supply.com/buy-it-now/) to keep his <span style="font-family: Arial, Helvetica, sans-serif; font-size: small; line-height: normal;">£15 and his closed source design.

![](/images/Reset_Switch_2.png)

*   It has one USB hub. This is my second greatest concern (after less community support) is having to rely on USB HUBs to connect devices.  And, yes, I'm aware an IC, breadboard, and access to hardware IO will allow custom [USB](http://www.atmel.com//doc8445.pdf) deivces. But sometimes don't you want to just plug-and-go? (Yes, I'm aware I'm lazy.)

![](/images/One_USB_2.png)

*   It has a barrel-jack instead of a Micro USB for power.  I don't know how you feel, but I'd rather have the Micro USB simply because I've got a lot of those lying about, whereas barrel-jacks, I'm not sure.  Maybe under the decaying skull?

![](/images/5v_Barrel_Jack2.png)

*   It's [open hardware](http://circuitco.com/support/index.php?title=BeagleBoneBlack#Revision_A4).  The RPi claims to be for "educational purposes," although, it seems the education is restricted to the software.  Of course, this is an assumption based on not yet seeing a schematic for the Raspberry Pi silicon bits.

*   It's TI.  They're nice to me. (I might have a stack of sampled ICs from them...maybe.)

If everyone is alright with me floating this post for a bit, I'm going to try to do a first-boot video tomorrow, then, continue until I've built this BBB into a bot.

Hope you're all well :)

*   **Bdk6**
*   RPI: 5
*   BBB: 14

*   **Maxhirez**
*   RPI:1
*   BBB: 2

*   **Ladvien:**
*   RPI:
*   BBB:1
