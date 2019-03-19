---
layout: post
title: STM32F030FPx Workspace in Visual Studio Code on a Mac
categories: robot
series: 
excerpt:
tags: [stm32f030fpx, visual studio code, stlink]
image: 
    feature: 
comments: true
custom_css:
custom_js: 
---


Hardware:
* [Board](https://www.ebay.com/itm/STM32F030F4P6-ARM-CORTEX-M0-Core-System-Dev-Board-SWD-ISP-MicroUSB-32bit-BBC/142665526610?hash=item2137872d52:g:IXQAAOSwZB9aHn2I)
* [Programmer / Debugger](https://www.ebay.com/itm/ST-Link-V2-Mini-Metal-Shell-STM8-STM32-Emulator-Downloader-Programming-Unit-M267/113406326168?epid=4024997830&hash=item1a678b3598:g:t5UAAOSwx6pYqmAg)

You will need [Homebrew](https://brew.sh/) installed for the following.

Recipe
Install GCC ARM tools
Download the latest version of the GCC ARM tools 
* [Download GCC ARM](https://developer.arm.com/open-source/gnu-toolchain/gnu-rm/downloads)
And unzip it and take note and copy the path to the bin directory

For example
```
/Users/your_user_name/gcc-arm-none-eabi-8-2018-q4-major/bin
```

Then add the following to the `.bash_profile`.
```
nano ~/.bash_profile
export PATH="$PATH:/Users/your_user_name/gcc-arm-none-eabi-8-2018-q4-major/bin"
source ~/.bash_profile
```
Test the tools are found
```
arm-none-eabi-gcc -v
```


```
brew install openocd
```


```
git clone https://github.com/Ladvien/STM32F030F4Px_workspace.git
cd STM32F030F4Px_workspace
```

Edit the openocd paths
```
nano stm32f0.cfg
```
Change the two paths at the top to your openocd tools
```
source [find /put_your_path_here/interface/stlink-v2.cfg]
source [find /put_your_path_here/target/stm32f0x.cfg]

reset_config none
init


proc stm_flash {IMGFILE} {
     halt
     stm32f0x unlock 0
     reset halt
     flash write_image erase $IMGFILE 0x08000000
     verify_image $IMGFILE 0x08000000
     reset run
     shutdown
}

proc stm_erase {} {
     reset halt
     stm32f0x mass_erase 0
     shutdown
}
```

Connect the board like:

And run
```
make setup
make all
make flash
```

You should get something like:
```
Licensed under GNU GPL v2
For bug reports, read
	http://openocd.org/doc/doxygen/bugs.html
Info : auto-selecting first available session transport "hla_swd". To override use 'transport select <transport>'.
Info : The selected transport took over low-level target control. The results might differ compared to plain JTAG/SWD
adapter speed: 1000 kHz
adapter_nsrst_delay: 100
none separate
none separate
Info : Unable to match requested speed 1000 kHz, using 950 kHz
Info : Unable to match requested speed 1000 kHz, using 950 kHz
Info : clock speed 950 kHz
Info : STLINK v2 JTAG v17 API v2 SWIM v4 VID 0x0483 PID 0x3748
Info : using stlink api v2
Info : Target voltage: 3.258278
Info : stm32f0x.cpu: hardware has 4 breakpoints, 2 watchpoints
....
```
Dont be alarmed if you see something like
```
target halted due to debug-request, current mode: Thread 
xPSR: 0x81000000 pc: 0x0800064e msp: 0x20000fe8
```
As long as you see the `verified` note towards the end.
```
verified 1976 bytes in 0.041452s (46.552 KiB/s)
```
This means it wrote the flash correctly.

Install the [Cortex Debug](https://marketplace.visualstudio.com/items?itemName=marus25.cortex-debug) extension in Visual Studio Code

Add the following Debugger configuration
```
    "configurations": [
        {
            "type": "cortex-debug",
            "request": "launch",
            "servertype": "stutil",
            "cwd": "${workspaceRoot}",
            "executable": "./build/blink.elf",
            "name": "Debug (ST-Util)",
            "device": "STM32F030F4",
            "v1": false
        }
    ]
```

Now, open your workspace, connect the STM32F0, and hit debug.