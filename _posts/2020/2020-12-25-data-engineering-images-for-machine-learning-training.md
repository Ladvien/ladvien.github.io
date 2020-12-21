---
layout: post
title: Engineering a Training Data Set from Garbage
categories: ml
series: Nothing but Neural Nets
excerpt: Annotation on the process used to refine a raw image set into an image set meant to train a generative adversarial network
tags: [data engineering, python, machine learning, gan, opencv]
image: 
    feature: scraping-internet-for-magic-symbols/scraping-internet-for-magic-symbols.png
    credit: Photo by Robert Anasch
comments: true
custom_css:
custom_js: 
---
After running through all of the key terms above, I ended with 32,000 images, most of them garbage.  Good engineers are lazy when it comes to tedium, and there's no way I was hand sorting 32,000 images.  

I thought, "I need a way write a script to sort these images--but, they need to be images _I_ believe carry signal."  Then it hit me, that's what an image classifiers were good at.  I decided I would try creating a small training data set of images.  There would be two categories, "magic symbols" and "garbage."  I would train a CNN to classify images into these two categories.   Then, I would use this CNN to sort the 32,000 images.  It worked like a charm. (Eh? eh?)

After using the classifier to sort the images, I ended with 6,000 training images.  Of course, I still had to comb through these images for a few occasional bits of noise.  But I tried to be smart about it, I moved the noise into my "garbage" category and retrained my CNN.  Then repeated the classification.  After a few iterations and only minimal amount of hand sorting, I had 5,200 pretty solid training images.  Huzzah!

Here's a sample of the images I used
![deep-convolutional-generative-adversarial-network-magic-symbol-training-data](../../images/deep-arcane/training-data-sampler2.png)

## Training Method


## Create your own Deep Magic Symbol Generator

Whether you are interested in making your own magic symbol generator, or you would like to 


![degan-searching-symbols-in-vampire-archive](/images/deep-arcane/thomas_ancient_archives.gif)
