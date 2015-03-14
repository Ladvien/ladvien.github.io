---
layout: post
title: You're up and running!
---

Next you can update your site name, avatar and other options using the _config.yml file in the root of your repository (shown below).

![_config.yml]({{ site.baseurl }}/images/config.png)

The easiest way to make your first post is to edit this one. Go into /_posts/ and update the Hello World markdown file. For more instructions head over to the [Jekyll Now repository](https://github.com/barryclark/jekyll-now) on GitHub.


<<<<<<< Updated upstream
![][12]

=======

![](<img src="ladvien.github.io/images/300x260xGCCLogo.png.pagespeed.ic.YZjB3d_p5p.png">)
>>>>>>> Stashed changes

[Source](http://letsmakerobots.com/content/command-line-menu "Permalink to Command Line Menu | Let's Make Robots!")

# Command Line Menu | Let's Make Robots!

**Nostalgia**

I wanted to post this simply because it working on it brought my a dry nostalgic joy. &nbsp;When I was young, 8-9, my parents got a old computer. &nbsp;All I remember was its screen was orange and black; having a [Hercules graphics card][1]. &nbsp;I quickly learned to get around from the command prompt. &nbsp;But I was always thrilled to run into menu driven program. &nbsp;It was like going to a fancy restaurant of abstractness. &nbsp;Anyway, when I wanted my code to slow down a bit and branch directions based upon user input, a command menu was a natural choice.

**A Break from the LPC1114 Uploader**

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

**![][7]**

&nbsp;

**How to Write a Command Line Menu**

There really isn't much to the code here. &nbsp;Basically, it it prints out the options you want your user to know. &nbsp;Then, it starts a do-while loop until the user selects an appropriate number.

Hmm. &nbsp;**Not really much to it, not sure it deserves its own post. &nbsp;But what the hell.**

&nbsp;

&nbsp;

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

 |

    void main_menu()
    {
    	char char_choice[3];
    	int int_choice = 0;

    	do
    	{
    		system("cls");
    		startScreen();
    		printf("n");
    		printf("Vorpal Hoff -- Main Menu: nn");
    		printf("1. Quick Connectn");
    		printf("2. FTDI Menun");
    		printf("3. Open HM-1X Menun");
    		printf("4. Connect LPCn");
    		printf("5. Program Chipn");
    		printf("6. Erase LPCn");
    		printf("7. Decode UUE debug filen");
    		printf("8. Parse hex-file and write to debug.hexn");
    		printf("9. Exitn");

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

 |

&nbsp;

6 and 54: This is the beginning and the end of the&nbsp;[do-while loop][8]. &nbsp;Basically, the do-while is a fancy loop which says to do everything in the brackets over and over, until the boolean variable is met (line 54).

The do-while loop if the equivalent in effect to the follow code,

| ----- |
|

    1
    2
    3
    4

 |

    while (true) {
       do_work();
       if (!condition) break;
    }

 |

&nbsp;

* 8: Clears the screen. &nbsp;This removes the command prompt; giving a clean slate to paint our menu.
* 9: I put a function in to paint my menu header. &nbsp;This allows me easily change the header for a menu. &nbsp;It also makes the menu code easier to read.
* 12-20: We print the menu options for the user.
* 22: [scanf][9] is a tricky command. It pauses and waits for the user to input followed by 'n'. &nbsp; It takes a variable respective to the data type you want to get from the user. &nbsp;Here, we are hoping the user enters one or two numbers. &nbsp;These are put into the string provided.
* 23: We use the [atoi][10] function to take a string and turn it into an integer. &nbsp;This value we store in the integer **int_choice**.
* 25: The beginning of the [switch-statement][11]&nbsp;which does the real work for us. &nbsp;It test the int_choice value you against predefined values (1-9 here). &nbsp;If the one of the values is equal, it executes the code found there before breaking from the switch-statement.
* 51: If a number besides 1-9 is entered the default will be true. &nbsp;Let's gripe at the user for selecting a bad number.

And that's it. &nbsp;You simply put the functions you want to be called in the appropriate values in the switch-statement. &nbsp;Because of the do-while loop, once a selection has been made and executed, the menu will be displayed again.

You can also make limit a selection to showing by doing something like the following,

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

 |

    bool connected_flag = false;
    	do
    	{
    		system("cls");
    		printf("FTDI Menu: ");
    		printf("1. Quick Connectn");
    		printf("2. Device Listn");
    		if (got_list == true) // Only display option if devices list.
    		{
    		printf("3. Connect Devicen");
    		}

    		printf("9. Main Menun");

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
    					connected_flag = connect_device(&amp;baud_rate);
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

 |

&nbsp;

Here, option "3. Connect Device" doesn't show until option "2. Device List" is run. &nbsp;On line 34 the connect_device() function sets the connected_flag variable to true if the function was successful. &nbsp;Then, after the break is hit and the menu is repainted the option "3. Connect Device" will show. &nbsp;Also, '3' will become a valid user selection.

**A Submenu**

One last note. &nbsp;If you want to make a sub-menu, you simply use the same code as above, just take the do-while loop out. &nbsp;This states you only want the sub-menu to run once, the return to the main menu.

[1]: http://en.wikipedia.org/wiki/Hercules_Graphics_Card
[2]: http://letsmakerobots.com/lpc1114-usb-serial-solution-rerolling-boot-uploader
[3]: http://letsmakerobots.com/files/userpics/u19048/300x260xGCCLogo.png.pagespeed.ic.YZjB3d_p5p.png
[4]: http://www.mingw.org/wiki/HOWTO_Install_the_MinGW_GCC_Compiler_Suite
[5]: http://www.sublimetext.com/2
[6]: http://letsmakerobots.com/content/lpc1114-setup-bare-metal-arm
[7]: http://letsmakerobots.com/files/userpics/u19048/426x218xCommand_line_menu.png.pagespeed.ic.56zs5r1auE.png
[8]: http://en.wikipedia.org/wiki/Do_while_loop
[9]: http://www.cplusplus.com/reference/cstdio/scanf/
[10]: http://www.cplusplus.com/reference/cstdlib/atoi/
[11]: http://www.tutorialspoint.com/cprogramming/switch_statement_in_c.htm
  </sys></stdint.h></stdbool.h></math.h></string.h></winbase.h></winnt.h></windef.h></windows.h></stdlib.h></stdarg.h></stdio.h>
  
[12]: <img src="https://github.com/Ladvien/ladvien.github.io/blob/master/images/200x210xSuper_Style_ASCII_by_buddhascii.png.pagespeed.ic.T8JsLoZeGa.png">
