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

I've been working on writing my own uploader since May 2014.  Originally, I was trying to write an uploader in C using the GCC compiler.  The idea was to upload a Intel HEX file compiled for the LPC1114 to the uC remotely, using a Bluetooth LE connection.  Here's a description of the custom circuit board designed for the project:

* [Valdez Mutant Board](http://ladvien.github.io/robots/valdez-mutant-board/)

Unfortunately, the project was _way_ out of my league.  After spending months, after months writing C code there was nothing complete.  Of course, learned a lot about C, though.

Well, fast-forward a couple of years.  I started on a code base to upload compiled Atmel ATMega and ATtiny programs using the same method outlined in the Valdez Mutant article.  But this time, the uploader would be written in C# on Windows.  And it would interface with the [TinySafeBootloader](http://ladvien.github.io/robots/tsb/) on the Atmel chips.

Strangely, I actually finished the project--I ended being able to upload to ATtiny chips and ATMega chips over Bluetooth LE.

* [Lumi Uploader Proof of Concept](https://www.youtube.com/watch?v=mLfFbrijakc)

[](https://www.thestar.com/content/dam/thestar/life/homes/2014/02/27/sweet_price_for_winnie_the_poohs_tree_house/winnie.jpg.size.custom.crop.866x650.jpg){:class="ll-image-fl"}



However, when I Started trying to setup the code base for adding ESP8266 support--well, things went to the poo-house.




{% highlight c# %}
public bool CreateWatcher(SharperDevice.DeviceTypes watcherType, Int32 watcherTimeout)
{
    // 1. Create the watcher based on consumer choice.
    // 2. If constructed, add to dictionary and events.
    // 3. If creation was successful, return true.

    DeviceWatcher watcher = DeviceInformation.CreateWatcher(GetSelector(watcherType));
    if(watcher != null)
    {
        ListOfActiveDeviceWatchers.Add(watcher);
        SharperDeviceWatcherInfo watcherInfo = new SharperDeviceWatcherInfo(watcherType);
        DictSharperDeviceWatcherInfo[watcher] = watcherInfo;
        watcher.Added += Watcher_Added;
        watcher.Updated += Watcher_Updated;
        watcher.Stopped += Watcher_Stopped;
        watcher.Removed += Watcher_Removed;
        watcher.EnumerationCompleted += Watcher_EnumerationCompleted;
        WatcherRunTimer = new Timer(WatcherTimerExpired, null, watcherTimeout, Timeout.Infinite);
        return true;
    } else
    {
        return false;
    }
}
{% endhighlight %}
