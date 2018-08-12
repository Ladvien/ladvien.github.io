---
layout: post
title: Recording Brain Waves to MongoDB
desription: A system to record EEG samples, store them on a remote server, and exposing the server to business intelligence platforms.
categories: data
excerpt:
tags: [Electroencephalography, EEG, NeuroSky, iOS, NodeJS, MongoDB, Tableau]
image: 
    feature: darius-bashar-529461-unsplash.jpg
    credit: Photo by Darius Bashar
comments: true
custom_css: 
custom_js: 
---

# Description
This project takes brain wave readings from a MindMobile 2+, transmits them to an iOS app via Bluetooth LE.  The iOS app makes  calls to a remote Node server, which is a minimal REST API.  The Node server stores the data to a MongoDB server.  The MongoDB server is then exposed to business intelligence application use with MongoDB BI Connector.  Lastly, using Tableau Professional Desktop, the data is accessed and visualizations created.

Whew.  To recap:

* 