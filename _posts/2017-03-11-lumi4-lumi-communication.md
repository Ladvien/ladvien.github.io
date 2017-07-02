---
layout: post
title: Lumi4 -- LumiCommunication
categories: robots
excerpt:
tags: [robot, C#, TinySafeBoot]
image: 
    feature: Lumi_CSharp.png
comments: true
custom_css:
custom_js: 
---
## Lumi Communication

This namespace contains the serial device handling functions.  The goal is to have two abstract classes which define the interaction between the main device and the peripheral  These two classes will be responsible for searching, connecting, exchanging data, closing connections, and device failure handling.  To get going I'm going to take some advice from Mythical Man Month: "Show me your flowcharts and conceal your tables, and I shall continue to be mystified. Show me your tables, and I won’t usually need your flowcharts; they’ll be obvious."  Well, I don't have tables, so I guess my charts will have to do.  

![lumi_communication_central.png](/../../images/lumi_communication_central.png)LumiCommunication is largely modeled after [Apple's CoreBluetooth API](https://developer.apple.com/reference/corebluetooth).  It has abstractions representing both remote and local devices.  These abstractions are inherited in concrete classes for different device types.  Currently, the API is focusing on two device types, BluetoothLE and WiFi (ESP8266).  Though, if the abstraction is effective, it shouldn't be difficult to provide support for Bluetooth Classic and Wired Serial connections.  

The CentralManager's main responsibilities are to monitor the PC's device status, initiate searches, connect to devices.  

I'm adding a bit to the CoreBluetooth model; I'm writing this code to be hacker friendly as one of my biggest peeves with frameworks meant for interacting with embedded devices is they often don't allow for easy modification of the device's behavior.  For example, most SoC-centered device modules (HM-10, ESP8266, etc.) which control radio hardware have firmware allowing for the modification of the module's behavior.  Often, these are modified through AT Commands.  It struck me one day, why am I not writing code in such a manner?  For example, instead writing concrete code inside the classes which handle searching for BluetoothLE to to automatically connect to known devices, why not create an static object which defines these behaviors, then, when I want to change the behavior of my hardware, I simply pass in a new behavioral definition object. I've outlined this in my [BehavioralBluetooth](https://github.com/Ladvien/behavioralBluetooth) project (abaonded for the time being).  

LumiCommunication classes will have an object which defines the behavior of the hardware.  

![lumi_communication.png](/../../images/lumi_communication.png)    
The PeripheralManager is responsible for representing the states and delivered data of the peripheral devices.  There are events associated with data received from the device, confirmation of sent data, device state changes.  Like the CentralManager the PeripheralManager will have a PeripheralBehavior object which will define its actions.  There are received and sent buffers to monitor succesful flow of data between the local and remote device.