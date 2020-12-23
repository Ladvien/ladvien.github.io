---
layout: post
title: How to Send Data between PC and Arduino using Bluetooth LE
categories: robot
series: Bluetooth Low Energy
excerpt: A how-to on using Python with Bluetooth LE from your PC.  This guide uses bleak, an open-source Bluetooth LE library for Python to make connection and data transfer easy.
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
Getting started with BLE using my starter application and `bleak` is straightforward.  You need to install `bleak` and I've also included library called [aioconsole](https://pypi.org/project/aioconsole/) for handling user input asynchronously
```bash
pip install bleak aioconsole
```
Once these packages are installed we should be ready to code.  If you have any issues, feel free to ask questions in the comments.  I'll respond when able.

# The Code
Before we get started, if you'd rather see the full-code it can be found at:

* [Bleak App](https://github.com/Ladvien/arduino_ble_sense/blob/master/app.py)

If you are new to Python then following code may look odd.  You'll see terms like `async`, `await`, `loop`, and `future`.  Don't let it scare you.  These keywords are Python's way of allowing a programmer to "easily" write asynchronous code in Python.

If you're are struggling with using `asyncio`, the built in asynchronous Python library, I'd highly recommend Łukasz Langa's detailed video series; it takes a time commitment, but is worth it.

* [Import asyncio](https://youtu.be/Xbl7XjFYsN4)

If you are an experienced Python programmer, feel free to critique my code, as I'm a new to Python's asynchronous solutions.  I've got my big kid britches on.

Enough fluff.  Let's get started.

## Application Parameters
There are a few code changes needed for the script to work, at least, with the Arduino and firmware I've outlined in the previous article:

* [Getting Started with Bluetooth LE on the Arduino Nano 33 Sense](https://ladvien.com/arduino-nano-33-bluetooth-low-energy-setup/)

The incoming microphone data will be dumped into a CSV; one of the parameters is where you would like to save this CSV.  I'll be saving it to the Desktop.  I'm also retrieving the user's home folder from the `HOME` environment variable, which is only available on Mac and Linux OS (Unix systems).  If you are trying this project from Windows, you'll need to replace the `root_path` reference with the full path.

```py
root_path = os.environ["HOME"]
output_file = f"{root_path}/Desktop/microphone_dump.csv"
```

You'll also need need to specify the [characteristics](https://www.bluetooth.com/specifications/gatt/characteristics/) which the Python app should try to subscribe to when connected to remote hardware.  Referring back to our previous project, you should be able to get this from the Arduino code.  Or the Serial terminal printout.

```py
read_characteristic = "00001143-0000-1000-8000-00805f9b34fb"
write_characteristic = "00001142-0000-1000-8000-00805f9b34fb"
```

## Main
The main method is where all the async code is initialized.  Essentially, it creates three different loops, which run asynchronously when possible.

* Main -- you'd put your application's code in this loop.  More on it later
* Connection Manager -- this is the heart of the `Connection` object I'll describe more in a moment.
* User Console -- this loop gets data from the user and sends it to the remote device.

You can imagine each of these loops as independent, however, what they are actually doing is pausing their execution when any of the loops encounter a blocking I/O event. For example, when input is requested from the user or waiting for data from the remote BLE device.  When one of these loops encounters an I/O event, they let one of the other loops take over until the I/O event is complete.

That's far from an accurate explanation, but like I said, I won't go in depth on async Python, as Langa's video series is much better than my squawking.

Though, it's important to know, the `ensure_future` is what tells Python to run a chunk of code asynchronously.  And I've been calling them "loops" because each of the 3 `ensure_future` calls have a `while True` statement in them.  That is, they do not return without error.

After creating the different futures, the `loop.run_forever()` is what causes them to run. 
```py
if __name__ == "__main__":
    # Create the event loop.
    loop = asyncio.get_event_loop()

    data_to_file = DataToFile(output_file)
    connection = Connection(
        loop, read_characteristic, write_characteristic, data_to_file.write_to_csv
    )
    try:
        asyncio.ensure_future(main())
        asyncio.ensure_future(connection.manager())
        asyncio.ensure_future(user_console_manager(connection))
        loop.run_forever()
    except KeyboardInterrupt:
        print()
        print("User stopped program.")
    finally:
        print("Disconnecting...")
        loop.run_until_complete(connection.cleanup())
```

Where does `bleak` come in?  You may have been wondering about the code directly before setting up the loops.
```py
    connection = Connection(
        loop, read_characteristic, write_characteristic, data_to_file.write_to_csv
    )
```

This class wrap the `bleak` library and makes it a bit easier to use.  Let me explain.


## Connection()

You may be asking, "Why create a wrapper around `bleak`, Thomas?" Well, two reasons. First, the `bleak` library is still in development and there are several aspects which do not work well.  Second, there are additional features I'd like my Bluetooth LE Python class to have.  For example, if you the Bluetooth LE connection is broken, I want my code to automatically attempt to reconnect.  This wrapper class allows me to add these capabilities.

I did try to keep the code highly hackable.  I want anybody to be able to use the code for their own applications, with a minimum time investment.

### Connection(): __init__

The `Connection` class has three required arguments and one optional.

* `loop` -- this is the loop established by `asyncio`, it allows the `connection` class to do async magic.
* `read_characteristic` -- the characteristic on the remote device containing data we are interested in.
* `write_characteristic` -- the characteristic on the remote device which we can write data.
* `data_dump_handler` -- this is the function to call when we've filled the `rx` buffer.
* `data_dump_size` -- this is the size of the `rx` buffer.  Once it is exceeded, the `data_dump_handler` function is called and the `rx` buffer is cleared.

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
        self.data_dump_size = data_dump_size
```

Alongside the arguments are internal variables which track device state. 

The variable `self.connected` tracks whether the `BleakClient` is connected to a remote device.  It is needed since the `await self.client.is_connected()` currently has an issue where it raises an exception if you call it and it's not connected to a remote device.  Have I mentioned `bleak` is in progress?

```py
        # Device state
        self.connected = False
        self.connected_device = None
```

`self.selected_device` hangs on to the device you selected when you started the `app`.  This is needed for reconnecting on disconnect.

The rest of variables help track the incoming data.  They'll probably be refactored into a [DTO](https://en.wikipedia.org/wiki/Data_transfer_object) at some point.

```py
        # RX Buffer
        self.last_packet_time = datetime.now()
        self.rx_data = []
        self.rx_timestamps = []
        self.rx_delays = []
```

### Connection(): Callbacks
There are two callbacks in the `Connection` class.  One to handle disconnections from the Bluetooth LE device.  And one to handle incoming data.

Easy one first, the `on_disconnect` method is called whenever the `BleakClient` loses connection with the remote device.  All we're doing with the callback is setting the `connected` flag to `False`.  This will cause the `Connection.connect()` to attempt to reconnect.
```py
    def on_disconnect(self, client: BleakClient):
        self.connected = False
        # Put code here to handle what happens on disconnet.
        print(f"Disconnected from {self.connected_device.name}!")
```

The `notification_handler` is called by the `BleakClient` any time the remote device updates a characteristic we are interested in.  The callback has two parameters, `sender`, which is the name of the device making the update, and `data`, which is a [bytearray](https://docs.python.org/3.1/library/functions.html#bytearray) containing the information received.

I'm converting the data from two-bytes into a single `int` value using Python's [from_bytes()](https://docs.python.org/3/library/stdtypes.html#int.from_bytes).  The first argument is the bytearray and the `byteorder` defines the [endianness](https://en.wikipedia.org/wiki/Endianness) (usually `big`).  The converted value is then appended to the `rx_data` list.

The `record_time_info()` calls a method to save the current time and the number of microseconds between the current byte received and the previous byte.

If the length of the `rx_data` list is greater than the `data_dump_size`, then the data are passed to the `data_dump_handler` function and the `rx_data` list is cleared, along with any time tracking information.

```py
    def notification_handler(self, sender: str, data: Any):
        self.rx_data.append(int.from_bytes(data, byteorder="big"))
        self.record_time_info()
        if len(self.rx_data) >= self.data_dump_size:
            self.data_dump_handler(self.rx_data, self.rx_timestamps, self.rx_delays)
            self.clear_lists()
```

### Connection(): Connection Management
The `Connection` class's primary job is to manage `BleakClient`'s connection with the remote device.  

The `manager` function is one of the async loops.  It continually checks if the `Connection.client` exists, if it doesn't then it prompts the `select_device()` function to find a remote connection.  If it does exist, then it executes the `connect()`.
```py
    async def manager(self):
        print("Starting connection manager.")
        while True:
            if self.client:
                await self.connect()
            else:
                await self.select_device()
                await asyncio.sleep(15.0, loop=loop)       
```

The `connect()` is responsible for ensuring the PC's Bluetooth LE device maintains a connection with the selected remote device.  

First, the method checks if the the device is already connected, if it does, then it simply returns.  Remember, this function is in an async loop.

If the device is not connected, it tries to make the connection by calling `self.client.connect()`.  This is awaited, meaning it will not continue to execute the rest of the method until this function call is returned.  Then, we check if the connection is was successful and update the `Connection.connected` property.

If the `BleakClient` is indeed connected, then we add the `on_disconnect` and `notification_handler` callbacks.  Note, we only added a callback on the `read_characteristic`.  Makes sense, right?

Lastly, we enter an infinite loop which checks every `5` seconds if the `BleakClient` is still connected, if it isn't, then it breaks the loop, the function returns, and the entire method is called again.

```py
    async def connect(self):
        if self.connected:
            return
        try:
            await self.client.connect()
            self.connected = await self.client.is_connected()
            if self.connected:
                print(f"Connected to {self.connected_device.name}")
                self.client.set_disconnected_callback(self.on_disconnect)
                await self.client.start_notify(
                    self.read_characteristic, self.notification_handler,
                )
                while True:
                    if not self.connected:
                        break
                    await asyncio.sleep(5.0, loop=loop)
            else:
                print(f"Failed to connect to {self.connected_device.name}")
        except Exception as e:
            print(e)
```

Whenever we decide to end the connection, we can escape the program by hitting `CTRL+C`, however, before shutting down the `BleakClient` needs to free up the hardware.  The `cleanup` method checks if the `Connection.client` exists, if it does, it tells the remote device we no longer want notifications from the `read_characteristic`.   It also sends a signal to our PC's hardware and the remote device we want to disconnect.
```py
    async def cleanup(self):
        if self.client:
            await self.client.stop_notify(read_characteristic)
            await self.client.disconnect()
```

## Device Selection
Bleak is a multi-OS package, however, there are slight differences between the different operating-systems.  One of those is the address of your remote device.  Windows and Linux report the remote device by it's [MAC](MAC_address).  Of course, Mac has to be the odd duck, it uses a Universally Unique Identifier ([UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier)).  Specially, it uses a [CoreBluetooth](https://developer.apple.com/documentation/corebluetooth) UUID, or a [CBUUID](https://developer.apple.com/documentation/corebluetooth/cbuuid). 

These identifiers are important as bleak uses them during its connection process.  These IDs are static, that is, they shouldn't change between sessions, yet they should be unique to the hardware.

The `select_device` method calls the `bleak.discover` method, which returns a list of `BleakDevices` advertising their connections within range.  The code uses the `aioconsole` package to asynchronously request the user to select a particular device
```py
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
```
After the user has selected a device then the `Connection.connected_device` is recorded (in case we needed it later) and the `Connection.client` is set to a newly created `BleakClient` with the address of the user selected device.
```py

        print(f"Connecting to {devices[response].name}")
        self.connected_device = devices[response]
        self.client = BleakClient(devices[response].address, loop=self.loop)
```

## Utility Methods
Not much to see here, these methods are used to handle timestamps on incoming Bluetooth LE data and clearing the `rx` buffer.

```py
    def record_time_info(self):
        present_time = datetime.now()
        self.rx_timestamps.append(present_time)
        self.rx_delays.append((present_time - self.last_packet_time).microseconds)
        self.last_packet_time = present_time

    def clear_lists(self):
        self.rx_data.clear()
        self.rx_delays.clear()
        self.rx_timestamps.clear()
```

## Save Incoming Data to File
This is a small class meant to make it easier to record the incoming microphone data along with the time it was received and delay since the last bytes were received.
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

## App Loops
I mentioned three "async loops," we've covered the first one inside the `Connection` class, but outside are the other two.

The `user_console_manager()` checks to see if the `Connection` instance has a instantiated a `BleakClient` and it is connected to a device.  If so, it prompts the user for input in a non-blocking manner.  After the user enters input and hits return the string is converted into a `bytearray` using the `map()`.  Lastly, it is sent by directly accessing the `Connection.client`'s `write_characteristic` method.  Note, that's a bit of a code smell, it should be refactored (when I have time).

```py
async def user_console_manager(connection: Connection):
    while True:
        if connection.client and connection.connected:
            input_str = await ainput("Enter string: ")
            bytes_to_send = bytearray(map(ord, input_str))
            await connection.client.write_gatt_char(write_characteristic, bytes_to_send)
            print(f"Sent: {input_str}")
        else:
            await asyncio.sleep(2.0, loop=loop)
```

The last loop is the one designed to take the application code.  Right now, it only simulates application logic by sleeping 5 seconds.
```py
async def main():
    while True:
        # YOUR APP CODE WOULD GO HERE.
        await asyncio.sleep(5)
```

# Closing
Well, that's it.  You _will_ have problems, especially if you are using the above code from Linux or Windows.  But, if you run into any issues I'll do my best to provide support.  Just leave me a comment below.
