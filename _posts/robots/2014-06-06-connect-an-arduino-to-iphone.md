---
layout: article
title: iOS to µC Using HM-1X in Objective-C
categories: robots
excerpt:
tags: [robots]
image:
  feature: Botting_iOS.png
  teaser: Botting_iOS.png
  thumb:
comments: true
---

Originally posted on [www.letsmakerobots.com](www.letsmakerobots.com)

(This node will probably float a bit, have lots of work to do on it. My apologies.)

I'd been wanting to create a bridge between Arduino and iOS for awhile. Not going to lie, not a huge fan of iOS devices, but since my wife won an iPad Mini I've begrudgingly accepted they fill a need. Still, my hacking has orbited robotics and any device I can't connect to a robot frustrate me. Well, a year ago I realized an [iPad Mini would connect to an HM-10](https://www.youtube.com/watch?v=1a9xLfBH-hc), and therefore, robot.

Sadly, the app used to connect to the HM-10 was [LightBlue](https://itunes.apple.com/us/app/lightblue-bluetooth-low-energy/id557428110?mt=8), an app with little versatility. However, it allowed me to confirm everything was in place to the connect the iPad Mini and a robot.  Of course, I wasn't willing to pay several hundreds of dollars at the chance I could develop an app.  Well, the idea got filed under "NSF."  

But, two months ago I was contacted by Simon Riley, the CEO of [Carduino](http://carduino.co.uk).  He asked why I had stopped short of developing an iOS app to interface with the HM-10 BLE Serial modules.  My response was short: Lack of funds.  I explained to develop in iOS (legally, and therefore weary and worry free) you need an iOS developer's license _and_ a Mac to develop from; I hadn't money for either.  Simon responded the next day, "Maybe we can help with that."

Long story short, Carduino donated to the cause and I used my robot allowance (you married guys understand) to purchase the rest.  So, what did I get?

Mac Mid 2009

![](/images/Mac_Pro.png)

Price ended at $469.99\.  I spent a little more than I should, but since Carduino had added to the kitty I was worried about getting something I'd be unable to run Xcode.  Therefore, I spent a little extra in hopes to get a machine that would allow me to write code efficiently.

![](/images/Amys_Mac.png)

I have to take a moment and remind people, I wear a white hat.  Dear [Amy2865](http://www.ebay.com/usr/amy2865), before you sell a laptop, be sure to log out of your eBay account. Also, [Jared Kusma](https://www.amherst.edu/athletics/archives/2011-12/golf-m/roster/bios/kusma), I'm liking your laptop, but I _did _clean the keyboard thoroughly before using it.  And the spots on the screen.

Alright, enough of the teasing. Moving on.

I deal with clinical [delusions](http://en.wikipedia.org/wiki/Delusional_disorder).  But, I'm learning to force them to serve me.  I realize I'll never be as good as I feel in the throes of a delusion.  Yet, I've allowed these words to guide me,

**Believing I can do anything, may not be true.  But believing it is enables me to do_ almost_ anything.**

Well, when I accepted Carduino's funds to help develop an app I might have been delusional.  I didn't tell anyone I'd never used a Mac before, let alone wrote Objective-C.  But one thing I believed, if I determine myself to do something I will.  Of course, my timeframe is my own and the product might be apparently hackish, but it _will_ get done.

Anyway, I admittedly had no idea what I was doing, so I decided to journal as I went.

This brings me to my disclaimer:

**I am _not_ a professional programmer.  I do not pretend to be. With that, please feel free to point out my mistakes, inefficiencies, or ineffective code in general.  Part of the reason I post articles like this is for the peer-review.  But don't expect me to apologize much for stuff I didn't catch.  Working a full-time job in a non-tech field, having a wife in graduate school, raising a four-year-old, well, these things leave me little time to program, _and nearly no time for code review._**

I don't think there are mistakes in my code, I _know_ there are.  Alright, self-deprecation aside, let's get going.

**1\. Setting up the Environment**

![](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOQ-5BA-cQGeZvjQRV20EJkij2JHa5Z-BmXaDlnlhqzVzroYopRg)First, you need a Mac and a Developer's License.  The Mac really needs to be at least 2008 or later to effectively code for the current iOS (7.1 at writing, 8.0 being in beta).

After looking over many "deals" on eBay I decided on a Mac Book Pro 2009\.  It seemed old enough people didn't have an unhealthy attachment.  Later than 2009, it was like people were selling their pretty daughter.

I chose the Mac Book over Mac Mini.  The Mac Book came with a monitor and peripherals.  Maxhirez warned me some Mac Mini's have proprietary video out, which would force me to buy a monitor as well.

I was a _a lot_ worried an eBay Mac would be DOA.  When it finally came in, I was relieved to see it boot up.  But, within an hour it overheated and crashed.  Worried the crap out of me.  I then realized this laptop had two video cards and the display settings were full-blast.  I backed down the video settings and the temperature seemed to hold.  Still a little worried.  When I get the app written for Carduino I'll probably take it apart, clean the heat-sink fins and reapply thermal paste.

So, price for the Mac: **$469.99**



![](/images/Dev_Web2.png)

Well, I had the Mac, now what?

I began researching costs for [iOS developers' license](https://developer.apple.com/programs/ios/).  It's $99 a year.  

This is supposed to allow you to write and _publish_ iOS for the entire year.  I bit the bullet and ordered it.

**Purchase the Publisher's License:**

*   [iOS Developer License Purchase](https://developer.apple.com/programs/ios/)

**Download Xcode**

Once you have your Mac and Developer License, time to setup Xcode.

*   [Xcode 5](https://itunes.apple.com/us/app/xcode/id497799835?mt=12#)

![](/images/Screenshot_2014-07-14_22_41_42.png)

If you try to compile your app and you **get an error regarding a certificate,** and doesn't automatically resolve, you can download a certificate manually.

**Download Developer certificate**

1\. Log on to [iOS Dev Center](https://developer.apple.com/devcenter/ios/index.action) and Download you Developer Certificate

![](/images/Screenshot_2014-07-14_22_59_42.png)

You will need to apply this certificate to the apps you write to publish them--even on an ad hoc basis.

**2\. The App We'll Write**

This write-up describes writing an app for Bluetooth 4.0 iOS devices to enable a serial connection to an Arduino. To facilitate the serial connection on the Arduino-end a HM-10 acts as a peripheral, which in turn, interacts with the Ardunio via a serial connection.

[![](https://i1.ytimg.com/vi/CfkU0xoOSNU/0.jpg)](http://youtu.be/CfkU0xoOSNU)

The HM-10 operates on 3.3v and the Arduino 5v, but I created an Instructable on how to convert the HM-10 to 5v.

*   [How to Create an Arduino Compatible Bluetooth 4.0 Module](http://www.instructables.com/id/How-to-Create-an-Arduino-Compatible-Bluetooth-40-M/)

The HM-10 is a low cost (6.87 USD, shipping ~.20) Bluetooth 4.0 module.

*   Order from Fastech: [HM-10](http://www.fasttech.com/products/0/10004051/1292002-ti-cc2540-cc2541-bluetooth-4-0-ble-2540-2541)

**3\. Preparing to Develop in Xcode 5**

Before I started this project I'd never used a Mac, never seen Xcode 5, let alone looked at Objective-C code.  But, like the delusional man I am, I thought, "Well, it's got the word 'C' in its name; couldn't be that hard for me to learn."  Stupid me.

Objective-C is silly.  Well, I shouldn't say its entirety is silly; the verbosity and syntax are silly, though.  The idea being everything is spelled out, nothing abbreviated, which makes the code chewy to read.  Anyway, I'll stay away from psychological rants about brevity being the essence of wit.  Or how humans will psychologically gravitate towards messages easy to [encode and decode](http://en.wikipedia.org/wiki/Encoding_(memory)).

This article isn't going to go into much on how to write Objective-C or use Xcode, since there are already many excellent guides.

The site I found most useful was Ray Wenderlich's

*   [Ray Wenderlich](http://www.raywenderlich.com/tutorials)

His written tutorials are free, but giving the visual component of Xcode I paid $15 for a subscription to his video tutorials.  Both written and video tutorials are excellent.  Learned pretty much everything I needed from him and his peers.

I would list other tutorials, but really, Ray's covers everything you'd need to write this app--well, besides the Bluetooth part, which I'll cover.  But one surprisingly helpful video was Apple's introduction to **CoreBluetooth Framework**.

1.  [101 Core Bluetooth](https://developer.apple.com/videos/wwdc/2012/?include=703#703) (You need an Apple Device to watch it.)
2.  [Advanced Core Bluetooth](https://developer.apple.com/videos/wwdc/2012/?include=705#705) (You need an Apple Device to watch it .)

Also, several videos and articles I found:

1.  [InvasiveCode](http://weblog.invasivecode.com/post/39707371281/core-bluetooth-for-ios-6-core-bluetooth-was)
2.  [Chris Miles](http://vimeo.com/59765638)

Lastly, the iOS code I have _was not_ written by me.  I've just chopped it up in hopes to understand it.  The original author is a friend of mine:

*   [Musawir Shah](https://github.com/musawirali)

**4\. The UI Layout**

The app we're going to write is pretty simple.  _Really_, it is. It takes the values from two Slider Controls and sends them via Bluetooth to an Ardunio. The Arduino in turn converts these values into direction and PWM values for two wheeled-motors.

Ok, open Xcode and let's start a new project.  We are going to use a Single View project.

![](/images/Screenshot_2014-07-15_19_16_47.png)

The first step in creating our app will be laying out the user interface. This boils down to a few items.

View for Background Image:

*   3 x [Labels](https://developer.apple.com/library/ios/documentation/uikit/reference/UILabel_Class/Reference/UILabel.html) -- Steer Value, Acceleration Value, RX Data
*   2 x [Image Views](https://developer.apple.com/library/ios/documentation/uikit/reference/uiimageview_class/Reference/Reference.html) -- for Slider Tracks
*   2 x [Slider Controllers](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/UIKitUICatalog/UISlider.html) -- For PWM Values
*   2 x [Buttons](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/UIKitUICatalog/UIButton.html#//apple_ref/doc/uid/TP40012857-UIButton-SW1) -- TEST Send and Scan Devices Menu Button
*   1 x View -- Acts as a hideable container for scanned devices.

The Scan Devices View will act as a container for the Devices Table View. We will set its initial state to hidden and then reveal it programmatically triggered by the Devices Menu Button.

The Scan Devices View will have 2 items.

*   1 x [Button](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/UIKitUICatalog/UIButton.html#//apple_ref/doc/uid/TP40012857-UIButton-SW1) -- Back
*   1 x Table View -- Contains BLE Device information

If all goes right, our UI should end up looking something like this:

![](http://www.instructables.com/files/deriv/FMI/P890/HXII1V1E/FMIP890HXII1V1E.LARGE.jpg)

If you'd like to create your own layout, I've created a video you can follow along:

[![](https://i1.ytimg.com/vi/yy91GB2trpA/0.jpg?time=1405398901904)](http://youtu.be/yy91GB2trpA)

Or if you prefer, you can download my skeleton layout:

*   [Github bleApp](https://github.com/Ladvien/bleApp)

Just download the project as zip. Then, within the project there is another zip titled: bleAppStartLayout.zip Simply unzip this project and open it in xCode if you'd like to write your own code to go with the skeleton layout.

**5\. Code**

There are three parts to the code of our app.

Code to control...

1.  The Bluetooth connection
2.  User interface
3.  Devices List

In this article I'm only going to cover the Bluetooth code in depth.  The rest is either pretty straightforward

**Objective-C Bluetooth Code (and some UI):**

Before we get going, it'll help to be slightly familiar with Bluetooth 4.0's standards and protocols.  Also, iOS' recommendations on using CoreBluetooth, Apple's API for Bluetooth 4.0 hardware.

*   [Bluetooth 4.0: Low Energy](http://chapters.comsoc.org/vancouver/BTLER3.pdf) (16-19)
*   [iOS' CoreBluetooth Central and Peripheral roles overview](https://developer.apple.com/library/ios/documentation/NetworkingInternetWeb/Conceptual/CoreBluetooth_concepts/CoreBluetoothOverview/CoreBluetoothOverview.html#//apple_ref/doc/uid/TP40013257-CH2-SW1)

The big take away for us is the differences between Central and Peripheral roles.

![](/images/Central_Peri_LMR.png)

This doesn't mean our bot cant receive data or iOS device can't send data, it simply defines the relationship between the devices.  The role decides which device controls the connection and data flow.  For the sake of this app the **bot will be setup as a Peripheral** and the **iOS device will be the Central**.  This is my opinion, but it seems the BLE hardware connected to the uC or CPU with the greatest speed should take the Central role.

**The header file -- bleApp.h**

To access the Bluetooth 4.0 functionality of compatible iOS devices, Apple provide the [CoreBluetooth Framework](https://developer.apple.com/library/ios/documentation/NetworkingInternetWeb/Conceptual/CoreBluetooth_concepts/AboutCoreBluetooth/Introduction.html#//apple_ref/doc/uid/TP40013257).  This framework is brought into your app code in the typical C fashion, by importing it in **bleApp.h**

{% highlight objective-c %}
#import <CoreBluetooth/CoreBluetooth.h>
{% endhighlight %}

Once the framework is imported we have access to the API methods.  

References to the methods can be found here:

*   [CBCentralManagerDelegate Protocol Reference](https://developer.apple.com/library/mac/documentation/CoreBluetooth/Reference/CBCentralManagerDelegate_Protocol/translated_content/CBCentralManagerDelegate.html#//apple_ref/occ/intfm/CBCentralManagerDelegate/centralManagerDidUpdateState:)
*   [CBPeripheral Delegate Protocol Reference](https://developer.apple.com/library/mac/documentation/CoreBluetooth/Reference/CBPeripheralDelegate_Protocol/translated_content/CBPeripheralDelegate.html)

Alright, I'm going to attempt explaining something I poorly understand, Objective-C Delegates.

I believe a delegate is a collection of services your code can subscribe.  I think of them much like interrupts in Arduino.  Each time a specific event happens a method is called.  You setup the delegates you wish to subscribe at the top of your **bleApp.h**:

{% highlight objective-c %}
@interface ViewController : UIViewController <CBPeripheralDelegate,
CBCentralManagerDelegate, UITableViewDelegate, UITableViewDataSource>
{% endhighlight %}

Here we are calling on subscribing to four delegates:

1.  CBPeripheralDelegate
2.  CBCentralMAnagerDelegate
3.  UITableViewDelegate
4.  UITableViewDataSource

The CoreBluetooth Central Manager, the CoreBluetooth Peripheral, User Interface Table View Delegate, and the User Interface Table View Data Source.  Right now we are only going to **focus on the Bluetooth delegates**.

Another way to think of delegates is a collection of little scout robots who report when a specific event takes place.

![](/images/Central_Manager_Delegate_15.png)

These delegates are a collection of little methods who will be called at specific events.  For example, the CBPeripheralDelegate has the method **-(void)peripheral:(CBPeripheral *)peripheral didDiscoverServices:(NSError *)error**.  This method is called whenever iOS app discovers BLE peripheral.  Again, these methods are **event** driven--this means something usually has to happen before the come report to your code.

Here are the major methods we will be using to control the iOS BLE hardware:

1.  **centralManagerDidUpdateState**
2.  **centralManager DidDiscoverPeripheral**
3.  **centralManager didConnectPeripheral**
4.  **peripheral didDiscoverServices**
5.  **peripheral didDiscoverCharacteristicsForService**
6.  **pierpheral didDiscoverDescriptorsForCharacteristic**

Next, we declare the properties we will need.  If you know as little about Objective-C properties as I did here's a [good tutorial](http://rypress.com/tutorials/objective-c/properties.html).

{% highlight objective-c %}
//
//  ViewController.h
//  Carduino
//
//  Created by Ladvien on 6/21/14.
//  Copyright (c) 2014 Honeysuckle Hardware. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <CoreBluetooth/CoreBluetooth.h>

@interface ViewController : UIViewController <CBPeripheralDelegate,
CBCentralManagerDelegate, UITableViewDelegate, UITableViewDataSource>

// Instance of Central Manager.
@property (strong, nonatomic) CBCentralManager *centralManager;
// Stores a list of discovered devices, the key being their UUID.
@property (strong, nonatomic) NSMutableDictionary *devices;
// Instance method, used to act when a peripheral is discovered.
@property (strong, nonatomic) CBPeripheral *discoveredPeripheral;
// Instance method, used to act when a peripheral is selected to connect.
@property (strong, nonatomic) CBPeripheral *selectedPeripheral;
// Holds UUIDs.
@property (readonly, nonatomic) CFUUIDRef UUID;
// Stores peripheral characteristics.
@property (strong, nonatomic) CBCharacteristic *characteristics;
// Stores the advertising data of a peripheral.
@property (strong, nonatomic) NSMutableData *data;
@end
{% endhighlight %}

That should be all the code we need in our header file.

**bleApp.m -- Our Implementation**

**1\. The UI Connection**

Objective-C operates under the [Modal-View-Controller](https://developer.apple.com/library/ios/documentation/general/conceptual/CocoaEncyclopedia/Model-View-Controller/Model-View-Controller.html) design modal.  We don't have to go too deep into this design theory to be dangerous, the main thing we want to take away is UI elements are connected to our code with keywords.  For UI elements we wish to change programmatically we set a **IBOutlet** and for UI elements we wish to generate an action we use the **-(IBAction)** methods.

An example of using an IBOutlet would like this: **rxLabel.text = @"Got data";**

An example of a -(IBAction) method would be:

**-(IBAction)menuButtonTouchUp:(id)sender{ [do stuff] };**

All good, now how do we make IBOutlets and IBActions?  First, click on the "Tuxedo" button

![](/images/Tux_View.png)

Now, hold CONTROL and click on the UI element you want to create an Action or Outlet, then drag to your code between **@interface** and **@end.**

![](/images/Drag_for_Outlet.png)  


[Ray Wenderlich's tutorials](http://www.raywenderlich.com/25561/learn-to-code-ios-apps-3-your-first-app) explain this process well.  So, I wont rehash.  A couple hints though, you can type out each of the IBOutlets and IBActions, but unless the dot on the bar next to where it is written is filled in, it is not connected to an element.  Also, if you hover your mouse over the little dot while in tuxedo-view, the element it is connected to will be highlighted.  

Ok.  So, we need to connect up all of our UI elements.  I'll simply refer back to my video on the layout.  Or I suggest you use the skeleton bleApp layout, since I've already wired up the UI elements.

Either way, we need to end up with code that looks something like this:

{% highlight objective-c %}
#import "ViewController.h"
@interface ViewController ()

// Timers.
@property (nonatomic, retain) NSTimer *steerSliderRecoilTimer;
@property (nonatomic, retain) NSTimer *accelerationSliderRecoilTimer;
@property (strong, nonatomic) IBOutlet UITableView *tableView;

//Outlets.
@property (strong, nonatomic) IBOutlet UIView *mainView;
@property (strong, nonatomic) IBOutlet UILabel *steerLabel;
@property (strong, nonatomic) IBOutlet UISlider *steerSlider;
@property (strong, nonatomic) IBOutlet UISlider *accelerationSlider;
@property (strong, nonatomic) IBOutlet UILabel *accelerationLabel;
@property (strong, nonatomic) IBOutlet UIView *devicesView;
@property (strong, nonatomic) IBOutlet UILabel *RSSI;
@property (strong, nonatomic) IBOutlet UILabel *rxDataLabel;

//Buttons in Devices Table.
@property (strong, nonatomic) IBOutlet UIButton *backFromDevices;
@property (strong, nonatomic) IBOutlet UIButton *test;

//BLE
@property (strong, nonatomic) IBOutlet UIButton *scanForDevices;

// Bytes used for switch-array.
@property (assign) uint8_t accelerationByte;
@property (assign) uint8_t steeringByte;

//Steer slider.
- (IBAction)steerSlider:(id)sender;
- (IBAction)steerSliderTouchUp:(id)sender;
- (IBAction)steerSliderTouchUpOutside:(id)sender;
- (IBAction)steerSliderTouchDown:(id)sender;


// Accceleration slider.
- (IBAction)accelerationSlider:(id)sender;
- (IBAction)accelerationSliderTouchUp:(id)sender;
- (IBAction)accelerationSliderTouchUpOutside:(id)sender;
- (IBAction)accelerationSliderTouchDown:(id)sender;

// Menu
- (IBAction)menuButtonTouchUp:(id)sender;
@end
{% endhighlight %}

**1\. CBCentralManager**

Ok, let's get our Bluetooth going.  Objective-C has a method that runs once if the UI loads, **-(void)viewDidLoad** method.

{% highlight objective-c %}
- (void)viewDidLoad
{
    [super viewDidLoad];

    // Allocates and initializes an instance of the CBCentralManager.
    _centralManager = [[CBCentralManager alloc] initWithDelegate:self queue:nil];
}
{% endhighlight %}

We will add more code in this method later, but for now this will work.  Here, we are simply allocating and initializing an instance of the CBCentralManager object.  It has two arguments, **initWithDelegate**, we set this to self and the queue we set to nil.  This allows us to inherit the CBDelegate from the ViewController.h.  The queue being set to nil simply means we are going to allow the CentralManager to manage our data.

![](/images/Msg_sir_3.jpg)

![](/images/bluetoothOniOs.jpg)

**centralManagerDidUpdateState**

This method is called each time the BLE hardware on the iOS device changes state.  Here, we are using it to check if the iOS' Bluetooth hardware has been turned on.

The **centralManagerDidUpdateState** is a method called by the CoreBluetooth (CB) Central Manager Delegate whenever the BLE hardware in your device changes state.  Here, it is being called when our app first begins.  It will also be called each time the iOS Bluetooth is turned on or off.

{% highlight objective-c %}
// Make sure iOS BT is on.  Then start scanning.
- (void)centralManagerDidUpdateState:(CBCentralManager *)central {
    // You should test all scenarios
    if (central.state != CBCentralManagerStatePoweredOn) {
        // In case Bluetooth is off.
        return;
        // Need to add code here stating unable to access Bluetooth.
    }
    if (central.state == CBCentralManagerStatePoweredOn) {
        //If it's on, scan for devices.
        [_centralManager scanForPeripheralsWithServices:nil options:nil];
    }
}
{% endhighlight %}

The [central.state](https://developer.apple.com/library/ios/documentation/CoreBluetooth/Reference/CBCentralManager_Class/translated_content/CBCentralManager.html)** property is set by the CBCentralManager Delegate.  It has six states:

1.  CBCentralManagerStateUnknown  -- Device can't be read, etc.
2.  CBCentralManagerStateResetting -- Device is resetting
3.  CBCentralManagerStateUnsupported -- this device doesn't support BLE.
4.  CBCentralManagerStateUnauthorized -- Your app isn't authorized to use BLE
5.  **CBCentralManagerStatePoweredOff**
6.  **CBCentralManagerStatePoweredOn**

We will only be using the last two states.  Our code checks if the BLE hardware is enabled; if it is not, it does nothing.  Eventually, I'll probably add an alert to notify the user, but right now, it does nothing. If the hardware is enabled, then it executes the centralManager instance method with two arguments **scanForPeripheralsWithServices: nil** and **options: nil.**  

In case you didn't have time to read the BLE protocol manual, I'm going to give you a crash course.  Let's start with the service tree.  The magic of Bluetooth lies in its advertisment protocol.  The Central BLE device is scanning the air, while the Peripheral is advertising its information.  The information advertised coordinates services the peripheral device has available.  

If you have a minute, Ada has an _excellent_ article on Generic Attribute Profile (GATT) written by Keven Townsend (I like his stuff).

*   [GATT](https://learn.adafruit.com/introduction-to-bluetooth-low-energy/gatt)

**![](/images/TreeOfServicesAndCharacteristics_Remote_2x.png)**

Keep two things in mind, first, I'm still learning what the hell I'm talking about.  Two, [jnhuamao](http://www.jnhuamao.cn) and I have a history.  I've watched their BLE firmware develop over the years.  When the first procuded the HM-10, it didn't conform to _any_ BLE protocols.  Now, they've got a damn fine product.  Of course, they seem to be trying to get old school Bluetooth thinking to fit BLE.  For instance, they equate the "Master" role of their modules with Central role protocol. Likewise, they equate "Slave" with Peripheral role.  This confuses me a little, since

For the HM-10 it looks something like this,

![](/images/HM-10_Serv_Tree.png)

When iDevice scans the HM-10 it'll report back the FFE1 characteristic, which is the characteristic address for RX/TX on the HM-10.

**![](/images/Msg_sir_3.jpg)**

** centralManager didDiscoverPeripheral**

The centralManager didDiscoverPeripheral method executes every time a new service has been discovered.  It provides several bits of information about the discovered peripheral.  First, the peripheral information itself, this includes its name, UUID, etc.  Further information can be pulled from the advertisementData dictionary.  Lastly, which is a neat attribute of BLE, you can access the RSSI of the discovered device before ever connecting.

{% highlight objective-c %}

// Report what devices have been found.
- (void)centralManager:(CBCentralManager *)central
 didDiscoverPeripheral:(CBPeripheral *)peripheral
     advertisementData:(NSDictionary *)advertisementData
                  RSSI:(NSNumber *)RSSI
{
    // Set peripheral.
    _discoveredPeripheral = peripheral;

    // Create a string for the discovered peripheral.
    NSString * uuid = [[peripheral identifier] UUIDString];

    if (uuid) //Make sure we got the UUID.
    {
        //This sets the devices object.peripheral = uuid
        [self.devices setObject:peripheral forKey:uuid];
    }

    //Refresh data in the table.
    [self.tableView reloadData];

}
{% endhighlight %}

**9: **Our code set an instance variable **_discoveredPeripheral** to the most recent discovered peripheral.

**12:** Creates a string variable and sets it to the discovered peripheral's UUID.

1**4:** Checks to see if we got a proper UUID string in the uuid variable.

**17:** Here we are calling the setter method for the **devices NSMutableDictionary**.  We are setting the object service information from the discovered peripheral and the key is the discovered peripheral's UUID.  This is going to allow us to recall at least 6 discovered services.

**- (NSMutableDictionary *)devices Sett Method**

We are going to store the last six peripherals discovered.

{% highlight objective-c %}
- (NSMutableDictionary *)devices
{
    // Make sure the device dictionary is empty.
    if (_devices == nil)
    {
        // Let's get the top 6 devices.
        _devices = [NSMutableDictionary dictionaryWithCapacity:6];
    }
    // Return a dictionary of devices.
    return _devices;
}
{% endhighlight %}

**4:** We check to see if we've initialized the dictionary.  **7:** If we haven't then we setup the dictionary with a six device slots, then, we set a slot to the last discovered device.

**10:  **When we are done, we return the **devices** dictionary.

The devices method will be called many times throughout our program.  Eventually, we will use the dictionary to populate a table of discovered devices.

**![](/images/Msg_sir_3.jpg)**

**centralManager didConnect**

The centralManager didConnect method executes whenever your app connects to a specific BLE device.

{% highlight objective-c %}
// Run this whenever we have connected to a device.
- (void)centralManager:(CBCentralManager *)central didConnectPeripheral:(CBPeripheral *)peripheral {

    // Set the peripheral delegate.
    peripheral.delegate = self;
    // Set the peripheral method's discoverServices to nil,
    // this searches for all services, its slower but inclusive.
    [peripheral discoverServices:nil];
}
{% endhighlight %}

**5: **Once we've connected we activate the peripheral delegate methods.

**8:** After we have connected to a particular peripheral, we call the **peripheral discoverServices** method.  Again, by setting the **discoverServices** to **nil** we search for all services on our newly connected peripheral.

**2\. CBPeripheralDelegate**

**![](/images/Msg_sir_3.jpg)**

**peripheral didDiscoverServices**

Here, we enumerate through all the services on the connected peripheral.  This is a slow way to discover services, but it's inclusive and easy.  And since the HM-10 only has two services, and only one service active at a time, we don't lose any time.

{% highlight objective-c %}
- (void)peripheral:(CBPeripheral *)peripheral didDiscoverServices:(NSError *)error
{
    // Enumerate through all services on the connected peripheral.
    for (CBService * service in [peripheral services])
    {
        // Discover all characteristics for this service.
        [_selectedPeripheral discoverCharacteristics:nil forService:service];
    }
}
{% endhighlight %}

**4:** This is a fancy for-loop called enumeration.  It goes through all the services listed in the **(CBPeripheral *)peripheral**, which is a small list on the HM-10\.  If it is in the peripheral role, which is default, it only has one service.

**7:** Here we call **discoverCharacteristics** method on each service on our connected device.  Again, passing the **nil** argument means we want to discover all characteristics, as oppossed to a specific.  Slow, but inclusive.

**![](/images/Msg_sir_3.jpg)**

**peripheral didDiscoverCharacteristicsForService**

For each service, we enumerate each of its characteristics.

{% highlight objective-c %}
- (void)peripheral:(CBPeripheral *)peripheral
didDiscoverCharacteristicsForService:(CBService *)service
             error:(NSError *)error
{
    // Enumerate through all services on the connected peripheral.
    for (CBCharacteristic * character in [service characteristics])
    {
        // Discover all descriptors for each characteristic.
        [_selectedPeripheral discoverDescriptorsForCharacteristic:character];
    }
}
{% endhighlight %}

**4:** We go through each characteristic of each service on the connected peripheral.

**7:** We call the **discoverDescriptorsForCharacteristic** method on each discovered characteristics.

**![](/images/Msg_sir_3.jpg)**

****peripheral** didDiscoverDescriptorsForCharacteristic**

We are accomplishing two things in this method.  First, we are getting the character version of the hex values FFE0

![](/images/TreeOfServicesAndCharacteristics_Remote_Var4.png)

**6: **The firs thing we do is convert the HM-10's characteristics from FFE1 to character values, 255 and 225\.  

**8: **Next, we check to see if we got two characters, and they are 255 and 225

**12-23**: We do a quick enumeration through the services and characteristics.  For each characteristic, for each service, we call the selectedPeripheral setter method.  We pass the **setNotifyValue** argument to **true**.  This automatically receives serial data.  Each time serial data is received the method

{% highlight objective-c %}
-(void)peripheral:(CBPeripheral *)peripheral didUpdateValueForCharacteristic:(CBCharacteristic *)characteristic error:(NSError *)error

{

    //Put RX data collection here.

}
{% endhighlight %}

We'll write our RX method when we get to UI, since we'll set our rxDataLabel to automatically update with incoming data.

Also, the we are setting up an automatic RX notification method.  But, another way to do this is by setting the **setNotifyValue** to false.  Then, each time you want to get RX data you can call the **didUpdateValueForCharacteristic** method manually.

{% highlight objective-c %}
- (void)peripheral:(CBPeripheral *)peripheral
didDiscoverDescriptorsForCharacteristic:(CBCharacteristic *)characteristic
             error:(NSError *)error
{
    //Store data from the UUID in byte format, save in the bytes variable.
    const char * bytes =[(NSData*)[[characteristic UUID] data] bytes];
    //Check to see if it is two bytes long, and they are both FF and E1.
    if (bytes && strlen(bytes) == 2 && bytes[0] == (char)255 && bytes[1] == (char)225)
    {
        // We set the connected peripheral data to the instance peripheral data.
        _selectedPeripheral = peripheral;
        for (CBService * service in [_selectedPeripheral services])
        {

            for (CBCharacteristic * characteristic in [service characteristics])
            {
                // For every characteristic on every service, on the connected peripheral
                // set the setNotifyValue to true.
                [_selectedPeripheral setNotifyValue:true forCharacteristic:characteristic];
            }
        }
    }
}
{% endhighlight %}

**![](/images/Msg_sir_3.jpg)**

**sendValue**

This method is called whenever we want to send information to the peripheral.  It has data passing argument **str**, but we wont be using it.  The app we are writing automatically assemblies a data string and send it to the peripheral each time it is called.  To send our data we simply must insure it is in the appropriate variable.

This app takes the values of two slider with a range of -255 to 255\.  We then do a little data manipulation.  On the iOS device a byte takes 8 bits.  Same for an unsigned character.  But I found if you assign a value greater than 127 then ARC will automatically generate two-bytes for a single unsigned value.  To get around this and hang on to full resolution of the Arduino, we convert the slider ranges from 255 to 125-0 or 125-1\.  The one is a bit set in a switch-array, **controlByte**.  Then, when the Arduino receives the data it converts it back to full range, 255.

Regarding the direction, using the same switch array, **controlByte**, we **set a bit low or high depending on whether the slider indicates 0 to -255 or 0 to 255**.  Again, when this makes it to the Arduino it is converted into direction of the motors.

Ok! Let's step through the code.

{% highlight objective-c %}
- (void)sendValue:(NSString *) str
{
    for (CBService * service in [_selectedPeripheral services])
    {
        for (CBCharacteristic * characteristic in [service characteristics])
        {
            // Round the float.
            steeringValue = lroundf(self.steerSlider.value);
            accelerationValue = lroundf(self.accelerationSlider.value);

            // SEND STRING
            //  DIR-MA    DIR-MB    PWM-MA  PWMA-MB EOTC
            //  CON Byte  CON Byte   0-255   0-255    :
            NSMutableData *myData = [NSMutableData data];

            // CONTROL BYTE
            //  BIT: 7=CAN'T BE USED
            //  BIT: 6=
            //  BIT: 5=Breaklights ON
            //  BIT: 4=Headlights ON
            //  BIT: 3=127+ MOTOR B
            //  BIT: 2=127+ MOTOR A
            //  BIT: 1=MOTOR B DIR
            //  BIT: 0=MOTOR A DIR
            NSUInteger controlByte = 0;


            //Steer value is negative number.
            if(steeringValue < 0)
            {
                // Set the reverse bit.
                controlByte |= 1 << 0;
                steeringValue = (steeringValue * -1);
            }

            // Acceleration value is a negative number.
            if(accelerationValue < 0)
            {
                // Set the reverse bit.
                controlByte |= 1 << 1;
                accelerationValue = (accelerationValue * -1);
            }

            // If steer motor is greater than 127.
            if (steeringValue > 127) {
                // Set the bit indicating 128-255.
                controlByte |= 1 << 2;
                // Remove excess from text.label
                steeringValue -= 128;
            }

            // If steer motor is greater than 127.
            if (accelerationValue > 127) {
                // Set the bit indicating 128-255.
                controlByte |= 1 << 3;
                // Remove excess from text.label
                accelerationValue -= 128;
            }

            //NSLog(@"After: %i", controlByte);
            // Breaklights
            //controlByte |= 1 << 5;
            // Headlights
            //controlByte |= 1 << 4;

            // Load all the data into myData.
            [myData appendBytes:&controlByte length:sizeof(unsigned char)];
            [myData appendBytes:&steeringValue length:sizeof(unsigned char)];
            [myData appendBytes:&accelerationValue length:sizeof(unsigned char)];

            // Create a string with all the data, formatted in ASCII.
            NSString * strData = [[NSString alloc] initWithData:myData encoding:NSASCIIStringEncoding];
            // Add the end-of-transmission character to allow the
            // Arduino to parse the string
            str = [NSString stringWithFormat:@"%@:", strData];

            // Write the str variable with all our movement data.
            [_selectedPeripheral writeValue:[str dataUsingEncoding:NSUTF8StringEncoding]
            forCharacteristic:characteristic type:CBCharacteristicWriteWithoutResponse];
                self.rxData = @" ";
        }
    }
}
{% endhighlight %}

**3-6:**Like before, we are enumerating through all services and characteristics on our connected peripheral.

**8-9**: We get the slider values, round them into an integer and load them into appropriate integer variables **steeringValue** and** accelerationValue**.

**14: **Setup a data variable to hold our send string.

**25: **We create a byte variable to act as our switch-array.

**29-42: **Determine direction the motors should go based on the sign of the sliders.

**45-58:** Decide whether we need to divide the range.

**67-69: **Load the processed data into data variable.

**72:** Create a string using the data we've processed, then, convert it to ASCII to be sent to the Arduino.

**75: **Add the ":" character, which will act as our end-of-transmission character.

**78:** _Finally,_ we send the completed data string to the peripheral.

_Voila!_

Full source code for this project can be found here:

*   [Ladvien's HM-10 Carduino App](https://github.com/Ladvien/Carduino)

Here's the Arduino sketch that goes with it:

*   [Ladvien's Carduino sketch](https://github.com/Ladvien/Carduino/blob/master/Carduino_iOS.ino)
