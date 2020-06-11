---
layout: post
title: Getting Started with Bluetooth LE on the Arduino Nano 33 Sense
categories: robot
series: Bluetooth Low Energy
excerpt:
tags: [ble, arduino, setup, bluetooth]
image: 
    feature: bluetooth_le/ble_loves_arduino.png
comments: true
custom_css:
custom_js: 
---
Bluetooth Low Energy and I go way back.  I was one of the first using the HM-10 module back in the day.  Recently, my mentor introduced me to the [Arduino Nano 33 BLE Sense](https://store.arduino.cc/usa/nano-33-ble-sense-with-headers).  Great little board--_packed_ with sensors!

Shortly after firing it up, I got excited.  I've been wanting to start creating my own smartwatch for a long time (basically, as long the Apple watch has sucked).  And it looks like I wasn't the only one:

* [The B&ND](https://create.arduino.cc/projecthub/ankurverma608/the-b-nd-e190dc)

This one board had many of the sensors I wanted, all in one little package. The board is a researcher's nocturnal emission.

Of course, my excitement was tamed when I realized there weren't really any good tutorials on how to get the Bluetooth LE portion of the board working.  So, after a bit of hacking I figured I'd share.

## How to Install the Arduino Nano 33 BLE Board
After getting your Arduino Nano 33 BLE board there's a little setup to do.  First, open up the Arduino IDE and navigate to the "Boards Manager."

![open-arduinos-manage-libraries](/images/arduino_nano_ble_board_installation.png)

Search for `Nano 33 BLE` and install the board `Arduino nRF528xBoards (MBed OS)`.

![arduino-install-nrf528-board](/images/bluetooth_le/arduino-install-nrf528-board.png)

Now your Arduino should be ready work with the Nano 33 boards.  One last bit, getting the libraries to work with BLE.

## How to Install the ArduinoBLE Library
There are are a few different Arduino libraries for Bluetooth LE--usually, respective to the hardware.  Unfortunately for us, this means we would need an entirely different library to work with the Bluetooth LE on a ESP32, for example.  Oh well. Back to the problem at hand.

The official library for working with the Arduino boards equipped with BLE is:

* [ArduinoBLE](https://www.arduino.cc/en/Reference/ArduinoBLE)

It works pretty well, though, the documentation is a bit spotty.

To get started you'll need to fire up the Arduino IDE and go to `Tools` then `Manager Libraries...`

![open-arduinos-manage-libraries](/images/ardino_ble_manage_libraries.png)

In the search box that comes up type `ArduinoBLE` and then select `Install` next to the library:

![install-arduino-ble-library](/images/install_arduino_ble_lbirary.png)

That's pretty much it, we can now include the library at the top of our sketch:
```cpp
#include <ArduinoBLE.h>
```
And access the full API in our code.

## Project Description
If you are eager, feel free to skip this information and jump to the code.

CODE LINK HERE

Before moving on, if the following terms are confusing:

* Peripheral
* Central
* Master
* Slave
* Server
* Client

You might check out EmbeddedFM's explanation:

* [BLE Terms](https://embedded.fm/blog/ble-roles)

That said, I'll be focusing on getting the Arduino 33 BLE Sense to act as a peripheral BLE device.  As a peripheral, it'll advertise itself as having services, one for reading and one for writing.

### UART versus Bluetooth LE 
Usually, when I'm working with a Bluetooth LE (BLE) device I want it to send and receive data.  And that'll be the focus of this article.  

I've seen this send-n-receive'ing data from BLE referred to as "UART emulation."  I think that's fair, UART is a classic communication protocol for a reason.  I've also see the comparison as a good mental framework for how our BLE code will work.

We will have a `rx` property, where we can get data from a remote device and a `tx` property, where we can send data.  Throughout my Arduino program you'll see my naming convention following this analog. That stated, there are clear differences between BLE communication and UART.  BLE is much more complex and versatile.

### Data from the Arduino Microphone
To demonstrate sending and receiving data we probably need to have some data to send.  For the sending end (`tx`) we are going to grab information from the microphone on the Arduino Sense and send it to remote connected device.  I'll not cover the microphone code here, as I don't understand it well enough to explain.  However, here's a few good reads:

* [Pulse-Density Modulation](https://en.wikipedia.org/wiki/Pulse-density_modulation) (data type output)
* [Arduino Pulse-Density Modulation Library docs](https://www.arduino.cc/en/Reference/PDM)

## Code
Time to code.  Below is what I hacked together, with annotations from the "gotchas" I ran into.

One last caveat, I used `Jithin`'s code as a base of my project:

* [Arduino BLE Example Explained Step by Step](https://rootsaid.com/arduino-ble-example/)

Although, I'm not sure any of the original code is left.

### Initialization
We load in the BLE and the PDM libraries to access the APIs to work with the microphone and the radio hardware.
```cpp

#include <ArduinoBLE.h>
#include <PDM.h>
```

Let's create the service.  First, we create name which will show up in the advertizing packet, making it easy for a user to identify our Arduino.

We also create a [Service](https://www.bluetooth.com/specifications/gatt/services/) called `microphoneService`, passing it the full Universally Unique ID (UUID) as a string. Now, when it comes to setting the UUID there are two options.  Either a short, 16-bit or a 128-bit version.  

If you use one of the standard Bluetooth LE Services the 16-bit version is good.  However, if you are looking to create a custom service, you will need to explore creating a full 128-bit UUID.

If you want to understand UUID's more fully, I highly recommend Nordic's article:

* [Bluetooth low energy Services, a beginner's tutorial](https://devzone.nordicsemi.com/nordic/short-range-guides/b/bluetooth-low-energy/posts/ble-services-a-beginners-tutorial)

Anyway, we are going to use the following Services UUIDs:
* `0x181a` -- [Environmental Sensing](https://www.bluetooth.com/xml-viewer/?src=https://www.bluetooth.com/wp-content/uploads/Sitecore-Media-Library/Gatt/Xml/Services/org.bluetooth.service.environmental_sensing.xml) (Microphone)
* 


```cpp
// Device name
const char* nameOfPeripheral = "MicrophoneMonitor";
// BLE Service
BLEService microphoneService("1800");
```



```cpp
// Setup the incoming data characteristic (RX).
const int WRITE_BUFFER_SIZE = 256;
bool WRITE_BUFFER_FIXED_LENGTH = false;

BLECharacteristic rxChar("1142", BLEWriteWithoutResponse | BLEWrite, WRITE_BUFFER_SIZE, WRITE_BUFFER_FIXED_LENGTH);

// Setup the outgoing data characteristic (TX).
BLEByteCharacteristic txChar("1143", BLERead | BLENotify | BLEBroadcast);

// Buffer to read samples into, each sample is 16-bits
short sampleBuffer[256];

// Number of samples read
volatile int samplesRead;

/*
 *  MAIN
 */
void setup() {

  // Start serial.
  Serial.begin(9600);

  // Ensure serial port is ready.
  while (!Serial);

  // Prepare LED pins.
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(LEDR, OUTPUT);
  pinMode(LEDG, OUTPUT);

  // Configure the data receive callback
  PDM.onReceive(onPDMdata);

  // Start PDM
  startPDM();

  // Start BLE.
  startBLE();

  // Create BLE service and characteristics.
  BLE.setLocalName("MicrophoneMonitor");
  BLE.setAdvertisedService(microphoneService);
  microphoneService.addCharacteristic(rxChar);
  microphoneService.addCharacteristic(txChar);
  BLE.addService(microphoneService);

  // Event driven reads.
  rxChar.setEventHandler(BLEWritten, onRxCharValueUpdate);
  
  // Let's tell devices about us.
  BLE.advertise();
  Serial.println("Bluetooth device active, waiting for connections...");
}


void loop()
{
  BLEDevice central = BLE.central();
  
  if (central)
  {
    Serial.print("Connected to central: ");
    Serial.println(central.address());

    // Only send data if we are connected to a central device.
    while (central.connected()) {
      connectedLight();

      // Send the microphone values to the central device.
      if (samplesRead) {
        // print samples to the serial monitor or plotter
        for (int i = 0; i < samplesRead; i++) {
          txChar.writeValue(sampleBuffer[i]);      
        }
        // Clear the read count
        samplesRead = 0;
      }
    }
  } else {
    disconnectedLight();
  }
}


/*
 *  BLUETOOTH
 */
void startBLE() {
  if (!BLE.begin())
  {
    Serial.println("starting BLE failed!");
    while (1);
    disconnectedLight();
  }
}

void onRxCharValueUpdate(BLEDevice central, BLECharacteristic characteristic) {
  // central wrote new value to characteristic, update LED
  Serial.print("Characteristic event, read: ");
  byte test[256];
  int dataLength = rxChar.readValue(test, 256);

  for(int i = 0; i < dataLength; i++) {
    Serial.print((char)test[i]);
  }
  Serial.println();
  Serial.print("Value length = ");
  Serial.println(rxChar.valueLength());
}


/*
 *  MICROPHONE
 */
void startPDM() {
  // initialize PDM with:
  // - one channel (mono mode)
  // - a 16 kHz sample rate
  if (!PDM.begin(1, 16000)) {
    Serial.println("Failed to start PDM!");
    while (1);
  }
}


void onPDMdata() {
  // query the number of bytes available
  int bytesAvailable = PDM.available();

  // read into the sample buffer
  PDM.read(sampleBuffer, bytesAvailable);

  // 16-bit, 2 bytes per sample
  samplesRead = bytesAvailable / 2;
}


/*
 * LEDS
 */
void connectedLight() {
  digitalWrite(LEDR, LOW);
  digitalWrite(LEDG, HIGH);
}


void disconnectedLight() {
  digitalWrite(LEDR, HIGH);
  digitalWrite(LEDG, LOW);
}

```

