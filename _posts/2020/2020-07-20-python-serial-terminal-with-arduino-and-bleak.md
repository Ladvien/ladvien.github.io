---
layout: post
title: How to Send Data between PC and Arduino using Bluetooth LE
categories: robot
series: Bluetooth Low Energy
excerpt:
tags: [uart, ble, bluetooth, pc, python, bleak]
image: 
    feature: bluetooth_le/ble_loves_arduino.png
comments: true
custom_css:
custom_js: 
---

> [Bluetooth is] like a mating dance between scorpions in the middle of a freeway. High chance something gets messed up. --bjt2n3904


* [Bleak Documentation](https://bleak.readthedocs.io/en/latest/)
* [Bleak Github](https://github.com/hbldh/bleak)

# Why is Connecting a PC and Device by Bluetooth LE Important?
Head's up, below is not researched.  It's just my opinion.

You will find Bluetooth LE ubiquitous among mobile devices.  Whether you have an Android, iPhone, or even a Pixel, your phone is most likely equipped with Bluetooth LE and uses it regularly to interact with peripherals.  In fact, I'd assert Bluetooth LE is to mobile what USB is to PCs.

Why bring it up?  Well, mobile companies were early adopters of Bluetooth LE.  It made a lot of sense, they didn't have to pay the USB licensing fees, it didn't require a physical cable connected to a small device and multiple devices could connect without a physical interfaces, let alone multiple--as the case with USB.  Unfortunately, PC manufacturers didn't adopt Bluetooth LE as whole-heartily.  They already had USB, why invest in all of the complexities of Bluetooth LE.  When they did start adding Bluetooth LE hardware as stock, it was much later than mobile. 

Even with the hardware being added, it only solved half of the problem.  There was also the "Bluetooth stack" which was needed to drive the hardware.  And therein was the real problem.

Operating systems did not provide a general abstraction of the many Bluetooth LE chipsets for a long time.  For example, Windows didn't support Bluetooth LE as part of their CLR until Windows 8.  And even though, it wasn't reliable until--well, still not sure it is.  I can attest to this, as I was working on a [Windows Bluetooth LE app](https://www.microsoft.com/en-us/p/lumi-uploader/9nblggh4wxfw?activetab=pivot:overviewtab) in 2017 and there were serious holes in the API (e.g., no in app scanning or connection, hidden "features" like 20-byte TX buffer).

Now, I stated PC hardware and OS'es did not provide generalized support early on--there's one exception, Apple.  They added BLE to everything. My theory, Apple knew early on their users prized fewer wires and low energy consumption.  Apple saw Bluetooth LE as the answer and they added to their mobile devices _and_ their PCs.

Alright, you suspect ramblings.  And you might be right.  But I mention it to emphasize why Bluetooth LE on PCs is not a solved problem.  Now let me risk a bit more goodwill and state why I feel it's a problem worth solving.

I'm a data engineer by day and one of the biggest problems I see with data is pesky humans.  If humans are involved in the data collection process they introduce tons of noise along with the signal.  In short, I'm in favor of passive data collection.  I love the idea of sensors being embedded in everything--though, I've even stronger opinions about where those data should go once collected--yes, I'm looking at you Facebook and Google.  And Bluetooh LE loves was built for passive data collection.  Literally.  A sensor can tell a Bluetooth LE chipset about its data and a central device can request those data at its leisure--they whole process is extremely passive and low maintenance.

But, as I hinted at above, I believe collected data should be _extremely_ accessible to the person who has generated those data.  And it shouldn't require an act of God to acquire those data for personal use.  Unfortunately, having poor support of Bluetooth LE on PC means one has to jump through all the hoops of learning iOS and Android programming--and pray Apple and Google are ok with you routing data collected by your phone into a personal repository.

To recap my mad theory, I believe having a reliable way to access Bluetooth LE from a PC is important for the ownership of one's own sensor data.

# BlueZ
* http://www.bluez.org/development/git/


# Install Packages

```bash
pip install bleak aioconsole
```

# Find Mac or CUID

```
python3 bleak_find_device.py 
```

Replace either the MAC address on PC or Linux, or CBUID on MacOS
```python
    if os_name == 'darwin': # Mac uses CBID.
        address = ('46BFEB38-910C-4490-962E-CD60E52D7AF1')
    else:
        address = ('C8:5C:A2:2B:61:86')
```

# Python Code

## Setup

```py
import os, sys
import asyncio
import platform
from datetime import datetime

from aioconsole import ainput
from bleak import BleakClient

root_path = os.environ['HOME']

#############
# Parameters
#############
output_file             = f'{root_path}/Desktop/microphone_dump.csv'

read_characteristic     = '00001143-0000-1000-8000-00805f9b34fb'
write_characteristic    = '00001142-0000-1000-8000-00805f9b34fb'

# Data
dump_size               = 256
column_names            = ['time', 'micro_secs_since_last', 'microphone_value']

#############
# Subroutines
#############

connected = False
last_packet_time = datetime.now()
```

## Main
```py
#############
# Main
#############        
microphone_values = []
timestamps = []
delays = []

if __name__ == "__main__":

    # Get OS name.
    os_name = sys.platform

    if os_name == 'darwin': # Mac uses CBID.
        address = ('46BFEB38-910C-4490-962E-CD60E52D7AF1')
    else:
        address = ('C8:5C:A2:2B:61:86')
    
    # Create the event loop.
    loop = asyncio.get_event_loop()

    # Create the Bluetooth LE object.
    client = BleakClient(address, loop = loop)
    try:
        asyncio.ensure_future(run(client))
        asyncio.ensure_future(user_write(client))
        asyncio.ensure_future(main())
        loop.run_forever()
    except KeyboardInterrupt:
        print()
        print('User stopped program.')
    finally:
        print('Disconnecting...')
        loop.run_until_complete(cleanup(client))



```

## Loops

```py
async def run(client):
    global connected
    while True:
        if not connected:
            try:
                await client.connect()
                connected = await client.is_connected()
                client.set_disconnected_callback(disconnect_callback)
                await client.start_notify(read_characteristic, notification_handler)
                while True:
                    await asyncio.sleep(15.0, loop = loop)
            except Exception as e:
                print(e)



async def main():
    while True:
        # YOUR CODE WOULD GO HERE.
        await asyncio.sleep(5)
```

## Callbacks

```py
def notification_handler(sender, data):
    global last_packet_time
    value = int.from_bytes(data, byteorder = 'big')
    microphone_values.append(value)
    present_time = datetime.now()
    timestamps.append(present_time)
    delays.append((present_time - last_packet_time).microseconds)
    last_packet_time = present_time
    if len(microphone_values) >= dump_size:
        write_to_csv(output_file, microphone_values, timestamps)
        microphone_values.clear()
        delays.clear()
        timestamps.clear()


def disconnect_callback(client, future):
    global connected
    connected = False
    print(f"Disconnected callback called on {client}!")
```


## Sending Data

```py
async def user_write(client):
    global connected
    while True:
        if connected:
            input_str = await ainput('Enter string: ')
            bytes_to_send = bytearray(map(ord, input_str))
            await client.write_gatt_char(write_characteristic,  bytes_to_send)
            print(f'Sent: {input_str}')
        else:
            await asyncio.sleep(15.0, loop = loop)

```

## Getting Data

```py
def write_to_csv(path, microphone_values, timestamps):
    with open(path, 'a+') as f:
        if os.stat(path).st_size == 0:
            print('Created file.')
            f.write(','.join([str(name) for name in column_names]) + ',\n')  
        else:
            for i in range(len(microphone_values)):
                f.write(f'{timestamps[i]},{delays[i]},{microphone_values[i]},\n')
```

# Linux Troubleshooting

* Update BlueZ script
* Physical distance
* Interference
* Bluetoothctl
  * Remove device
  * Pair device
  * [Power cycle](https://github.com/hbldh/bleak/issues/172#issuecomment-637351561) 
  * Set primary controller
