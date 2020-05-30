---
layout: post
title: Lumi3 Debriefing Notes
categories: robots
excerpt:
tags: [robot, C#, TinySafeBoot]
image: 
    feature: Lumi_CSharp.png
comments: true
custom_css:
custom_js: 
---

# C# Learning Journal: Refactoring Lumi

## Lumi Uploader

I’ve been working on writing my own flash UART uploader since May 2014\. Originally, I was trying to write an uploader in C using the GCC compiler. The idea was to upload a Intel HEX file compiled for the LPC1114 to the uC remotely, using a Bluetooth LE connection. Here’s a description of the custom circuit board designed for the project:

*[Valdez Mutant Board](/images/robots/valdez-mutant-board/)

Unfortunately, the project was out of my league. After spending months writing C code there it was not usable. Of course, learned a lot about C in the process.

Well, after a couple of years I started on code to upload compiled Atmel ATMega and ATtiny programs using the same method outlined in the Valdez Mutant article. But this time, the uploader was written in C# on Windows. And it interfaced with the [TinySafeBootloader](/images/robots/tsb/) on the Atmel uCs.

Strangely, I actually finished the project. The first code-base was written as a [C# Forms application](https://msdn.microsoft.com/en-us/library/360kwx3z(v=vs.90).aspx). This worked out great! I was actually able to use the `System.Devices.Ports` to access a CH340G or FTDI chip. The USB-to-UART then shook hands with the bootloader on either an ATMega328P, ATtiny84, or ATtiny85 (others should be supported, but these were the only tested due to the simplicity of the Arduino HAL).

![](/images/lumi_blink_upload2.PNG)

Here’s the code base:

*[Lumi Uploader – Windows Forms Version](https://github.com/Ladvien/Lumi_TinySafeBoot_Uploader)

Of course, there is are a lot of problems with the code. Most center around inexperience writing object-oriented code.  

Here are some of the problems I identified:

<table>

<thead>

<tr>

<th>Mistakes</th>

</tr>

</thead>

<tbody>

<tr>

<td>1\. [God objects](http://sourcemaking.com/antipatterns/the-blob)</td>

</tr>

<tr>

<td>2\. [C# Conventions not followed](https://msdn.microsoft.com/en-us/library/ff926074.aspx)</td>

</tr>

<tr>

<td>3\. Deprecation (Forms->Universal)</td>

</tr>

<tr>

<td>4\. [Synchronous IO](https://msdn.microsoft.com/en-us/library/windows/desktop/aa365683(v=vs.85).aspx)</td>

</tr>

<tr>

<td>5\. Poor support for BLE</td>

</tr>

<tr>

<td>6\. Poor naming schemes</td>

</tr>

<tr>

<td>7\. Improper use of delegate / events</td>

</tr>

<tr>

<td>8\. Poor use of object abstraction</td>

</tr>

<tr>

<td>9. </td>

</tr>

</tbody>

</table>

It was really the lack of BluetoothLE support which forced a change in directions. However, the elusive wireless upload to an AVR was just too close to abandon. Reluctantly, I created yet _another_ code base. This time, it was derived from the [Windows Universal App](https://msdn.microsoft.com/en-us/windows/uwp/get-started/whats-a-uwp) platform.

After a few months I had a working version. It was able to upload to ATtiny chips and ATMega chips over Bluetooth LE.

*   [Lumi Uploader Proof of Concept](https://www.youtube.com/watch?v=mLfFbrijakc)

![](/images/pooh.png) However, when I started trying to add ESP8266 support–well, things went to the Pooh. It seemed of all the problems listed above the only one resolved was the adding of Bluetooth LE support.  My skill was not increasing.

Also, there were two additional issues which arose:

1.  Handling advertisement and connection for Bluetooth.
2.  There was a rather nasty bug around writing to a connected device.

The first issue was a nightmare. I was able to work around it–but, it was horrifically hackish. In short, there are two namespaces which must be used to achieve in app BluetoothLE search and connection, [Windows.Devices.Bluetooth](https://msdn.microsoft.com/library/windows/apps/windows.devices.bluetooth.aspx) and [Windows.Devices.Bluetooth.BluetoothAdvertisement](https://msdn.microsoft.com/library/windows/apps/windows.devices.bluetooth.advertisement.aspx). First, to find the BluetoothLE devices you’d need to instialize [BluetoothLEAdvertisementWatcher](https://msdn.microsoft.com/en-us/library/windows.devices.bluetooth.advertisement.bluetoothleadvertisementwatcher.aspx) object:

{% highlight csharp %}

  // Bluetooth LE Discovery
  BluetoothLEAdvertisementWatcher bleAdvertWatcher = new BluetoothLEAdvertisementWatcher();
  public sealed partial class MainPage : Page
  {
        // Create and initialize a new watcher instance.
        bleAdvertWatcher = new BluetoothLEAdvertisementWatcher();
        bleAdvertWatcher.Received += OnAdvertisementReceived;
        bleAdvertWatcher.Stopped += OnAdvertisementWatcherStopped;
        bleAdvertWatcher.ScanningMode = BluetoothLEScanningMode.Active;
        bleAdvertWatcher.Start();
  }

{% endhighlight %}

I’ll not dig into the details, but with this sample in mind here is the outline of how I achieved BluetoothLE in-app scan and connect.

1.  When OnAdvertisementReceived fires you get the discovered devices ID from the EventArgs
2.  After the user discovers the device sought, then a user input would start a the asynchronous creation of a BluetoothLEDevice using the ID found from the AdvertisementWatcher.
3.  Here’s where it gets hackish: If the device is successful in connecting, then there is no event–rather, a callback timer should be started with enough time for the BluetoothLEDevice to connect and enumerate.
4.  When the timer callback fires then, using the new var device = await BluetoothLEDevice.FromBluetoothAddressAsync(ID).
5.  After the wait, the services variable should have all of the services found on the BluetoothLEDevice. At this point, all the services on the remote device should be enumerated–and var services = device.GattServices, which includes enumerating services and characteristics.

What the API actually expects is the user will connect to the device using Windows built-in Bluetooth support. This API seems poorly thought out and unfortunate. Even Apple, with all of their “developer guidance”, doesn’t tie the developers’ hands when searching and connecting to BluetoothLE devices. Of course, CoreBluetooth was developed early in BluetoothLE’s lifecycle, so maybe that’s before API developers knew better than turn too much power over to code-consumers? Who knows! But I’ve strong feelings on the matter, given it took me so much time to figure out Microsoft’s intentions.  

And with that--I'm closing down the Lumi3 project and starting on Lumi4.