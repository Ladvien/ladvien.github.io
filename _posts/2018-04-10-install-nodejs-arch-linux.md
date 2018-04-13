---
layout: post
title: Setup NodeJS Project Space on Raspberry Pi Zero W
categories: Arch Linux
excerpt: How to setup NodeJS on Raspberry Pi Zero W
tags: [Arch Linux, Raspberry Pi Zero W, linux, nodejs]
series: Raspberry Pi
image: 
    feature: arch-pi-splash.png
comments: true
custom_css:
custom_js: 
---

### Setup the Arch Linux SD Card

This article will be building off a previous article, where I walked through a headless setup of Arch Linux on the Raspberry Pi Zero W (rp0w).  And if you aren't familiar with the term "headless setup," essentially, we are talking about setting up the SD card so you don't have to plug it into a monitor.  You can plug it in to your rp0w, boot it, and SSH in.

* [Installing Arch Linux on a Raspberry Pi with Immediate WiFi Access](https://ladvien.com/installing-arch-linux-raspberry-pi-zero-w/)

Now you've setup the Arch Linux card and SSH'ed lets go through setting up a NodeJS environment on the rp0w.  Luckily, there have been people smarter than me who've already done some heavy lifting for us.

Alright, start by SSH'ing into your Raspberry Pi.

### Running a NodeJS Install Script
Now we are at the Raspberry Pi command prompt we are going to run a script which will pull down the latest version of NodeJS built for ARM and install it to the Raspberry Pi.

But before we can do that we need to install a few helper programs

At the command prompt type and say "yes" when prompted.
```
sudo pacman -S wget
```
Wget is a package which allows direct download of Internet content from the command prompt.

Now, we will run a command which pulls a NodeJS installation script of the Internet and run it.  This script was written by `audstanley` and can be found at

* [NodeJS Raspberry Pi Github](https://github.com/audstanley/NodeJs-Raspberry-Pi)

If you like the script, you should go buy `audstanley` a coffee -- the link to do so is the Github page.

As of this writing, the script downloads the latest version of NodeJS for your architecture (that's the tricky part), installs it, then creates the appropriate symbolic links for NodeJS and [npm](https://www.npmjs.com/) to work correctly.

Ok, enough preamble.

To install NodeJS type
```
sudo wget -O - https://raw.githubusercontent.com/audstanley/NodeJs-Raspberry-Pi/master/Install-Node.sh | sudo bash
node -v
```

That's it!