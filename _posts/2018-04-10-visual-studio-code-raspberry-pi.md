---
layout: post
title: Editing Raspberry Pi Code Remotely from Visual Studio Code 
categories: Arch Linux
excerpt: Enable Visual Studio Code to remote edit files on the Raspberry Pi
tags: [i2c, Arch Linux, Raspberry Pi Zero W, linux, nodejs]
series: RAN
image: 
    feature: RAN_Robot.png
comments: true
custom_css:
custom_js: 
---

I'm spoiled.  I love the pretty colors of modern text IDEs.  My favorite among them being Visual Studio Code.

- [1. Get Visual Studio Code](#1-get-visual-studio-code)

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

Start by SSH'ing into your Raspberry Pi as root.

Run an update
```
pacman -Syu
```

Let's install ruby and supporting packages.
```
pacman -S ruby ruby-docs ruby-rdoc
sed "s|unset appendpath|appendpath \'$(ruby -e 'print Gem.user_dir')/bin'\\nunset appendpath|g" /etc/profile >> /etc/profile
```
If it installs, then we setup the remote correctly.  If not, feel free to ask debugging questions in the comments.

Now we'll install the needed Ruby `gems`.
```
gem install rmate
gem install rdoc
```
The above commands install [Ruby](https://www.ruby-lang.org/en/), moves to to the user's directory, uses the Ruby package manager to install rmate, then adds Ruby and it's Gems (packages) executables to the environment variables.  All of this is necessary to get Rmate working on Arch Linux.

Ok, let's test it.  Stop SSH'ing into your Pi by typing `exit` until it brings you back to your PC's prompt.  Now we are going to SSH into the Pi while listening for incoming files to be displayed in Visual Studio Code.

Open Visual Studio Code and open the integrated terminal (if it's not showing hit CTRL + `).

At the terminal type
```
ssh -R 52698:localhost:52698 alarm@192.168.1.x
```
Replace the `x` with your Pi's ip address.

This should SSH into the Pi while listening for files.

At the pi command prompt, type
```
rmate test.js
```
[![](https://ladvien.com/images/rmate_new_file.png){: .float-right}](https://ladvien.com/images/rmate_new_file.png)
This should open a new file called `test.js` in your Visual Studio Code.

Now you get all the goodness of the VSC IDE, such as syntax highlighting, linting, etc!

A few notes.  File permissions still apply, so if you want to be able to save a file the user you logged into on the Raspberry Pi and `rmated` the file must have write permission on the file.

However, if you do have write permissions, then the "File Save" function in the VSC editor will update the Raspberry Pi file with your modifications.  _Booyah!_
<br/>
<br/>
<br/>
<br/>
<br/>
<div style="clear: both;"></div>

One last annoyance to address.  Whenever you want to use VSC to edit your file you have to log into the Pi using
```
ssh -R 52698:localhost:52698 alarm@192.168.1.x
```
This annoyed me a bit.  I could never remember all that.  Instead, I created a small bash script to help.

On my PC (for Mac and Linux, Windows, you're on your own) I created in my home user directory called
```
vs
```
And added the following to the file.
```
echo $1
ssh -R 52698:localhost:52698 "$1"
```

Essentially, this script takes your Pi's login information and logs in to your Pi using the VSC Remote Extension listening.

To get it to work you've got to make the file executable
```
sudo +x chmod vs
```

Then login in your Pi like this
```
./vs alarm@192.168.1.x
```
Hope you enjoy.

Oh, and for you web-devs, this also works for remote servers.  Just replace the Pi with the server.