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

Now, let's setup a project folder.  This is main folder where all the iOS app code will live.  It's a bad habit, but I usually put mine on the Desktop.

Open Xcode and Select

![xcode-project-start](https://ladvien.com/images/xcode_project_start_1.png)

Back in the terminal, type:
```
cd ~/Desktop/MindWaveJournaler
```


### MindWaveJournaler-Bridging-Header.h
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
        
        // blink is not checked, as it only updates when
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