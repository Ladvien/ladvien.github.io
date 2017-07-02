---
layout: post
title: Lumi4 -- Unit and Integration Tests
categories: lumi
excerpt: 
tags: [robot, C#, TinySafeBoot]
image: 
    feature: Lumi_CSharp.png
comments: true
custom_css:
custom_js: 
---

## Unit and Integration Testing

I mentioned in an earlier entry that I had the hardest time differentiating between unit and integration tests.  But this distinction was critical for implementing tests which could cover frameworks designed to interact with embedded systems.  At least, in my perspective.  Below is an outline of how I'm structuring tests for the Lumi4 code base.

## [Lumi4.Tests](https://github.com/Ladvien/Lumi4/tree/master/Lumi4.Tests "Lumi4.Tests")

The unit tests namespace will contain all tests which cover methods which can be operate independtly, without communication of any other system then the program itself.    

For example,

{% highlight csharp %}
    [TestClass]
    public class Constructor
    {
    	[TestMethod]
    	public void WifiCentralManagerConstructor_Null_Exception()
    	{
    		bool ThrewNull = false;
    		try
    		{

    			WifiCentralManager wifiCentralManager = new WifiCentralManager(null);
    		}
    		catch (Exception ex)
    		{
    			ThrewNull = true;
    		}
    		Assert.IsTrue(ThrewNull);
    	}
    }
{% endhighlight %}

The test above covers a constructor method, which should always be able to execute effectively without any communication with a

## [Lumi4.IntegrationTests](https://github.com/Ladvien/Lumi4/tree/master/Lumi4.IntegrationTests "Lumi4.IntegrationTests")

In an earlier entry I reviewed the epiphanic difference between intergration and unit tests.  The intergration tests are really meant for code which relies on outside systems; database query result, characters from a filestream, or characters from a UART device.  For Lumi4 there are three systems which the program is depedent.

1.  Remote Bluetooth Device(s)
2.  Remote Wifi Device(s)
3.  Intel HEX Filestream

For the first two I've decided to focus on integration testing rather than mocks and stubs.  My reasoning is two fold, I will most likely be tweaking the firmware of the remote devices.  Secondly, I don't understand mocks and stubs yet.  Trying to focus on [MVP](https://en.wikipedia.org/wiki/Minimum_viable_product).    

Of course, when I finally put together a plan of action a new struggle arose.  A lot of my Bluetooth and Wifi handling was depedent on asynchronous callbacks.  And this isn't the easiest thing to tackle in MSTesting (which is the testing package I'm using for this iteration).  Eventually though, I hacked together the following logic

{% highlight csharp %}
    [TestMethod]
    public async Task Search_FindsWebServer_ValidIp()
    {
    	var localNetwork = Lumi4IntegrationTestSettings.LocalIP;
    	WifiCentralManager wifiCentralManager = new WifiCentralManager(localNetwork);
    	bool foundDevice = false;
    	wifiCentralManager.DiscoveredDevice += delegate (object obj, DiscoveredDeviceEventArgs args)
    	{
    		if (args.DiscoveredPeripheral != null) { foundDevice = true; }
    	};
    	wifiCentralManager.Search(90, 120);
    	await Task.Delay(Lumi4IntegrationTestSettings.SearchWifiCallbackDelay);
    	Assert.IsTrue(foundDevice);
    }
{% endhighlight %}

There are a few inputs which most be manually provided to the test, for example, the LocalIP and the target device's IP.  Scoped at the top of the method is a flag which will identify whether the device was found. It then takes this information, sets up a in method delegate (callback), and attempts to contact the device. Lastly, there is an async delay whose purpose is to allow the search enough time to properly execute. If the test finds the device within the given time, the callback is fired, and the flag set true. Otherwise, it returns failed.  

Not sure of the validity, but it's what I got (so far).