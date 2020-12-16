---
layout: post
title: Training a Generative Adversarial Network to Generate Magic Symbols
categories: ml
series: Nothing but Neural Nets
excerpt: A guide on using PyTorch to train a GAN to generative images of magic symbols.
tags: [ml, gan, pytorch, deep-learning]
image: 
    feature: deep-arcane/deep-arcane-splash.png
    credit: Photo by Rhii Photography
comments: true
custom_css:
custom_js: 
---
I love folklore dealing with magic.  Spells, witches, and summoning the dead.  It all piques my interest.  I think it inspires me as it is far removed from being a data engineer--I know it might kill aspirations of young data engineers reading, but data engineering can be a bit boring at times. To beat the boredom, I decided to mix my personal and professional interests.

I've scraped the internet for images of magic symbols, then trained a deep convolutional generative adversarial network ([DCGAN](https://en.wikipedia.org/wiki/Generative_adversarial_network)) to generate new magic symbols, which are congruent to real magic symbols.  The DCGAN is built using PyTorch.  I usually roll with Tensorflow, but working on learning PyTorch.  

I've taken the "nothing but net" approach with this project.  Most of the data augmentation I've done during this project have been using other neural networks.  Most of these augmenting nets were written in Tensorflow.  

I've planned a series of articles, as there is too much to cover in one.  A lot of the code has been borrowed and adapted; I'll do my best to give credit where it's due.

## What was in my Head
![blade-ancient-vampire-symbols](/raw_images/deep-arcane/thomas_ancient_archives.gif)
 Let's start with current results first.  After getting the urge to teach a computer to make a magic sign, it took a couple days of hacking before I ended up with the images below.

 Keep in mind, these are preliminary results.  They were generated using my GTX 1060 6GB.  The GPU RAM limits the model a lot--at least, until I rewrite the training loop.  Why do I mention the the small GPU?  Well, GANs are an architecture which provide much better results with more neurons.  And the 6GB limits the network a lot for well performing GAN.

 Anyway, 'nuff caveats.  Let's dig in.

## Signal
There are a few concepts I'll refer to a lot throughout these articles--let's define them before we dig in.

First, "[signal](https://en.wikipedia.org/wiki/Signal)."  I like Wikipedia's definition, even if it is sleep inducing.

> In signal processing, a signal is a function that conveys information about a phenomenon.

One of the mistakes I made early in this project was not defining the desired signal.  In future projects, I'll lead with a written definition and modify it based on what I learn about the signal.  However, for this project, here was my eventual definition.

The "magic symbol" signal had the following properties,
* Used in traditional superstition
* Defined

These terms became my measuring stick for determining whether an image was included in the training data.  

I decided each image should be defined.  Meaning, an image must be easily discernible at the resolution in which it was trained.  

Here are examples of "defined,"
![example-of-defined-training-images](/images/deep-arcane/defined_example.png)

And examples of "used in traditional superstition."  The top-left symbol is the [Leviathan Cross](https://symbolism.fandom.com/wiki/The_Leviathan_Cross) and bottom-left is the [Sigil of Bael](https://en.wikipedia.org/wiki/Bael_(demon)).

![example-of-superstitious-training-images](/images/deep-arcane/superstition_example.png)


### Small Symbols (64x64)
The following symbols were generated with a DCGAN using 64x64 dimensions as output.  These symbols were then post-processed by using a deep denoising varational auto-encoder (DDVAE).  It was a fancy way of removing "[pepper](https://en.wikipedia.org/wiki/Salt-and-pepper_noise)" from the images.

If you would like all 6,000 of the sample images generated, here you go:

* [Ladvien's Deep Arcane GAN 64x64 Output (6k)](https://ladvien.com/raw_images/deep-arcane/64x64_cleaned/ladvien-deep-arcane-64x64_cleaned.tar.gz)

![machine-learning-created-magical-symbols-64x64](/images/deep-arcane/deep-arcane-sample-64x64.png)

### Large Symbols (128x128)
The following symbols were generated with a GAN using 128x128 dimensions as input and output.  These symbols were **not** post-processed.

* [Ladvien's Deep Arcane GAN 128x128 Output (6k)](https://ladvien.com../../raw_images/deep-arcane/128x128_dirty/ladvien-deep-arcane-128x128_dirty.tar.gz)

![machine-learning-created-magical-symbols-128x128](/images/deep-arcane/deep-arcane-sample-128x128.png)

### Assessment of Outputs
Overall, I'm pleased with the output.  Looking at how muddy the outputs are on the 128x128 you may be wondering why.  Well, a few reasons.

I've been able to avoid [mode collapse](https://developers.google.com/machine-learning/gan/problems#mode-collapse) in almost all of my training sessions.  Mode collapse is the bane of GANs.  Simply put, the generator finds one or two outputs which always trick the discriminator and then produces those every time.

There is a lot of pepper throughout the generated images.  I believe a lot of this comes from dirty input data, so when there's time, I'll refine my dataset further. However, the denoising auto-encoder seems to be the easiest way to get rid of the noise--as you can see the 64x64 samples (denoised) are much cleaner than the 128x128 samples.  Also, I might try applying the denoiser to the inputs, rather than the outputs.  In short, I feel training will greatly improve as I continue to refine the training data.

But do they look like real magic symbols?  I don't know.  At this point, I'm biased, so I don't trust my perspective.  I did show the output to a coworker and asked, "What does this look like?"  He said, "I don't know, some sort of runes?"  And my boss asked, "What are those Satan symbols?"  So, I feel I'm on the right track.

