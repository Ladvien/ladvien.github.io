---
layout: post
title: Recording Brain Waves to MongoDB
desription: A system to record EEG samples, store them on a remote server, and exposing the server to business intelligence platforms.
categories: data
excerpt:
tags: [Electroencephalography, EEG, NeuroSky, iOS, NodeJS, MongoDB, Tableau]
image: 
    feature: darius-bashar-529461-unsplash.jpg
    credit: Darius Bashar
comments: true
custom_css: 
custom_js: 
---

# Description
This project takes brain wave readings from a MindWave Mobile 2+, transmits them to an iOS app via Bluetooth LE.  The iOS app makes  calls to a remote Node server, which is a minimal REST API, passing off the brain wave sample.  The Node server stores the data on a MongoDB server.  The MongoDB server is then exposed to business intelligence applications use with MongoDB BI Connector.  Lastly, using Tableau Professional Desktop, the data is accessed and visualizations created.

Whew.  

To recap:
* [MindWave Mobile 2+](https://www.sparkfun.com/products/14758)
* [iOS App](https://github.com/Ladvien/MindWaveJournaler) (tentatively named Mind Wave Journaler; Swift)
* [REST Server](https://github.com/Ladvien/mind-wave-journal-server) (mind-wave-journaler; NodeJS)
* [MongoDB BI Connector Server](https://www.mongodb.com/products/bi-connector)
* [Tableau Desktop Professional](https://www.tableau.com/products/desktop)

The end result is a system which could allow a remote EEG analyst to examine samples nearly in real time.

![eeg-visualization](https://ladvien.com/images/eeg_poc_tableau_viz.png)

Below, I'm going to show how I was able to setup the system.  But, before that a few words of warning.

## Gotchas

### Hacker Haters
This isn't a hacker friendly project.  It relies on several paid licenses, an Apple Developer License ($99) and Tableau Desktop Professional ($10,000,000,000 or something).  Of course, the central piece of hardware, the MindWave Mobile, is also $99, but I think that one is fair.  Oh! Let's not forget, even though you bought an Apple Developer license, you still need a Mac (or Hackintosh) to compile the app.

However, as a proof-of-concept, I think it's solid.  Hopefully a good hacker will be able to see how several tweaks in the system could make it _dirt_ cheap to deploy.

### Mimimum Viable Hack..er, Product
The source code provided here is a [minimally viable](https://en.wikipedia.org/wiki/Minimum_viable_product).  Fancy words meaning, only _base_ functionality was implemented.  There many other things which could be done to improve each piece of the system. 

Not to be a douche, but please don't point them out.  That's the only thing I ask for providing this _free_ information.

There are many improvements I know can be made.  The reason they were not made had nothing to do with my ignorance (well, at least a majority of them), but rather my time constraints.

### I Hate Tableau
That's it.  I hate Tableau.

## Getting Started

Let's make a list of what's needed before beginning this project.

* Mac (to compile the iOS app)
* [MindWave Mobile 2+](https://www.sparkfun.com/products/14758)
* A remote server running Ubuntu 16.04 (theoretically a local server will work, but you'll be on your own)
* [Apple Developer License](https://developer.apple.com/programs/)
* [Xcode](https://developer.apple.com/xcode/), with Swift 4.1
* [CocoaPods](https://cocoapods.org/)
* [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/) Running on Ubuntu
* [MongoDB BI Connector Server](https://www.mongodb.com/products/bi-connector)
* A business intelligence platform with remote connection ability

Regarding the business intelligence platform--if anyone has a _free_ suggestions, please leave them in the comments below.  The first improvement I'd like to the entire system is to get away from Tableau.  Have I mentioned I hate it?

