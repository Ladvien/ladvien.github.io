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

For a long time now I've put off learning JavaScript.  It really never interested me.  I'd like to say it was the thought, "Oh, JavaScript is for web developers and I'm embedded all the way!"  But that wasn't really it.  I think it hasn't appealed to me because I couldn't connect it to hardware.  Well, at least, that was my assumption.

However, I've recently discovered Google's Web APIs.  Specifically, their Bluetooth Low Energy API. 

* [Google's Bluetooth Web API](https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web)

It's pretty amazing.  It allows a developer to write asynchronous JavaScript using [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to get into the hardware of the client's PC, all from the browser!

Now, this might sound like it open for security issues--and perhaps it will be.  But there are two requirements Google has put in place which hopefully gets around any issues.  First, the API can only be called by action.  Secondly, the API can only be called from a secured connection (HTTP over SSL).  


![](https://ladvien.com/images/2017-06-08-bluetooth-low-energy-javascript/BLE_scan.png)

Ok, there are few other downers to talk about.  First this only works in Chrome--but given this is a Google API, well, _duh_.  The other is not all OSes are currently supported.  The following I've tested and work right out of the box:

* Mac OS
* Android

The others which are supposed to be supported but I've not tested:

* Linux
* Windows (with some work)
* Chromium

Having worked with Bluetooth LE on all of these OSes I can say there is hope for Windows.  In fact, I think with the Creator's Update the Microsoft folk opened up the [last needed ingredient](https://blogs.windows.com/buildingapps/2017/01/13/new-bluetooth-features-in-creators-update-gatt-server-bluetooth-le/#cRIO1b8BMgFqCfrz.97).  The real hold out will be iOS.  Apple is not a fan of browser apps.  They would much rather browsing be done inside their native apps.  If I'm being positive, I'd say this is so Apple can make sure the mobile UX is excellent, and by forcing native apps, they have control by app approval.  If I'm being negative, well, Apple takes 30% on app purchases and web apps land them nada.  Just my opinion.

If you'd like to stay up to date on compatibility of BLE in the browser there is a an implementation status page on the Web Bluetooth Community Group:

* [Current Compatibility Matrix for Web Bluetooth](https://github.com/WebBluetoothCG/web-bluetooth/blob/master/implementation-status.md)

Sadly, right now iOS is the loser. 

Moving into the fun part.  Below is how to kick things off.

To begin, it will pay to keep the Mozilla Developer Netowork's Web Bluetooth API open for reference.

* [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)

The documentation is actually pretty robust--and with this guide, the process of subscribing to a device characteristic should be pretty straight forward.

The first piece we need are service IDs to search for. 

{% highlight js %}

let optionalServices = document.getElementById('optionalServices').value
	.split(/, ?/).map(s => s.startsWith('0x') ? parseInt(s) : s)
	.filter(s => s && BluetoothUUID.getService);

{% endhighlight %}

This takes the text element of the DOM element 'optionalServices', which should be in the in 16 bit hex format, 0x0000.  This becomes one of the service IDs searched in the Bluetooth LE search cycle.  For the Bluetooth module HM-10, HM-11, HM-16, HM-17 the service ID is 0xFFE0.

Moving on to the search, when the code below is executed the Chrome browser should show a search and pair menu (see image) for pairing a device.  When a device has been paired the promise will resolve returning the device which has been paired.

{% highlight js %}
				
navigator.bluetooth.requestDevice({
		acceptAllDevices: true,
		optionalServices: optionalServices
	})
		
{% endhighlight %}

It is important to note this block must be called by a user action.  For example, if set to execute on page load it will refuse to fire.  But if called onClick then it will show.  This is meant to provide more security to the API.

As stated, the requestDevice will return a device.  Using the promise `.then` we can begin working with the `BluetoothDevice`

* [BluetoothDevice](https://developer.mozilla.org/en-US/docs/Web/API/BluetoothDevice) 

Which is returned after it has been paired by the user.  The BluetoothDevice object has three items of interest.

* name -- which provides the string name of the device
* id -- the ID string
* gatt -- a `gatt` which contains a reference to the `BluetoothRemoteGATTServer` object

The `BluetoothRemoteGATTServer` interface contains many of the methods needed to interact with the Bluetooth device.  For example,

{% highlight js %}

device.gatt.connect()

{% endhighlight %}

Attempts to asynchronously create a connection with the device through a Promise.  If `.then` is attached then the method will return a `service` object if succesful.  If you are just looking to get something done with Bluetooth, feel free to keep hacking through this article (that's what I'd do--TL;DR).  However, if you want to know more about Bluetooth 4 protocol here a few useful links:

* [Generic Attributes (GATT)](https://www.bluetooth.com/specifications/generic-attributes-overview)
* [Bluetooth Core Specifications](https://www.bluetooth.com/specifications/bluetooth-core-specification)

Back to the code.

{% highlight js %}

.then(device => {
	pairedDevices[device.name] = device;
	return device.gatt.connect();
}).then
			
{% endhighlight %}

Once the connection attempt has been made and returned succesful, the [BluetoothRemoteGATTServer](https://developer.mozilla.org/en-US/docs/Web/API/BluetoothRemoteGATTServer) object returned can be petitioned for a list of services.

{% highlight js %}

....
	return device.gatt.connect();
})
.then(server => {
	return server.getPrimaryServices();
})
			
{% endhighlight %}

This will fire asynchronously using promises, and if succesful, return a [BluetoothRemoteGATTService](https://developer.mozilla.org/en-US/docs/BluetoothRemoteGATTService) object.  This represents all the services the device has public.  Then, the returned `service` object may be iterated over to identify get characteristics of the device.  (Almost to the data, I swear).

{% highlight js %}

....
return server.getPrimaryServices();
	})
	.then(services => {
	services.forEach(service => {
			
{% endhighlight %}

Essentially, the [BluetoothRemoteGATTService](https://developer.mozilla.org/en-US/docs/BluetoothRemoteGATTService) object is merely an array containing on the services.  Using a `services.forEach` we get each individual service to explore its characteristics.

Now, I'm going to add the whole block which is responsible for iterating over each service and its characteristics, essentially turning on notifications for each device.  This will ultimately allow a callback to be fired every every time the device sends data and a reference to a method by which data can be written to the device.

{% highlight js %}

	....
		let queue = Promise.resolve();
		queue = queue.then(_ => service.getCharacteristics()
			.then(characteristics => {
				characteristics.forEach(characteristic => {
					writeCharacteristic = characteristic;
					writeCharacteristic.startNotifications();
					resolve();
			}); // End enumerating characteristics
		})); // End queue
	}) // End enumerating services
}) // End Service exploration  
				
{% endhighlight %}

The queue is a promise which allows us to loop through services and characteristics without breaking asynchronousity.  Since this is my first JavaScript program, I will not try to explain it, but here's another guy's article which attempts to explain it:

* [Promise Patterns](https://www.promisejs.org/patterns/)

Essentially, each service and characteristic contained in the service enumerated.  At each characteristic there are two calls.  One is to get a reference to the characteristic for writing.  This is the global variable `writeCharacteristic`.  Then, notifications for the writeCharacteristic are started.  This will assure any time data is made available on the remote device our program is notified.

Now, it should be noted, this above code is hackish.  For example, what if there are multiple characteristics and the last one isn't the one we want to know about.  Well, we'd have a write reference to the wrong characteristic.  So, filtering to the desired characteritic is on my TODO list.

But, let's finish before refactoring.

Let's take a look at how to write data to the device after getting a reference to the desired characteristic.



{% highlight js %}

var write = function (data, string = true) {
	p = new Promise(function (resolve, reject) {
		// See if the device is paired.
		if (pairedDevices) {
			// Has a write reference been discovered.
			if (writeCharacteristic != null) {
				// Don't double encode.
				if (string) {
					let encoder = new TextEncoder('utf-8');
					writeCharacteristic.writeValue(encoder.encode(data));
				} else {
					dataInUint8 = Uint8Array.from(data);
					writeCharacteristic.writeValue(dataInUint8);
				}
				resolve();

			} else {
				reject("No write characteristic")
			}
		} else {
			reject("No devices paired.")
		}
	}).catch(error => {
	});
	return p;
}

{% endhighlight %}


The above method creates a promise and writes to the device asynchoronously.  On the way, it checks to make sure the device is paired (not connected, that's on the TODO list).  Also, it makes sure we still have a reference to the writeCharacteristic.  Then, it will either encode it in utf-8 and write the data, or if the `string` argument is false it'll just write the data.  After it has written the data, the resolve is executed.  This would allow the writeMethod to be called like so:

{% highlight js %}
	
write("Buggers", true).then(_ => {
	// Do something after write has completed.
})

{% endhighlight %}

Ok, last bit.  Let's setup capturing incoming data. To begin, I created a method which holds a list of all the callback methods to call when data has been received.

{% highlight js %}
	
var onReceivedDataCallbacks = [];
...
// Adds a function called when a BLE characteristic changes value.
// Mutiple callbacks may be added.
this.addReceivedDataCallback = function (callback) {
	if (writeCharacteristic) {
		writeCharacteristic.addEventListener('characteristicvaluechanged', callback);
		onReceivedDataCallbacks.push({
			key: callback.name,
			value: callback
		})
	}
}
	
{% endhighlight %}

This method allows a method's name to be passed in.  It then adds an event listener to this method, which will be called whenever characteristicvaluechanged.  Also, it saves this method's name in an array in case I want to stop notifications later (again, not completed, but on the TODO).

The purpose of allowing multiple callbacks is for when I'm working with many modules which all would like to know what's going on with the Bluetooth LE device.

For example, this module is meant to be a piece of a larger project, which is an uploader app using BLE to upload HEX files to AVRs running TinySafeBoot.

Ok, one last piece.  Let us see what the onRecievedData callback could looks like:


{% highlight js %}
    
this.onReceivedData = function (event) {
	// TODO: Handle received data better.  
	// NOTE: the TX buffer for the HM-1X is only 20 bytes.  
	// But other devices differ.
	var receivedData = new Uint8Array(event.target.value.byteLength);
	for (var i = 0; i < event.target.value.byteLength; i++) {
		receivedData[i] = event.target.value.getUint8(i);
	}
}

{% endhighlight %}

This is how I've written the notification of data callback.  The event.target.value contains the data, which is in an untyped array.  I choice to encode it into Uint8 as I'll be working with both ASCII and non-ASCII data.

Well, that's it.  This code will allow one to search, connect, write data to, and receive data from Bluetooth Low Energy devices from Chrome browser. Let me know if you have any recommendations.


Here is the full code referenced directly from my project:

{% highlight js %}
    
	{% include /snippets/js-ble/lumi-comm-ble.js %}
	
{% endhighlight %}