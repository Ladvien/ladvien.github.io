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
Bluetooth Low Energy and I go way back.  I was one of the first people using the HM-10 module back in the day.  Recently, my mentor introduced me to the [Arduino Nano 33 BLE Sense](https://store.arduino.cc/usa/nano-33-ble-sense-with-headers).  Great little board--_packed_ with sensors!

Shortly after firing it up, I got excited.  I've been wanting to start creating my own smartwatch for a long time (basically, as long the Apple watch has blown chunks).  And this one board had many of the sensors I was looking to add, all neatly in one small little package.

Here are the specifications provided by Arduino:


|-----------------------------|----------------------------------| 
| Microcontroller             | nRF52840 ([datasheet](https://content.arduino.cc/assets/Nano_BLE_MCU-nRF52840_PS_v1.1.pdf))             | 
| Operating Voltage           | 3.3V                             | 
| Input Voltage (limit)       | 21V                              | 
| DC Current per I/O Pin      | 15 mA                            | 
| Clock Speed                 | 64MHz                            | 
| CPU Flash Memory            | 1MB (nRF52840)                   | 
| SRAM                        | 256KB (nRF52840)                 | 
| EEPROM                      | none                             | 
| Digital Input / Output Pins | 14                               | 
| PWM Pins                    | all digital pins                 | 
| UART                        | 1                                | 
| SPI                         | 1                                | 
| I2C                         | 1                                | 
| Analog Input Pins           | 8 (ADC 12 bit 200 ksamples)      | 
| Analog Output Pins          | Only through PWM (no DAC)        | 
| External Interrupts         | all digital pins                 | 
| LED_BUILTIN                 | 13                               | 
| USB                         | Native in the nRF52840 Processor | 
| IMU                         | LSM9DS1 ([datasheet](https://content.arduino.cc/assets/Nano_BLE_Sense_lsm9ds1.pdf))              | 
| Microphone                  | MP34DT05 ([datasheet](https://content.arduino.cc/assets/Nano_BLE_Sense_mp34dt05-a.pdf))             | 
| Gesture, light, proximity   | APDS9960 ([datasheet](https://content.arduino.cc/assets/Nano_BLE_Sense_av02-4191en_ds_apds-9960.pdf))             | 
| Barometric pressure         | LPS22HB ([datasheet](https://content.arduino.cc/assets/Nano_BLE_Sense_lps22hb.pdf))              | 
| Temperature, humidity       | HTS221 ([datasheet](https://content.arduino.cc/assets/Nano_BLE_Sense_HTS221.pdf))               | 
| Length                      | 45 mm                            | 
| Width                       | 18 mm                            | 
| Weight                      | 5 gr (with headers)              | 

Note, the specifications don't list it, but there is actually very small RGB LED on the board too (though, the pins are swapped--more later).  Giving the board 4 individually addressable LEDs.  The thing is a researcher's nocturnal emission.


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


void disconnectedLig
  digitalWrite(LEDR, HIGH);
  digitalWrite(LEDG, LOW);
}

```