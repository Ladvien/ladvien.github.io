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

I've scraped the internet for images of magic symbols, then trained a deep convolutional generative adversarial network ([DCGAN](https://en.wikipedia.org/wiki/Generative_adversarial_network)) to generate new magic symbols, which are sincerely similar to real magic symbols.  The DCGAN is built using PyTorch.  Though, there are several other neural-nets I've used in the project which were written in Tensorflow.  As this is a series, I'll write-up each stage of the project.  A lot of the code has been borrowed and adapted; I'll do my best to give credit where it's due.

## What was in my Head
I like folklore.  Especially, folklore dealing with magic.  Spells, witches, and summoning the dead.  It all piques my interest.  Being meta-analytical, I suppose I love folklore as it is far removed from profession, data engineer.  I know it might burst the aspirations of young data engineers reading, but data engineering, on occasion, can get a bit boring. I thought I'd mix my interest and profession.  I decided to use a DCGAN to see if a computer could learn to make new magic symbols on its own.   After a few days of hacking, below are the results.

### Small Symbols (64x64)
The following symbols were generated with a DCGAN using 64x64 dimensions as output.  These symbols were then post-processed by using a deep denoising varational auto-encoder (DDVAE).  It was a fancy way of removing "[pepper](https://en.wikipedia.org/wiki/Salt-and-pepper_noise)" from the images.

If you would like all 6,000 of the sample images generated, here you go:

* [Ladvien's Deep Arcane GAN 64x64 Output (6k)](https://ladvien.com../../raw_images/deep-arcane/64x64_cleaned/ladvien-deep-arcane-64x64_cleaned.tar.gz)

![machine-learning-created-magical-symbols-64x64](../../images/deep-arcane/deep-arcane-sample-64x64.png)

### Large Symbols (128x128)
The following symbols were generated with a GAN using 128x128 dimensions as input and output.  These symbols were **not** post-processed.

* [Ladvien's Deep Arcane GAN 128x128 Output (6k)](https://ladvien.com../../raw_images/deep-arcane/128x128_dirty/ladvien-deep-arcane-128x128_dirty.tar.gz)

![machine-learning-created-magical-symbols-128x128](../../images/deep-arcane/deep-arcane-sample-128x128.png)

### Assessment of Outputs
Overall, I'm pleased with the output.  

I've been able to avoid [mode collapse](https://developers.google.com/machine-learning/gan/problems#mode-collapse) in almost all of my training sessions.  Mode collapse is the bane of GANs.  Simply put, the generator finds one or two outputs which always tricks the discriminator and then produces those every time.

There is a little bit of pepper throughout the generated images.  I believe a lot of this comes from dirty input data, so when there's time, I'll try to further refine my dataset.  However, the denoising auto-encoder seems to be the easiest way to get rid of the noise--as you can see the 64x64 samples (denoised) are much cleaner than the 128x128 samples.

But do they look like real magic symbols?  I don't know.  At this point, I'm biased, so I don't trust my perspective.  I did show the output to a coworker and asked, "What does this look like?"  He said, "I don't know, some sort of runes?"

## Training Data
It may be blasphemy, but I prize data engineering over machine learning skills.  Even with stated skills, putting together a good training data set is tough.  The images I collected by scraping the internet through Google's image search.  There were several issues.  First, using the following list of key terms:
```
black and white magic symbol icon
black and white arcane symbol icon
black and white mystical symbol
black and white useful magic symbols icon
black and white ancient magic sybol icon
black and white key of solomn symbol icon
black and white historic magic symbol icon
black and white symbols of demons icon
black and white magic symbols from book of enoch
black and white historical magic symbols icons
black and white witchcraft magic symbols icons
black and white occult symbols icons
black and white rare magic occult symbols icons
black and white rare medieval occult symbols icons
black and white alchemical symbols icons
black and white demonology symbols icons
black and white magic language symbols icon
black and white magic words symbols glyphs
black and white sorcerer symbols
black and white magic symbols of power
occult religious symbols from old books
conjuring symbols
magic wards
esoteric magic symbols
demon summing symbols
demon banishing symbols
esoteric magic sigils
esoteric occult sigils
ancient cult symbols
gypsy occult symbols
Feri Tradition symbols
Quimbanda symbols
Nagualism symbols
Pow-wowing symbols
Onmyodo symbols
Ku magical symbols
Seidhr And Galdr magical symbols
Greco-Roman magic symbols
Levant magic symbols
Book of the Dead magic symbols
kali magic symbols
```
Resulted in a lot of garbage images (noise) along with my ideal training images.  

For example, out of all the images shown, I only wanted the image highlighted.
![magic-symbol-training-data-collection-noise-sample](../../images/deep-arcane/training-data-garbage.png)

After running through all of the key terms above, I ended with 32,000 images, most of them garbage.  Good engineers are lazy when it comes to tedium.  And there's no way I was hand sorting 32,000 images.  

I thought, "I need a way write a script to sort these images--but, they need to be images _I_ believe carry signal."  Then it hit me, that's what an image classifiers were good at.  I decided I would try creating a small training data set of images.  There would be two categories, "magic symbols" and "garbage."  I would train a CNN to classify images into these two categories.   Then, I would use this CNN to sort the 32,000 images.  It worked like a charm. (Eh? eh?)

After using the classifier to sort the images, I ended with 6,000 training images.  Of course, I still had to comb through these images for a few occasional bits of noise.  But I tried to be smart about it, I moved the noise into my "garbage" category and retrained my CNN.  Then repeated the classification.  After a few iterations and only minimal amount of hand sorting, I had 5,200 pretty solid training images.  Huzzah!



## Training Method


## Create your own Deep Magic Symbol Generator

Whether you are interested in making your own magic symbol generator, or you would like to 


![degan-searching-symbols-in-vampire-archive](/images/deep-arcane/thomas_ancient_archives.gif)
