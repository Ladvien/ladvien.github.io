---
layout: post
title: Porting DRV8830 I2C Motor Driver Code to NodeJS
categories: Arch Linux
excerpt: How to setup NodeJS on Raspberry Pi Zero W
tags: [i2c, Arch Linux, Raspberry Pi Zero W, linux, nodejs]
series: RAN
image: 
    feature: RAN_Robot.png
comments: true
custom_css:
custom_js: 
---

I'm spoiled.  I love the pretty colors of modern text IDEs.  My favorite among them being Visual Studio Code.

* [Visual Studio Code](https://code.visualstudio.com)

I know it'll engender a lot of bad rep with the old-timers, but I prefer the one on the right.

[![](https://ladvien.com/images/nano_vs_vsc.png)](https://ladvien.com/images/nano_vs_vsc.png)

However, when working on a headless (no monitor) Raspberry Pi it felt like I was pretty much stuck with the `nano`.  

Until! I discovered Visual Studio Code's `remote` extension.

* [Visual Studio Code Remote Extension](https://github.com/rafaelmaiolla/remote-vscode)

This allowed me to edit my Raspberry Pi files from within Visual Studio Code.  So, I get all the joys of writing code directly on my Raspberry Pi, but with all the bells-and-whistles of Visual Studio Code (VSC).

For the most part, setup is pretty straightforward.  But the Pi side can get tricky, so I'm going to walk us through the process.

### 1. Get Visual Studio Code

Download the version of VSC for your PC.  Note, you aren't running this from the Raspberry Pi--instead, you'll be running it from the PC and connecting it to the Raspberry Pi. 

* [Visual Studio Code Download](https://code.visualstudio.com/download)

After it's downloaded and installed open it up.

Once open, click here
[![](https://ladvien.com/images/vsc-ext-btn.png){: .float-left}](https://ladvien.com/images/vsc-ext-btn.png])
<div style="clear: both;"></div>