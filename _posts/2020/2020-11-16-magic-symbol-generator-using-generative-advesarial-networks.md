---
layout: post
title: Training a Generative Adversarial Network to Generate Magic Symbols
categories: ml
series: Creepy GANs
excerpt: A guide on using PyTorch to train a GAN to generative images of magic symbols.
tags: [ml, gan, pytorch, deep-learning]
image: 
    feature: deep-arcane/deep-arcane-splash.png
    credit: Photo by Rhii Photography
comments: true
custom_css:
custom_js: 
---
Often, I'll get whims and spend far too long on bringing them to fruition.  This is one of those projects.  There isn't much reason other than lolz and learning.  I've scraped the internet for images of magic symbols, then used a generative adversarial network ([GAN](https://en.wikipedia.org/wiki/Generative_adversarial_network)).  The GAN is built using PyTorch.  Though, there are several other neural-nets I've used in the project which were written in Tensorflow.  A lot of the code has been borrowed from elsewhere and adapted; I'll do my best to give credit where it's due.

## What was in my Head
I like folklore.  Of special interest is folklore dealing with magic.  Spells, witches, and summoning the dead, all pique my interests.  I'm guessing I love folklore because it is far removed from what I do every day, engineer data.  I know it might burst the aspirations of young data engineers reading this, but someone has to tell the truth, data engineering, on occasion, can get a bit boring.

To change things up, I thought I'd mix my interest and profession.  I decided to use a GAN to see if a computer could learn to make new magic symbols on its own.  

![degan-searching-symbols-in-vampire-archive](/images/deep-arcane/thomas_ancient_archives.gif)

After a few days of hacking, here are some highlights:
### Small Symbols (64x64)
The following symbols were generated with a GAN using 64x64 dimensions as input and output.  These symbols were then post-processed by using a deep denoising varational auto-encoder (DDVAE).  It was a fancy way of removing "[pepper](https://en.wikipedia.org/wiki/Salt-and-pepper_noise)" from the images.

If you would like all 6,000 of the sample images generated, here you go:

* [Ladvien's Deep Arcane GAN 64x64 Output (6k)](https://ladvien.com/raw_images/deep-arcane/64x64_cleaned/ladvien-deep-arcane-64x64_cleaned.tar.gz)

![machine-learning-created-magical-symbols-64x64](/raw_images/deep-arcane/deep-arcane-sample-64x64.png)

### Small Symbols (64x64)
The following symbols were generated with a GAN using 128x128 dimensions as input and output.  These symbols were not post-processed.

* [Ladvien's Deep Arcane GAN 128x128 Output (6k)](https://ladvien.com/raw_images/deep-arcane/128x128_dirty/ladvien-deep-arcane-128x128_dirty.tar.gz)

![machine-learning-created-magical-symbols-128x128](/raw_images/deep-arcane/deep-arcane-sample-128x128.png)


## How to Create Your Own
