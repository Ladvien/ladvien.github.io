---
layout: post
title: You're up and running!
---

Next you can update your site name, avatar and other options using the _config.yml file in the root of your repository (shown below).

![_config.yml]({{ site.baseurl }}/images/config.png)

The easiest way to make your first post is to edit this one. Go into /_posts/ and update the Hello World markdown file. For more instructions head over to the [Jekyll Now repository](https://github.com/barryclark/jekyll-now) on GitHub.


**I want to take a moment to thank [Bdk6](http://letsmakerobots.com/users/bdk6).  The man is a walking Stack Overflow, with more patience for stupid.  I doubt I'd understand any of this without his guidance.**

I thought I'd take some time away from coding my [LPC1114 Uploader](http://letsmakerobots.com/lpc1114-usb-serial-solution-rerolling-boot-uploader) and verbally process a few things I've learned.  As always, feel free to critique any of it; it'll only serve to make my code more robust in the end.  

This post will be a series of post leading up to the large post I'll make on writing the uploader.  All posts will rely on the GCC compiler.

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

**![](/files/userpics/u19048/300x260xGCCLogo.png.pagespeed.ic.YZjB3d_p5p.png)Setting Up the GCC Compiler**

I setup a C environment as basic I could.  There may be easier ways to go about this, but I wanted to use GCC to compile.  

To setup the environment:

1. I downloaded and setup [MinGW32](http://www.mingw.org/wiki/HOWTO_Install_the_MinGW_GCC_Compiler_Suite).

2. I added these **includes** to make the code go.

 

<table>
<col width="50%" />
<col width="50%" />
<tbody>
<tr class="odd">
<td align="left"><pre style="margin:0;line-height:125%;"><code> 1
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
13</code></pre></td>
<td align="left"><pre style="margin:0;line-height:125%;"><code>#include &lt;stdio.h&gt;
#include &lt;stdarg.h&gt;
#include &lt;stdlib.h&gt; 
#include &lt;windows.h&gt;
#include &lt;windef.h&gt;
#include &lt;winnt.h&gt;
#include &lt;winbase.h&gt;
#include &lt;string.h&gt;
#include &lt;math.h&gt;
#include &lt;stdbool.h&gt;
#include &lt;stdint.h&gt;

#include &lt;sys/time.h&gt;</code></pre></td>
</tr>
</tbody>
</table>

 

I used this line to build it:

**\$ gcc -o main main.c**

As for editing, I've really grown to love [Sublime Text 2](http://www.sublimetext.com/2).

If you have issues**, make sure directory containing your files is in your PATH environment variable **(I go over how to add the directory to your environment variables in this [post](http://letsmakerobots.com/content/lpc1114-setup-bare-metal-arm)).

 

**How to Convert Hex Data to UUE**

**"What is 'UUEncoding'?"**

** **Unix-to-Unix encoding (UUE) is the process where **binary data is converted to a form which can be represented using ASCII character values from space (32) to underscore (95)**.  These 64 characters allow us to express any binary stream of data.

I will not spend a lot of time explaining **UUEncoding** since the [Wikipedia article is excellent](http://en.wikipedia.org/wiki/Uuencoding).

**"Why UUEncode?"**

Have you written a program to look for a particular value?  Like this,

<table>
<col width="50%" />
<col width="50%" />
<tbody>
<tr class="odd">
<td align="left"><pre style="margin:0;line-height:125%;"><code> 1
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
13</code></pre></td>
<td align="left"><pre style="margin:0;line-height:125%;"><code>int i;
char tCollection[32];
char c;

if( c == &#39;T&#39;)
{
    Serial.print(&quot;I found a T!&quot;);
    tCollection[i] = c;
else if (c == &#39;\r&#39;)
{
    exit();
}
        </code></pre></td>
</tr>
</tbody>
</table>

 

 

You begin running your program and everything seems fine.  It is inspecting data looking for the letter T (0x54), but then, all of a sudden your program exits without reason.  You're upset, because the sensor sending you the data didn't send the exit code, which is a carriage return ('\\r', or 0x13), but still, your program ended like it did.

Really, we know the reason, your program came across a random 0x13, which it interpreted as an exit command.  Maybe a different special character?

![](http://www.bibase.com/images/ascii.gif)

But you realize, if you are dealing with a 8-bit data stream any ASCII character *might* be found in the incoming stream.  So, how can the communicating devices know when it is getting data, versus, when it is receiving a command?

 

![](/files/userpics/u19048/200x210xSuper_Style_ASCII_by_buddhascii.png.pagespeed.ic.T8JsLoZeGa.png)

 

This is where UUE comes in.  As I stated earlier, UUE is a way to represent the same 8-bit data using only hex values 0x32 through 0x95 (the two middle columns in the ASCII chart above).  This means characters 0x00 through 0x1F and 0x60 through 0x7F are free to be used for command functions.

Returning to the above example, this means we could now us the CR value to signal the end-of-transmission, since CR is 0x13.

Ok, I hope I've sold you on UUE's utility, let me attempt to explain the basics of how hexadecimal data is converted into a form which may be represented with only 64 values.

 

 

UUE conversion works with three bytes of data at a time and follows this algorithm.

1.  The individual bits of 3 HEX bytes are put into a series.
2.  The 24-bit series is then divided into four bytes of 6-bits.
3.  Then, 32 is added to the decimal value representing each of the 6-bit bytes.
4.  The resulting four values are UUEncoded bytes.

Confused as hell? I was too.  Pictures are good.  Let's follow the Wiki example and use: **Cat**

The first step is to take the binary values for each ASCII character.

-   'C' = 01000011
-   'a' = 01100001
-   't' =  01110100

This means the resulting 24-bit binary series is,

24-bit: 010000110110000101110100

This is then divided into four 6-bit bytes,

| 6-bit Byte | 1      | 2      | 3      | 4      |
|------------|--------|--------|--------|--------|
| Binary:    | 010000 | 110110 | 000101 | 110100 |



The new decimal values are,

| 6-bit Byte | 1             2             3              4 |
|------------|----------------------------------------------|
| Decimal    | 16           54            5             52  |

At this point the 6-bit (senary) byte gave me a little trouble.  I didn't understand how 6-bits were treated by the 8-bit variable I was putting them in.  For example, how could I get an **int variable** to take only 6 bits, not 8?  The trick is understanding the 8-bit variable is only the width of the allotted space provided in a register, it has no influence on what you put in it.  It finally dawned on me, I didn't need to worry about the empty bits in a register.

Examples are good:

010000     = 16 in Decimal

00010000 = 16 in Decimal

010000 = 00010000

Anyway, this is how I finally made sense of it.  As long as when I did my bit manipulations I kept unused bits of the register towards the "left" side, the my 6-bit values could be put into a 8-bit register and there value would remain the same.

Alright, back to our example.

Our next step is to add 32 to each of the decimal value of our new four bytes.


|     a      |    a       |       a    |     a      |     a      |            
| ---------- | ---------- | ---------- | ---------- | ---------- |
|6-bit Byte:|1|2|3|4|
|Decimal:|16|54|5|52|
|Add 32|+32|+32|+32|+32|
|New Dec.|48|86|37|84|
|UUE char:|0|V|%|T|

 

![](/files/userpics/u19048/250x156xschrodingers_cat.jpg.pagespeed.ic.HsKqMX45Vf.webp)And...that's it.  Your data is now UUEncoded.  When it is sent through whatever transmission medium it wont be bothered with special character protocals.  For our Cat, we have transformed it into:**0V%T**

Let's hope for the Cat's sake, there is decoding algorithm.

**Those sharper than myself may have already noticed a couple of problems.**  For instance, what if our data doesn't come in increments of threes?  For example, how do we send **Cats?**

The answer? We make nothing up.  In the instance of Cats, we simply pad the end of the character series with two nulls on the end.  For example,

-   'C' = 01000011
-   'a' = 01100001
-   't' =  01110100
-   's' = 01110011
-   NUL = 00000000
-   NUL = 00000000

48-bit: 010000110110000101110100011100110000000000000000

-   6-bit Byte:     1               2             3              4           5               6              7              8
-   Binary:    010000    110110    000101    110100    011100    110000     000000    000000

The new decimal values are,

-   6-bit Byte:        1             2             3            4           5            6              7              8
-   Decimal:         16           54            5           52         28          48             0              0 

-   6-bit Byte:        1             2             3            4           5            6              7              8
-   Decimal:         16           54            5           52         28          48             0              0 
-   Add 32          +32        +32          +32        +32      +32         +32          +32         +32
-   New Dec.        48          86            37          84        60           80            32            32
-   **UUE char:       0            V             %             T        \<             P            SPC        SPC**

We have turned "Cats" into "**0V%T\<P  **"  Well, almost, we aren't quite done here.

Uh-oh.  Another problem.  The whole point of UUE was to stay away from special characters like the space character (0x32).  But now we have two of them in our transmission.  Well, the UUE protocol addresses this.  It states,

-   If the result of the 6-bit encoding process is the space character, we convert this to the [grave characte](http://en.wikipedia.org/wiki/Grave_accent)r, **' \` '.  **(The grave accent character is 0x60 in hexadecimal, by the way).

Therefore, our "Cats" actually becomes.

-   **Almost UUE char:       0            V             %             T        \<             P            SPC        SPC**
-   **UUE char:                    0            V             %             T        \<             P               \`               \`**

 

Finally! We have encoded "Cats"

We've turned:

![](/files/userpics/u19048/250x140xfivekittems1.jpg.pagespeed.ic.kRIAR7z7uD.webp) into -------------\> **  0V%T\<P \`\`      Now, *that's* science folks!**

 

**Hmm, what else are you going to need to know? **Oh, right, how the UUE data is stored.****

UUE stores and sends data in lines.  A line of UUE data consist of a start character, which represents how many bytes have been encoded in the line (**not** how many UUE characters are in the line) by using a 6-bit number stored as an ASCII char.  The line of UUE data ends with a new line character (i.e., '\\n').  Lastly, a UUE line is limited to 45 bytes of data.  This means, the maximum amount of data characters in on line of UUE should be no more than 60.  Or, 62, if you count the start character and the end character.

Again, examples are good.  For our Cats, the line would look something like this,

-   \$ **0V%T\<P \`\` \\n**

![](/files/userpics/u19048/584x261xUUE_dump.png.pagespeed.ic.45j-POMFUZ.png)

Let me take a moment to describe how we get the start character.  Basically, we count how many bytes we are sending, in our case 4, and we add 32.  This gives us the decimal representation of the ASCII character we will use as our start character.  Therefore,

-   4 + 32 = 36 as ASCII = \$

Confusing?  It'll probably make more sense when we look at the code.

 

Speaking of which, I think I've covered the basics, time to jump into implementation.

 

**Implementing UUEncoding in C**

Well, here it is.  My shoddy implementation of a UUEncoder in C.  

The function takes several variables.

1.  **UUE\_data\_array** is a pointer to an uint8\_t array where the encoded characters will be stored.
2.  **hex\_data\_array** is a pointer to an uint8\_t array containing the hexadecimal values to be encoded (to learn where I get my hexadecimal data, checkout another one of this inglorious post: [Intel HEX File to Array](http://letsmakerobots.com/content/intel-hexfile-array)).
3.  **hex\_data\_array** size is an integer representing how many bytes of data might be found in the **hex\_data\_array**.
4.  After the function is complete, it returns how many ASCII UUE characters were created.  This is meant for parsing the UUE array at a later time.

 

<table>
<col width="50%" />
<col width="50%" />
<tbody>
<tr class="odd">
<td align="left"><pre style="margin:0;line-height:125%;"><code>  1
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
113</code></pre></td>
<td align="left"><pre style="margin:0;line-height:125%;"><code>int UUEncode(uint8_t * UUE_data_array, uint8_t * hex_data_array, int hex_data_array_size)
{
    // 1. Add char for characters per line.
    // 2. Load 3 bytes into an array.
    // 3. Encode array.
    // 4. Add padding.
    // 5. Replace &#39; &#39; with &#39;&#39;&#39;
    // 6. Return UUE data array (implicit) and size.
    uint8_t byte_to_encode[3];
    uint8_t uue_char[4];

    int UUEncoded_array_index = 0;
    int uue_length_char_index = 45;
    int padded_index = 0;
    int bytes_left = 0;

    // 1. Add char for characters per line.
    if(hex_data_array_size &lt; 45)
    {
         UUE_data_array[UUEncoded_array_index] = ((hex_data_array_size &amp; 0x3f) + &#39; &#39;);
    }
    else
    {
        UUE_data_array[UUEncoded_array_index] = &#39;M&#39;;
    }

    UUEncoded_array_index++;

    // Encode loop.
    for (int hex_data_array_index = 0; hex_data_array_index &lt; hex_data_array_size; hex_data_array_index)
    {
        // 2. Load 3 bytes into an array.
        for (int i = 0; i &lt; 3; ++i)
        {
            // Load bytes into array
            if (hex_data_array_index &lt; hex_data_array_size)
            {
                byte_to_encode[i] = hex_data_array[hex_data_array_index];
                hex_data_array_index++;
            }
            else
            {
                // 4. Add padding.
                byte_to_encode[i] = 0;
                padded_index++;
            }
            uue_length_char_index--;
        }

        // 3. Encode array.
        uue_char[0] = ((byte_to_encode[0] &gt;&gt; 2) &amp; 0x3f);
        uue_char[1] = (((byte_to_encode[0] &lt;&lt; 4) | ((byte_to_encode[1] &gt;&gt; 4) &amp; 0x0f)) &amp; 0x3f);
        uue_char[2] = (((byte_to_encode[1] &lt;&lt; 2) | ((byte_to_encode[2] &gt;&gt; 6) &amp; 0x03)) &amp; 0x3f);
        uue_char[3] = (byte_to_encode[2] &amp; 0x3f);

        for (int i = 0; i &lt; 4; i++)
        {
            // 5. Replace &#39; &#39; with &#39;&#39;&#39;
            if (uue_char[i] == 0x00)
            {
                UUE_data_array[UUEncoded_array_index] = 0x60;
            }
            else
            {
                UUE_data_array[UUEncoded_array_index] = (uue_char[i] + &#39; &#39;);
            }

            UUEncoded_array_index++;
        }

        // Data bytes left.
        bytes_left = (hex_data_array_size - hex_data_array_index);

        if (uue_length_char_index == 0 &amp;&amp; bytes_left &gt; 0)
        {
            // NOTE: Could be simplified to include first char
            // and additional characters, using a positive index.
            // 1. Add char for characters per line.
            UUE_data_array[UUEncoded_array_index] = &#39;\n&#39;;
            UUEncoded_array_index++;

            if(bytes_left &lt; 45)
            {
                // Find how many characters are left.
                UUE_data_array[UUEncoded_array_index] = ((bytes_left &amp; 0x3f) + &#39; &#39;);
            }
            else
            {
                UUE_data_array[UUEncoded_array_index] = &#39;M&#39;;
            }  
            UUEncoded_array_index++;
            uue_length_char_index = 45;
        }

    } // End UUE loop   
    UUE_data_array[UUEncoded_array_index] = &#39;\n&#39;;

    // 6. Return UUE data array (implicit) and size.
    return UUEncoded_array_index;
}

int check_sum(uint8_t * hex_data_array, int hex_data_array_size)
{
    int check_sum = 0;
    int char_index = 0;

    while(char_index &lt; hex_data_array_size)
    {
        check_sum += hex_data_array[char_index];
        char_index++;
    }
    return check_sum;
}</code></pre></td>
</tr>
</tbody>
</table>

 

-   3-8: Here, I outline in pseudo-code what I wanted to get done in this function.
-   17-25: I deal with the start character of the first line.  I do this by checking if hex data we were handed is more than the UUE line limit, 45 bytes.  If it is, I place an M as the start character (45 + 32 = 77 = ASCII **M**).  If the data we've been handed is less than 45 bytes, let's calculate the start character.  We take 65 bits of the 8-bit number representing how many bytes are here, then add 32, this will give us our start character.
-   30-96: This is the main loop where the work is done.  We loop through all the hexadecimal data provided us, encoding as we go.
-   33-48: The loop here deals with 3 bytes of data at a time.  It also checks to see if we have less than 3 bytes left, if so, it pads the remaining space with 0 (null).
-   47: This index is used in combination with the if statement found one lines 82-90.  It is in essence repeating the beginning if statement where we determined what the start character for this line will be. 
-   51-54: This is where the magic happens.  Here, we are turning the 3 bytes of 8 bits, into 4 bytes of 6 bits.  We store the resulting bits in an 8-bit variable.  But remember, we can put 6 bit data in a 8 bit jar, as long as we remember to be careful how we place the bits.
-   56-69: The resulting 6-bit characters are checked to see if they are a space character (0x20), if they are, we turn them into a grave ' '  ' character (0x60).  If they are not a space, we add 32 to the decimal value (' ' = 32 in decimal), this completes the encoding process.
-   72: We calculate how many data bytes are left, in preparation for calculating the next line's start character.
-   74-96: This loop serves two purposes.  One, to place a new-line character ('\\n') at the end of our last encoded line.  Two, to calculate and load the next line's start character.
-   96: When we've reached the end of our data, we place a new-line character to mark the end.
-   112: We return the number of ASCII characters used to represent our encoded data.

And there you go.  **UUE!**

Here are some additional resources I found helpful,

1.  [Wikipedia's article on UUEncoding](http://en.wikipedia.org/wiki/Uuencoding)
2.  [NXP's Application Note on UUEncoded for their uCs](/files/userpics/u19048/UUE__app_note.pdf)
3.  [Bdk6](http://letsmakerobots.com/users/bdk6)

Comment viewing options
-----------------------

Flat list - collapsedFlat list - expandedThreaded list - collapsedThreaded list - expanded

Date - newest firstDate - oldest first

10 comments per page30 comments per page50 comments per page70 comments per page90 comments per page150 comments per page200 comments per page250 comments per page300 comments per page

Select your preferred way to display the comments and click "Save settings" to activate your changes.

By [bdk6](/users/bdk6 "View user profile.") @ Tue, 2015-03-10 19:40

[![](/files/userpics/xpicture-17276.gif.pagespeed.ic.K5ECekHqVL.webp)](/users/bdk6)

### [Far Out!](/content/uuencode-0#comment-127169)

-   [reply](/comment/reply/43628/127169)
-   [Report Spam](/flag/flag/flag_comment_spam/127169?destination=node%2F43628&token=dc96ac36f4f9ee3822c267180d0fa4dc "Mark this post as spam") 
-   [Add comment to Chillout Zone](/chill/add/comment/127169/43628?destination=node%2F43628#comment-127169)
-   [More](http://letsmakerobots.com/node/43628#null)

These are great posts.  You've really explained things well and given good code examples to go along.  Really nice work. And thanks for the kind words, too.

By [cevinius](/user/20896 "View user profile.") @ Tue, 2015-03-10 18:07

[![](/files/userpics/xpicture-20896.png.pagespeed.ic.Smlz_8YNbr.webp)](/user/20896)

### [Awesome post!!](/content/uuencode-0#comment-127166)

-   [reply](/comment/reply/43628/127166)
-   [Report Spam](/flag/flag/flag_comment_spam/127166?destination=node%2F43628&token=a38d0132d51382c35fe113c13be94436 "Mark this post as spam") 
-   [Add comment to Chillout Zone](/chill/add/comment/127166/43628?destination=node%2F43628#comment-127166)
-   [More](http://letsmakerobots.com/node/43628#null)

Thanks, Ladvien! Fantastic information!! :D

By [DangerousThing](/users/dangerousthing "View user profile.") @ Tue, 2015-03-10 16:18

[![](/sites/default/themes/LMRv3/LMRv3/images/xlmr_placeholder_userpic.png.pagespeed.ic.-RyEmI71F6.png)](/users/dangerousthing)

### [Thank you. This is an](/content/uuencode-0#comment-127161)

-   [reply](/comment/reply/43628/127161)
-   [Report Spam](/flag/flag/flag_comment_spam/127161?destination=node%2F43628&token=45401e4e98421a77b702cd98f1ec840f "Mark this post as spam") 
-   [Add comment to Chillout Zone](/chill/add/comment/127161/43628?destination=node%2F43628#comment-127161)
-   [More](http://letsmakerobots.com/node/43628#null)

Thank you. This is an excellent explanation of UUEncoding and why it exists, not to mention some wonderful source code.

Post new comment
----------------

Your name: [Ladvien](/user/19048 "View user profile.")

Subject:

Comment: \*

Input format

Filtered HTML

-   Web page addresses and e-mail addresses turn into links automatically.
-   Allowed HTML tags: \<a\> \<b\> \<em\> \<h1\> \<h2\> \<h3\> \<h4\> \<h5\> \<h6\> \<strong\> \<cite\> \<code\> \<ul\> \<ol\> \<li\> \<dl\> \<dt\> \<dd\> \<img\> \<br\> \<p\>

Purified HTML

-   HTML tags will be transformed to conform to HTML standards.
-   Web page addresses and e-mail addresses turn into links automatically.
-   Every instance heading tags will be modified to include an id attribute for anchor linking.

Markdown

-   Every instance heading tags will be modified to include an id attribute for anchor linking.
-   You can use [Markdown syntax](/filter/tips) to format and style the text. Also see [Markdown Extra](http://michelf.com/projects/php-markdown/extra/) for tables, footnotes, and more.

[More information about formatting options](/filter/tips)

Search
------

Shout Box
---------

**[6677](/user/13374 "click to view profile")**: to be fair, most of my linux-wall-head-bang incidents recently have all been to do with steam at least rather than linux itself

**[6677](/user/13374 "click to view profile")**: maybe its linux

**[6677](/user/13374 "click to view profile")**: maybe the SB dislikes the superscripted 2 in a hyperlink

**[mogul](/user/15907 "click to view profile")**: data arrives through two different channels

**[mogul](/user/15907 "click to view profile")**: link looks fine on page reload but not from the live updates

**[ggallant](/user/20007 "click to view profile")**: Its my satelite. Changing to DSL on the 18th.

**[6677](/user/13374 "click to view profile")**: yet upon page reload, its fine again

**[6677](/user/13374 "click to view profile")**: literally here on my machine I was given a link to /wiki/i rather than a link to /wiki/i2c

**[mogul](/user/15907 "click to view profile")**: ahh, yet an other case of SB weirdness,

**[bdk6](/user/17276 "click to view profile")**: perhaps you don't know how to use a browser?

**[6677](/user/13374 "click to view profile")**: maybe yet another linux oddity to make me smack head against wall

**[6677](/user/13374 "click to view profile")**: force refresh page fixes

**[bdk6](/user/17276 "click to view profile")**: works fine on my machine

**[6677](/user/13374 "click to view profile")**: last few characters missing bdk, goes to wikipedia article on the letter "i"

**[bdk6](/user/17276 "click to view profile")**: works fine on my machine

**[ggallant](/user/20007 "click to view profile")**: I'm on internet with garbled SB messaging. Your post may arrive in a few minutes.

**[6677](/user/13374 "click to view profile")**: of sorts

**[6677](/user/13374 "click to view profile")**: broken link

**[bdk6](/user/17276 "click to view profile")**: see second paragraph

**[bdk6](/user/17276 "click to view profile")**: [http://en.wikipedia.org/wiki/I²C](http://en.wikipedia.org/wiki/I%C2%B2C)

[All Shouts](/shoutbox "All Shouts from the last 1 days")

Recent blog posts
-----------------

-   [Introduction](/blog/hydroguy/introduction)
-   [Find a sign by color tracking](/blog/rb-adventures/find-a-sign-color-tracking)
-   [Actobotics Runt Rover Sprout Unboxing](/blog/jscottb/actobotics-runt-rover-sprout-unboxing)
-   [New stuff arrived!](/blog/dangerousthing/new-stuff-arrived)
-   [sb weirdness](/blog/bdk6/sb-weirdness)
-   [UV LED board](/blog/viswesh713/uv-led-board-0)
-   [Ardux: low cost tracks robot based on cables chain](/blog/gianfx/ardux-low-cost-tracks-robot-based-cables-chain)
-   [A blast from the past! 1979](/blog/jscottb/a-blast-past-1979)
-   [Odroids](/blog/dangerousthing/odroids)
-   [Hexapod Parameters](/blog/duane-degn/hexapod-parameters)

[more](/blog "Read the latest blog entries.")

-   [shops](/shops)
-   [Cool Guides](/taxonomy/term/62)
-   [Other robot-related](/taxonomy/term/61)

Latest weblinks
---------------

-   [Test C/C++/Python/JS etc online](/content/test-ccpythonjs-etc-online)
-   [CraftBot 3D printer](/content/craftbot-3d-printer)
-   [Cheap Pi (DAMMIT!)](/content/cheap-pi-dammit)
-   [HACKADAY PRIZE 2015](/content/hackaday-prize-2015)
-   [E. W. Dijkstra Treasure Trove](/content/e-w-dijkstra-treasure-trove)
-   [The first ever photograph of light as both a particle and wave](/content/the-first-ever-photograph-light-both-a-particle-and-wave)
-   [Yale OpenHand Project](/content/yale-openhand-project)
-   [My pet issue](/content/my-pet-issue)
-   [TUG](/content/tug)
-   [PI board](/content/pi-board)

Who's online
------------

There are currently *9 users* and *70 guests* online.

### Online users

-   [Ladvien](/user/19048 "View user profile.")
-   [6677](/users/6677 "View user profile.")
-   [bdk6](/users/bdk6 "View user profile.")
-   [mogul](/user/15907 "View user profile.")
-   [bdk6](/users/bdk6 "View user profile.")
-   [ggallant](/users/ggallant "View user profile.")
-   [bdk6](/users/bdk6 "View user profile.")
-   [KIDBOT](/user/17108 "View user profile.")
-   [Tmortn](/users/tmortn "View user profile.")

Ladvien
-------

-   [LMR on Google+](https://plus.google.com/u/0/112079279304962380860/posts "LMR on Google+")
-   [LMR on Facebook](http://www.facebook.com/group.php?gid=52847854131)
-   [LMR on Flicker](http://www.flickr.com/groups/letsmakerobots "LMR on Flicker")
-   [LMR on Twitter](http://twitter.com/LetsMakeRobots "Follow LMR on Twitter")
-   [LMR Scrapbook](/content/lmr-scrapbook)
-   [User list](/user_list)
-   [Create content](/node/add)
-   [Unread posts](/tracker_unread/all)
-   [RSS feeds](/rss_feeds)
-   [Spam Control](/view/admin/spam)
-   [Log out](/logout)

ALL LMR ARE BELONG TO US!

Let's make robots!

