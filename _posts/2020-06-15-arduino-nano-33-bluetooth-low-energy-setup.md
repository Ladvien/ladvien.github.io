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

Shortly after firing it up, I got excited.  I've been wanting to start creating my own smartwatch for a long time (basically, as long the Apple watch has sucked).  This one board had many of the sensors I wanted, all in one little package. The board is a researcher's nocturnal emission.

Of course, my excitement was a little tamed when I realized there weren't really any good tutorials on how to get the Bluetooth LE portion of the board working.  So, after a bit of hacking I figured I'd share.

## How to Install the Arduino Nano 33 BLE Board
After getting your Arduino Nano 33 BLE board there's a little setup to do.  First, open up the Arduino IDE and navigate to the "Boards Manager."

![open-arduinos-manage-libraries](/images/arduino_nano_ble_board_installation.png)

Search for `Nano 33 BLE` and install the board `Arduino nRF528xBoards (MBed OS)`.

![arduino-install-nrf528-board](/images/arduino-install-nrf528-board.png)




## How to Install the ArduinoBLE Library
The key to working with Bluetooth LE for the official Arduino boards is the stock library:

* [ArduinoBLE](https://www.arduino.cc/en/Reference/ArduinoBLE)

It works pretty well, though, the documentation is a bit spotty.

To get started you'll need to fire up the Arduino IDE and got to `Tools` then `Manager Libraries...`

![open-arduinos-manage-libraries](/images/ardino_ble_manage_libraries.png)

In the search box that comes up type `ArduinoBLE` and then select `Install` next to the library:

![install-arduino-ble-library](/images/install_arduino_ble_lbirary.png)

That's pretty much it, we can now include the library at the top of our sketch:
```cpp
#include <ArduinoBLE.h>
```

## UART versus Bluetooth LE
Usually, when I'm working with a Bluetooth LE (BLE) device I'm trying to get it to send and receive data.  And that's what I'll be focusing on in this article.  

I've seen this send-n-receive'ing data from BLE as "UART emulation."  I think that's fair, it's a classic communication protocol for a reason.  I've also the comparison as a great mental framework for understanding how our BLE will work.  

We will have a `rx` property, where we can get data from a remote device and a `tx` property, where we can send data.  Throughout my Arduino program you'll see my naming convention following this analog. That stated, there are clear differences between BLE communication and UART.  BLE is much more complex and versatile.

## Data from the Arduino Microphone
To demonstrate sending and receiving data we probably need to have some data to send.  For the sending end (`tx`) we are going to grab information from the microphone on the Arduino Sense and send it to remote connected device.

The Arduino BLE core



```cpp
// https://rootsaid.com/arduino-ble-example/
#include <ArduinoBLE.h>
#include <PDM.h>

// This device's MAC:
// C8:5C:A2:2B:61:86
//#define LEDR        (23u)
//#define LEDG        (22u)
//#define LEDB        (24u)

// BLE Service
BLEService microphoneService("1101");

// Characteristic info.
// https://www.arduino.cc/en/Reference/ArduinoBLEBLECharacteristicBLECharacteristic

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

