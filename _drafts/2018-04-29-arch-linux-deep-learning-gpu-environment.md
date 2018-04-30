---
layout: post
title: Creating a GPU Arch Linux Deep-Learning Environment
categories: deep-learning
series: Deep-Learning
excerpt:
tags: [deep-learning, arch-linux, keras, python, tensorflow, gpu, rs]
image: 
    feature: 
comments: true
custom_css:
custom_js: 
---

This article logs a weekend of efforts to create a deep-learning environment which meets the following criteria

* GPU Enabled
* On Arch Linux
* Uses Keras with Tensorflow as a backend
* Main IDE being RStudio

It was a tough one.

## TL;DR
There was error I had a hell of a time debugging.  Installing the toolchain is fairly straightforward, _except_ CUDA.  At the time of writing this article (2018-04-29), there is a version mismatch between CUDA and CUDNN in the Arch Linux repositories.

This results in an the following error every time I tried to import tensorflow in Python.
```
ImportError: libcublas.so.9.0: cannot open shared object file: No such file or directorys
```
The Arch Linux package CUDA was pulling the latest version 9.1.1 (at writing) and the Arch Linux package CUDNN was looking for version 9.0.  That little mismatch cost me 10 hours.s

### 0. Other Arch Linux Deep-Learning Articles
There are a couple other Arch Linux deep-learning setup walkthroughs.  Definitely need to give these guys credit, they are smarter than me.   However, neither walkthrough had everything I was looking for.

