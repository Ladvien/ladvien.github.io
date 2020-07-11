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

* [Bleak Documentation](https://bleak.readthedocs.io/en/latest/)
* [Bleak Github](https://github.com/hbldh/bleak)

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