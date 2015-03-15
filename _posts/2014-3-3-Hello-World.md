---
layout: post
title: You're up and running!
---

Next you can update your site name, avatar and other options using the _config.yml file in the root of your repository (shown below).

![_config.yml]({{ site.baseurl }}/images/config.png)

The easiest way to make your first post is to edit this one. Go into /_posts/ and update the Hello World markdown file. For more instructions head over to the [Jekyll Now repository](https://github.com/barryclark/jekyll-now) on GitHub.



<span style="font-size: medium;"><span style="line-height: 22px;">**I
want to take a moment to thank [Bdk6][].  The man is a walking Stack
Overflow, with more patience for stupid.  I doubt I’d understand any of
this without his guidance.**</span></span>

I thought I’d take some time away from coding my [LPC1114
Uploader][] and verbally process a few things I’ve learned.  As always,
feel free to critique any of it; it’ll only serve to make my code more
robust in the end.  

This post will be a series of post leading up to the large post I’ll
make on writing the uploader.  All posts will rely on the GCC compiler.

 

**![][]<span style="font-size: large;">Setting Up the GCC
Compiler</span>**

I setup a C environment as basic I could.  <span
style="line-height: 1.231;">There may be easier ways to go about this,
but I wanted to use GCC to compile.  </span>

To setup the environment:

1\. I downloaded and setup [MinGW32][].

2\. I added these **includes** to make the code go.

 

<div
style="background: #f8f8f8; overflow: auto; width: auto; border: solid gray; border-width: .1em .1em .1em .8em; padding: .2em .6em;">

+--------------------------------------+--------------------------------------+
| ``` {style="margin: 0; line-height:  | ``` {style="margin: 0; line-height:  |
| 125%;"}                              | 125%;"}                              |
|  1                                   | #include <stdio.h>                   |
|  2                                   | #include <stdarg.h>                  |
|  3                                   | #include <stdlib.h>                  |
|  4                                   | #include <windows.h>                 |
|  5                                   | #include <windef.h>                  |
|  6                                   | #include <winnt.h>                   |
|  7                                   | #include <winbase.h>                 |
|  8                                   | #include <string.h>                  |
|  9                                   | #include <math.h>                    |
| 10                                   | #include <stdbool.h>                 |
| 11                                   | #include <stdint.h>                  |
| 12                                   |                                      |
| 13                                   | #include <sys/time.h>                |
| ```                                  | ```                                  |
+--------------------------------------+--------------------------------------+

</div>

 

I used this line to build it:

**\$ gcc -o main main.c**

<span style="line-height: 1.231;">As for editing, I’ve really grown to
love </span><a s>

  [Bdk6]: http://letsmakerobots.com/users/bdk6
  [LPC1114 Uploader]: http://letsmakerobots.com/lpc1114-usb-serial-solution-rerolling-boot-uploader
  []: /files/userpics/u19048/GCCLogo.png
  [MinGW32]: http://www.mingw.org/wiki/HOWTO_Install_the_MinGW_GCC_Compiler_Suite
