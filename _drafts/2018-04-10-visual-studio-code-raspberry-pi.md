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


[![](https://ladvien.com/images/vsc-ext-btn.png){: .float-left}](https://ladvien.com/images/vsc-ext-btn.png)
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
Once open, click here
<br/>
<br/>
<br/>
<br/>
<br/>

<div style="clear: both;"></div>
Ok, now search for the extension called

```
Remote VSCode
```

And hit the `Install` button.  Once it finishes hit the reload button.

The extension works by creating a server which listens for incoming calls from the Raspberry Pi.  Once we finished setting up the Raspberry Pi we will use a special command which sends the file on the Raspberry Pi to Visual Studio Code.  However, when it's all done, it'll look pretty seamless.

Back to setup.

In Visual Studio Code type `F1` and type `Preferences: Open Workspace Settings`

[![](https://ladvien.com/images/vsc_preferences.png)](https://ladvien.com/images/vsc_preferences.png)

Find the section labeled
```
remote.onStartup: false
```

We need to change it to `true` by clicking on the pencil next to its name.  This sets the listening server to start every time you open Visual Studio Code.

[![](https://ladvien.com/images/vsc_start_server.png)](https://ladvien.com/images/vsc_start_server.png)

Almost there.  Now to setup the Raspberry Pi.  We need to install a program on the Pi which will send a file of our choosing to Visual Studio Code to be edited.  [RMate](https://github.com/textmate/rmate) was my choice.

Start by SSH'ing into your Raspberry Pi.  Then type
```
sudo pacman -S rmate
```
