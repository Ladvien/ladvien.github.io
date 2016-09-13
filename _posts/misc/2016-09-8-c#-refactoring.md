---
layout: article
title: "C# Learning Journal: Refactoring Lumi"
categories: misc
excerpt:
tags: [philosophy]
image:
  feature: csharper-ladvien-learning-journal.png
  teaser:
  thumb:
---

## Lumi Uploader

I've been working on writing my own flash UART uploader since May 2014.  Originally, I was trying to write an uploader in C using the GCC compiler.  The idea was to upload a Intel HEX file compiled for the LPC1114 to the uC remotely, using a Bluetooth LE connection.  Here's a description of the custom circuit board designed for the project:

* [Valdez Mutant Board](http://ladvien.github.io/robots/valdez-mutant-board/)

Unfortunately, the project was _way_ out of my league.  After spending months, after months writing C code there was nothing complete.  Of course, learned a lot about C, though.

Well, fast-forward a couple of years.  I started on a code base to upload compiled Atmel ATMega and ATtiny programs using the same method outlined in the Valdez Mutant article.  But this time, the uploader would be written in C# on Windows.  And it would interface with the [TinySafeBootloader](http://ladvien.github.io/robots/tsb/) on the Atmel chips.

Strangely, I actually finished the project.  The first code-base was written as a [C# Forms application](https://msdn.microsoft.com/en-us/library/360kwx3z(v=vs.90).aspx).  This worked out great!  I was actually able to use the `System.Devices.Ports` to access a CH340G or FTDI chip.  The USB-to-UART then shook hands with the bootloader on either an ATMega328P, ATtiny84, or ATtiny85 (others should be supported, but these were the only tested due to the simplicity of the Arduino HAL).

![](http://ladvien.github.io/images/lumi_blink_upload2.PNG){:class="ll-image-med-fl width="320px" height="320px""}

Here's the code base:

* [Lumi Uploader -- Windows Forms Version](https://github.com/Ladvien/Lumi_TinySafeBoot_Uploader)

Of course, there is are a lot of problems with the code.  Most center around inexperience writing object-oriented code properly.  Here are some of the problems I identified:

| Error  |
|---|
| 1. [Too many god objects](https://sourcemaking.com/antipatterns/the-blob) |
| 2. [C# Conventions were not followed](https://msdn.microsoft.com/en-us/library/ff926074.aspx) |
| 3. Deprecation (Forms->Universal) |
| 4. [Synchronous IO](https://msdn.microsoft.com/en-us/library/windows/desktop/aa365683(v=vs.85).aspx)|
| 5. No robust support for BLE|

It was really the last point which forced a change in directions.  The elusive wireless upload to an AVR was just too close.  Reluctantly, I created yet _another_ code base.  This time, it was derived from the [Windows Universal App](https://msdn.microsoft.com/en-us/windows/uwp/get-started/whats-a-uwp) platform.

After many months later I had procuded a working version. It was able to upload to ATtiny chips and ATMega chips over Bluetooth LE.

* [Lumi Uploader Proof of Concept](https://www.youtube.com/watch?v=mLfFbrijakc)

![](http://ladvien.github.io/images/pooh.png){:class="ll-image-med-fr"}
However, when I Started trying to add ESP8266 support--well, things went to the poo-house.  It seemed of all the problems listed above the only one resolved was the adding of Bluetooth LE support.

Also, there were two additional issues which arose:

1. Handling advertisement and connection for Bluetooth.  
2. There was a rather nasty bug around writing to a connected device.

The first issue was a nightmare.  I was able to work around it--but, it was horrifically hackish. In sum, there are two namespaces which must be drawn on: [Windows.Devices.Bluetooth](https://msdn.microsoft.com/library/windows/apps/windows.devices.bluetooth.aspx) and [Windows.Devices.Bluetooth.BluetoothAdvertisement](https://msdn.microsoft.com/library/windows/apps/windows.devices.bluetooth.advertisement.aspx).  First, to find the find BluetoothLE devices you'd need to setup a [BluetoothLEAdvertisementWatcher](https://msdn.microsoft.com/en-us/library/windows.devices.bluetooth.advertisement.bluetoothleadvertisementwatcher.aspx) object.  Like this:

{% highlight c# %}
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

I'll not dig into the details, but with this sample in mind here are the other steps which should be followed:

1. When OnAdvertisementReceived fires you get the discovered devices ID from the EventArgs
2. After the user discovers the device sought, then a user input would start a the asynchronous creation of a BluetoothLEDevice using the ID found from the AdvertisementWatcher.
3. Here's where it gets hackish: If the device is successful in connecting, then there is no event--rather, a callback timer should be started with enough time for the BluetoothLEDevice to connect and enumerate.
4. When the timer callback fires then, using the new var device = await BluetoothLEDevice.FromBluetoothAddressAsync(ID).
5. After the wait, the services variable should have all of the services found on the BluetoothLEDevice.  At this point, all the services on the remote device should be enumerated--and var services = device.GattServices, which includes enumerating services and characteristics.

What the API actually expects is the user will connect to the device using Windows built-in Bluetooth support. This API seems poorly thought out and unfortunate.  Even Apple, with all of their "developer guidance", doesn't tie the developers' hands when searching and connecting to BluetoothLE devices.  Of course, CoreBluetooth was developed early in BluetoothLE's lifecycle, so maybe that's before API developers knew better than turn too much power over to code-consumers?  Who knows! But I've strong feelings on the matter, given it took me so much time to figure out Microsoft's intentions.

The BluetoothLEScanningMode needs to be set to Active to get a lot of the advertised information.  
