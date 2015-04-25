---
layout: default
title: UUEncoding in C
---

<p><img alt="" src="http://www.instructables.com/files/deriv/FC5/PDU6/I8BGM5EA/FC5PDU6I8BGM5EA.MEDIUM.jpg" style="float: right;margin: 0.0px 0.0px 10.0px 10.0px;"> </p><p>Setting Up the GCC Compiler</p><p>I setup a C environment as basic I could.  There may be easier ways to go about this, but I wanted to use GCC to compile.   To setup the environment: </p><ol>      
<li>I downloaded and setup <a href="http://www.mingw.org/wiki/HOWTO_Install_the_MinGW_GCC_Compiler_Suite" rel="nofollow">MinGW32</a>.         
</li><li>I added these includes to make the code go.</li></ol><pre>#include &lt;stdio.h&gt;
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
#include &lt;sys/time.h&gt;</pre><p>I used this line to build it: </p><pre>$ gcc -o main main.c </pre><p>As for editing, I've really grown to love <a href="http://www.sublimetext.com/3" rel="nofollow">Sublime Text 3</a>. If you have issues, make sure directory containing your files is in your PATH environment variable (I go over how to add the directory to your environment variables in this post).</p>

<p>"What is 'UUEncoding'?"</p><p> Unix-to-Unix encoding (UUE) is the process where binary data is converted to a form which can be represented using ASCII character values from space (32) to underscore (95).  These 64 characters allow us to express any binary stream of data. </p><p>I will not spend a lot of time explaining <a href="http://en.wikipedia.org/wiki/Uuencoding" rel="nofollow">UUEncoding since the Wikipedia article</a> is excellent. </p><p>"Why UUEncode?" Have you written a program to look for a particular value?  Like this,</p><pre>int i; char tCollection[32];
char c; if( c == 'T')
{
    Serial.print("I found a T!");
    tCollection[i] = c;
else if (c == '\r')
{
    exit();
}</pre><p>You begin running your program and everything seems fine.  It is inspecting data looking for the letter T (0x54), but then, all of a sudden your program exits without reason.  You're upset, because the sensor sending you the data didn't send the exit code, which is a carriage return ('\r', or 0x13), but still, your program ended like it did.</p><p>Really, we know the reason, your program came across a random 0x13, which it interpreted as an exit command.  Maybe a different special character?</p><p><img src="http://www.asciitable.com/index/asciifull.gif"></p><p>But you realize, if you are dealing with a 8-bit data stream any ASCII character might be found in the incoming stream.  So, how can the communicating devices know when it is getting data, versus, when it is receiving a command?</p>

<p><img alt="" src="http://www.instructables.com/files/deriv/FA1/7FDV/I8BGME06/FA17FDVI8BGME06.SQUARE3.jpg" style="width: 239.0px;float: left;margin: 0.0px 10.0px 10.0px 0.0px;">This is where UUE comes in.  As I stated earlier, UUE is a way to represent the same 8-bit data using only hex values 0x32 through 0x95 (the two middle columns in the ASCII chart above).  This means characters 0x00 through 0x1F and 0x60 through 0x7F are free to be used for command functions. </p><p>Returning to the above example, this means we could now us the CR value to signal the end-of-transmission, since CR is 0x13. Ok, I hope I've sold you on UUE's utility, let me attempt to explain the basics of how hexadecimal data is converted into a form which may be represented with only 64 values.     </p><p>UUE conversion works with three bytes of data at a time and follows this algorithm. </p><ol>  
<li>The individual bits of 3 HEX bytes are put into a series.  
</li><li>The 24-bit series is then divided into four bytes of 6-bits.  
</li><li>Then, 32 is added to the decimal value representing each of the 6-bit bytes.  
</li><li>The resulting four values are UUEncoded bytes.</li></ol><p>Confused as hell? I was too.  Pictures are good.  Let's follow the Wiki example and use: Cat</p>

<p>The first step is to take the binary values for each ASCII character.</p><pre>'C' = 01000011 
'a' = 01100001
't' =  01110100</pre><p>This means the resulting 24-bit binary series is,</p><p>24-Bit Cat,</p><pre>010000110110000101110100</pre><p>This is then divided into four 6-bit bytes, </p><pre>6-bit Byte:     1        2        3        4
Binary:      010000    110110   000101   110100</pre>

<pre>6-bit Byte:     1        2        3        4
Binary:      010000    110110   000101   110100
Decimal:       16        54       5        52
</pre><p>At this point the 6-bit (senary) byte gave me a little trouble.  I didn't understand how 6-bits were treated by the 8-bit variable I was putting them in.  For example, how could I get an int variable to take only 6 bits, not 8?  The trick is understanding the 8-bit variable is only the width of the allotted space provided in a register, it has no influence on what you put in it.  It finally dawned on me, I didn't need to worry about the empty bits in a register.</p><p>Examples are good:<br>010000     = 16 in Decimal </p><p>00010000 = 16 in Decimal </p><p>010000 = 00010000</p><p>Anyway, this is how I finally made sense of it.  As long as when I did my bit manipulations I kept unused bits of the register towards the "left" side, the my 6-bit values could be put into a 8-bit register and there value would remain the same.</p>

<p>Alright, back to our example.</p><p>Our next step is to add 32 to each of the decimal value of our new four bytes.</p> <pre>6-bit Byte:     1        2        3        4
Binary:      010000    110110   000101   110100
Decimal:       16        54       5        52
Add 32:       +32        +32     +32       +32
New Dec.:      48        86       37       84
UUE char:       0        V        %        T</pre><p><img src="http://www.instructables.com/files/deriv/FVW/MP7J/I8BGME05/FVWMP7JI8BGME05.MEDIUM.jpg" style="float: right;width: 302.0px;"></p><p>And...that's it. Your data is now UUEncoded. When it is sent through whatever transmission medium it wont be bothered with special character protocols. For our Cat, we have transformed it into: <strong>0V%T</strong></p><p>Let's hope for the Cat's sake, there is decoding algorithm.</p>

<p><strong>Those sharper than myself may have already noticed a couple of problems.</strong>  For instance, what if our data doesn't come in increments of threes?  For example, how do we send <strong>Cats</strong>?</p><p>The answer? We make nothing up.  In the instance of Cats, we simply pad the end of the character series with two nulls on the end.  For example,</p> <pre>'C' = 01000011
'a' = 01100001
't' = 01110100
's' = 01110011
NUL = 00000000
NUL = 00000000
</pre><p>48-Bits,</p> <pre>010000110110000101110100011100110000000000000000
</pre><p>The senary bytes become,</p><pre>6-bit Byte:   1      2       3       4       5       6        7       8
Binary:    010000  110110  000101  110100  011100  110000   000000  000000
Decimal:      16     54      5       52      28      48       0       0 
Add 32        +32    +32    +32      +32     +32     +32      +32     +32
New Dec.      48     86      37      84      60      80       32      32
UUE char:     0      V       %       T       &lt;       P        SPC     SPC</pre><p>We have turned "Cats" into "<strong>0V%T</strong>".  </p><p>Well, <em>almost</em>; we aren't quite done.</p>

<p>Uh-oh.  Another problem.  The whole point of UUE was to stay away from special characters like the space character (0x32).  But now we have two of them in our transmission.  Well, the UUE protocol addresses this.  It states,</p><p>If the result of the 6-bit encoding process is the space character, we convert this to the <a href="http://en.wikipedia.org/wiki/Grave_accent" rel="nofollow">grave</a> character, ' ` '.  (The grave accent character is 0x60 in hexadecimal, by the way).</p><p>Therefore, our "Cats" actually becomes.</p> <pre>Almost UUE char:       0   V   %   T   &lt;   P   SPC   SPC
UUE char:              0   V   %   T   &lt;   P   `     `	
</pre><p>Finally! We have encoded "Cats"</p><p>We've turned:</p><p><img src="http://www.instructables.com/files/deriv/FJG/9QZR/I8BGMF8B/FJG9QZRI8BGMF8B.MEDIUM.jpg"> </p><h3>into  -------------&gt;  0V%T``</h3><h3>Now, that's science folks!</h3>

<p>Hmm, what else are you going to need to know? <strong>Oh, right, how the UUE data is stored.</strong></p><p>UUE stores and sends data in lines.  A line of UUE data consist of a start character, which represents how many bytes have been encoded in the line (not how many UUE characters are in the line) by using a 6-bit number stored as an ASCII char.  The line of UUE data ends with a new line character (i.e., '\n').  Lastly, a UUE line is limited to 45 bytes of data.  This means, the maximum amount of data characters in on line of UUE should be no more than 60.  Or, 62, if you count the start character and the end character.</p><p>Again, examples are good.  For our Cats, the line would look something like this,</p> <pre>$ 0V%T&lt;P `` \n</pre><p>Let me take a moment to describe how we get the start character.  Basically, we count how many bytes we are sending, in our case 4, and we add 32.  This gives us the decimal representation of the ASCII character we will use as our start character.  Therefore</p><pre>4 + 32 = 36 as ASCII = $
</pre><p>Confusing?  It'll probably make more sense when we look at the code.</p><p>Speaking of which, I think I've covered the basics, time to jump into implementation.</p>

<p>Well, here it is.  My shoddy implementation of a UUEncoder in C.  </p><p>The function takes several variables.</p><ol>
<li><strong>UUE_data_array</strong> is a pointer to an uint8_t array where the encoded characters will be stored.
</li><li><strong>hex_data_array</strong> is a pointer to an uint8_t array containing the hexadecimal values to be encoded (to learn where I get my hexadecimal data, checkout another one of this inglorious post: Intel HEX File to Array).
</li><li><strong>hex_data_array</strong> size is an integer representing how many bytes of data might be found in the hex_data_array.
</li><li>After the function is complete, it returns how many ASCII UUE characters were created.  This is meant for parsing the UUE array at a later time.</li></ol><p><a href="https://github.com/Ladvien/Instructables_UUE_function/blob/master/Instructables_UUEncoding_function_0.c" rel="nofollow">Code Link</a></p><ul>
<li>3-8: Here, I outline in pseudo-code what I wanted to get done in this function.
</li><li>17-25: I deal with the start character of the first line.  I do this by checking if hex data we were handed is more than the UUE line limit, 45 bytes.  If it is, I place an M as the start character (45 + 32 = 77 = ASCII M).  If the data we've been handed is less than 45 bytes, let's calculate the start character.  We take 65 bits of the 8-bit number representing how many bytes are here, then add 32, this will give us our start character.
</li><li>30-96: This is the main loop where the work is done.  We loop through all the hexadecimal data provided us, encoding as we go.
</li><li>33-48: The loop here deals with 3 bytes of data at a time.  It also checks to see if we have less than 3 bytes left, if so, it pads the remaining space with 0 (null).
</li><li>47: This index is used in combination with the if statement found one lines 82-90.  It is in essence repeating the beginning if statement where we determined what the start character for this line will be. 
</li><li>51-54: This is where the magic happens.  Here, we are turning the 3 bytes of 8 bits, into 4 bytes of 6 bits.  We store the resulting bits in an 8-bit variable.  But remember, we can put 6 bit data in a 8 bit jar, as long as we remember to be careful how we place the bits.
</li><li>56-69: The resulting 6-bit characters are checked to see if they are a space character (0x20), if they are, we turn them into a grave ' '  ' character (0x60).  If they are not a space, we add 32 to the decimal value (' ' = 32 in decimal), this completes the encoding process.72: We calculate how many data bytes are left, in preparation for calculating the next line's start character.
</li><li>74-96: This loop serves two purposes.  One, to place a new-line character ('\n') at the end of our last encoded line.  Two, to calculate and load the next line's start character.
</li><li>96: When we've reached the end of our data, we place a new-line character to mark the end.
</li><li>112: We return the number of ASCII characters used to represent our encoded data.</li></ul>

<p>And there you go.  UUE!</p><p>Here are some additional resources I found helpful, </p><ol>
<li><a href="http://en.wikipedia.org/wiki/Uuencoding" rel="nofollow">Wikipedia's article on UUEncoding</a>
</li><li><a href="http://letsmakerobots.com/files/userpics/u19048/UUE__app_note.pdf" rel="nofollow">NXP's Application Note on UUEncoded for their uCs</a>
</li><li><a href="http://letsmakerobots.com/users/bdk6" rel="nofollow">Bdk6</a></li></ol><p><strong>I want to take a moment to thank Bdk6.  The man is a walking Stack Overflow, with more patience for stupid.  I doubt I'd understand any of this without his guidance.</strong></p>
