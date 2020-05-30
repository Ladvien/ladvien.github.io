---
layout: post
title: Command Line Menu in C
categories: robots
excerpt:
tags: [robots, C]
color: "#152a55"
image:
  feature: my_uC_icon_12.png
  teaser: my_uC_icon_12.png
  thumb:
comments: true
---

Originally posted on [www.letsmakerobots.com](www.letsmakerobots.com)

**Nostalgia**

I wanted to post this simply because it working on it brought my a dry nostalgic joy.  When I was young, 8-9, my parents got a old computer.  All I remember was its screen was orange and black; having a [Hercules graphics card](http://en.wikipedia.org/wiki/Hercules_Graphics_Card).  I quickly learned to get around from the command prompt.  But I was always thrilled to run into menu driven program.  It was like going to a fancy restaurant of abstractness.  Anyway, when I wanted my code to slow down a bit and branch directions based upon user input, a command menu was a natural choice.

**A Break from the LPC1114 Uploader**

I thought I'd take some time away from coding my [LPC1114 Uploader](http://letsmakerobots.com/lpc1114-usb-serial-solution-rerolling-boot-uploader) and verbally process a few things I've learned.  As always, feel free to critique any of it; it'll only serve to make my code more robust in the end.  

This post will be a series of post leading up to the large post I'll make on writing the uploader.  All posts will rely on the GCC compiler.

![](/images/GCCLogo.png)Setting Up the GCC Compiler

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

![](/images/Command_line_menu.png)

**How to Write a Command Line Menu**

There really isn't much to the code here.  Basically, it it prints out the options you want your user to know.  Then, it starts a do-while loop until the user selects an appropriate number.

Hmm.  **Not really much to it, not sure it deserves its own post.  But what the hell.**

{% highlight c linenos %}
void main_menu()
{
	char char_choice[3];
	int int_choice = 0;

	do
	{
		system("cls");
		startScreen();
		printf("\n");
		printf("Vorpal Hoff -- Main Menu: \n\n");
		printf("1. Quick Connect\n");
		printf("2. FTDI Menu\n");
		printf("3. Open HM-1X Menu\n");
		printf("4. Connect LPC\n");
		printf("5. Program Chip\n");
		printf("6. Erase LPC\n");
		printf("7. Decode UUE debug file\n");
		printf("8. Parse hex-file and write to debug.hex\n");
		printf("9. Exit\n");

		scanf("%s", char_choice);
		int_choice = atoi(char_choice);

		switch (int_choice)
		{
			case 1:
				quick_connect();
				break;
			case 2:
				ftdi_menu();
				break;
			case 3:
                                HM_1X_main_menu();
				break;
			case 4:
				// Not yet used.
				break;
			case 5:
				program_chip(file_name);
			        break;
			case 6:
				// Not yet used.
			       break;
			case 8:
				debug_hex_file(file_name);
			        break;
			case 9:
				shut_down();
			        break;
			default:printf("Wrong choice. Enter Again");
			        break;
		}
	}while(int_choice !=99);
}
{% endhighlight %}

6 and 54: This is the beginning and the end of the [do-while loop](http://en.wikipedia.org/wiki/Do_while_loop).  Basically, the do-while is a fancy loop which says to do everything in the brackets over and over, until the boolean variable is met (line 54).

The do-while loop if the equivalent in effect to the follow code,

{% highlight c linenos %}
while (true) {
   do_work();
   if (!condition) break;
}
{% endhighlight %}

*   8: Clears the screen.  This removes the command prompt; giving a clean slate to paint our menu.
*   9: I put a function in to paint my menu header.  This allows me easily change the header for a menu.  It also makes the menu code easier to read.
*   12-20: We print the menu options for the user.
*   22: [scanf](http://www.cplusplus.com/reference/cstdio/scanf/) is a tricky command. It pauses and waits for the user to input followed by 'n'.   It takes a variable respective to the data type you want to get from the user.  Here, we are hoping the user enters one or two numbers.  These are put into the string provided.
*   23: We use the [atoi](http://www.cplusplus.com/reference/cstdlib/atoi/) function to take a string and turn it into an integer.  This value we store in the integer **int_choice**.
*   25: The beginning of the [switch-statement](http://www.tutorialspoint.com/cprogramming/switch_statement_in_c.htm) which does the real work for us.  It test the int_choice value you against predefined values (1-9 here).  If the one of the values is equal, it executes the code found there before breaking from the switch-statement.
*   51: If a number besides 1-9 is entered the default will be true.  Let's gripe at the user for selecting a bad number.

And that's it.  You simply put the functions you want to be called in the appropriate values in the switch-statement.  Because of the do-while loop, once a selection has been made and executed, the menu will be displayed again.

You can also make limit a selection to showing by doing something like the following,

{% highlight c linenos %}
bool connected_flag = false;
	do
	{
		system("cls");
		printf("FTDI Menu: ");
		printf("1. Quick Connect\n");
		printf("2. Device List\n");
		if (got_list == true) // Only display option if devices list.
		{
		printf("3. Connect Device\n");
		}

		printf("9. Main Menu\n");


		// Get user choice.
		scanf("%s", char_choice);

		// Convert string to int for switch statement.
		int_choice = atoi(char_choice);

		switch (int_choice)
		{
			case 1:
				quick_connect();
				baud_rate = 115200;
				connected_flag = true;
			case 2:
				got_list = get_device_list();
				break;
			case 3:
				if (got_list == true) // Only display option if devices listed.
				{
					connected_flag = connect_device(&baud_rate);
				}
				break;
			case 9:
				main_menu();
			    break;
			default:printf("""Bad choice. Hot glue!""");
			    break;
		}
	}while(int_choice !=99);
}
{% endhighlight %}

Here, option "3\. Connect Device" doesn't show until option "2\. Device List" is run.  On line 34 the connect_device() function sets the connected_flag variable to true if the function was successful.  Then, after the break is hit and the menu is repainted the option "3\. Connect Device" will show.  Also, '3' will become a valid user selection.

**A Submenu**

One last note.  If you want to make a sub-menu, you simply use the same code as above, just take the do-while loop out.  This states you only want the sub-menu to run once, the return to the main menu.
