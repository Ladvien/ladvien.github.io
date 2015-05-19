---
layout: article
title: Intel Hexfile to Array
categories: robots
excerpt:
tags: [robots]
image:
  feature: my_uC_icon_5_300x300.png
  teaser: my_uC_icon_5_300x300.png
  thumb:
comments: true
---

Originally posted on [www.letsmakerobots.com](www.letsmakerobots.com)
my_uC_icon_5_300x300.png

**Not All Those Who Wander are Lost (but I am)**

I thought I'd take some time away from coding my [LPC1114 Uploader](http://letsmakerobots.com/lpc1114-usb-serial-solution-rerolling-boot-uploader) and verbally process a few things I've learned.  As always, feel free to critique any of it; it'll only serve to make my code more robust in the end.  

This post will be a series of post leading up to the large post I'll make on writing the uploader.  All posts will rely on the GCC compiler.

**![](/images/GCCLogo.png)Setting Up the GCC Compiler**

I setup a C environment as basic I could.  There may be easier ways to go about this, but I wanted to use GCC to compile.  

To setup the environment:

1\. I downloaded and setup [MinGW32](http://www.mingw.org/wiki/HOWTO_Install_the_MinGW_GCC_Compiler_Suite).

2\. I added these **includes** to make the code go.

{% highlight c linenos %}
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
#include <sys/time.h>
{% endhighlight %}

I used this line to build it:

**$ gcc -o main main.c**

As for editing, I've really grown to love [Sublime Text 2](http://www.sublimetext.com/2).

If you have issues**, make sure directory containing your files is in your PATH environment variable** (I go over how to add the directory to your environment variables in this [post](http://letsmakerobots.com/content/lpc1114-setup-bare-metal-arm)).

**Intel Hexfile to An Array Based on Data Address**

To load data from an [Intel HEX format file](http://en.wikipedia.org/wiki/Intel_HEX) I used several functions, open_file() to create a data stream, more commonly know as a [file pointer](http://www.gnu.org/software/libc/manual/html_node/Streams.html#Streams), from the file I wanted to read.  And hex_file_to_array(), to parse the hex file and extract the data.

![](/images/hexfile2.png)


**main.c**

{% highlight c linenos %}
MAIN.C

int main(int argc, char *argv[])
{
	//If the user fails to give us two arguments yell at him.
	if ( argc != 2 ) {
		fprintf ( stderr, "Usage: %s <readfile1>\n", argv[0] );
		exit ( EXIT_FAILURE );
	}
	// Data array
	uint8_t HEX_array[32768];

	// Bytes read into array.
	int HEX_array_size;

	//File to be loaded.
	FILE *hex_file;

	//Open file using command-line info; for reading.
	hex_file = open_file (argv[0], "rb" );

	// Load the data from file
	HEX_array_size = hex_file_to_array(hex_file, HEX_array);


} // END PROGRAM
{% endhighlight %}

*   6:  Let's check the number of arguments passed in by the user.  If there is no file name, then we exit.
*   11: Declare a unsigned array for the data.  I've set it arbitrarily, but it will need to be large enough for the amount of data to be extracted from the hexfile.
*   17: Here we create a pointer to a file data stream.
*   20: We pass the pointer to the data stream to the **open_file** function.  We are setting up to only read the file in binary.  We pass it the file we wish to open and it returns the opened file.
*   23: We pass **hex_file_to_array** a file pointer and pointer to an an array.  This function reads the hex file, parses it, extracting the data and placing them into the the uint8_t array based on the data's address found in the hexfile.  The function then returns the number of data bytes found in the hex file.

**open_file()**

This function takes the name of a file and the [mode](http://www.c4learn.com/c-programming/c-file-open-modes/) under which to open it, then attempts to open a file pointer to this file.  If it is is successful, it returns the pointer to the now open file.  If it it fails, the program exits with an error code.

{% highlight c linenos %}
MAIN.C

//Open file for reading, function.
FILE *open_file ( uint8_t *file, uint8_t *mode )
{
  FILE *fileOpen = fopen ( file, mode );

  if ( fileOpen == NULL ) {
    perror ( "Unable to open file" );
    exit (EXIT_FAILURE);
  }

  return fileOpen;
}
{% endhighlight %}

To understand this function it pays to understand well the Intel HEX file format.

**Parsed HEX file:**

<pre style="font-family: monospace, Courier; background-color: #f9f9f9; border: 1px solid #dddddd; padding: 1em; line-height: 1.3em; font-size: 14px;"><span style="background-color: #ffffcc; font-family: monospace;">:<span style="background-color: #ccffcc; font-family: monospace;">10<span style="background-color: #ccccff; font-family: monospace;">0100<span style="background-color: #ffcccc; font-family: monospace;">00<span style="background-color: #ccffff; font-family: monospace;">214601360121470136007EFE09D21901<span style="background-color: #cccccc; font-family: monospace;">40
<span style="background-color: #ffffcc; font-family: monospace;">:<span style="background-color: #ccffcc; font-family: monospace;">10<span style="background-color: #ccccff; font-family: monospace;">0110<span style="background-color: #ffcccc; font-family: monospace;">00<span style="background-color: #ccffff; font-family: monospace;">2146017E17C20001FF5F160021480119<span style="background-color: #cccccc; font-family: monospace;">28
<span style="background-color: #ffffcc; font-family: monospace;">:<span style="background-color: #ccffcc; font-family: monospace;">10<span style="background-color: #ccccff; font-family: monospace;">0120<span style="background-color: #ffcccc; font-family: monospace;">00<span style="background-color: #ccffff; font-family: monospace;">194E79234623965778239EDA3F01B2CA<span style="background-color: #cccccc; font-family: monospace;">A7
<span style="background-color: #ffffcc; font-family: monospace;">:<span style="background-color: #ccffcc; font-family: monospace;">10<span style="background-color: #ccccff; font-family: monospace;">0130<span style="background-color: #ffcccc; font-family: monospace;">00<span style="background-color: #ccffff; font-family: monospace;">3F0156702B5E712B722B732146013421<span style="background-color: #cccccc; font-family: monospace;">C7
<span style="background-color: #ffffcc; font-family: monospace;">:<span style="background-color: #ccffcc; font-family: monospace;">00<span style="background-color: #ccccff; font-family: monospace;">0000<span style="background-color: #ffcccc; font-family: monospace;">01<span style="background-color: #cccccc; font-family: monospace;">FF
</pre>

<div><span style="font-family: sans-serif; font-size: 14px; line-height: 22px; display: inline-block; width: 1.5em; height: 1.5em; margin: 1px 0px; border: 1px solid black; background-color: #ffffcc; text-align: center;">  :  <span style="color: #252525; font-family: sans-serif; font-size: 14px; line-height: 22px;"> Start code <span style="font-family: sans-serif; font-size: 14px; line-height: 22px; display: inline-block; width: 1.5em; height: 1.5em; margin: 1px 0px; border: 1px solid black; background-color: #ccffcc; text-align: center;"> 10 <span style="color: #252525; font-family: sans-serif; font-size: 14px; line-height: 22px;"> Byte count <span style="font-family: sans-serif; font-size: 14px; line-height: 22px; display: inline-block; width: 1.5em; height: 1.5em; margin: 1px 0px; border: 1px solid black; background-color: #ccccff; text-align: center;"> 01<span style="color: #252525; font-family: sans-serif; font-size: 14px; line-height: 22px;"> Address <span style="font-family: sans-serif; font-size: 14px; line-height: 22px; display: inline-block; width: 1.5em; height: 1.5em; margin: 1px 0px; border: 1px solid black; background-color: #ffcccc; text-align: center;"> 00<span style="color: #252525; font-family: sans-serif; font-size: 14px; line-height: 22px;"> Record type <span style="font-family: sans-serif; font-size: 14px; line-height: 22px; display: inline-block; width: 1.5em; height: 1.5em; margin: 1px 0px; border: 1px solid black; background-color: #ccffff; text-align: center;"> A7 <span style="color: #252525; font-family: sans-serif; font-size: 14px; line-height: 22px;"> Data <span style="font-family: sans-serif; font-size: 14px; line-height: 22px; display: inline-block; width: 1.5em; height: 1.5em; margin: 1px 0px; border: 1px solid black; background-color: #cccccc; text-align: center;"> C7 <span style="color: #252525; font-family: sans-serif; font-size: 14px; line-height: 22px;"> Checksum</div>

<div>(Borrowed from Wikipedia's excellent article on [Intel HEX](http://en.wikipedia.org/wiki/Intel_HEX))</div>

<div>All of the information in the file is important, but we are only looking to put the <span style="color: #252525; font-family: sans-serif; font-size: 14px; line-height: 22px;"> <span style="font-family: sans-serif; font-size: 14px; line-height: 22px; display: inline-block; width: 1.5em; height: 1.5em; margin: 1px 0px; border: 1px solid black; background-color: #ccffff; text-align: center;"> A7<span style="color: #252525; font-family: sans-serif; font-size: 14px; line-height: 22px;"> Data into the array.</div></div>

To extract this data we are going to use three sub-routines: read_byte_from_file(), Ascii2Hex(), clear_special_char()



**read_byte_from_file()**

One bit to understand about hex files is the data is actually stored as ASCII characters.  When we open a file pointer to these ASCII characters, we can't just read the bytes, since they'd simply be an ASCII character representing the [nibble](http://en.wikipedia.org/wiki/Nibble) read.  To make the conversion we get a character, store it as a binary nibble A, get another character and store it as binary nibble B.  We then combine nibble A and B into a single byte.

The function takes three parameters: the file pointer, a uint8_t pointer for storing the complete byte, and the total_chars_read, which allows us to track how far we are into the file.

{% highlight c linenos %}
DATA.C

uint8_t read_byte_from_file(FILE * file, uint8_t * char_to_put, int * total_chars_read)
{
	//Holds combined nibbles.
	uint8_t hexValue;
	//Get first nibble.
	*char_to_put = fgetc (file);
	clear_special_char(file, char_to_put, total_chars_read);
	//Put first nibble in.
	hexValue = (Ascii2Hex(*char_to_put));
	//Slide the nibble.
	hexValue = ((hexValue << 4) & 0xF0);
	//Put second nibble in.
	*char_to_put = fgetc (file);
	clear_special_char(file, char_to_put, total_chars_read);
	//Put the nibbles together.
	hexValue |= (Ascii2Hex(*char_to_put));
	//Return the byte.
	*total_chars_read += 2;

	return hexValue;
}
{% endhighlight %}

*   6: Declaring a 8-bit unsinged integer to hold the finished byte.
*   8: Get an ASCII character from the file pointer.
*   9: Here we call the cleaer_special_char function to remove '\n' and '\r' found in the hex file.
*   11: We then convert the ASCII character into a true binary nibble.  The result is stored in the string.  (I will cover the Ascii2Hex function below.)
*   The above steps are repeated for nibble B.
*   18: We combine the string of nibbles into a byte.
*   26: We increment two ASCII characters read from the file pointer.

**clear_special_char()**

The clear special character function is simply meant to remove the ':', '\n', and '\r' characters from the data stream.  It simply looks through the character pulled from the data stream.  If it is not a special character, it does nothing.  If it is, it increments the character counter and discards the character.

{% highlight c linenos %}
DATA.C

void clear_special_char(FILE * file, uint8_t * charToPut, int * totalCharsRead)
{
	//Removes CR, LF, ':'  --Bdk6's
	while (*charToPut == '\n' || *charToPut == '\r' || *charToPut ==':'){
		(*charToPut = fgetc (file));
		*totalCharsRead++;
	}
}
{% endhighlight %}

**Ascii2Hex()**

Another fairly simple function.  Here, we simply find the numeric value of the ASCII character and convert it to its binary equivalent.

{% highlight c linenos %}
DATA.C

//Copied in from lpc21isp.c
uint8_t Ascii2Hex(uint8_t c)
{
	if (c >= '0' && c <= '9')
	{
		return (uint8_t)(c - '0');
	}
	if (c >= 'A' && c <= 'F')
	{
		return (uint8_t)(c - 'A' + 10);
	}
	if (c >= 'a' && c <= 'f')
	{
        return (uint8_t)(c - 'a' + 10);
	}

	return 0;  // this "return" will never be reached, but some compilers give a warning if it is not present
}
{% endhighlight %}

This function is pretty simple, if you keep in mind each character is actually an integer.  For example, the if-statements could be re-written as follows,

{% highlight c linenos %}
if (c >= 0 && c <= 9)
   { return (uint8_t)(c - 0) }

if (c >= 65 && c <= 70)
   { return (uint8_t)(c - 65 + 10)}

if (c >= 97 && c <= 102)
   {return (uint8_t)(c - 97 + 10)}
{% endhighlight %}


You can use an [ASCII reference table](http://www.bibase.com/images/ascii.gif) to determine how a character read will be interpreted.  For instance, 'D' or 'd' would be 68 or 100\.  68 - 65 + 10 = 13\.  We know D is hexadecimal for 13 (0 = 0, 1 = 1, 1 = 2, etc... A = 10, B, = 11, C = 12, **D = 13**, E = 14, F = 15).

This brings us to the main function,

**read_line_from_hex_file()**

{% highlight c linenos %}
DATA.C

bool read_line_from_hex_file(FILE * file, uint8_t line_of_data[], long int * combined_address, int * bytes_this_line)
{
		int data_index = 0;
		uint8_t char_to_put;
		int total_chars_read = 0;

		//To hold file hex values.
		uint8_t byte_count;
		uint8_t datum_address1;
		uint8_t datum_address2;
		uint8_t datum_record_type;
		uint8_t datum_check_sum;

		//BYTE COUNT
		byte_count = read_byte_from_file(file, &char_to_put, &total_chars_read);

		// No need to read, if no data.
		if (byte_count == 0){return false;}

		//ADDRESS1 //Will create an 8 bit shift. --Bdk6's
		datum_address1 = read_byte_from_file(file, &char_to_put, &total_chars_read);

		//ADDRESS2
		datum_address2 = read_byte_from_file(file, &char_to_put, &total_chars_read);

		//RECORD TYPE
		datum_record_type = read_byte_from_file(file, &char_to_put, &total_chars_read);

		// No need to read, if not data.
		if (datum_record_type != 0){return false;}

		*combined_address = ((uint16_t)datum_address1 << 8) | datum_address2;

		// DATA
		while(data_index < byte_count)
		{
			line_of_data[data_index] = read_byte_from_file(file, &char_to_put, &total_chars_read);
			data_index++;
		}
		*bytes_this_line = data_index;

		// CHECKSUM
		datum_check_sum = read_byte_from_file(file, &char_to_put, &total_chars_read);

		return true;
}
{% endhighlight %}

The above code parses exactly one line of hex data from the file pointer.

<pre style="font-family: monospace, Courier; background-color: #f9f9f9; border: 1px solid #dddddd; padding: 1em; line-height: 1.3em; font-size: 14px;"><span style="background-color: #ffffcc; font-family: monospace;">:<span style="background-color: #ccffcc; font-family: monospace;">10<span style="background-color: #ccccff; font-family: monospace;">0120<span style="background-color: #ffcccc; font-family: monospace;">00<span style="background-color: #ccffff; font-family: monospace;">194E79234623965778239EDA3F01B2CA<span style="background-color: #cccccc; font-family: monospace;">A7</pre>

*   17: We read the first byte of a line.  This should be the ':' character, but remember our clear_special_char() should skip this and read the next two bytes '1' and '0' (green).  The "10" is how many bytes of data (blue) found on this line.  Note, 10 is not a decimal number, it's hexadecimal.  Meaning, there should be 16 bytes of data found on this line.
*   20: We check if there was any data on this line.  If there are zero data, we return false.
*   23: Take the first byte of the data address (purple).
*   26: Take the second byte of the data address (purple).
*   29: Get the byte (red) identifying the type of information found on this line.  We are only looking for data ('00').  The other types are explained well at the ole' Wiki article: [Intel HEX record types](http://en.wikipedia.org/wiki/Intel_HEX#Record_types).
*   32: If the record type is not data, we don't want it.  We return false.
*   34: Combine the two 8-bit address bytes into one 16-bit address.
*   37: Let's get all the data found on this line and put it into the array we provided the function.
*   42: We have to keep track of how many bytes are on each line, to complete our address of the data.  Therefore, we pass it back to hex_file_to_array().
*   45: I read the checksum, but I don't do anything with it.  I probably should.

**hex_file_line_count()**

To properly parse the hexfile we need to know how many lines are found in the the file.  We can find this information several ways, but I counted the number of line start characters ':'.

{% highlight c linenos %}
MAIN.C

int hex_file_line_count(FILE * file_to_count)
{
	int line_count = 0;
	char got_char;

	while(got_char != EOF)
	{
		got_char = fgetc(file_to_count);
		if (got_char == ':'){line_count++;}
	}
	rewind(file_to_count);
	return line_count;
}
{% endhighlight %}

*   8: Loops until the end-of-file character is reached.
*   10: Gets a ASCII character from the file pointer.
*   11: We check to see if the character we go was line start character ':'.
*   13: This function iterates through the entire file, but we want to start pulling data from the beginning of the file, so we [rewind](http://www.tutorialspoint.com/c_standard_library/c_function_rewind.htm) the file to the first character.
*   14: We return the number of lines.

**hex_file_to_array()**

{% highlight c linenos %}
DATA.C

int hex_file_to_array(FILE * file, uint8_t hex_data[])
{
	// 1. Get line count.
	// 2. Read a line. From ':' to '\n'
	// 3. Parse a line.
	//   Repeat for all lines.

	// Data per line.
	uint8_t line_of_data[32];
	long int combined_address[4096];

	// Indices and counters
	int hex_line_index = 0;
	int chars_this_line = 0;
	int total_chars_read = 0;
	// How many lines in the hexfile?
	int hex_lines_in_file = 0;
	int bytes_this_line[4096];

	// Let's count how many lines are in this file.
	hex_lines_in_file = hex_file_line_count(file);

	// Indices for parsing.
	int line_index = 0;
	int byte_index = 0;
	bool read_line_ok = false;

	// Parse all lines in file.
	while(line_index < hex_lines_in_file)
	{
		read_line_ok = read_line_from_hex_file(file, line_of_data, &combined_address[line_index], &bytes_this_line[line_index]);
		if (!read_line_ok)
		{
			printf("Line#: %i. Dude, that's not data!\n", line_index);
			read_line_ok = true;
		}
		while(byte_index < bytes_this_line[line_index])
		{
			hex_data[combined_address[line_index] + byte_index] = line_of_data[byte_index];
			line_of_data[byte_index] = '\0';
			byte_index++;
		}
		byte_index = 0;
		line_index++;
	}

	// Print out parsed data.
	int k = 0;
	int j = 0;
	int printed_bytes = 0;
	while (k < hex_lines_in_file)
	{
		while(j < bytes_this_line[k])
		{
			printf("%02X ", hex_data[j+(printed_bytes)]);
			j++;
		}
		printed_bytes += bytes_this_line[k];
		j=0;
		printf("\n");
		k++;
	}

	return total_chars_read;
} // End hex_file_to_array
{% endhighlight %}


*   23: We count the number of lines in the file we wish to extract data.
*   31: This is the work-horse loop.  We loop until the we have read through all the lines we counted.
*   33: We pass read_line_from_hex() our variables we wish to fill.  The hex file we want to parse (file), the buffer we hold the line data in, the int array which will serve to hold the address of this line of data, a variable to hold the number of bytes in this line.  If the function was got data, it will return true.  Otherwise, it will return false.  We store this flag to make sure we got something.
*   34: We check to see if we actually got data from our attempt.
*   39: Here, we move the line of data from the buffer into the final array.  
*   41: We place the data into the array based upon the address we pulled from the line (address1 + address2) and the byte number.
*   42: Reset the buffer to nil.
*   49-64:  Finally, we print out the data.  The k-loop goes through each line we extracted; the j-loop goes through each byte found on the respective line.

And that's it.  **Note, 49-64 is meant to demonstrate the data is properly extracted.  These lines could be moved to another function where the data may be used as needed.**

![](/images/Hex_file_data_dump1.png)
