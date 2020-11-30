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
Often, I've whims and spend far too long bringing them to fruition.  This project is one of those whims.  There isn't much reason other than lolz and learning.  

I love folklore.  Especially, folklore dealing with magic.  Spells, witches, and summoning the dead.  It all piques my interest.  I think folklore inspires me as it is removed from being a data engineer--I know it might kill aspirations of young data engineers reading, but data engineeringcan be a bit boring. To beat boredom, I mixed novel and professional interests.

I've scraped the internet for images of magic symbols, then trained a deep convolutional generative adversarial network ([DCGAN](https://en.wikipedia.org/wiki/Generative_adversarial_network)) to generate new magic symbols, which are congruent to real magic symbols.  The DCGAN is built using PyTorch, as I'm learning the framework.  However, several other neural-nets I've used in the project were written in Tensorflow.  As this is a series, I'll write-up each stage of the project.  A lot of the code has been borrowed and adapted; I'll do my best to give credit where it's due.

## What was in my Head
 Let's start with current results first.  After getting the urge to teach a computer to make a magic sign, it took a couple days of hacking before I ended up with the images below.

 Keep in mind, these are preliminary results.  They were generated using my GTX 1060 6GB.  The ram limits the model a lot--at least, until I rewrite the training loop.  Why do I mention the the small GPU?  Well, GANs are an architecture which provide much better results with more parameters.  And the 6GB limits the parameters.

 Anyway, 'nuff caveats.  Let's look at some "symbols."

## Signal
There are a few concepts I'll refer to a lot throughout these articles--let's define them before we dig in.

First, "[signal](https://en.wikipedia.org/wiki/Signal)."  I like Wikipedia's definition,

> In signal processing, a signal is a function that conveys information about a phenomenon.

One of the mistakes I made early in this project was not defining this desired signal.  In future projects, I'll lead with a written definition and modify it based on what I learn about the signal.  However, for this project, here was my eventual definition of the signal.

The "magic symbol" signal had the following properties,
* Used in traditional superstition
* Defined

These terms became my measuring stick for determining whether an image was included in the training data.  

I decided each image should be defined.  Meaning, an image must be easily discernible as the resolution in which it was trained.  

Here are an examples of "defined,"
![example-of-defined-training-images](../../images/deep-arcane/defined_example.png)

And examples of "used in traditional superstition,"
![example-of-superstitious-training-images](../../images/deep-arcane/superstition_example.png)

In another effort to define signal,[2] anything that is only a function of space, such as an image, is excluded from the category of signals.



### Small Symbols (64x64)
The following symbols were generated with a DCGAN using 64x64 dimensions as output.  These symbols were then post-processed by using a deep denoising varational auto-encoder (DDVAE).  It was a fancy way of removing "[pepper](https://en.wikipedia.org/wiki/Salt-and-pepper_noise)" from the images.

If you would like all 6,000 of the sample images generated, here you go:

* [Ladvien's Deep Arcane GAN 64x64 Output (6k)](https://ladvien.com/raw_images/deep-arcane/64x64_cleaned/ladvien-deep-arcane-64x64_cleaned.tar.gz)

![machine-learning-created-magical-symbols-64x64](../../images/deep-arcane/deep-arcane-sample-64x64.png)

### Large Symbols (128x128)
The following symbols were generated with a GAN using 128x128 dimensions as input and output.  These symbols were **not** post-processed.

* [Ladvien's Deep Arcane GAN 128x128 Output (6k)](https://ladvien.com../../raw_images/deep-arcane/128x128_dirty/ladvien-deep-arcane-128x128_dirty.tar.gz)

![machine-learning-created-magical-symbols-128x128](../../images/deep-arcane/deep-arcane-sample-128x128.png)

### Assessment of Outputs
Overall, I'm pleased with the output.  

I've been able to avoid [mode collapse](https://developers.google.com/machine-learning/gan/problems#mode-collapse) in almost all of my training sessions.  Mode collapse is the bane of GANs.  Simply put, the generator finds one or two outputs which always trick the discriminator and then produces those every time.

There is a little bit of pepper throughout the generated images.  I believe a lot of this comes from dirty input data, so when there's time, I'll try to further refine my dataset.  However, the denoising auto-encoder seems to be the easiest way to get rid of the noise--as you can see the 64x64 samples (denoised) are much cleaner than the 128x128 samples.

But do they look like real magic symbols?  I don't know.  At this point, I'm biased, so I don't trust my perspective.  I did show the output to a coworker and asked, "What does this look like?"  He said, "I don't know, some sort of runes?"

## Training Data
It may be blasphemy, but I prize my data engineering over machine learning skills.  As I learned, putting together a good training data set is tough.  For this project, the I collected images by scraping the internet through Google's image search.  This method is technically against Google's terms of service, but it seemed to work.  Below is a random sample of search terms I used:
```
occult religious symbols from old books
conjuring symbols
magic wards
esoteric magic symbols
demon summing symbols
ancient cult symbols
gypsy occult symbols
Feri Tradition symbols
Quimbanda symbols
Nagualism symbols
Pow-wowing symbols
Book of the Dead magic symbols
kali magic symbols
```
Scraping images resulted in a lot of garbage images (noise) along with my ideal training images.  

For example, out of all the images shown, I only wanted the image highlighted.
![magic-symbol-training-data-collection-noise-sample](../../images/deep-arcane/training-data-garbage.png)

I'll try to cover these issues in later articles.


After running through all of the key terms above, I ended with 32,000 images, most of them garbage.  Good engineers are lazy when it comes to tedium, and there's no way I was hand sorting 32,000 images.  

I thought, "I need a way write a script to sort these images--but, they need to be images _I_ believe carry signal."  Then it hit me, that's what an image classifiers were good at.  I decided I would try creating a small training data set of images.  There would be two categories, "magic symbols" and "garbage."  I would train a CNN to classify images into these two categories.   Then, I would use this CNN to sort the 32,000 images.  It worked like a charm. (Eh? eh?)

After using the classifier to sort the images, I ended with 6,000 training images.  Of course, I still had to comb through these images for a few occasional bits of noise.  But I tried to be smart about it, I moved the noise into my "garbage" category and retrained my CNN.  Then repeated the classification.  After a few iterations and only minimal amount of hand sorting, I had 5,200 pretty solid training images.  Huzzah!

Here's a sample of the images I used
![deep-convolutional-generative-adversarial-network-magic-symbol-training-data](../../images/deep-arcane/training-data-sampler2.png)

## Training Method


## Create your own Deep Magic Symbol Generator

Whether you are interested in making your own magic symbol generator, or you would like to 


![degan-searching-symbols-in-vampire-archive](/images/deep-arcane/thomas_ancient_archives.gif)
