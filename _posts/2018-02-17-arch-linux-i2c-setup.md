---
layout: post
title: Setup i2c on Raspberry Pi Zero W using Arch Linux
categories: Arch Linux
excerpt: A guide to setting up the I2C bus or the Raspberry Pi Zero W on Arch Linux
tags: [Arch Linux, pi, linux, i2c]
series: RAN
image: 
    feature: arch-pi-splash.png
comments: true
custom_css:
custom_js: 
---

This article builds on the previous, where I ran us through setting up Arch Linux for the Raspberry Pi Zero W.

Let's not stop, let's get I2C going so we can interact with some cool hardware.

## 1. Installing sudo
If you've followed my previous guide on installing Arch Linux on a Raspberry Pi then you'll have ended up with a bare bones system, which is good.  No unneeded fat.  But sometimes fat is needed, it's what gives us curves, and curves are beautiful....I feel this metaphor is breaking down.  In short, we need extra packages to get work done.

The first package we need is `sudo`

* [Install Sudo on Arch Linux](https://wiki.archlinux.org/index.php/sudo#Installation)

It will allow us to easily manage file permissions.

First, make sure your system is up to date.  To do this we are going to login as the root user.  You can do this by typing `su` followed by the root user's password, which for a barebone Arch Linux installation is `root`.
```
$ su
Password: root
```

Oh, and if you haven't figured out yet, `alarm` stands for Arch Linux ARM.

Next we need to update the package libraries and system.
```
pacman -Syu
```
After hitting enter, it should look like this:
```
root@alarmpi alarm]# pacman -Syu
:: Synchronizing package databases...
 core                                                        179.0 KiB   448K/s 00:00 [#################################################] 100%
 extra                                                      1982.8 KiB  1279K/s 00:02 [#################################################] 100%
 community                                                     4.0 MiB  1689K/s 00:02 [#################################################] 100%
 alarm                                                        35.0 KiB   583K/s 00:00 [#################################################] 100%
 aur                                                           6.0 KiB  0.00B/s 00:00 [#################################################] 100%
:: Starting full system upgrade...
resolving dependencies...
looking for conflicting packages...
```
It should give you a list of packages with update and upgrade candidates and prompting you to confirm the updates.  Go ahead and say yes.

Now we should be good to install `sudo`

```
$ pacman -S sudo
```

Even after sudo is installed, we still need to add the main user, which is `alarm` to the sudo'er group.  This in effect gives the `alarm` user the superpowers of the root user.

* [Arch Linux Sudo Configuration](https://wiki.archlinux.org/index.php/sudo#Configuration)

Now, the way sudo works is by adding a user to a special Linux group.  Anyone added to this group will be given root superpowers.  To get a list of those currently in the sudo group:
```
sudo -ll
```

You should get something like

```
User root may run the following commands on alarmpi:

Sudoers entry:
    RunAsUsers: ALL
    Commands:
```
Ok, let's get the alarm user added to the sudoer group.

Type
```
EDITOR=nano visudo
```
This should allow you to edit the visudo file and add alarmpi to sudoers.  Oh, the write permissions for the visudo file are limited to root, so if you have switched back from the root user to alarmpi you will need to run `su` again and log back in as root before editing this file.

Let's find the entry for adding users to the sudo'er group.

Find the part which looks like this:
```
##
## User privilege specification
##
root ALL=(ALL) ALL
```
And add `alarm ALL=(ALL) ALL` right below the root entry.  It should look like this after editing.

```
##
## User privilege specification
##
root ALL=(ALL) ALL
alarm ALL=(ALL) ALL
```

Then hit CTRL+O to write the changes and CTRL+X to exit.

Before we can check the changes took, we will need to exit our root session.

```
exit
```
This should land you back at your alarm session.  To see you the alarm user is now added to the sudoer group type

```
sudo -ll
```
And if all went well, you'll get this output
```
User alarm may run the following commands on alarmpi:

Sudoers entry:
    RunAsUsers: ALL
    Commands:
        ALL
```
Notice, we now have access to ALL commands.  _Booyah!_

We can do a hard test by typing:

```
sudo ls
```
We should get
```
We trust you have received the usual lecture from the local System
Administrator. It usually boils down to these three things:

    #1) Respect the privacy of others.
    #2) Think before you type.
    #3) With great power comes great responsibility.

[sudo] password for alarm:
```
Type the alarm user password (which is alarm, if you haven't changed it).


## 2. Install needed packages

```
pacman -S git python2 i2c-tools base-devel python2-distribute python2-pip
```

Use Python's Package Index (pip) to install Raspberry Pi GPIO support

```
pip2 install RPi.GPIO
```

## 3. Install raspi-config
```
sudo pacman -S xorg-xrandr libnewt
git clone https://aur.archlinux.org/raspi-config.git
cd raspi-config
makepkg -i
```

Use the Raspi-Config tool to enable I2C
```
sudo raspi-config
```

![](https://ladvien.com/images/rasp-config.png)


Select "Interfacing Options" and enable I2C.

Note: Going back through these instructions I did notice when I started `raspi-config` I received this warning:

`/usr/bin/raspi-config: line 997: warning: command substitution: ignored null byte in input`

And when I attempted to enable I2C it gave this error.

`* Failed to read active DTB`

But it still seemed to do the job. I'll investigate more when I've time.


## 4. Test the I2C Setup
We _should_ be all setup.  Try running
```
sudo i2cdetect -y 1
```

If all has went well then you should get
```
[alarm@alarmpi ~]$ sudo i2cdetect -y 1
     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00:          -- -- -- -- -- -- -- -- -- -- -- -- --
10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
20: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
40: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
70: -- -- -- -- -- -- -- --
```
Now, we just need to connect an I2C device to the bus and we should the hex address of where the device may be found.