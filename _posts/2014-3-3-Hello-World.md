---
layout: post
title: You're up and running!
---

Next you can update your site name, avatar and other options using the _config.yml file in the root of your repository (shown below).

![_config.yml]({{ site.baseurl }}/images/config.png)

The easiest way to make your first post is to edit this one. Go into /_posts/ and update the Hello World markdown file. For more instructions head over to the [Jekyll Now repository](https://github.com/barryclark/jekyll-now) on GitHub.




[Source](http://letsmakerobots.com/content/uuencode-0 "Permalink to UUEncode | Let's Make Robots!")

# UUEncode | Let's Make Robots!

&nbsp;

**I want to take a moment to thank [Bdk6][1]. &nbsp;The man is a walking Stack Overflow, with more patience for stupid. &nbsp;I doubt I'd understand any of this without his guidance.**

I thought I'd take some time away from coding my&nbsp;[LPC1114 Uploader][2]&nbsp;and verbally process a few things I've learned. &nbsp;As always, feel free to critique any of it; it'll only serve to make my code more robust in the end. &nbsp;

This post will be a series of post leading up to the large post I'll make on writing the uploader. &nbsp;All posts will rely on the GCC compiler.

&nbsp;

**![][3]Setting Up the GCC Compiler**

I setup a C environment as basic I could. &nbsp;There may be easier ways to go about this, but&nbsp;I wanted to use GCC to compile. &nbsp;

To setup the environment:

1\. I downloaded and setup&nbsp;[MinGW32][4].

2\. I added these&nbsp;**includes**&nbsp;to make the code go.

&nbsp;

| ----- |
|

     1
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

 |

    #include <stdio.h>
    #include <stdarg.h>
    #include <stdlib.h>
    #include <windows.h>
    #include <windef.h>
    #include <winnt.h>
    #include <winbase.h>
    #include <string.h>
    #include <math.h>
    #include <stdbool.h>
    #include <stdint.h>

    #include <sys time.h="">

 |

&nbsp;

I used this line to build it:

**$ gcc -o main main.c**

As for editing, I've really grown to love&nbsp;[Sublime Text 2][5].

If you have issues**, make sure directory containing your files is in your PATH environment variable&nbsp;**(I go over how to add the directory to your environment variables in this&nbsp;[post][6]).

&nbsp;

**How to Convert Hex Data to UUE**

**"What is 'UUEncoding'?"**

**&nbsp;**Unix-to-Unix encoding (UUE) is the process where **binary data is converted to a form which can be represented using ASCII character values from space (32) to underscore (95)**. &nbsp;These 64 characters allow us to express any binary stream of data.

I will not spend a lot of time explaining&nbsp;**UUEncoding** since the [Wikipedia article is excellent][7].

**"Why UUEncode?"**

Have you written a program to look for a particular value? &nbsp;Like this,

| ----- |
|

     1
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

 |

    int i;
    char tCollection[32];
    char c;

    if( c == 'T')
    {
        Serial.print("I found a T!");
        tCollection[i] = c;
    else if (c == 'r')
    {
        exit();
    }

 |

&nbsp;

&nbsp;

You begin running your program and everything seems fine. &nbsp;It is inspecting data looking for the letter T (0x54), but then, all of a sudden your program exits without reason. &nbsp;You're upset, because the sensor sending you the data didn't send the exit code, which is a carriage return ('r', or 0x13), but still, your program ended like it did.

Really, we know the reason, your program came across a random 0x13, which it interpreted as an exit command. &nbsp;Maybe a different special character?

![][8]

But you realize, if you are dealing with a 8-bit data stream any ASCII character _might_&nbsp;be found in the incoming stream. &nbsp;So, how can the communicating devices know when it is getting data, versus, when it is receiving a command?

&nbsp;

![][9]

&nbsp;

This is where UUE comes in. &nbsp;As I stated earlier, UUE is a way to represent the same 8-bit data using only hex values 0x32 through 0x95 (the two middle columns in the ASCII chart above). &nbsp;This means characters 0x00 through 0x1F and 0x60 through 0x7F are free to be used for command functions.

Returning to the above example, this means we could now us the CR value to signal the end-of-transmission, since CR is 0x13.

Ok, I hope I've sold you on UUE's utility, let me attempt to explain the basics of how hexadecimal data is converted into a form which may be represented with only 64 values.

&nbsp;

&nbsp;

UUE conversion works with three bytes of data at a time and follows this algorithm.

1. The individual bits of 3 HEX bytes are put into a series.
2. The 24-bit series is then divided into four bytes of 6-bits.
3. Then, 32 is added to the decimal value representing each of the 6-bit bytes.
4. The resulting four values are UUEncoded bytes.

Confused as hell? I was too. &nbsp;Pictures are good. &nbsp;Let's follow the Wiki example and use: **Cat**

The first step is to take the binary values for each ASCII character.

* 'C' = 01000011
* 'a' = 01100001
* 't' = &nbsp;01110100

This means the resulting 24-bit binary series is,

24-bit:&nbsp;010000110110000101110100

This is then divided into four 6-bit bytes,

&nbsp;

* 6-bit Byte: &nbsp; &nbsp; 1 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 2 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 3 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;4
* Binary: &nbsp; &nbsp; &nbsp;010000 &nbsp; 110110 &nbsp; &nbsp;000101 &nbsp; 110100

The new decimal values are,

* 6-bit Byte: &nbsp; &nbsp; &nbsp; &nbsp;1 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 2 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 3 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;4
* Decimal: &nbsp; &nbsp; &nbsp; &nbsp; 16 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 54&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 5&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;52

At this point the 6-bit (senary) byte gave me a little trouble. &nbsp;I didn't understand how 6-bits were treated by the 8-bit variable I was putting them in. &nbsp;For example, how could I get an **int variable**&nbsp;to take only 6 bits, not 8? &nbsp;The trick is understanding the 8-bit variable is only the width of the allotted space provided in a register, it has no influence on what you put in it. &nbsp;It finally dawned on me, I didn't need to worry about the empty bits in a register.

Examples are good:

010000 &nbsp; &nbsp; = 16 in Decimal

00010000&nbsp;= 16 in Decimal

010000 =&nbsp;00010000

Anyway, this is how I finally made sense of it. &nbsp;As long as when I did my bit manipulations I kept unused bits of the register towards the "left" side, the my 6-bit values could be put into a 8-bit register and there value would remain the same.

Alright, back to our example.

Our next step is to add 32 to each of the decimal value of our new four bytes.

* 6-bit Byte: &nbsp; &nbsp; &nbsp; &nbsp;1 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 2 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 3 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;4
* Decimal: &nbsp; &nbsp; &nbsp; &nbsp; 16 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 54&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 5&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;52
* Add 32 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;+32 &nbsp; &nbsp; &nbsp; &nbsp;+32 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;+32 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; +32
* New Dec. &nbsp; &nbsp; &nbsp; &nbsp;48 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;86 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;37 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;84
* **UUE char: &nbsp; &nbsp; &nbsp; 0 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;V &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; % &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; T**

&nbsp;

![][10]And...that's it. &nbsp;Your data is now UUEncoded. &nbsp;When it is sent through whatever transmission medium it wont be bothered with special character protocals. &nbsp;For our Cat, we have transformed it into:** 0V%T**

Let's hope for the Cat's sake, there is decoding algorithm.

**Those sharper than myself may have already noticed a couple of problems.** &nbsp;For instance, what if our data doesn't come in increments of threes? &nbsp;For example, how do we send **Cats?**

The answer? We make nothing up. &nbsp;In the instance of Cats, we simply pad the end of the character series with two nulls on the end. &nbsp;For example,

* 'C' = 01000011
* 'a' = 01100001
* 't' = &nbsp;01110100
* 's' =&nbsp;01110011
* NUL = 00000000
* NUL = 00000000

48-bit:&nbsp;010000110110000101110100011100110000000000000000

* 6-bit Byte: &nbsp; &nbsp; 1 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 2 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 3 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;4 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 5 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 6 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;7 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;8
* Binary: &nbsp; &nbsp;010000 &nbsp; &nbsp;110110 &nbsp; &nbsp;000101 &nbsp; &nbsp;110100 &nbsp; &nbsp;011100 &nbsp; &nbsp;110000 &nbsp; &nbsp; 000000 &nbsp; &nbsp;000000

The new decimal values are,

* 6-bit Byte: &nbsp; &nbsp; &nbsp; &nbsp;1 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 2 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 3 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;4 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 5 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;6 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;7 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;8
* Decimal: &nbsp; &nbsp; &nbsp; &nbsp; 16 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 54&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 5&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;52 &nbsp; &nbsp; &nbsp; &nbsp; 28 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;48 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 0 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;0&nbsp;
* 6-bit Byte: &nbsp; &nbsp; &nbsp; &nbsp;1 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 2 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 3 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;4 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 5 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;6 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;7 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;8
* Decimal: &nbsp; &nbsp; &nbsp; &nbsp; 16 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 54&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 5&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;52 &nbsp; &nbsp; &nbsp; &nbsp; 28 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;48 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 0 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;0&nbsp;
* Add 32 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;+32 &nbsp; &nbsp; &nbsp; &nbsp;+32 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;+32 &nbsp; &nbsp; &nbsp; &nbsp;+32 &nbsp; &nbsp; &nbsp;+32 &nbsp; &nbsp; &nbsp; &nbsp; +32 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;+32 &nbsp; &nbsp; &nbsp; &nbsp; +32
* New Dec. &nbsp; &nbsp; &nbsp; &nbsp;48 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;86 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;37 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;84 &nbsp; &nbsp; &nbsp; &nbsp;60 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 80 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;32 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;32
* **UUE char: &nbsp; &nbsp; &nbsp; 0 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;V &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; % &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; T &nbsp; &nbsp; &nbsp; &nbsp;&lt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; P &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;SPC &nbsp; &nbsp; &nbsp; &nbsp;SPC**

We have turned "Cats" into "**0V%T<p  **"=""  well,="" almost,="" we="" aren't="" quite="" done="" here.="" uh-oh.=""  another="" problem.=""  the="" whole="" point="" of="" uue="" was="" to="" stay="" away="" from="" special="" characters="" like="" the="" space="" character="" (0x32).=""  but="" now="" have="" two="" them="" in="" our="" transmission.="" protocol="" addresses="" this.=""  it="" states,="" *="" if="" result="" 6-bit="" encoding="" process="" is="" character,="" convert="" this="" [grave="" characte][11]r,="" **'="" `="" '.=""  **(the="" grave="" accent="" 0x60="" hexadecimal,="" by="" way).="" therefore,="" "cats"="" actually="" becomes.="" **almost="" char:=""  ="" 0=""  v="" %="" t=""  <="" p=""  spc=""  spc**="" **uue=""  0="" `**="" finally!="" encoded="" we've="" turned:="" ![][12] into="" -------------="">&nbsp;**&nbsp;&nbsp;0V%T</p><p ``=""  =""  now,="" _that's_ science="" folks!**="" **hmm,="" what="" else="" are="" you="" going="" to="" need="" know?="" **oh,="" right,="" how="" the="" uue="" data="" is="" stored.****="" stores="" and="" sends="" in="" lines.=""  a="" line="" of="" consist="" a="" start="" character,="" which="" represents="" many="" bytes="" have="" been="" encoded="" (**not** how="" characters="" line)="" by="" using="" 6-bit="" number="" stored="" as="" an="" ascii="" char.=""  the="" ends="" with="" new="" character="" (i.e.,="" 'n').=""  lastly,="" limited="" 45="" data.=""  this="" means,="" maximum="" amount="" on="" should="" be="" no="" more="" than="" 60.=""  or,="" 62,="" if="" count="" end="" character.="" again,="" examples="" good.=""  for="" our="" cats,="" would="" look="" something="" like="" this,="" ![][13]="" let="" me="" take="" moment="" describe="" we="" get=""  basically,="" sending,="" case="" 4,="" add="" 32.="" gives="" us="" decimal="" representation="" will="" use=""  therefore,="" confusing?=""  it'll="" probably="" make="" sense="" when="" at="" code.="" speaking="" which,="" i="" think="" i've="" covered="" basics,="" time="" jump="" into="" implementation.="" **implementing="" uuencoding="" c**="" well,="" here="" it="" is.=""  my="" shoddy="" implementation="" uuencoder="" c.="" function="" takes="" several="" variables.="" 1.="" **uue_data_array**="" pointer="" uint8_t="" array="" where="" stored.="" 2.="" **hex_data_array**="" containing="" hexadecimal="" values="" (to="" learn="" my="" data,="" checkout="" another="" one="" this="" inglorious="" post:="" [intel="" hex="" file="" array][14]).="" 3.="" size="" integer="" representing="" might="" found="" **hex_data_array**.="" 4.="" after="" complete,="" returns="" were="" created.="" meant="" for="" parsing="" later="" time.="" |="" -----="" 1="" 2="" 3="" 4="" 5="" 6="" 7="" 8="" 9="" 10="" 11="" 12="" 13="" 14="" 15="" 16="" 17="" 18="" 19="" 20="" 21="" 22="" 23="" 24="" 25="" 26="" 27="" 28="" 29="" 30="" 31="" 32="" 33="" 34="" 35="" 36="" 37="" 38="" 39="" 40="" 41="" 42="" 43="" 44="" 46="" 47="" 48="" 49="" 50="" 51="" 52="" 53="" 54="" 55="" 56="" 57="" 58="" 59="" 60="" 61="" 62="" 63="" 64="" 65="" 66="" 67="" 68="" 69="" 70="" 71="" 72="" 73="" 74="" 75="" 76="" 77="" 78="" 79="" 80="" 81="" 82="" 83="" 84="" 85="" 86="" 87="" 88="" 89="" 90="" 91="" 92="" 93="" 94="" 95="" 96="" 97="" 98="" 99="" 100="" 101="" 102="" 103="" 104="" 105="" 106="" 107="" 108="" 109="" 110="" 111="" 112="" 113="" int="" uuencode(uint8_t="" *="" uue_data_array,="" hex_data_array,="" hex_data_array_size)="" {="" char="" per="" line.="" load="" array.="" encode="" padding.="" 5.="" replace="" '="" '''="" 6.="" return="" (implicit)="" size.="" byte_to_encode[3];="" uue_char[4];="" uuencoded_array_index="0;" uue_length_char_index="45;" padded_index="0;" bytes_left="0;" if(hex_data_array_size="" <="" 45)="" uue_data_array[uuencoded_array_index]="((hex_data_array_size" &="" 0x3f)="" +="" ');="" }="" ;="" uuencoded_array_index++;="" loop.="" (int="" hex_data_array_index="0;" hex_data_array_size;="" hex_data_array_index)="" 3;="" ++i)="" (hex_data_array_index="" byte_to_encode[i]="hex_data_array[hex_data_array_index];" hex_data_array_index++;="" padded_index++;="" uue_length_char_index--;="" uue_char[0]="((byte_to_encode[0]">&gt; 2) &amp; 0x3f);
    		uue_char[1] = (((byte_to_encode[0] &lt;&lt; 4) | ((byte_to_encode[1] &gt;&gt; 4) &amp; 0x0f)) &amp; 0x3f);
    		uue_char[2] = (((byte_to_encode[1] &lt;&lt; 2) | ((byte_to_encode[2] &gt;&gt; 6) &amp; 0x03)) &amp; 0x3f);
    		uue_char[3] = (byte_to_encode[2] &amp; 0x3f);

    		for (int i = 0; i &lt; 4; i++)
    		{
    			// 5. Replace ' ' with '''
    			if (uue_char[i] == 0x00)
    			{
    				UUE_data_array[UUEncoded_array_index] = 0x60;
    			}
    			else
    			{
    				UUE_data_array[UUEncoded_array_index] = (uue_char[i] + ' ');
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
    			UUE_data_array[UUEncoded_array_index] = 'n';
    			UUEncoded_array_index++;

    			if(bytes_left &lt; 45)
    			{
    				// Find how many characters are left.
    				UUE_data_array[UUEncoded_array_index] = ((bytes_left &amp; 0x3f) + ' ');
    			}
    			else
    			{
    				UUE_data_array[UUEncoded_array_index] = 'M';
    			}
    			UUEncoded_array_index++;
    			uue_length_char_index = 45;
    		}

    	} // End UUE loop
    	UUE_data_array[UUEncoded_array_index] = 'n';

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
    }

 |

&nbsp;

* 3-8: Here, I outline in pseudo-code what I wanted to get done in this function.
* 17-25: I deal with the start character of the first line. &nbsp;I do this by checking if hex data we were handed is more than the UUE line limit, 45 bytes. &nbsp;If it is, I place an M as the start character (45 + 32 = 77 = ASCII **M**). &nbsp;If the data we've been handed is less than 45 bytes, let's calculate the start character. &nbsp;We take 65 bits of the 8-bit number representing how many bytes are here, then add 32, this will give us our start character.
* 30-96: This is the main loop where the work is done. &nbsp;We loop through all the hexadecimal data provided us, encoding as we go.
* 33-48: The loop here deals with 3 bytes of data at a time. &nbsp;It also checks to see if we have less than 3 bytes left, if so, it pads the remaining space with 0 (null).
* 47: This index is used in combination with the if statement found one lines 82-90. &nbsp;It is in essence repeating the beginning if statement where we determined what the start character for this line will be.&nbsp;
* 51-54: This is where the magic happens. &nbsp;Here, we are turning the 3 bytes of 8 bits, into 4 bytes of 6 bits. &nbsp;We store the resulting bits in an 8-bit variable. &nbsp;But remember, we can put 6 bit data in a 8 bit jar, as long as we remember to be careful how we place the bits.
* 56-69: The resulting 6-bit characters are checked to see if they are a space character (0x20), if they are, we turn them into a grave ' ' &nbsp;' character (0x60). &nbsp;If they are not a space, we add 32 to the decimal value (' ' = 32 in decimal), this completes the encoding process.
* 72: We calculate how many data bytes are left, in preparation for calculating the next line's start character.
* 74-96: This loop serves two purposes. &nbsp;One, to place a new-line character ('n') at the end of our last encoded line. &nbsp;Two, to calculate and load the next line's start character.
* 96: When we've reached the end of our data, we place a new-line character to mark the end.
* 112: We return the number of ASCII characters used to represent our encoded data.

And there you go. &nbsp;**UUE!**

Here are some additional resources I found helpful,

1. [Wikipedia's article on UUEncoding][7]
2. [NXP's Application Note on UUEncoded for their uCs][15]
3. [Bdk6][1]

[1]: http://letsmakerobots.com/users/bdk6
[2]: http://letsmakerobots.com/lpc1114-usb-serial-solution-rerolling-boot-uploader
[3]: http://letsmakerobots.com/files/userpics/u19048/300x260xGCCLogo.png.pagespeed.ic.YZjB3d_p5p.png
[4]: http://www.mingw.org/wiki/HOWTO_Install_the_MinGW_GCC_Compiler_Suite
[5]: http://www.sublimetext.com/2
[6]: http://letsmakerobots.com/content/lpc1114-setup-bare-metal-arm
[7]: http://en.wikipedia.org/wiki/Uuencoding
[8]: http://www.bibase.com/images/ascii.gif
[9]: http://letsmakerobots.com/files/userpics/u19048/200x210xSuper_Style_ASCII_by_buddhascii.png.pagespeed.ic.T8JsLoZeGa.png
[10]: http://letsmakerobots.com/files/userpics/u19048/250x156xschrodingers_cat.jpg.pagespeed.ic.gMZVCsbORg.jpg
[11]: http://en.wikipedia.org/wiki/Grave_accent
[12]: http://letsmakerobots.com/files/userpics/u19048/250x140xfivekittems1.jpg.pagespeed.ic.TE7i7Z-C2Y.jpg
[13]: http://letsmakerobots.com/files/userpics/u19048/584x261xUUE_dump.png.pagespeed.ic.45j-POMFUZ.png
[14]: http://letsmakerobots.com/content/intel-hexfile-array
[15]: /files/userpics/u19048/UUE__app_note.pdf
  </p></sys></stdint.h></stdbool.h></math.h></string.h></winbase.h></winnt.h></windef.h></windows.h></stdlib.h></stdarg.h></stdio.h>
