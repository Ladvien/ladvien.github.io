---
layout: post
title: Setup Headless WiFi on Re4son's Kali Pi
categories: Kali
excerpt: Setup wifi on Re4son's Kali Pi by editing the SD card.
tags: [kali, pi, linux]
series: Raspberry Pi
image: 
    feature: kali-pi-splash.png
comments: true
custom_css:
custom_js: 
---

I bought a few Raspberry Pi Zero W's for $10.  It was happenstance I also purchased the Udemy course Learn Ethical Hacking from Scratch.  I figure, I might as well put these things together.

* [Raspberry Pi Zero W](https://www.raspberrypi.org/products/raspberry-pi-zero-w/)
* [Learn Ethical Hacking from Scratch](https://www.udemy.com/learn-ethical-hacking-from-scratch/)

I also discovered the Sticky Fingers Kali Pi kernel and distros put together by Re4son.

* [Kali Pi](https://whitedome.com.au/re4son/sticky-fingers-kali-pi/)

It has worked well so far.  However, I've not fully tested the Bluetooth LE hardware on the custom kernel.
<!-- more -->
One of the issues I've had is not being able to connect to new hotspots headlessly.  Usually, you'd boot the rp0w connected to a monitor, keyboard, mouse, and edit wpa_supplicant.conf directly.  But what if you want to go into a new location with only your laptop and the rp0w.  How would you add the wifi credentials to the rp0w without a monitor, etc.

For awhile, I tried to get the ethernet gadget setup to work on the rp0w without any luck.  I think the problems relates to trying to use the gadget hardware on a Mac rather than a Windows machine.

In the end, I decided I would add a script which would do the following:

1. Mount the /boot partition (which is editable through PC's SD card reader).
2. Look for a file on the /boot called "wpa_supplicant.txt" and copy it to the /etc/wpa_supplicant.conf 
3. Look for a file on the /boot called "interfaces.txt" and copy it to the /etc/networks/interfaces
4. Unmount /boot
5. Remove the /boot directory

I saved this script in `/root` as `wifi_setup.sh`.  I then added a call to it in `/etc/rc.local`

{% highlight bash %}
#!/bin/sh -e
#
# rc.local
#
# This script is executed at the end of each multiuser runlevel.
# Make sure that the script will "exit 0" on success or any other
# value on error.
#
# In order to enable or disable this script just change the execution
# bits.
#
# By default this script does nothing.
/root/wifi_setup.sh || exit 1
exit 0
{% endhighlight %}

Here's the `wifi_setup.sh`

{% highlight bash %}
#!/bin/bash

if [ ! -d "/boot" ]; then
        echo 'Mounting /boot'
        cd ..
        mkdir /boot
        mount /dev/mmcblk0p1 /boot
fi

if [ -f "/boot/wpa_supplicant.txt" ]; then
        echo 'Applying wpa_supplicant'
        cp /boot/wpa_supplicant.txt /etc/wpa_supplicant.conf
        mv /boot/wpa_supplicant.txt /boot/wpa_supplicant.applied.txt
fi

if [ -f "/boot/interfaces.txt" ]; then
        echo 'Applying intefaces'
        cp /boot/interfaces.txt /etc/network/interfaces
        mv /boot/interfaces.txt /boot/interfaces.applied
fi

umount /boot
rm -r /boot
{% endhighlight %}

This has let me add a new network from my laptop with merely an SD card reader.