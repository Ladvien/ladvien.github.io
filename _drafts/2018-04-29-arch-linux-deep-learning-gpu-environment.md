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
There was error I had a hell of a time debugging.  Installing the toolchain is fairly straightforward, _except_ CUDA.  At the time of writing this article (2018-04-29), there is a version mismatch between CUDA and CUDNN in the Arch Linux repositories.  Of course, this is tricky to see, since CUDA is part of the Arch `nvidia` package.

This results in an the following error every time I tried to import tensorflow in Python.
```
ImportError: libcublas.so.9.0: cannot open shared object file: No such file or directorys
```
The Arch Linux package CUDA was pulling the latest version 9.1.1 (at writing) and the Arch Linux package CUDNN was looking for version 9.0.  That little mismatch cost me 10 hours.s

### 0. Other Arch Linux Deep-Learning Articles
There are a couple other Arch Linux deep-learning setup walkthroughs.  Definitely need to give these guys credit, they are smarter than me.   Sadly, neither walkthrough had everything I was looking for.

1.[Deep Learning Setup in Arch Linux: From Start To Finish with PyTorch + TensorFlow + Nvidia CUDA + Anaconda](https://medium.com/@k_efth/deep-learning-in-arch-linux-from-start-to-finish-with-pytorch-tensorflow-nvidia-cuda-9a873c2252ed)

This article was alright.  But it focused a lot on setting up Arch Linux from the bare metal, which is usually the right idea with Arch, _if_ you don't have the resources.  For example, running on a server or Raspberry Pi.  But the extra few bytes of RAM used by desktop doesn't really justify the time spent on meticulous tunning.  And let my immolation begin.

Also, this article doesn't include information on GPU support.  _Whaawhaa._

2. [Getting Started With NVIDIA GPU, Anaconda, TensorFlow and Keras on Arch Linux](https://medium.com/@mimoralea/getting-started-with-nvidia-gpu-anaconda-tensorflow-and-keras-on-arch-linux-8f5f2868a455)

This one was a bit closer to what I need.  In fact, I did use the middle part.  However, the mismatch I mentioned was not mentioned here--so I spent a lot of time mad at this article.  Of course, it's not the author's fault at the time he wrote it I'm guessing there was no mismatch.

Alright, on to my take on the setup.

### 1. Install Antergos (Arch Linux)
I love me some Arch Linux.  It's lightweight and avoids the long-term issues of other flavors.  Plus, it is meant to be headless, so it's great for embedded projects.  Given how many embedded projects I take on it made me accustomed to using it, and eventually, I made it my main desktop flavor. Specifically, I dual-boot it on my Mac Book Pro.  The one issue with Arch Linux is it can be a little unfriendly to new users--or those with limited time and cannot be bothered with the nuances of setup. Enter Antergos.  

Antergos is essentially Arch Linux with a desktop environment and a GUI installer.  A perfect choice for my deep-learning endeavors.  Really, you should check it out.  Go now.

* [Antergos](https://antergos.com/)

We're going to use it for this project.

Download the `iso` file

* [Antergos (direct download)](https://antergos.com/download/antergos-live-iso/)

You'll need a little jumpdrive, 4gb should work.s

I use Etcher as it makes painless to create boot media.

* [Etcher](https://etcher.io/)

Insert the jumpdrive, open Etcher, and then select the Antergos iso file.  *Here's the usual warning, if you have anything on your jumpdrive it's about to get deleted forever.*
