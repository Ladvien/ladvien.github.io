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
A how-to guide on connecting your PC to an Arduino using Bluetooth LE and Python.  To make it easier, we will use [bleak](https://pypi.org/project/bleak/) an open source BLE library for Python. The code provided should work for connecting your PC to any Bluetooth LE devices.

![sending-string-from-pc-to-arduino-nano-33-ble-sense](/images/bluetooth_le/arduino_ble_python_bleak.gif)

Before diving in a few things to know

* Bleak is under-development.  It _will_ have issues
* Although Bleak is multi-OS library, Windows support is still rough
* PC operating systems suck at BLE
* Bleak is asynchronous; in Python, this means a bit more complexity
* The code provided is a proof-of-concept; it should be improved before use

Ok, all warnings stated, let's jump in.

# Bleak
Bleak is a Python package written by [Henrik Blidh](https://www.youtube.com/watch?v=TPJGJ_rwJlI).  Although the package is still under development, it is pretty nifty.  It works on Linux, Mac, or Windows.  It is non-blocking, which makes writing applications a bit more complex, but extremely powerful, as your code doesn't have to manage concurrency.

* [Bleak Documentation](https://bleak.readthedocs.io/en/latest/)
* [Bleak Github](https://github.com/hbldh/bleak)

# Setup
Getting started with BLE using `bleak` is straightforward.  You need to install bleak and I've also included library called [aioconsole](https://pypi.org/project/aioconsole/) for handling user input asynchronously
```bash
pip install bleak aioconsole
```
Once these packages are installed we should be ready to code.  If you have any issues, feel free to ask questions and the comments.  I'll respond when able.

# Python Code
If you are new to Python then the code I'm about to walk-through may look odd.  You'll see terms like `async`, `await`, `loop`, and `future`.  Don't let it scare you.  These keywords are Python's way of allowing a programmer to "easily" write asynchronous code in Python.

If you're are struggling with using `asyncio`, the built in Python library allowing you to write asynchronous Python easily, I'd highly recommend Łukasz Langa's highly detailed video series; it definitely takes a time commitment, but is well worth it.

* [Import asyncio](https://youtu.be/Xbl7XjFYsN4)

If you are an experienced Python programmer, feel free to critique my async code, as I'm a new to Python's asynchronous solutions.

Enough fluff.  Let's get started.

## Find Mac or CBUUID
Bleak is a multi-OS package, however, there are slight differences between the different operating-systems.  One of those is the address of your remote device.  Windows and Linux report the remote device by it's [MAC](MAC_address).  Mac's the odd duck, it uses a Universally Unique Identifier ([UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier).  Specially, it uses a [CoreBluetooth](https://developer.apple.com/documentation/corebluetooth) UUID, or a [CBUUID](https://developer.apple.com/documentation/corebluetooth/cbuuid). 

These identifiers are important because bleak uses them during its connection process.  These IDs are static, that is, they shouldn't change.  That stated, I've included a script which will help you identify your device.

If you run
```
python3 bleak_find_device.py 
```
It should list any Bluetooth LE devices advertising services.  Once you've identified  your device then open the `bleak_app.py` script and replace either the MAC address or CBUUID shown below.

```python
    if os_name == 'darwin': 
        # Mac.
        address = ('46BFEB38-910C-4490-962E-CD60E52D7AF1')
    else:
        # Windows or Linux
        address = ('C8:5C:A2:2B:61:86')
```

## Parameters

```py
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
```


## Initialization

```py
#################
# Initialization
#################
connected = False
last_packet_time = datetime.now()
microphone_values = []
timestamps = []
delays = []
```

## Main
```py
#############
# Main
#############        
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
  *  http://www.bluez.org/development/git/
* Physical distance
* Interference
* Bluetoothctl
  * Remove device
  * Pair device
  * [Power cycle](https://github.com/hbldh/bleak/issues/172#issuecomment-637351561) 
  * Set primary controller


# Why Does Bluetooth Suck?
https://www.businessinsider.com/why-bluetooth-sucks-bad-problems-issues-disconnects-2018-2


## Why I Think PCs Suck at Bluetooth LE
> [Bluetooth is] like a mating dance between scorpions in the middle of a freeway. High chance something gets messed up. --[bjt2n3904](news.ycombinator.com/item?id=14753035)
> 
Head's up, below is not researched, it's conjecture.

You will find Bluetooth LE ubiquitous among mobile devices.  Whether you have an Android, iPhone, or even a Pixel, your phone is most likely equipped with Bluetooth LE and uses it regularly.  In fact, I'd assert Bluetooth LE is to mobile what USB is to PCs.

Why bring it up?  Well, mobile device providers were early adopters of Bluetooth LE.  It made a lot of sense, they didn't have to pay the USB licensing fees, it didn't require a physical cable connected to a small device, and multiple devices could connect without a physical interfaces.  

Unfortunately, PC manufacturers didn't adopt Bluetooth LE as whole-heartily.  They already had USB, why invest in all of the complexities of Bluetooth LE.  When they did start adding Bluetooth LE hardware as stock, it was much later than mobile.  With the hardware being added, it only solved half of the problem.  There was also the "Bluetooth stack" which was needed to drive the hardware.  And therein was the real problem.

Operating systems did not provide an abstraction of the many Bluetooth LE chipsets for years.  For example, Windows didn't support Bluetooth LE as part of their common language runtime (CLR) until Windows 8.  And even then it wasn't reliable until--well, still not sure it is.  I can attest to lack of reliability, as I was working on a [Windows Bluetooth LE app](https://www.microsoft.com/en-us/p/lumi-uploader/9nblggh4wxfw?activetab=pivot:overviewtab) in 2017 and there were serious holes in the API (e.g., no in app scanning or connection, hidden "features" like 20-byte TX buffer).

Now, I stated PC hardware and OS'es did not provide generalized support early on--there's one exception, Apple.  They added BLE to everything. My theory is Apple knew early on their users prized fewer wires and low energy peripherals.  Apple saw Bluetooth LE as a greart answer and they added to all their devices, whether it be mobile or PC.  And create CoreBluetooth, a developer's abstraction of the Bluetooth LE stacks. 

Alright, I suspect I'm rambling.  But I mention it to emphasize why Bluetooth LE on PCs is not a solved problem.  Now let me risk a bit more goodwill and state why I feel it's a problem worth solving.

## Importance of Connecting a PC and Device by Bluetooth LE

I'm a data engineer by day.  One of the biggest problems I see with data is pesky humans.  If humans are involved in the data collection process they introduce tons of noise along with the signal.  As an advocate of good data, I'm in favor of passive data collection.  

I love the idea of sensors being embedded in everything.  Of course, I've even stronger opinions about where those data should go once collected--yes, I'm looking at you Facebook and Google. Bluetooh LE was built for passive data collection.  Literally.  A sensor can use Bluetooth LE to push data to a bigger device at infrequent intervals, making sensor batteries last a long time.  With long lasting sensor batteries, it means the data collection process becomes passive.  That is, it takes very little human interaction for data to continue flowing to a central device.

But, as I hinted at above, I believe collected data should be accessible to the person who generated those data primarily.  And it shouldn't require an act of God to acquire those data for personal use.  Bring it back full circle, having poor support of Bluetooth LE on PC means one has to jump through all the hoops of learning iOS or Android programming--and pray Apple and Google are ok with you routing data collected by your phone into a personal repository.

In summary. I believe having a reliable way to access Bluetooth LE devices from a PC is important for the ownership of one's own sensor data.
