---
layout: post
title: Google Vision API using Raspberry Pi and Node
categories: Arch Linux
excerpt: How to setup NodeJS on Raspberry Pi Zero W
tags: [Google Vision, Computer Vision, NodeJS, Arch Linux, Raspberry Pi Zero W, linux]
series: RAN
image: 
    feature: RAN_Robot.png
comments: true
custom_css:
custom_js: 
---

This is a jumpstart guide to connecting a Raspberry Pi Zero W to the Google Vision API.

### 1. Get an Account
Sadly, Google Vision API is not a completely free service.  At the time of writing an API account provides 1000 free Google Vision API calls a month.  Then, it's a $1.00 for each 1000 calls.

I know, I know, not too bad.  But this isn't a commercial project.  I'm wanting to use it for a puttering little house bot.  If my wife gets a bill for $40 because I decided to stream images to the API, well, it'll be a dead bot. Anyway, I thought I'd still explore the service for poo-and-giggles.

To get an account visit

* https://console.cloud.google.com/

And sign-in with an existing Google account or create one.

### 2. Enter Billing Information
Now, here's the scary part, you've must enter your billing information before getting going.  **Remember, you will be charged if you go over 1000 calls.**

![](https://ladvien.com/images/google-vision-billing.png)

Again, if you exceed your 1,000 free calls you will be charged. 

### 2. Enable Cloud Vision API
After setting up billing information we still need to enable the Cloud Vision API.  This is a security feature, essentially, all Google APIs are disabled by default so if someone accidently gets access they don't unleash hell everywhere.

![](https://ladvien.com/images/enable-cloud-vision.png)

Now search for `Vision` and click the button.  Here there should be a glaring `Enable` button.  Press it.

![](https://ladvien.com/images/cloud-vision-enable-button.png)