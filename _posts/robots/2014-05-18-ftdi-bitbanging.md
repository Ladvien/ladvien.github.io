---
layout: article
title: FTDI Bitbanging GCC
categories: robots
excerpt:
tags: [robots]
color: blue
color: blue
image:
  feature: FTDI.jpg
  teaser: FTDI.jpg
  thumb:
comments: true
---

Originally posted on [www.letsmakerobots.com](www.letsmakerobots.com)

This is a short note on how to setup a C programming environment for the FTDI chip in bit banging mode, since that's what I had difficulty doing.

There may be easier ways to go about this, but I wanted to use GCC to compile a small C program to control the 8 IOs.  The purpose was to write a small command-line program that would reset my LPC1114 before and after programming.

To setup the environment:

1\. I downloaded and setup [MinGW32](http://www.mingw.org/wiki/HOWTO_Install_the_MinGW_GCC_Compiler_Suite).

2\. I then downloaded [FTD2XX libraries](http://www.ftdichip.com/Drivers/D2XX.htm).  **This included the ftd2xx.h file and ftd2xx.lib**.

3\. I then stole the test code from Hack-a-Day's article on [bitbanging with the FTDI](http://hackaday.com/2009/09/22/introduction-to-ftdi-bitbang-mode/).

4\. I modified the code as they suggested by including, in this order, the Windows compatibility files:

{% highlight c%}
#include <stdio.h>
#include <stdarg.h>
#include <windows.h>
#include <windef.h>
#include <winnt.h>
#include <winbase.h>
#include <string.h>
#include <math.h>
#include "ftd2xx.h"
{% endhighlight %}
5\. I then used the rest of their code as a base: [Hack-a-Day's FTDI PWM Code](https://github.com/Ladvien/FTDI_Bitbangin_GCC/blob/master/ftdi_Test.c)

I used this line to build it:

**$ gcc -o ftdi_PWM ftdi_Test.c -L./ -lftd2xx**

You must have both the ftd2xx.h and ftd2xx.lib in the same directory as you attempt to build.

6\. I then wrote two programs, one to send DTR and CTS high and low in order to reset the LPC1114 into **programming mode. ** Second, to send DTR and CTS high and low in order to send the LPC1114 into **run program mode.**  The idea being, I could use the typical [Sparkfun FTDI programmer](https://www.sparkfun.com/search/results?term=ftdi) to program my [LPC1114](http://letsmakerobots.com/content/lpc1114-setup-bare-metal-arm).

1.  [LPC1114_reset_to_program](https://github.com/Ladvien/FTDI_Bitbangin_GCC/blob/master/LPC1114_reset_to_program.c)
2.  [LPC1114_reset_to_bootloader](https://github.com/Ladvien/FTDI_Bitbangin_GCC/blob/master/LPC1114_reset_to_bootloader.c)

That's it.  Just wanted to make sure this was out in the universe for the next guy's sake.
