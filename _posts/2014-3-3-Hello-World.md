---
layout: post
title: You're up and running!
---

Next you can update your site name, avatar and other options using the _config.yml file in the root of your repository (shown below).

![_config.yml]({{ site.baseurl }}/images/config.png)

The easiest way to make your first post is to edit this one. Go into /_posts/ and update the Hello World markdown file. For more instructions head over to the [Jekyll Now repository](https://github.com/barryclark/jekyll-now) on GitHub.



&nbsp;

<span style="font-size: medium;"><span style="line-height: 22px;">**I want to take a moment to thank [Bdk6](http://letsmakerobots.com/users/bdk6). &nbsp;The man is a walking Stack Overflow, with more patience for stupid. &nbsp;I doubt I'd understand any of this without his guidance.**</span></span>

I thought I'd take some time away from coding my&nbsp;[LPC1114 Uploader](http://letsmakerobots.com/lpc1114-usb-serial-solution-rerolling-boot-uploader)&nbsp;and verbally process a few things I've learned. &nbsp;As always, feel free to critique any of it; it'll only serve to make my code more robust in the end. &nbsp;

This post will be a series of post leading up to the large post I'll make on writing the uploader. &nbsp;All posts will rely on the GCC compiler.

&nbsp;

**![](/files/userpics/u19048/GCCLogo.png)<span style="font-size: large;">Setting Up the GCC Compiler</span>**

I setup a C environment as basic I could. &nbsp;<span style="line-height: 1.231;">There may be easier ways to go about this, but&nbsp;I wanted to use GCC to compile. &nbsp;</span>

To setup the environment:

1. I downloaded and setup&nbsp;[MinGW32](http://www.mingw.org/wiki/HOWTO_Install_the_MinGW_GCC_Compiler_Suite).

2. I added these&nbsp;**includes**&nbsp;to make the code go.

&nbsp;
<div style="background: #f8f8f8; overflow: auto; width: auto; border: solid gray; border-width: .1em .1em .1em .8em; padding: .2em .6em;"><table><tbody><tr><td><pre style="margin: 0; line-height: 125%;"> 1
 2
 3
 4
 5
 6
 7
 8
 9
10
11
12
13</pre></td><td><pre style="margin: 0; line-height: 125%;"><span style="color: #8f5902; font-style: italic;">#include &lt;stdio.h&gt;</span>
<span style="color: #8f5902; font-style: italic;">#include &lt;stdarg.h&gt;</span>
<span style="color: #8f5902; font-style: italic;">#include &lt;stdlib.h&gt; </span>
<span style="color: #8f5902; font-style: italic;">#include &lt;windows.h&gt;</span>
<span style="color: #8f5902; font-style: italic;">#include &lt;windef.h&gt;</span>
<span style="color: #8f5902; font-style: italic;">#include &lt;winnt.h&gt;</span>
<span style="color: #8f5902; font-style: italic;">#include &lt;winbase.h&gt;</span>
<span style="color: #8f5902; font-style: italic;">#include &lt;string.h&gt;</span>
<span style="color: #8f5902; font-style: italic;">#include &lt;math.h&gt;</span>
<span style="color: #8f5902; font-style: italic;">#include &lt;stdbool.h&gt;</span>
<span style="color: #8f5902; font-style: italic;">#include &lt;stdint.h&gt;</span>

<span style="color: #8f5902; font-style: italic;">#include &lt;sys/time.h&gt;</span>
</pre></td></tr></tbody></table></div>

&nbsp;

I used this line to build it:

**$ gcc -o main main.c**

<span style="line-height: 1.231;">As for editing, I've really grown to love&nbsp;</span>[Sublime Text 2](http://www.sublimetext.com/2)<span style="line-height: 1.231;">.</span>

If you have issues**, make sure directory containing your files is in your PATH environment variable&nbsp;**(I go over how to add the directory to your environment variables in this&nbsp;[post](http://letsmakerobots.com/content/lpc1114-setup-bare-metal-arm)).

&nbsp;

**<span style="font-size: large;">How to Convert Hex Data to UUE</span>**

**"What is 'UUEncoding'?"**

**&nbsp;**<span style="line-height: 1.231;">Unix-to-Unix encoding (UUE) is the process where </span>**binary data is converted to a form which can be represented using ASCII character values from space (32) to underscore (95)**<span style="line-height: 1.231;">. &nbsp;These 64 characters allow us to express any binary stream of data.</span>

I will not spend a lot of time explaining&nbsp;**UUEncoding** since the [Wikipedia article is excellent](http://en.wikipedia.org/wiki/Uuencoding).

**"Why UUEncode?"**

Have you written a program to look for a particular value? &nbsp;Like this,

<!-- HTML generated using hilite.me -->
<div style="background: #f8f8f8; overflow: auto; width: auto; border: solid gray; border-width: .1em .1em .1em .8em; padding: .2em .6em;"><table><tbody><tr><td><pre style="margin: 0; line-height: 125%;"> 1
 2
 3
 4
 5
 6
 7
 8
 9
10
11
12
13</pre></td><td><pre style="margin: 0; line-height: 125%;"><span style="color: #204a87; font-weight: bold;">int</span> <span style="color: #000000;">i</span><span style="color: #000000; font-weight: bold;">;</span>
<span style="color: #204a87; font-weight: bold;">char</span> <span style="color: #000000;">tCollection</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #0000cf; font-weight: bold;">32</span><span style="color: #000000; font-weight: bold;">];</span>
<span style="color: #204a87; font-weight: bold;">char</span> <span style="color: #000000;">c</span><span style="color: #000000; font-weight: bold;">;</span>

<span style="color: #204a87; font-weight: bold;">if</span><span style="color: #000000; font-weight: bold;">(</span> <span style="color: #000000;">c</span> <span style="color: #ce5c00; font-weight: bold;">==</span> <span style="color: #4e9a06;">'T'</span><span style="color: #000000; font-weight: bold;">)</span>
<span style="color: #000000; font-weight: bold;">{</span>
    <span style="color: #000000;">Serial</span><span style="color: #000000; font-weight: bold;">.</span><span style="color: #000000;">print</span><span style="color: #000000; font-weight: bold;">(</span><span style="color: #4e9a06;">"I found a T!"</span><span style="color: #000000; font-weight: bold;">);</span>
    <span style="color: #000000;">tCollection</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #000000;">i</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #000000;">c</span><span style="color: #000000; font-weight: bold;">;</span>
<span style="color: #204a87; font-weight: bold;">else</span> <span style="color: #000000;">if</span> <span style="color: #000000; font-weight: bold;">(</span><span style="color: #000000;">c</span> <span style="color: #ce5c00; font-weight: bold;">==</span> <span style="color: #4e9a06;">'\r'</span><span style="color: #000000; font-weight: bold;">)</span>
<span style="color: #000000; font-weight: bold;">{</span>
    <span style="color: #000000;">exit</span><span style="color: #000000; font-weight: bold;">();</span>
<span style="color: #000000; font-weight: bold;">}</span>

</pre></td></tr></tbody></table></div> 

&nbsp;

&nbsp;

You begin running your program and everything seems fine. &nbsp;It is inspecting data looking for the letter T (0x54), but then, all of a sudden your program exits without reason. &nbsp;You're upset, because the sensor sending you the data didn't send the exit code, which is a carriage return ('\r', or 0x13), but still, your program ended like it did.

Really, we know the reason, your program came across a random 0x13, which it interpreted as an exit command. &nbsp;Maybe a different special character?

![](http://www.bibase.com/images/ascii.gif)

But you realize, if you are dealing with a 8-bit data stream any ASCII character _might_&nbsp;be found in the incoming stream. &nbsp;So, how can the communicating devices know when it is getting data, versus, when it is receiving a command?

&nbsp;

![](/files/userpics/u19048/Super_Style_ASCII_by_buddhascii.png)

&nbsp;

<span style="line-height: 1.231;">This is where UUE comes in. &nbsp;As I stated earlier, UUE is a way to represent the same 8-bit data using only hex values 0x32 through 0x95 (the two middle columns in the ASCII chart above). &nbsp;This means characters 0x00 through 0x1F and 0x60 through 0x7F are free to be used for command functions.</span>

Returning to the above example, this means we could now us the CR value to signal the end-of-transmission, since CR is 0x13.

Ok, I hope I've sold you on UUE's utility, let me attempt to explain the basics of how hexadecimal data is converted into a form which may be represented with only 64 values.

&nbsp;

&nbsp;

UUE conversion works with three bytes of data at a time and follows this algorithm.

1.  The individual bits of 3 HEX bytes are put into a series.
2.  The 24-bit series is then divided into four bytes of 6-bits.
3.  Then, 32 is added to the decimal value representing each of the 6-bit bytes.
4.  The resulting four values are UUEncoded bytes.

Confused as hell? I was too. &nbsp;Pictures are good. &nbsp;<span style="line-height: 1.231;">Let's follow the Wiki example and use: </span>**Cat**

The first step is to take the binary values for each ASCII character.

*   <span style="line-height: 1.231;">'C' = 01000011</span>
*   'a' = 01100001
*   't' = &nbsp;01110100

This means the resulting 24-bit binary series is,

24-bit:&nbsp;<span style="line-height: 1.231;">01000011</span><span style="line-height: 1.231;">01100001</span><span style="line-height: 1.231;">01110100</span>

<span style="line-height: 1.231;">This is then divided into four 6-bit bytes,</span>

<span style="line-height: 1.231;">&nbsp;</span>

*   <span style="line-height: 1.231;">6-bit Byte: &nbsp; &nbsp; 1 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 2 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 3 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;4</span>
*   <span style="line-height: 1.231;">Binary: &nbsp; &nbsp; &nbsp;010000 &nbsp; 11</span><span style="line-height: 1.231;">0110 &nbsp; &nbsp;0001</span><span style="line-height: 1.231;">01 &nbsp; 110100</span>

The new decimal values are,

*   <span style="line-height: 1.231;">6-bit Byte: &nbsp; &nbsp; &nbsp; &nbsp;1 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 2 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 3 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;4</span>
*   <span style="line-height: 1.231;">Decimal: &nbsp; &nbsp; &nbsp; &nbsp; 16 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 54</span><span style="line-height: 1.231;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 5</span><span style="line-height: 1.231;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;52</span>

At this point the 6-bit (senary) byte gave me a little trouble. &nbsp;I didn't understand how 6-bits were treated by the 8-bit variable I was putting them in. &nbsp;For example, how could I get an **int variable**&nbsp;to take only 6 bits, not 8? &nbsp;The trick is understanding the 8-bit variable is only the width of the allotted space provided in a register, it has no influence on what you put in it. &nbsp;It finally dawned on me, I didn't need to worry about the empty bits in a register.

Examples are good:

010000 &nbsp; &nbsp; = 16 in Decimal

00<span style="line-height: 1.231;">010000&nbsp;</span><span style="line-height: 1.231;">= 16 in Decimal</span>

010000 =&nbsp;<span style="line-height: 1.231;">00</span><span style="line-height: 1.231;">010000</span>

Anyway, this is how I finally made sense of it. &nbsp;As long as when I did my bit manipulations I kept unused bits of the register towards the "left" side, the my 6-bit values could be put into a 8-bit register and there value would remain the same.

<span style="line-height: 1.231;">Alright, back to our example.</span>

<span style="line-height: 1.231;">Our next step is to add 32 to each of the decimal value of our new four bytes.</span>

*   <span style="line-height: 1.231;">6-bit Byte: &nbsp; &nbsp; &nbsp; &nbsp;1 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 2 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 3 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;4</span>
*   <span style="line-height: 1.231;">Decimal: &nbsp; &nbsp; &nbsp; &nbsp; 16 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 54</span><span style="line-height: 1.231;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 5</span><span style="line-height: 1.231;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;52</span>
*   <span style="line-height: 1.231;">Add 32 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;+32 &nbsp; &nbsp; &nbsp; &nbsp;+32 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;+32 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; +32</span>
*   <span style="line-height: 1.231;">New Dec. &nbsp; &nbsp; &nbsp; &nbsp;48 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;86 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;37 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;84</span>
*   **<span style="line-height: 1.231;">UUE char: &nbsp; &nbsp; &nbsp; 0 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;V &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; % &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; T</span>**

&nbsp;

![](/files/userpics/u19048/schrodingers_cat.jpg)And...that's it. &nbsp;Your data is now UUEncoded. &nbsp;When it is sent through whatever transmission medium it wont be bothered with special character protocals. &nbsp;For our Cat, we have transformed it into:** 0V%T**

Let's hope for the Cat's sake, there is decoding algorithm.

**Those sharper than myself may have already noticed a couple of problems.** &nbsp;For instance, what if our data doesn't come in increments of threes? &nbsp;For example, how do we send **Cats?**

The answer? We make nothing up. &nbsp;In the instance of Cats, we simply pad the end of the character series with two nulls on the end. &nbsp;For example,

*   <span style="line-height: 1.231;">'C' = 01000011</span>
*   'a' = 01100001
*   't' = &nbsp;01110100
*   's' =&nbsp;01110011
*   NUL = 00000000
*   NUL = 00000000

<span style="line-height: 1.231;">48-bit:&nbsp;</span><span style="line-height: 1.231;">01000011</span><span style="line-height: 1.231;">01100001</span><span style="line-height: 1.231;">01110100</span><span style="line-height: 1.231;">01110011</span><span style="line-height: 1.231;">00000000</span><span style="line-height: 1.231;">00000000</span>

*   <span style="line-height: 1.231;">6-bit Byte: &nbsp; &nbsp; 1 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 2 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 3 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;4 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 5 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 6 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;7 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;8</span>
*   <span style="line-height: 1.231;">Binary: &nbsp; &nbsp;</span><span style="line-height: 1.231;">010000 &nbsp; &nbsp;11</span><span style="line-height: 1.231;">0110 &nbsp; &nbsp;0001</span><span style="line-height: 1.231;">01 &nbsp; &nbsp;110100 &nbsp; &nbsp;</span><span style="line-height: 1.231;">011100 &nbsp; &nbsp;11</span><span style="line-height: 1.231;">0000 &nbsp; &nbsp; 0000</span><span style="line-height: 1.231;">00 &nbsp; &nbsp;000000</span>

The new decimal values are,

*   <span style="line-height: 1.231;">6-bit Byte: &nbsp; &nbsp; &nbsp; &nbsp;1 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 2 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 3 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;4 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 5 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;6 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;7 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;8</span>
*   <span style="line-height: 1.231;">Decimal: &nbsp; &nbsp; &nbsp; &nbsp; 16 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 54</span><span style="line-height: 1.231;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 5</span><span style="line-height: 1.231;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;52 &nbsp; &nbsp; &nbsp; &nbsp; 28 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;48 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 0 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;0&nbsp;</span>

*   <span style="line-height: 1.231;">6-bit Byte: &nbsp; &nbsp; &nbsp; &nbsp;1 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 2 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 3 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;4 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 5 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;6 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;7 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;8</span>
*   <span style="line-height: 1.231;">Decimal: &nbsp; &nbsp; &nbsp; &nbsp; 16 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 54</span><span style="line-height: 1.231;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 5</span><span style="line-height: 1.231;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;52 &nbsp; &nbsp; &nbsp; &nbsp; 28 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;48 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 0 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;0&nbsp;</span>
*   <span style="line-height: 1.231;">Add 32 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;+32 &nbsp; &nbsp; &nbsp; &nbsp;+32 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;+32 &nbsp; &nbsp; &nbsp; &nbsp;+32 &nbsp; &nbsp; &nbsp;+32 &nbsp; &nbsp; &nbsp; &nbsp; +32 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;+32 &nbsp; &nbsp; &nbsp; &nbsp; +32</span>
*   <span style="line-height: 1.231;">New Dec. &nbsp; &nbsp; &nbsp; &nbsp;48 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;86 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;37 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;84 &nbsp; &nbsp; &nbsp; &nbsp;60 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 80 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;32 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;32</span>
*   **UUE char: &nbsp; &nbsp; &nbsp; 0 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;V &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; % &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; T &nbsp; &nbsp; &nbsp; &nbsp;&lt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; P &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;SPC &nbsp; &nbsp; &nbsp; &nbsp;SPC**

We have turned "Cats" into "**0V%T&lt;P &nbsp;**" &nbsp;Well, almost, we aren't quite done here.

Uh-oh. &nbsp;Another problem. &nbsp;The whole point of UUE was to stay away from special characters like the space character (0x32). &nbsp;But now we have two of them in our transmission. &nbsp;Well, the UUE protocol addresses this. &nbsp;It states,

*   If the result of the 6-bit encoding process is the space character, we convert this to the [grave characte](http://en.wikipedia.org/wiki/Grave_accent)r, **' ` '. &nbsp;**(The grave accent character is 0x60 in hexadecimal, by the way).

Therefore, our "Cats" actually becomes.

*   **Almost UUE char: &nbsp; &nbsp; &nbsp; 0 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;V &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; % &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; T &nbsp; &nbsp; &nbsp; &nbsp;&lt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; P &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;SPC &nbsp; &nbsp; &nbsp; &nbsp;SPC**
*   **UUE char: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;0 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;V &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; % &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; T &nbsp; &nbsp; &nbsp; &nbsp;&lt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; P &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ` &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; `**

&nbsp;

Finally! We have encoded "Cats"

We've turned:

![](/files/userpics/u19048/fivekittems1.jpg)&nbsp;into -------------&gt;&nbsp;**&nbsp;&nbsp;0V%T&lt;P `` &nbsp; &nbsp; &nbsp;Now, _that's_&nbsp;science folks!**

&nbsp;

**<span style="font-weight: normal;">Hmm, what else are you going to need to know? <strong>Oh, right, how the UUE data is stored.**</span></strong>

UUE stores and sends data in lines. &nbsp;A line of UUE data consist of a start character, which represents how many bytes have been encoded in the line (**not**&nbsp;how many UUE characters are in the line) by using a 6-bit number stored as an ASCII char. &nbsp;The line of UUE data ends with a new line character (i.e., '\n'). &nbsp;Lastly, a UUE line is limited to 45 bytes of data. &nbsp;This means, the maximum amount of data characters in on line of UUE should be no more than 60. &nbsp;Or, 62, if you count the start character and the end character.

Again, examples are good. &nbsp;For our Cats, the line would look something like this,

*   <span style="line-height: 1.231;">$&nbsp;</span>**0V%T&lt;P `` \n**

![](/files/userpics/u19048/UUE_dump.png)

Let me take a moment to describe how we get the start character. &nbsp;Basically, we count how many bytes we are sending, in our case 4, and we add 32. &nbsp;This gives us the decimal representation of the ASCII character we will use as our start character. &nbsp;Therefore,

*   <span style="line-height: 1.231;">4 + 32 = 36 as ASCII = $</span>

Confusing? &nbsp;It'll probably make more sense when we look at the code.

&nbsp;

Speaking of which, I think I've covered the basics, time to jump into implementation.

&nbsp;

**<span style="font-size: large;">Implementing UUEncoding in C</span>**

Well, here it is. &nbsp;My shoddy implementation of a UUEncoder in C. &nbsp;

The function takes several variables.

1.  <span style="line-height: 1.231;">**UUE_data_array** is a pointer to an uint8_t array where the encoded characters will be stored.</span>
2.  <span style="line-height: 1.231;">**hex_data_array** is a pointer to an uint8_t array containing the hexadecimal values to be encoded (to learn where I get my hexadecimal data, checkout another one of this inglorious post: [Intel HEX File to Array](http://letsmakerobots.com/content/intel-hexfile-array)).</span>
3.  <span style="line-height: 1.231;">**hex_data_array** size is an integer representing how many bytes of data might be found in the **hex_data_array**.</span>
4.  <span style="line-height: 1.231;">After the function is complete, it returns how many ASCII UUE characters were created. &nbsp;This is meant for parsing the UUE array at a later time.</span>

&nbsp;

<!-- HTML generated using hilite.me -->
<div style="background: #f8f8f8; overflow: auto; width: auto; border: solid gray; border-width: .1em .1em .1em .8em; padding: .2em .6em;"><table><tbody><tr><td><pre style="margin: 0; line-height: 125%;">  1
  2
  3
  4
  5
  6
  7
  8
  9
 10
 11
 12
 13
 14
 15
 16
 17
 18
 19
 20
 21
 22
 23
 24
 25
 26
 27
 28
 29
 30
 31
 32
 33
 34
 35
 36
 37
 38
 39
 40
 41
 42
 43
 44
 45
 46
 47
 48
 49
 50
 51
 52
 53
 54
 55
 56
 57
 58
 59
 60
 61
 62
 63
 64
 65
 66
 67
 68
 69
 70
 71
 72
 73
 74
 75
 76
 77
 78
 79
 80
 81
 82
 83
 84
 85
 86
 87
 88
 89
 90
 91
 92
 93
 94
 95
 96
 97
 98
 99
100
101
102
103
104
105
106
107
108
109
110
111
112
113</pre></td><td><pre style="margin: 0; line-height: 125%;"><span style="color: #204a87; font-weight: bold;">int</span> <span style="color: #000000;">UUEncode</span><span style="color: #000000; font-weight: bold;">(</span><span style="color: #204a87; font-weight: bold;">uint8_t</span> <span style="color: #ce5c00; font-weight: bold;">*</span> <span style="color: #000000;">UUE_data_array</span><span style="color: #000000; font-weight: bold;">,</span> <span style="color: #204a87; font-weight: bold;">uint8_t</span> <span style="color: #ce5c00; font-weight: bold;">*</span> <span style="color: #000000;">hex_data_array</span><span style="color: #000000; font-weight: bold;">,</span> <span style="color: #204a87; font-weight: bold;">int</span> <span style="color: #000000;">hex_data_array_size</span><span style="color: #000000; font-weight: bold;">)</span>
<span style="color: #000000; font-weight: bold;">{</span>
	<span style="color: #8f5902; font-style: italic;">// 1. Add char for characters per line.</span>
	<span style="color: #8f5902; font-style: italic;">// 2. Load 3 bytes into an array.</span>
	<span style="color: #8f5902; font-style: italic;">// 3. Encode array.</span>
	<span style="color: #8f5902; font-style: italic;">// 4. Add padding.</span>
	<span style="color: #8f5902; font-style: italic;">// 5. Replace ' ' with '''</span>
	<span style="color: #8f5902; font-style: italic;">// 6. Return UUE data array (implicit) and size.</span>
	<span style="color: #204a87; font-weight: bold;">uint8_t</span> <span style="color: #000000;">byte_to_encode</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #0000cf; font-weight: bold;">3</span><span style="color: #000000; font-weight: bold;">];</span>
	<span style="color: #204a87; font-weight: bold;">uint8_t</span> <span style="color: #000000;">uue_char</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #0000cf; font-weight: bold;">4</span><span style="color: #000000; font-weight: bold;">];</span>

	<span style="color: #204a87; font-weight: bold;">int</span> <span style="color: #000000;">UUEncoded_array_index</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #0000cf; font-weight: bold;">0</span><span style="color: #000000; font-weight: bold;">;</span>
	<span style="color: #204a87; font-weight: bold;">int</span> <span style="color: #000000;">uue_length_char_index</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #0000cf; font-weight: bold;">45</span><span style="color: #000000; font-weight: bold;">;</span>
	<span style="color: #204a87; font-weight: bold;">int</span> <span style="color: #000000;">padded_index</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #0000cf; font-weight: bold;">0</span><span style="color: #000000; font-weight: bold;">;</span>
	<span style="color: #204a87; font-weight: bold;">int</span> <span style="color: #000000;">bytes_left</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #0000cf; font-weight: bold;">0</span><span style="color: #000000; font-weight: bold;">;</span>

	<span style="color: #8f5902; font-style: italic;">// 1. Add char for characters per line.</span>
	<span style="color: #204a87; font-weight: bold;">if</span><span style="color: #000000; font-weight: bold;">(</span><span style="color: #000000;">hex_data_array_size</span> <span style="color: #ce5c00; font-weight: bold;">&lt;</span> <span style="color: #0000cf; font-weight: bold;">45</span><span style="color: #000000; font-weight: bold;">)</span>
	<span style="color: #000000; font-weight: bold;">{</span>
		 <span style="color: #000000;">UUE_data_array</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #000000;">UUEncoded_array_index</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #000000; font-weight: bold;">((</span><span style="color: #000000;">hex_data_array_size</span> <span style="color: #ce5c00; font-weight: bold;">&amp;</span> <span style="color: #0000cf; font-weight: bold;">0x3f</span><span style="color: #000000; font-weight: bold;">)</span> <span style="color: #ce5c00; font-weight: bold;">+</span> <span style="color: #4e9a06;">' '</span><span style="color: #000000; font-weight: bold;">);</span>
	<span style="color: #000000; font-weight: bold;">}</span>
	<span style="color: #204a87; font-weight: bold;">else</span>
	<span style="color: #000000; font-weight: bold;">{</span>
		<span style="color: #000000;">UUE_data_array</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #000000;">UUEncoded_array_index</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #4e9a06;">'M'</span><span style="color: #000000; font-weight: bold;">;</span>
	<span style="color: #000000; font-weight: bold;">}</span>

	<span style="color: #000000;">UUEncoded_array_index</span><span style="color: #ce5c00; font-weight: bold;">++</span><span style="color: #000000; font-weight: bold;">;</span>

	<span style="color: #8f5902; font-style: italic;">// Encode loop.</span>
	<span style="color: #204a87; font-weight: bold;">for</span> <span style="color: #000000; font-weight: bold;">(</span><span style="color: #204a87; font-weight: bold;">int</span> <span style="color: #000000;">hex_data_array_index</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #0000cf; font-weight: bold;">0</span><span style="color: #000000; font-weight: bold;">;</span> <span style="color: #000000;">hex_data_array_index</span> <span style="color: #ce5c00; font-weight: bold;">&lt;</span> <span style="color: #000000;">hex_data_array_size</span><span style="color: #000000; font-weight: bold;">;</span> <span style="color: #000000;">hex_data_array_index</span><span style="color: #000000; font-weight: bold;">)</span>
	<span style="color: #000000; font-weight: bold;">{</span>
		<span style="color: #8f5902; font-style: italic;">// 2. Load 3 bytes into an array.</span>
		<span style="color: #204a87; font-weight: bold;">for</span> <span style="color: #000000; font-weight: bold;">(</span><span style="color: #204a87; font-weight: bold;">int</span> <span style="color: #000000;">i</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #0000cf; font-weight: bold;">0</span><span style="color: #000000; font-weight: bold;">;</span> <span style="color: #000000;">i</span> <span style="color: #ce5c00; font-weight: bold;">&lt;</span> <span style="color: #0000cf; font-weight: bold;">3</span><span style="color: #000000; font-weight: bold;">;</span> <span style="color: #ce5c00; font-weight: bold;">++</span><span style="color: #000000;">i</span><span style="color: #000000; font-weight: bold;">)</span>
		<span style="color: #000000; font-weight: bold;">{</span>
			<span style="color: #8f5902; font-style: italic;">// Load bytes into array</span>
			<span style="color: #204a87; font-weight: bold;">if</span> <span style="color: #000000; font-weight: bold;">(</span><span style="color: #000000;">hex_data_array_index</span> <span style="color: #ce5c00; font-weight: bold;">&lt;</span> <span style="color: #000000;">hex_data_array_size</span><span style="color: #000000; font-weight: bold;">)</span>
			<span style="color: #000000; font-weight: bold;">{</span>
				<span style="color: #000000;">byte_to_encode</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #000000;">i</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #000000;">hex_data_array</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #000000;">hex_data_array_index</span><span style="color: #000000; font-weight: bold;">];</span>
				<span style="color: #000000;">hex_data_array_index</span><span style="color: #ce5c00; font-weight: bold;">++</span><span style="color: #000000; font-weight: bold;">;</span>
			<span style="color: #000000; font-weight: bold;">}</span>
			<span style="color: #204a87; font-weight: bold;">else</span>
			<span style="color: #000000; font-weight: bold;">{</span>
				<span style="color: #8f5902; font-style: italic;">// 4. Add padding.</span>
				<span style="color: #000000;">byte_to_encode</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #000000;">i</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #0000cf; font-weight: bold;">0</span><span style="color: #000000; font-weight: bold;">;</span>
				<span style="color: #000000;">padded_index</span><span style="color: #ce5c00; font-weight: bold;">++</span><span style="color: #000000; font-weight: bold;">;</span>
			<span style="color: #000000; font-weight: bold;">}</span>
			<span style="color: #000000;">uue_length_char_index</span><span style="color: #ce5c00; font-weight: bold;">--</span><span style="color: #000000; font-weight: bold;">;</span>
		<span style="color: #000000; font-weight: bold;">}</span>

		<span style="color: #8f5902; font-style: italic;">// 3. Encode array.</span>
		<span style="color: #000000;">uue_char</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #0000cf; font-weight: bold;">0</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #000000; font-weight: bold;">((</span><span style="color: #000000;">byte_to_encode</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #0000cf; font-weight: bold;">0</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">&gt;&gt;</span> <span style="color: #0000cf; font-weight: bold;">2</span><span style="color: #000000; font-weight: bold;">)</span> <span style="color: #ce5c00; font-weight: bold;">&amp;</span> <span style="color: #0000cf; font-weight: bold;">0x3f</span><span style="color: #000000; font-weight: bold;">);</span>
		<span style="color: #000000;">uue_char</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #0000cf; font-weight: bold;">1</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #000000; font-weight: bold;">(((</span><span style="color: #000000;">byte_to_encode</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #0000cf; font-weight: bold;">0</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">&lt;&lt;</span> <span style="color: #0000cf; font-weight: bold;">4</span><span style="color: #000000; font-weight: bold;">)</span> <span style="color: #ce5c00; font-weight: bold;">|</span> <span style="color: #000000; font-weight: bold;">((</span><span style="color: #000000;">byte_to_encode</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #0000cf; font-weight: bold;">1</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">&gt;&gt;</span> <span style="color: #0000cf; font-weight: bold;">4</span><span style="color: #000000; font-weight: bold;">)</span> <span style="color: #ce5c00; font-weight: bold;">&amp;</span> <span style="color: #0000cf; font-weight: bold;">0x0f</span><span style="color: #000000; font-weight: bold;">))</span> <span style="color: #ce5c00; font-weight: bold;">&amp;</span> <span style="color: #0000cf; font-weight: bold;">0x3f</span><span style="color: #000000; font-weight: bold;">);</span>
		<span style="color: #000000;">uue_char</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #0000cf; font-weight: bold;">2</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #000000; font-weight: bold;">(((</span><span style="color: #000000;">byte_to_encode</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #0000cf; font-weight: bold;">1</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">&lt;&lt;</span> <span style="color: #0000cf; font-weight: bold;">2</span><span style="color: #000000; font-weight: bold;">)</span> <span style="color: #ce5c00; font-weight: bold;">|</span> <span style="color: #000000; font-weight: bold;">((</span><span style="color: #000000;">byte_to_encode</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #0000cf; font-weight: bold;">2</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">&gt;&gt;</span> <span style="color: #0000cf; font-weight: bold;">6</span><span style="color: #000000; font-weight: bold;">)</span> <span style="color: #ce5c00; font-weight: bold;">&amp;</span> <span style="color: #0000cf; font-weight: bold;">0x03</span><span style="color: #000000; font-weight: bold;">))</span> <span style="color: #ce5c00; font-weight: bold;">&amp;</span> <span style="color: #0000cf; font-weight: bold;">0x3f</span><span style="color: #000000; font-weight: bold;">);</span>
		<span style="color: #000000;">uue_char</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #0000cf; font-weight: bold;">3</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #000000; font-weight: bold;">(</span><span style="color: #000000;">byte_to_encode</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #0000cf; font-weight: bold;">2</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">&amp;</span> <span style="color: #0000cf; font-weight: bold;">0x3f</span><span style="color: #000000; font-weight: bold;">);</span>

		<span style="color: #204a87; font-weight: bold;">for</span> <span style="color: #000000; font-weight: bold;">(</span><span style="color: #204a87; font-weight: bold;">int</span> <span style="color: #000000;">i</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #0000cf; font-weight: bold;">0</span><span style="color: #000000; font-weight: bold;">;</span> <span style="color: #000000;">i</span> <span style="color: #ce5c00; font-weight: bold;">&lt;</span> <span style="color: #0000cf; font-weight: bold;">4</span><span style="color: #000000; font-weight: bold;">;</span> <span style="color: #000000;">i</span><span style="color: #ce5c00; font-weight: bold;">++</span><span style="color: #000000; font-weight: bold;">)</span>
		<span style="color: #000000; font-weight: bold;">{</span>
			<span style="color: #8f5902; font-style: italic;">// 5. Replace ' ' with '''</span>
			<span style="color: #204a87; font-weight: bold;">if</span> <span style="color: #000000; font-weight: bold;">(</span><span style="color: #000000;">uue_char</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #000000;">i</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">==</span> <span style="color: #0000cf; font-weight: bold;">0x00</span><span style="color: #000000; font-weight: bold;">)</span>
			<span style="color: #000000; font-weight: bold;">{</span>
				<span style="color: #000000;">UUE_data_array</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #000000;">UUEncoded_array_index</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #0000cf; font-weight: bold;">0x60</span><span style="color: #000000; font-weight: bold;">;</span>
			<span style="color: #000000; font-weight: bold;">}</span>
			<span style="color: #204a87; font-weight: bold;">else</span>
			<span style="color: #000000; font-weight: bold;">{</span>
				<span style="color: #000000;">UUE_data_array</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #000000;">UUEncoded_array_index</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #000000; font-weight: bold;">(</span><span style="color: #000000;">uue_char</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #000000;">i</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">+</span> <span style="color: #4e9a06;">' '</span><span style="color: #000000; font-weight: bold;">);</span>
			<span style="color: #000000; font-weight: bold;">}</span>

			<span style="color: #000000;">UUEncoded_array_index</span><span style="color: #ce5c00; font-weight: bold;">++</span><span style="color: #000000; font-weight: bold;">;</span>
		<span style="color: #000000; font-weight: bold;">}</span>

		<span style="color: #8f5902; font-style: italic;">// Data bytes left.</span>
		<span style="color: #000000;">bytes_left</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #000000; font-weight: bold;">(</span><span style="color: #000000;">hex_data_array_size</span> <span style="color: #ce5c00; font-weight: bold;">-</span> <span style="color: #000000;">hex_data_array_index</span><span style="color: #000000; font-weight: bold;">);</span>

		<span style="color: #204a87; font-weight: bold;">if</span> <span style="color: #000000; font-weight: bold;">(</span><span style="color: #000000;">uue_length_char_index</span> <span style="color: #ce5c00; font-weight: bold;">==</span> <span style="color: #0000cf; font-weight: bold;">0</span> <span style="color: #ce5c00; font-weight: bold;">&amp;&amp;</span> <span style="color: #000000;">bytes_left</span> <span style="color: #ce5c00; font-weight: bold;">&gt;</span> <span style="color: #0000cf; font-weight: bold;">0</span><span style="color: #000000; font-weight: bold;">)</span>
		<span style="color: #000000; font-weight: bold;">{</span>
			<span style="color: #8f5902; font-style: italic;">// NOTE: Could be simplified to include first char</span>
			<span style="color: #8f5902; font-style: italic;">// and additional characters, using a positive index.</span>
			<span style="color: #8f5902; font-style: italic;">// 1. Add char for characters per line.</span>
			<span style="color: #000000;">UUE_data_array</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #000000;">UUEncoded_array_index</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #4e9a06;">'\n'</span><span style="color: #000000; font-weight: bold;">;</span>
			<span style="color: #000000;">UUEncoded_array_index</span><span style="color: #ce5c00; font-weight: bold;">++</span><span style="color: #000000; font-weight: bold;">;</span>

			<span style="color: #204a87; font-weight: bold;">if</span><span style="color: #000000; font-weight: bold;">(</span><span style="color: #000000;">bytes_left</span> <span style="color: #ce5c00; font-weight: bold;">&lt;</span> <span style="color: #0000cf; font-weight: bold;">45</span><span style="color: #000000; font-weight: bold;">)</span>
			<span style="color: #000000; font-weight: bold;">{</span>
				<span style="color: #8f5902; font-style: italic;">// Find how many characters are left.</span>
				<span style="color: #000000;">UUE_data_array</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #000000;">UUEncoded_array_index</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #000000; font-weight: bold;">((</span><span style="color: #000000;">bytes_left</span> <span style="color: #ce5c00; font-weight: bold;">&amp;</span> <span style="color: #0000cf; font-weight: bold;">0x3f</span><span style="color: #000000; font-weight: bold;">)</span> <span style="color: #ce5c00; font-weight: bold;">+</span> <span style="color: #4e9a06;">' '</span><span style="color: #000000; font-weight: bold;">);</span>
			<span style="color: #000000; font-weight: bold;">}</span>
			<span style="color: #204a87; font-weight: bold;">else</span>
			<span style="color: #000000; font-weight: bold;">{</span>
				<span style="color: #000000;">UUE_data_array</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #000000;">UUEncoded_array_index</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #4e9a06;">'M'</span><span style="color: #000000; font-weight: bold;">;</span>
			<span style="color: #000000; font-weight: bold;">}</span>	
			<span style="color: #000000;">UUEncoded_array_index</span><span style="color: #ce5c00; font-weight: bold;">++</span><span style="color: #000000; font-weight: bold;">;</span>
			<span style="color: #000000;">uue_length_char_index</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #0000cf; font-weight: bold;">45</span><span style="color: #000000; font-weight: bold;">;</span>
		<span style="color: #000000; font-weight: bold;">}</span>

	<span style="color: #000000; font-weight: bold;">}</span> <span style="color: #8f5902; font-style: italic;">// End UUE loop	</span>
	<span style="color: #000000;">UUE_data_array</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #000000;">UUEncoded_array_index</span><span style="color: #000000; font-weight: bold;">]</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #4e9a06;">'\n'</span><span style="color: #000000; font-weight: bold;">;</span>

	<span style="color: #8f5902; font-style: italic;">// 6. Return UUE data array (implicit) and size.</span>
	<span style="color: #204a87; font-weight: bold;">return</span> <span style="color: #000000;">UUEncoded_array_index</span><span style="color: #000000; font-weight: bold;">;</span>
<span style="color: #000000; font-weight: bold;">}</span>

<span style="color: #204a87; font-weight: bold;">int</span> <span style="color: #000000;">check_sum</span><span style="color: #000000; font-weight: bold;">(</span><span style="color: #204a87; font-weight: bold;">uint8_t</span> <span style="color: #ce5c00; font-weight: bold;">*</span> <span style="color: #000000;">hex_data_array</span><span style="color: #000000; font-weight: bold;">,</span> <span style="color: #204a87; font-weight: bold;">int</span> <span style="color: #000000;">hex_data_array_size</span><span style="color: #000000; font-weight: bold;">)</span>
<span style="color: #000000; font-weight: bold;">{</span>
	<span style="color: #204a87; font-weight: bold;">int</span> <span style="color: #000000;">check_sum</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #0000cf; font-weight: bold;">0</span><span style="color: #000000; font-weight: bold;">;</span>
	<span style="color: #204a87; font-weight: bold;">int</span> <span style="color: #000000;">char_index</span> <span style="color: #ce5c00; font-weight: bold;">=</span> <span style="color: #0000cf; font-weight: bold;">0</span><span style="color: #000000; font-weight: bold;">;</span>

	<span style="color: #204a87; font-weight: bold;">while</span><span style="color: #000000; font-weight: bold;">(</span><span style="color: #000000;">char_index</span> <span style="color: #ce5c00; font-weight: bold;">&lt;</span> <span style="color: #000000;">hex_data_array_size</span><span style="color: #000000; font-weight: bold;">)</span>
	<span style="color: #000000; font-weight: bold;">{</span>
		<span style="color: #000000;">check_sum</span> <span style="color: #ce5c00; font-weight: bold;">+=</span> <span style="color: #000000;">hex_data_array</span><span style="color: #000000; font-weight: bold;">[</span><span style="color: #000000;">char_index</span><span style="color: #000000; font-weight: bold;">];</span>
		<span style="color: #000000;">char_index</span><span style="color: #ce5c00; font-weight: bold;">++</span><span style="color: #000000; font-weight: bold;">;</span>
	<span style="color: #000000; font-weight: bold;">}</span>
	<span style="color: #204a87; font-weight: bold;">return</span> <span style="color: #000000;">check_sum</span><span style="color: #000000; font-weight: bold;">;</span>
<span style="color: #000000; font-weight: bold;">}</span>
</pre></td></tr></tbody></table></div> 

&nbsp;

*   3-8: Here, I outline in pseudo-code what I wanted to get done in this function.
*   17-25: I deal with the start character of the first line. &nbsp;I do this by checking if hex data we were handed is more than the UUE line limit, 45 bytes. &nbsp;If it is, I place an M as the start character (45 + 32 = 77 = ASCII **M**). &nbsp;If the data we've been handed is less than 45 bytes, let's calculate the start character. &nbsp;We take 65 bits of the 8-bit number representing how many bytes are here, then add 32, this will give us our start character.
*   30-96: This is the main loop where the work is done. &nbsp;We loop through all the hexadecimal data provided us, encoding as we go.
*   33-48: The loop here deals with 3 bytes of data at a time. &nbsp;It also checks to see if we have less than 3 bytes left, if so, it pads the remaining space with 0 (null).
*   47: This index is used in combination with the if statement found one lines 82-90. &nbsp;It is in essence repeating the beginning if statement where we determined what the start character for this line will be.&nbsp;
*   51-54: This is where the magic happens. &nbsp;Here, we are turning the 3 bytes of 8 bits, into 4 bytes of 6 bits. &nbsp;We store the resulting bits in an 8-bit variable. &nbsp;But remember, we can put 6 bit data in a 8 bit jar, as long as we remember to be careful how we place the bits.
*   56-69: The resulting 6-bit characters are checked to see if they are a space character (0x20), if they are, we turn them into a grave ' ' &nbsp;' character (0x60). &nbsp;If they are not a space, we add 32 to the decimal value (' ' = 32 in decimal), this completes the encoding process.
*   72: We calculate how many data bytes are left, in preparation for calculating the next line's start character.
*   74-96: This loop serves two purposes. &nbsp;One, to place a new-line character ('\n') at the end of our last encoded line. &nbsp;Two, to calculate and load the next line's start character.
*   96: When we've reached the end of our data, we place a new-line character to mark the end.
*   112: We return the number of ASCII characters used to represent our encoded data.

And there you go. &nbsp;**UUE!**

Here are some additional resources I found helpful,

1.  [Wikipedia's article on UUEncoding](http://en.wikipedia.org/wiki/Uuencoding)
2.  [NXP's Application Note on UUEncoded for their uCs](/files/userpics/u19048/UUE__app_note.pdf)
3.  [Bdk6](http://letsmakerobots.com/users/bdk6)