1. [Deep Learning Setup in Arch Linux: From Start To Finish with PyTorch + TensorFlow + Nvidia CUDA + Anaconda](https://medium.com/@k_efth/deep-learning-in-arch-linux-from-start-to-finish-with-pytorch-tensorflow-nvidia-cuda-9a873c2252ed)

This article was alright.  But it focused a lot on preparing Arch Linux from the bare metal, which is usually the right idea with Arch, _if_ you are on a resource budget.  For example, running on a server or Raspberry Pi.  But the extra few bytes of RAM saved doesn't really justify the time spent on meticulous tunning when we will be talking in megabytes and not bytes.  And let my immolation begin.

Also, this article doesn't include information on GPU support.  _Whaawhaa._

2. [Getting Started With NVIDIA GPU, Anaconda, TensorFlow and Keras on Arch Linux](https://medium.com/@mimoralea/getting-started-with-nvidia-gpu-anaconda-tensorflow-and-keras-on-arch-linux-8f5f2868a455)

This one was a bit closer to what I need.  In fact, I did use the middle part.  However, the mismatch was not mentioned.  Of course, it's not the author's fault.   At the time he wrote it I'm guessing the repositories matched.

Alright, on to my take on the setup.

### 1. Install Antergos (Arch Linux)
I love me some Arch Linux.  It's lightweight and avoids the long-term issues of other flavors.  Plus, it is meant to be headless, so it's great for embedded projects.  Given how many embedded projects I take on it made me accustomed to using it, and eventually, I made it my main desktop flavor. Specifically, I dual-boot it on my Mac Book Pro.  The one issue with Arch Linux is it can be a little unfriendly to new users--or those with limited time and cannot be bothered with the nuances of setup. Enter Antergos.

Antergos is essentially Arch Linux with a desktop environment and a GUI installer.  A perfect choice for my deep-learning endeavors.  Really, you should check it out.  Go now.

* [Antergos](https://antergos.com/)

We're going to use it for this project.

Download the `iso` file

* [Antergos (direct download)](https://antergos.com/download/antergos-live-iso/)

You'll need a little jumpdrive, 4gb should work.

I use Etcher as it makes painless to create boot media.

* [Etcher](https://etcher.io/)

Insert the jumpdrive, open Etcher, and then select the Antergos iso file.  *Here's the usual warning, if you have anything on your jumpdrive it's about to get deleted forever.*

![](https://ladvien.com/images/etcher_antergos.png)

Insert the media into the machine you want to install Arch on and boot from the jumpdrive.

#### Windows
You will need to hit a special key during the boot sequence to enter the BIOS' boot menu

#### Mac
While booting hold down the `Option` key.

If all goes well you should see a menu which says

```
Welcome to GRUB!
```
And then shows an Antergos boot menu.  Select boot Antergos Live.

Once the boot sequence is finished you should see the Antergos desktop environment start and shortly after `cnchi`, which is Antergos' GUI installer

![](https://ladvien.com/images/cnchi.png)

Select the `Install It`.  The installer is fairly self explantory.  But, if you run in to any issues, please feel free to ask me questions in the comments.  I'm glad to help.

Once the installer is complete you will be prompted to restart the computer. It's go time.

### 2. Install NVIDIA
When you boot up the installed Antergos open the terminal.

We will start with installing the base NVIDIA packages.  As part of it, we are going to get the wrong version of CUDA.  But, I found downloading the NVIDIA as whole packages and then replacing CUDA with an earlier version, much eaiser than trying to pull everything together myself.

Ok, here we go.
```
sudo pacman -S nvidia nvidia-utils cuda cdnn
```
That might take awhile.  

...

So, how you been?  Oh crap, it's done.

Ok, to initialize the changes reboot.
```
sudo reboot now
```

### 3. Downgrade CUDA to match CDNN
That should have gotten everything at once.  Now, let's downgrade CUDA to from 9.1 to _9.0_.

```
wget https://archive.archlinux.org/packages/c/cuda/cuda-9.0.176-4-x86_64.pkg.tar.xz
```
This downloads a `pkg` file for CUDA 9.0, which is what the most recent version of Tensorflow is expecting (at this time, 1.8).  I found the easiest way to replace CUDA 9.1 with 9.0 to simply double click on the file we downloaded from the GUI file browser.  This opens it in Antergos' answer to a GUI based package manager.  It will warn you this package will downgrade your CUDA version and ask you to `Commit` to the changes.  Hit the commit button.

Wait for the file to be replaced before moving on.

### 4. Anaconda (Optional)
Anaconda is a great package manager for data (mad) scientist tools.  It is Python centric, but also supports R and other stuff I don't know how to use yet.

* [Anaconda](https://www.anaconda.com/what-is-anaconda/)

We will be using it to prepare our system to support deep-learning projects.

* [Download Anaconda](https://www.anaconda.com/what-is-anaconda/)

Download the Linux version suited for your computer.
![](https://ladvien.com/images/anaconda_download.png)

Once the file is downloaded right click on the file and select `Show In Folder`.  Once there, right-click in the open space and select `Open in Terminal`.
![](https://ladvien.com/images/anaconda_download_box.png)

### Manual Setup for Dual-Boot
I had to buy a graphics card for this project.  Sigh.  Not a great time to do it.  Between [cryptocurrency craze](https://www.gamesindustry.biz/articles/2018-01-25-gpu-prices-more-than-double-as-cryptocurrency-craze-accelerates), [shortage of DRAM](https://www.kitguru.net/components/matthew-wilson/dram-and-nand-supply-shortage-expected-to-last-until-2018/), and [NVIDIA's monopoly](https://www.reddit.com/r/pcmasterrace/comments/435sbf/can_someone_educate_me_in_the_supposed_nvidia/), well, it was painful.

However, I talked my wife into it by saying, "But hey! We could also use it to play games with."  (Seems backwards somehow...)  But this meant I needed to leave our family's installation of Windows on the computer--dual booting.

If you want to dual boot as well, you will need to turn on your computer and create a separate partition for Arch Linux.

* [Create a Linux Partition for Windows: Make Room for Linux](https://www.howtogeek.com/214571/how-to-dual-boot-linux-on-your-pc)
* [Create a Linux Partition on Mac](https://www.imore.com/how-to-partition-your-mac)

And if you are already using Linux, I'm going to guess you know how to create a second partition.