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

![sending-string-from-pc-to-arduino-nano-33-ble-sense](/images/python-serial-terminal-with-arduino-and-bleak/python_ble_to_arduino_demo_vert.gif)

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
Getting started with BLE using `bleak` is straightforward.  You need to install `bleak` and I've also included library called [aioconsole](https://pypi.org/project/aioconsole/) for handling user input asynchronously
```bash
pip install bleak aioconsole
```
Once these packages are installed we should be ready to code.  If you have any issues, feel free to ask questions in the comments.  I'll respond when able.

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

## Parameters


```py
## Initialization
root_path = os.environ["HOME"]
output_file = f"{root_path}/Desktop/microphone_dump.csv"
```


## Main
```py
#############
# App Main
#############
read_characteristic = "00001143-0000-1000-8000-00805f9b34fb"
write_characteristic = "00001142-0000-1000-8000-00805f9b34fb"

if __name__ == "__main__":

    # Create the event loop.
    loop = asyncio.get_event_loop()

    data_to_file = DataToFile(output_file)
    connection = Connection(
        loop, read_characteristic, write_characteristic, data_to_file.write_to_csv
    )
    try:
        asyncio.ensure_future(connection.manager())
        asyncio.ensure_future(user_console_manager(connection))
        asyncio.ensure_future(main())
        loop.run_forever()
    except KeyboardInterrupt:
        print()
        print("User stopped program.")
    finally:
        print("Disconnecting...")
        loop.run_until_complete(connection.cleanup())
```

## Save Incoming Data to File
```py
class DataToFile:

    column_names = ["time", "delay", "data_value"]

    def __init__(self, write_path):
        self.path = write_path

    def write_to_csv(self, times: [int], delays: [datetime], data_values: [Any]):

        if len(set([len(times), len(delays), len(data_values)])) > 1:
            raise Exception("Not all data lists are the same length.")

        with open(self.path, "a+") as f:
            if os.stat(self.path).st_size == 0:
                print("Created file.")
                f.write(",".join([str(name) for name in self.column_names]) + ",\n")
            else:
                for i in range(len(data_values)):
                    f.write(f"{times[i]},{delays[i]},{data_values[i]},\n")
```

## Connection Management
```py
class Connection:
    
    client: BleakClient = None
    
    def __init__(
        self,
        loop: asyncio.AbstractEventLoop,
        read_characteristic: str,
        write_characteristic: str,
        data_dump_handler: Callable[[str, Any], None],
        data_dump_size: int = 256,
    ):
        self.loop = loop
        self.read_characteristic = read_characteristic
        self.write_characteristic = write_characteristic
        self.data_dump_handler = data_dump_handler

        self.last_packet_time = datetime.now()
        self.dump_size = data_dump_size
        self.connected = False
        self.connected_device = None

        self.rx_data = []
        self.rx_timestamps = []
        self.rx_delays = []

    def on_disconnect(self, client: BleakClient):
        self.connected = False
        # Put code here to handle what happens on disconnet.
        print(f"Disconnected from {self.connected_device.name}!")

    async def cleanup(self):
        if self.client:
            await self.client.stop_notify(read_characteristic)
            await self.client.disconnect()

    async def manager(self):
        print("Starting connection manager.")
        while True:
            if self.client:
                await self.connect()
            else:
                await self.select_device()
                await asyncio.sleep(15.0, loop=loop)       

    async def connect(self):
        if self.connected:
            return
        try:
            await self.client.connect()
            self.connected = await self.client.is_connected()
            if self.connected:
                print(F"Connected to {self.connected_device.name}")
                self.client.set_disconnected_callback(self.on_disconnect)
                await self.client.start_notify(
                    self.read_characteristic, self.notification_handler,
                )
                while True:
                    await asyncio.sleep(15.0, loop=loop)
            else:
                print(f"Failed to connect to {self.connected_device.name}")
        except Exception as e:
            print(e)

    async def select_device(self):
        print("Bluetooh LE hardware warming up...")
        await asyncio.sleep(2.0, loop=loop) # Wait for BLE to initialize.
        devices = await discover()

        print("Please select device: ")
        for i, device in enumerate(devices):
            print(f"{i}: {device.name}")

        response = -1
        while True:
            response = await ainput("Select device: ")
            try:
                response = int(response.strip())
            except:
                print("Please make valid selection.")
            
            if response > -1 and response < len(devices):
                break
            else:
                print("Please make valid selection.")

        print(f"Connecting to {devices[response].name}")
        self.connected_device = devices[response]
        self.client = BleakClient(devices[response].address, loop=self.loop)

    def record_time_info(self):
        present_time = datetime.now()
        self.rx_timestamps.append(present_time)
        self.rx_delays.append((present_time - self.last_packet_time).microseconds)
        self.last_packet_time = present_time

    def clear_lists(self):
        self.rx_data.clear()
        self.rx_delays.clear()
        self.rx_timestamps.clear()

    def notification_handler(self, sender: str, data: Any):
        self.rx_data.append(int.from_bytes(data, byteorder="big"))
        self.record_time_info()
        if len(self.rx_data) >= self.dump_size:
            self.data_dump_handler(self.rx_data, self.rx_timestamps, self.rx_delays)
            self.clear_lists()
```

## App Loops

```py
#############
# Loops
#############
async def user_console_manager(connection: Connection):
    while True:
        if connection.client and connection.connected:
            input_str = await ainput("Enter string: ")
            bytes_to_send = bytearray(map(ord, input_str))
            await connection.client.write_gatt_char(write_characteristic, bytes_to_send)
            print(f"Sent: {input_str}")
        else:
            await asyncio.sleep(2.0, loop=loop)


async def main():
    while True:
        # YOUR APP CODE WOULD GO HERE.
        await asyncio.sleep(5)
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
