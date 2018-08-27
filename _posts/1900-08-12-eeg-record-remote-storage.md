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

Ok, let's get started!

# Step 1: iOS App

I'm going to assume you have Xcode installed.

### Step 1.1: Install CocoaPods
[CocoaPods](https://guides.cocoapods.org/using/getting-started.html) is a package handler for Xcode.  We will be using it to install [Alamofire](https://github.com/Alamofire/Alamofire), which a Swift library for making HTTP requests.  We will need HTTP call support as we will call our server to store the EEG samples.


```
sudo gem install cocoapods
```
After you hit Return it will prompt for your password

![cocoapods-installation](https://ladvien.com/images/cocoapods_installation.png)

### Step 1.2: Setup Xcode Project
Now, let's setup a project folder.  This is main folder where all the iOS app code will live.  It's a bad habit, but I usually put mine on the Desktop.

Open Xcode and select "Create a new Xcode proejct"

![xcode-project-start](https://ladvien.com/images/xcode_project_start_1.png)

Then select "Single View App" and click "Next"

![xcode-project-start](https://ladvien.com/images/xcode_project_start_2.png)

Let's call the project `MindWaveJournaler` and click "Next"
![xcode-project-start](https://ladvien.com/images/xcode_project_start_3.png)

Choose your Desktop as location for the project and click "Create"
![xcode-project-start](https://ladvien.com/images/xcode_project_start_4.png)

### Step 1.3: Development Environment Setup
You've created a Project Folder, but we have to setup the project folder to be used with CocoaPods.  After, we will use CocoaPods to install Alamofire.

Back in the terminal, type:
```
cd ~/Desktop/MindWaveJournaler
pod init
```
This creates a `Podfile` in the root folder of our project.  We can list CocoaPod packages in the Podfile and run `pod install` in the same directory, this will cause CocoaPods to install all the packages we listed.

Sadly, we are really only doing this for Alamofire right now.  But, later, when we start building on to this app it will allow us to quickly access third-party frameworks.

Ok, back to typing:
```
open -a Xcode Podfile
```
This will open the Podfile for editing in Xcode.  Now let's insert the our desired pod information. 

Copy information below and paste it into your file:
```
# Uncomment the next line to define a global platform for your project
platform :ios, '11.4'

target 'MindWaveJournaler' do
  # Comment the next line if you're not using Swift and don't want to use dynamic frameworks
  use_frameworks!

  # Pods for MindWaveJournaler
  pod 'Alamofire', '~> 4.7'

  target 'MindWaveJournalerTests' do
    inherit! :search_paths
    # Pods for testing
  end

  target 'MindWaveJournalerUITests' do
    inherit! :search_paths
    # Pods for testing
  end

end
```

You may notice the only changes we made were
```
platform :ios, '11.4'
...
pod 'Alamofire', '~> 4.7'
```
These lines tell CocoaPods which version of iOS we are targetting with our app (this will silence a warning, but shouldn't be required).  The other, is telling CocoaPods which version of Alamofire we'd like to use on this project.

Ok, now let's run this Podfile.

Back in the same directory as the Podfile type:
```
pod install
```
You should see CocoaPods do its thing with output much like below.

![cocoapods-installed-alamofire](https://ladvien.com/images/alamofire_pod_installed.png)

### Step 1.4: Install NeuroSky iOS SDK
NeuroSky has a "Swift SDK."  Really, it's an Objective-C SDK which is "bridged" into Swift.  Essentialy, this means we won't be able to see what's going on the SDK, but we can use functions from the pre-compiled binaries.

I've not been impressed with NeuroSky's website.  Or the SDK.  It does the job, but not much more.  

Anyway, the SDK download is annoyingly behind a sign-up wall.

* [NeuroSky iOS SDK](https://store.neurosky.com/products/ios-developer-tools-4)

Visit the link above and click on "Add to Cart"

![neurosky-sdk-sign-up](https://ladvien.com/images/neurosky-sdk-download-1.png)

Then "Proceed to Checkout"

![neurosky-sdk-sign-up](https://ladvien.com/images/neurosky-sdk-download-2.png)

Lastly, you have to enter your "Billing Information."  Really, this is only your email address, last name, street address, city, and zip.

(Really NeuroSky?  This is very 1990.)

Eh, I made mine up.

Anyway, after your enter information click, then click "Continue to PayPal" (What? I just provided my information...)  You should be rewarded with a download link.  Click it and download the files.


![neurosky-sdk-sign-up](https://ladvien.com/images/neurosky-sdk-download-5.png)

Unzip the files and navigate `lib` folder
```
iOS Developer Tools 4.8 -> MWM_Comm_SDK_for_iOS_V0.2.9 -> lib
```
Copy all files from the `lib` folder into the main directory of the `MindWaveJournaler` project folders.

![neurosky-sdk-lib](https://ladvien.com/images/neurosky-sdk-download-7.png)

### Step 1.5: Workspace Setup
CocoaPods works by creating a `.xcworkspace` file.  It contains all the information needed to compile your project _with_ all of the CocoaPod packages installed.  In our case the file will be called `MindWaveJournaler.xcworkspace`.  And every time you want to work on your project, you must open it with this specific file.

It can be a bit confusing because Xcode created a `.xcodeproj` file which is tempting to click on.
![xcworkspace](https://ladvien.com/images/mind-wave-journaler-project-setup-1.png)

Go ahead and open the `MindWaveJournaler.xcworkspace` file.  The workspace should open with one warning, which we will resolve shortly.  

But first, another caveat.  CoreBluetooth, Apple's Bluetooth LE Framework, _only_ works when compiled for and run on an actual device.  *It does *not* work in the iOS Simulator.*  Once upon a time it did, if your Mac had the hardware, however, my version of the story is Apple didn't like having to support the confusion and dropped it.

![eeg-apple-workspace](https://ladvien.com/images/mind-wave-journaler-project-setup-2.png)

Moving on.  Click on the yellow warning.  Then click on the warning in the sidebar.  This should create a prompt asking if you'd like to make some changes.  This should automatically make some tweaks to the build settings which should make our project mo' betta.  

Click `Perform Changes`.
![eeg-apple-workspace-resolve-warning](https://ladvien.com/images/mind-wave-journaler-project-setup-3.png)

This should silence the warning and make your project error free.  Go ahead and hit `Play` button and let it compile to the simulator (we aren't testing the Bluetooth, so it's ok).  Everything should compile correctly, if not, just let me know the specifics of your problems in the comments.

### Step 1.5: Enable Secure HTTP Request
There are still a few tweaks we need to make to the Xcode workspace to get everything working.  

First, open the `ViewController.swift` file and add `import Alamofire` right below `import UIKit`.  If auto-complete lists Alamofire as an option you know the workspace is detecting its presence.  Good deal.

Now, for Alamofire to be able to securely make HTTP request an option needs to be added to the `Info.plist` file.  I scratched my head as to why the HTTP calls were not being made successfully until Manab Kumar Mal's StackOverflow post:

* [The resource could not be loaded](https://stackoverflow.com/a/32631185/2108441)

Thanks, buddy.

Ok, following his instructions open up the `Info.plist` file in your MindWaveJournaler folder.  Now add an entry by right-clicking and selecting `Add Row`.  Change the `Application Category` to `NSAppTransportSecurity` and make sure it's set as `dictionary`.  Now, click the plus sign by the new dictionary and set this attribute as `NSAllowsArbitraryLoads`, setting the type `bool`, and the value as `YES`.

![eeg-apple-workspace-add-secure-layer](https://ladvien.com/images/mind-wave-journaler-project-setup-4.png)

### Step 1.5: Setup Objective-C Bridge Header for MindWave SDK

There's a few other bits of housekeeping, though.  As I mentioned earlier, the MindwAve SDK is in an Objective-C precompiled binary.  It is usable in a Swift project, but requires setting up a "bridge header" file.

* [Manually Creating Bridging Header](https://stackoverflow.com/a/39615171)

Start by creating the bridge header file.  Go to `File -> New -> File...`

![bridge-header-file](https://ladvien.com/images/bridge-header-setup-01.png)

Then select `Header` and click `Next`.

![bridge-header-file](https://ladvien.com/images/bridge-header-setup-02.png)

Name the file `YourProjectName-Bridge-Header` and **make sure the file is saved to the same folder which contains the `.xcworkspace` file**, then click `Create`.

![bridge-header-file](https://ladvien.com/images/bridge-header-setup-03.png)

The header file should automatically open.  Copy and paste the following to the bottom of the header file.

```
#import "MWMDevice.h"
#import "MWMDelegate.h"
#import "MWMEnum.h"
```

My entire file looked like this once done.

#### MindWaveJournaler-Bridging-Header.h
{% highlight swift %}
//
//  MindWaveJournaler-Bridging-Header.h
//  MindWaveJournaler
//
//  Created by Casey Brittain on 8/3/18.
//  Copyright © 2018 Honeysuckle Hardware. All rights reserved.
//

#ifndef MindWaveJournaler_Bridging_Header_h
#define MindWaveJournaler_Bridging_Header_h


#endif /* MindWaveJournaler_Bridging_Header_h */

#import "MWMDevice.h"
#import "MWMDelegate.h"
#import "MWMEnum.h"
{% endhighlight %}

Let's tell the Swift compile we have a header file.  In Xcode go to `Project File -> Build Settings -> All`  then in the search box type `Swift Compiler - General`  (if you don't include the hyphen and spaces it wont find it). 

![bridge-header-file](https://ladvien.com/images/bridge-header-setup-04.png)

### ViewController.swift
{% highlight swift %}
//
//  ViewController.swift
//  MindWaveJournaler
//
//  Created by Casey Brittain on 8/3/18.
//  Copyright © 2018 Honeysuckle Hardware. All rights reserved.
//

import UIKit
import CoreBluetooth
import Alamofire

let central = CBCentralManager()

class ViewController: UIViewController, CBCentralManagerDelegate, MWMDelegate, MindMobileEEGSampleDelegate {
    
    func completedSample(sample: Parameters) {
        storeSample(sample: sample)
        sampleInProcess.startNewSample()
    }
    

    let mindWaveDevice = MWMDevice()
    let sampleInProcess = MindMobileEEGSample()
    
    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        switch central.state {
        case CBManagerState.poweredOn:
            mindWaveDevice.scanDevice()
        default:
            print("BLE Off")
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        central.delegate = self
        mindWaveDevice.delegate = self
        sampleInProcess.delegate = self
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    
    func deviceFound(_ devName: String!, mfgID: String!, deviceID: String!) {
        print("Device Name" + devName! + "\n" + "Manfacturer ID: " + mfgID! + "\n" + "Device ID: " + deviceID!)
        mindWaveDevice.stopScanDevice()
        mindWaveDevice.connect(deviceID!)
        mindWaveDevice.readConfig()
    }
    
    func didConnect() {
        print("Connected")
    }
    
    func didDisconnect() {
        mindWaveDevice.scanDevice()
    }

    func eegBlink(_ blinkValue: Int32) {
        sampleInProcess.addDataToSampe(packetName: "eegBlink", reading: [blinkValue])
    }

    func eegSample(_ sample: Int32) {
        // Not currently used
    }

    func eSense(_ poorSignal: Int32, attention: Int32, meditation: Int32) {
        sampleInProcess.addDataToSampe(packetName: "eSense", reading: [poorSignal, attention, meditation])
    }

    func eegPowerDelta(_ delta: Int32, theta: Int32, lowAlpha: Int32, highAlpha: Int32) {
        sampleInProcess.addDataToSampe(packetName: "eegPowerDelta", reading: [delta, theta, lowAlpha, highAlpha])
    }

    func eegPowerLowBeta(_ lowBeta: Int32, highBeta: Int32, lowGamma: Int32, midGamma: Int32) {
        sampleInProcess.addDataToSampe(packetName: "eegPowerLowBeta", reading: [lowBeta, highBeta, lowGamma, midGamma])
    }
    
    func storeSample(sample: Parameters) {
        Alamofire.request("http://ladvien.com:3000/eegsamples/", method: .post, parameters:  sample, encoding: JSONEncoding.default).responseJSON { response in

    }

}


{% endhighlight %}

### MindMobileEEGSample.swift
{% highlight swift %}
//
//  MindMobileEEGSample.swift
//  MindWaveJournaler
//
//  Created by Casey Brittain on 8/11/18.
//  Copyright © 2018 Honeysuckle Hardware. All rights reserved.
//

import Foundation
import Alamofire

public protocol MindMobileEEGSampleDelegate {
    func completedSample(sample: Parameters)
}

public class MindMobileEEGSample: NSObject {
    
    public var delegate: MindMobileEEGSampleDelegate?
    
    private var time = ""
    
    private var theta: Int32 = -1
    private var delta: Int32 = -1
    private var lowAlpha: Int32 = -1
    private var highAlpha: Int32 = -1
    private var lowBeta: Int32 = -1
    private var highBeta: Int32 = -1
    private var lowGamma: Int32 = -1
    private var midGamma: Int32 = -1
    private var attention: Int32 = -1
    private var meditation: Int32 = -1
    private var blink: Int32 = -1
    private var poorSignal: Int32 = -1
    
    override init() {
        super.init()
        startNewSample()
    }
    
    public func startNewSample() {
        theta = -1
        delta = -1
        lowAlpha = -1
        highAlpha = -1
        lowBeta = -1
        highBeta = -1
        lowGamma = -1
        midGamma = -1
        attention = -1
        meditation = -1
        blink = -1
        poorSignal = -1
        time = timeToString()
    }
    
    public func addDataToSampe(packetName: String, reading: Array<Int32>) -> Void {
        switch packetName {
        case "eegBlink":
            blink = reading[0]
            // Blink does not update delegate, as the TGM module
            // only updates if a blink is suspected.
            break
        case "eSense":
            poorSignal = reading[0]
            attention = reading[1]
            meditation = reading[2]
            updateDelegate()
            break
        case "eegPowerDelta":
            delta = reading[0]
            theta = reading[1]
            lowAlpha = reading[2]
            highAlpha = reading[3]
            updateDelegate()
            break
        case "eegPowerLowBeta":
            lowBeta = reading[0]
            highBeta = reading[1]
            lowGamma = reading[2]
            midGamma = reading[3]
            updateDelegate()
            break
        default:
            print("error")
        }
    }
    
    private func updateDelegate() {
        if(completePacket()) {
            let parameters = getSampleHTTPParameter()
            delegate?.completedSample(sample: parameters)
        }
    }
    
    private func completePacket() -> Bool {
        
        // blink is not checked, as it only updates
        // on occurrence.
        
        if(theta        < 0 ||
            delta       < 0 ||
            lowAlpha    < 0 ||
            highAlpha   < 0 ||
            lowBeta     < 0 ||
            highBeta    < 0 ||
            lowGamma    < 0 ||
            midGamma    < 0 ||
            attention   < 0 ||
            meditation  < 0 ||
            poorSignal  < 0 ||
            time        == "") {
            return false
        }
        return true
    }
    
    private func getSampleHTTPParameter() -> Parameters {
        let parameters: Parameters =  [
            "time": time,
            "theta": theta,
            "lowAlpha": lowAlpha,
            "highAlpha": highAlpha,
            "lowBeta": lowBeta,
            "highBeta": highBeta,
            "lowGamma": lowGamma,
            "midGamma": midGamma,
            "attention": attention,
            "meditation": meditation,
            "blink": blink,
            "poorSignal": poorSignal
        ]
        return parameters
    }
    
    private func timeToString() -> String {
        let date = Date()
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
        formatter.timeZone = TimeZone.init(secondsFromGMT: -18000)
        formatter.locale = Locale(identifier: "en_US_POSIX")
        
        let result = formatter.string(from: date)
        return result
    }
{% endhighlight %}




# Step 2: MongoDB

# Step 3: NodeJS Server

# Step 4: MongoDB BI Connector

# Step 5: Connecting Tableau





To install CocoaPods we will install prerequisites [Homebrew](https://brew.sh/).  

Installing Homebrew is pretty simple.  Open your terminal and paste the following:
```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
It will prompt you for the password, as it needs root access to setup correctly. Then, it clones Homebrew from Github and runs a script to set it up.  After a bit, you should end with "Installation Successful".

![homebrew-installation](https://ladvien.com/images/homebrew_installation.png)

Now Homebrew is setup, let's install CocoaPods