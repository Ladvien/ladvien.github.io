---
layout: article
title: Populating and Programming and APM
categories: robots
excerpt:
tags: [robots]
image:
  feature: 11114-02_i_ma.jpg
  teaser: 11114-02_i_ma.jpg
  thumb:
comments: true
---

I decided to try making an Arduino Pro Mini at home.  Being done, it's not worth it.  You can buy one for a dollar more than you can make them, and it took awhile to populate.  Although, it's "fun."

![](/images/IMG_8868_513x768.jpg)

This project was also a chance for me to test the Spying-Stalactite I built.

I've enjoyed it.  It allows me to reflect on my strategy while populating boards.  It's simply a drop down with some high-powered LEDs (~2500 lumen), heatsink, and coolant fan.  It has a hole for my iphone to do the recording.  Cheap and simple.  Although, I need to diffuse the light, as you might see by the video that it washes out the details of the project.  Also, I'll add a few more lights and do away with the tungsten lamp, since the iphone is constantly in a white-balance battle as I move infront of the mixed lightsources.

![](/images/IMG_8862_1150x768.jpg)

I populated this board; everything came out fine (although, it was _much more difficult_ trying not to block the camera with my head).  I popped it into Atmel studio and it read out the device voltage and signature.  Of course, I bricked it, as I seem to do a lot.

My next project is a Fuse Doctor. :)

I had ordered the boards from OSHPark and had planned on making three.  So, I populated another and took some time programming it.  I've outlined my steps below:

**1 Hook up the AVRISP MKII **

![](/images/avrispmkii-pin-out.png)

![](/images/Pinout_of_Aduino_Pro_Mini.jpg)

**2 Open Atmel Studio.  Go to Tools -- Device Programming.**

**3 Setup:**

*   **Tool: AVRISP mkII**
*   **Device: ATmega328P**
*   **Interface: ISP**

**Click apply**

**4 Read Target voltage (it should be ~5V).  Read Device Signature.**

**![](/images/Atmel_Studio_1.jpg)
**

6 Open **boards.txt** that comes with Arduino (\Desktop\arduino-1.0.3\hardware\arduino\boards.txt).

7 Scroll down to the area marked:

![](/images/Boards_File.jpg)

**8 Pull the programming information for the board from this area.**  Now, I've bricked a few boards, but I think I've figured this one out.  When programming this board with the MKII and Atmel Studio, you should follow this order.

**1 Set the fuses.**

*   **Extended: 0xFD**
*   **High: 0xDA**
*   **Low: 0xFF**
*   **(Double check the board file to make sure I didn't make typos)**
*   **Hit "Program"**

**2 Upload Bootloader.**

"The bootloader for the 5v, 16mhz Arduino Pro Mini (which is what I built) is **"ATmegaBOOT_168_atmega328.hex **(Desktop\arduino-1.0.3\hardware\arduino\bootloaders\atmega\ATmegaBOOT_168_atmega328.hex).  It's important to note that the 3.3v and 5v versions use different bootloaders.

*   **Go to the Memories tab**
*   **Hit the browse ellipsis.**
*   **Select the "ATmegaBOOT_168_atmega328.hex"**
*   **(Double check the boards file to make sure I'm not screwing you up).**
*   **Hit program.**

**3  Set Lock Bits. **

*   **Go to the "Lock bits" tab.  **
*   **Check the boards.txt file for Lockbit number**
*   **Lockbit: 0xCF**
*   **(Double check the boards.txt.  I don't take blame for bricked boards :P).**
*   **Hit "Program"**

**9 Upload the Blink Sketch; the LED by the reset button should blink.**

**10 Let me know how it went.  If you bricked a chip using these instructions, let me know so I can modify them quick.**

Now that I'm used to the camera and stalactite, I plan to annotate my next board for tips on working with 0402s.

Hope all are well.

ps. Birdmun et al., sorry bout the copyright issues.  Not a professional at anything, especially video editing :)
