---
layout: post
title: Bluetooth Low Energy in JavaScript
desription: An expirement using Google's Bluetooth 4.0 JavaScript API to connect to the HM-10
categories: robots
excerpt:
tags: [javascript, bluetooth 4.0, Bluetooth Low Energy]
image: 
    feature: JS_CSS_HTML_BT.png
comments: true
custom_css: 
custom_js: 
- lumi-comm-ble
---


# BluetoothLE.js #

For a long time now I've put off learning JavaScript.  It really never interested.  I'd like to say it was the thought, "Oh, JavaScript is for web developers and I'm embedded all the way!"  But that wasn't really it.  I think it hasn't appealed to me because I couldn't connect it to hardware.  Well, at least, that was my assumption.

However, I've recently discovered Google's Web APIs.  Specifically, their Bluetooth Low Energy API. 

* [Google's Bluetooth Web API](https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web)

It's pretty amazing.  It allows a developer to right asynchronous JavaScript using [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to get into the hardware of the client's PC, all from the browser!

Now, this might sound like it open for security issues--and perhaps it will be.  But there are two requirements Google has put in place which hopefully gets around any issues.  First, the API can only be called from user interaction.  Secondly, the API can only be called from a secured connection (HTTP over SSL).  


![](https://ladvien.com/images/2017-06-08-bluetooth-low-energy-javascript/BLE_scan.png)

Moving into the fun part:

The 


Below is the module which controls the Bluetooth LE functions.

{% highlight javascript %}
    {% include /snippets/js-ble/lumi-comm-ble.js %}
{% endhighlight %}