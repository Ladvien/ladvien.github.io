---
layout: article
title: Apple Serial Manager
categories: robots
excerpt:
tags: [robots]
color: "#152a55"
image:
  feature: apple-hardware-logo.png
  teaser: apple-hardware-logo.png
  thumb:
comments: true
---

# Apple doesn't like robots.

It's strange, since they have some great hardware and some excellent software.  But alas, trying to get a robot to connect to any iOS product is like asking Steve Jobs to come to dinner; you'll get your hopes up, but, alas, he's dead.  So, short of a necromancy and some Frebreeze, it's not going to happen.

But, I've found the backdoor to getting your iOS device to help your robot, and my friend, I'm going to give you the key.

Those little HM-10 Bluetooth Low Energy PCBs that I've written about for so long.  Those combined with a iOS developer license ($99 a year) and you can get your robot to do all sorts of neat tricks using your iOS device for higher functions.

To catch you up on the HM-10,

*   [iOS to µC Using an HM-1X](http://ladvien.github.io/robots/connect-an-arduino-to-iphone/)
*   [HM-10](http://ladvien.github.io/robots/HM10/)
*   [Advanced(ish) HM-10](http://ladvien.github.io/robots/advancedish-hm-10/)

Ok.  Now, for the purpose of this post.  I have created some breakout boards that'll let you interface your microcontroller with Bluetooth, which will let you access your iOS device from your robot, but, not easily.

The CoreBluetooth API is a little abstract and cumbersome.  I've found myself writing the same code over-and-over as I try to get my robot to do cool tricks.  I think the closest I've come to something neat has been using my iOS device (iPhone 4S) as a robot radio controller.  Well, I decided I needed to start using the [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) method when I programmed.  It's funny. I think I've been writing in Swift since the first day you could compile in it, but I have been treating my writing as [procedural programming](https://en.wikipedia.org/wiki/Procedural_programming).  It was mainly out of ignorance, since I've always programmed procedurally, and when I started in languages which were meant to be written as [object-oriented](http://searchsoa.techtarget.com/definition/object-oriented-programming) (OO) languages I never took the time to learn the differences, nor how I should write.  It has made me very frustrated.  

But after some advice form [Mr. Bdk6](http://coolkidsrobots.com/users/bdk6) I took some time to try and understand the purpose of OOP.  Really, all I did was watch this video:

*   [Object-Oriented Programming](https://www.youtube.com/watch?v=lbXsrHGhBAU)

It was seriously enlightening.  Maybe I was primed for a thought-shift (for you 90's kids, "A paradigm shift.")  But the concepts of a encapsulation and message-passing were are forcefully explicit to a robot rebel.  A robot is self-contained system.  It has internal and external behaviors.  It has some information it shares with others; the same as message passing.  But other parts of its memory reserved for the robot only.  Object-oriented programming is something roboticist cannot help but do. 

All right, to the point of this article.

I am writing a CoreBluetooth handling class in Swift.  It is meant to take care of a lot of the boring responsibilities when communicating to a serial BLE device from an iOS device.  Things discovering services or characteristics, setting up buffers, handling autoreconnect on disconnect, or perhaps mapping the -20 to 127 RSSI on to a green to red color.  In short, all the boring stuff you must do to get your HM-10/11 to talk to an iOS and help a robot brother out, well, I hope this class will make it easy.  It should be noted, this Class is written in Swit 2.0, tested on an iPhone 6 with iOS 9.0.2 and 9.1.

Let's jump in,

The project can be found here:

*   [HMTerminal2](https://github.com/Ladvien/HM10Terminal2)

The project is an app meant for a iPhone.  It is simple.  It has one View which is blank, but has a "Scan" button which will provide a table list of all BLE devices in range.

The handler Class is here,

*   [bleSerialManager](https://github.com/Ladvien/HM10Terminal2/blob/master/HM10Terminal2/bleSerialManager.swift)

The following will be the explanation of the class API.

# **This is a Work-in-Progress! **

### **Initialize an instance of the bleSerialManager Class**

Before you can do anything with the class you must create an instance,

    //
    //  ViewController.swift
    //  HM10Terminal2
    //
    //  Created by Casey Brittain on 8/22/15.
    //  Copyright © 2015 Honeysuckle Hardware. All rights reserved.
    //

    import UIKit
    import CoreBluetooth

    let hm10serialManager = bleSerialManager()

    class ViewController: UIViewController, bleSerialDelegate {

Here we create an immutable instance of the **bleSerialManager**, we call it **hm10serialManager**.  This initializes a lot of properties you will need to handle the BLE devices discovered.  It _also _starts searching for advertising BLE devices.

Also, notice I initialized this instance before any other classes.  This is on purpose.  I want my **hm10serialManager** instance to be visible to all other Swift files in the project.  And a benefit of Swift design is such a declaration will do that, make your instance visible to all files.  After my bleSerialManager instance is initialized _then _ our ViewController class is initialized.  Notice, any Class which is meant to access the instance should include the **bleSerialDelegate**.  This requires the ViewController class to conform to the [protocol](https://developer.apple.com/library/ios/documentation/Swift/Conceptual/Swift_Programming_Language/Protocols.html) of our instance.  Currently, there are no required methods, but there are several optional methods, which I will detail later, but for now they are named: 

    optional func searchTimerExpired()
    optional func deviceStatusChanged()
    optional func connectedToDevice()

They are meant to be call back functions.

## **Set your bleSerialDelegate**

After you initialize your bleSerialManager instance **you must set the [delegate](https://www.andrewcbancroft.com/2015/04/08/how-delegation-works-a-swift-developer-guide/) in every class that will be receiving data from CoreBluetooth**.  This should be accomplished in the viewWillAppear, _not_ viewDidLoad.  This will assure everytime the view is visible it is ready for the data coming from the Bluetooth device.

    class ViewController: UIViewController, bleSerialDelegate {

        override func viewDidLoad() {
            super.viewDidLoad()
            // Do any additional setup after loading the view, typically from a nib.
        }

        override func viewWillAppear(animated: Bool) {
            hm10serialManager.delegate = self
        }

## **Define Device Behavior**

In all honesty, a lot of what has been done before is baked into the CoreBluetooth API, but here is where I start bringing added value.

    setAutomaticReconnectOnDisconnect(on: Bool, tries: Int, timeBetweenTries: Double)

This allows you to set whether you want your iOS device (usually the acting as the Master / Central) to automatically reconnect to the laster peripheral it was connected.  It takes three parameters.  The first, **on: Bool**, sets whether you want a reconnect behavior.  Then, **tries: Int** tells the instance how many times you want to try to reconnect to the last peripheral before it gives up.  And **timeBetweenTries: Double** is the amount of time in seconds you would like wait before your iOS devices tries to reconnect.

    setRetryConnectAfterFail(on: Bool, tries: Int, timeBetweenTries: Double)

Much like the afore stated function, this function defines what actions will be taken if your Central device is unable to connect to a device you tell it to connect.  To be specific, this function would execute if you tell your Central (iOS device) to connect to a peripheral, it begins to the steps intended for establishing connection, but is disrupted sometime before it establishes solid connection.

    setMutipleConnections(numberOfDevices: Int)

Here, you tell the iOS device to limit its number of connected devices.  It should be noted, this function does not look as how many connections are possible, but rather, how many connection you would like to limit your program to attempt.  

I found this function helpful since I had several HM-10 devices I was trying to connect.  Strangely, the HM-10 when in peripheral role can connect to a central role which has other connections established, but if the HM-10 is in central role it can only handle one connection.  Regardless, this is to prevent you program from wasting time attempting establishing a connection which is not needed.

**A few notes, **none of these behavior functions are required to be called.  The **bleSerialManager** will work proper without the calls; it defaults to the following,

**Default:**

    automaticReconnectOnDisconnect(on: true, tries: 3, timeBetweenTries: 1.0)
    setRetryConnectAfterFail(on: true, tries: 3, timeBetweenTries: 1.0)
    setMutipleConnections(numberOfDevices: 1)

## **Search for Devices**

After we have setup it's time to find some devices.

    // Begin search automatically.
    hm10serialManager.search(1.0)

This manually initiates the [Central Manager](https://developer.apple.com/library/prerelease/ios/documentation/CoreBluetooth/Reference/CBCentralManager_Class/index.html) search for peripherals.  If it discovers a peripheral it logs its information (mostly) in a Swift [dictionary](https://developer.apple.com/library/prerelease/ios/documentation/Swift/Conceptual/Swift_Programming_Language/CollectionTypes.html).  Each dictionary's values are keyed by the [NSUUID](https://developer.apple.com/library/prerelease/ios/documentation/Foundation/Reference/NSUUID_Class/index.html) discovered for a respective device.  Here are the types of data collected by the Central Manager,

    // Dictionaries for device details on discovered devices.
    private var discoveredDeviceList: Dictionary<NSUUID, CBPeripheral>
    private var discoveredDeviceListRSSI: Dictionary<NSUUID, NSNumber>
    private var discoveredDeviceListUUIDString: Dictionary<NSUUID, String>
    private var discoveredDeviceListNameString: Dictionary<NSUUID, String>
    private var discoveredDeviceListAdvertisementData: Dictionary<NSUUID, [String : AnyObject]>

Notice, these [fields](https://en.wikipedia.org/wiki/Field_(computer_science)) are all private (i.e., none are [made into properties](http://stackoverflow.com/questions/295104/what-is-the-difference-between-a-field-and-a-property-in-c)).  This is purposeful and doesn't necessarily comply with suggested Swift design.  I chose to follow the strict OOP design pattern of only exposing fields through methods.  That is, each of the properties other instances will have access to will be done so through a [getter method.](https://en.wikipedia.org/wiki/Mutator_method)

### **Optional Call Back Method #1**

Included in the bleSerialManager are several optional methods meant to serve as callbacks in your main instance.  The **searchTimerExpired()** method is called when the amount of search time passed to the **search()** has expired.  **Note,** the method is only called if it is unwrapped, which means you must declare the method in your main class for it to fire.  These methods are only attached if you include the **bleSerialDelegate.**

For example,

    //  Copyright © 2015 Honeysuckle Hardware. All rights reserved.
    //

    import UIKit
    import CoreBluetooth

    class mainViewController: UITableViewController, bleSerialDelegate {

        func searchTimerExpired() {
             // Only called at the end of search
             print("Your search for peripheral devices is over!")
        }

    ....

**Again**, if the **searchTimerExpired** method is not declared and you have not conformed to the **bleSerialManager **protocol by attaching the **bleSerialDelegate** this method will never fire.  

## **Get Discovered Devices' Information**

Let's go over the info which has been collected on our discovered devices.

    discoveredDeviceList: Dictionary<NSUUID, CBPeripheral>

This field contains dictionary items for each device discovered.  The items are a [CBPeripheral](https://developer.apple.com/library/prerelease/ios/documentation/CoreBluetooth/Reference/CBPeripheral_Class/index.html) instance.  Each instance contains most of the info you would like to know about the device.  In fact, the following dictionaries are simply this info broken out into separate dictionaries for ease of handling.

As I stated earlier, you cannot access bleSerialManager properties directly.  Instead, there is a getter method which will allow you get at the stored list.  

    let myDiscoveredPeripheralDictioanry = hm10serialManager.getdiscoveredDeviceDictionary()

This will retrieve a dictionary in the form of **Dictionary<NSUUID, CBPeripheral>**.  It really isn't my intention for this to be used often.  In fact, if you find yourself using it, please email me.  It means I didn't do a good job at making this class as versatile and easy as intended.  Nevertheless, it's there just in case.

    discoveredDeviceListRSSI: Dictionary<NSUUID, NSNumber>

This is one of my favorite attributes of BLE, the radio signal strength indicator.  It can be used for all sorts of neat tricks, especially for robots.  For example, let's say you put an HM-10 on a quadcopter and another on a controller. You've got a quadcopter controlled through Bluetooth.  But you start flying it away from you at high-speeds, yanno, to test it out.  Well, all of a sudden your HM-10s lose connection due to distance and your quadcopter flies off to oblivion, right?  Nope!  You have the quadcopter checking the RSSI as part of its flight procedures and if the RSSI is too great, then it will simply stop its existing flight and lower itself gently to the ground.  Cool, right?

Of course, there are two different points which you can access the RSSI, when the device has been discovered but not connected, and then when the device is connected.  How current the RSSI for discovered devices is dependent on several factors, but primarily, how often your central device is scanning for advertised packages and how often a peripheral is advertising.  It is usually somewhere between 200ms and 1500ms.

This one feature allows you to do neat stuff like this,

[![](https://i.ytimg.com/vi/vcrPdhN9MJw/hqdefault.jpg)](https://youtu.be/vcrPdhN9MJw)

Ok.  It's a neat feature, how do we get to it?

    func getDeviceRSSI(deviceOfInterest: NSUUID)->Int()

This method takes a NSUUID object as a key, looks through the discovered device list, and returns the RSSI indicator as an integer.  It should be called something like this,

    let myDeviceRSSI = hm10serialManager.getDeviceRSSI(myDeviceNSUUID)

Note, the RSSI value is updated every time the search method is called.  

Another fun RSSI function is,

    func getSortedArraysBasedOnRSSI()-> (nsuuids: Array<NSUUID>, rssies: Array<NSNumber>)

![](/sites/default/files//users/Ladvien/images/RSSI_Mapping_Table.png)This function takes no variables and returns two objects.  One is is an array of discovered NSUUIDs in ascending order of their RSSI (i.e., the closer they are the closer they are to 0-indexed).  The other is an array of NSNumbers representing the RSSI values of the corresponding NSUUID in the NSUUID array.

This method is meant for you to do neat things like shown in the image.  Here, I used an range mapping function to map the RSSI values onto a simple color scheme (red = -127 and green = -20).

Eventually, I will write a function to take the RSSI and return a UIColor value.

    func getDeviceName(deviceOfInterest: NSUUID)-> String

A fairly straight forward call.  It is meant to provide you quick access to a particular discovered device's name, as a string.  For example,

    let deviceName = getDeviceName(interestingDeviceNSUUID)
    print("The name of my the interesting device is: " + deviceName)

Along with this,

    func getDeviceUUIDAsString(deviceOfInterest: NSUUID)->String

This is a convenience method.  It is meant quickly get you a NSUUID as String.

## Discovered Peripheral Advertisement Data

I'm still experimenting with this section -- I'll have it up soon.

## Get Connected

After a search it's time to connect to a particular device.

    func connectToDevice(deviceNSUUID: NSUUID) -> Bool

When **connectoToDevice()** is called it takes one argument, the NSUUID of the discovered device you want to connect.  It will return **true** if the method is able to connect to the chosen device.  It will return **false** if you are already connected to that particular device, or if you have reached the maximum number of connected devices, or if the device was not found.

**connectToDevice() Example:**

    if(hm10serialManager.connectToDevice(myDeviceNSUUID)){
        print("Connected!")
    } else {
        print("Was unable to connect")
    }

This should attempt to connect to whatever device myDeviceNSUUID corresponds.  Aftere connecting to your device the bleSerialManager takes care of discovering the device's services, characteristics, and characteristics descriptors.  This can then be accessed with the following method calls.

    Huh, haven't written these methods yet

**Optional Call Back Method #2**

    optional func connectedToDevice()

The **connectedToDevice()** method is a call-back method which is part of the **bleSerialManager **protocol.  It is called whenever the bleSerialManager has successfully connected to a device.  **Note,** the method is only called if it is unwrapped, which means you must declare the method in your main class.  You must also conform to the **bleSerialManager** protocol.  This method is meant to update an UI with connection status.  Or do any house-cleaning after connection has been confirmed.

**10-05-16: Ok.  Got tired.  I'll write some more tomorrow.**
