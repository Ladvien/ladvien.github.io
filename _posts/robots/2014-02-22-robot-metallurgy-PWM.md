---
layout: article
title: Robot Metallurgy 101 -- PWM -- AVR Lesson Journal
categories: robots
excerpt:
tags: [robots]
image:
  feature: Simply-AVR-Infographic-1200x11022_0.jpg
  teaser: Simply-AVR-Infographic-1200x11022_0.jpg
  thumb:
comments: true
---

Originally posted on [www.letsmakerobots.com](www.letsmakerobots.com)

This is a continuation of my [Robot Metallurgy 101 Lesson Journal](http://letsmakerobots.com/node/39996).

After I was able to get my motors moving using the SN754410 I became a little obessessed with understanding AVR PWM architecture.  There are several tutorials that helped me a lot:

1.  Newbie Hack's ["Intro to PWM."](http://www.newbiehack.com/MicrocontrollerIntroToPWM.aspx)
2.  Newbie Hack's ["Control a Servo with PWM."](http://www.newbiehack.com/MicrocontrollerControlAHobbyServo.aspx)
3.  humanHardDrive's "[PWM](http://www.youtube.com/watch?v=ZhIRRyhfhLM)"
4.  maxEmbedded's "[AVR Timers -- PWM MODE](http://maxembedded.com/2012/01/07/avr-timers-pwm-mode-part-ii/)"

In the end, I ripped maxEmbedded code and got my PB3 LED working in about 10 minutes.  Then, I spent the next three evenings reading trying to figure out what maxEmbedded's code was doing.  

Really, it was the register and bit names that were tripping me up.  Each had names like, "TCCROA1" and "OCR0A", and so forth.  Each is an [initialism](http://en.wikipedia.org/wiki/Acronym).  This was a problem for me, I was soon lost in a jungle of intialisms, which represented abstract concepts, such as other intialisms.  I felt as if I were bumbling through a [George MacDonald](http://en.wikipedia.org/wiki/George_Macdonald) dissertation on an orc language:

<div class="flex-video">
<iframe width="560" height="315" src="https://www.youtube.com/embed/voWenZRJcD0?list=UUKodYd0Fj3TSHzXg7aOJYYQ" frameborder="0" allowfullscreen></iframe>
</div>


NOTE: Dear reader, I apologize if that video confused you more.  Again, this is a journal so to help me remember what I learn.  And I find adding a story to ridicules abstractions is necessary for me.

Alright, now that I had a little story in my head to handle the intialisms learning PWM on the AVR flowed a little easier.

Here is my reference list:

**1. TCCR = Timer/Counter Control Register.</span>**

On the ATtiny1634 there are 4 control registers.  One is 8-bit and the other is 16-bit.  Though, this journal will stick with the Arduino standard, meaning, I'll use my 16-bit as an 8-bit.  Here are the four Timer/Counter Control Register names:</span>

1.  TCCROA (8-bit)
2.  TCCROB (8-bit)
3.  TCCR1A (16-bit)
4.  TCCR1B (16-bit)

TCCROA (8-bit timer) and TCCROB (16-bit timer) control the PWM functions of pins.

*   TCCROA/B control pins PA5 and PA6.
*   TCCR1A/B control pins PC0 and PB3.

**2. COM = Compare Output Mode**

There are four bits per TCCR register that control the compare output of each pin.  This is where the magic happens.  If a pin is setup in compare output mode, it will only go high when the counter is equal to or higher than a number you provide.  For instance,

* **Is timer greater than 100? Then go high.**

This is the essence of PWM.  You provide a number, in our case a number between 0-255 since it is an 8-bit counter, and if the timer is equal to or greater than your number, the pin will be HIGH.  Then, the timer will continue to count up and will reset to 0 after 255 is reached.  Mind you, the comparison is made every tick of the counter, so when it resets to 0 the comparison will be made and the pin will go LOW ago.  _Voila!_

There are four COM bits in each TCCR register, two control the output of one pin.

**Found in TCCR0A:**

1.  COM0A0 and COM0A0 control pin PC0.
2.  COM0B0 and COM0B0 control pin PA5.

**Found in TCCR1A:**

1.  COM1A0 and COM1A1 control pin PB3.
2.  COM1B0 and COM1B1 control pin PA6.

Now, switching these bits can create many different types of output.  But I stuck with Arduino standard.

![](/images/FAST_PWM_8BIT_COM0A1.png)

**3. WGM = Wave Form Generation (for 8-bit)**

There are 3 bits that control the type of PWM we end up with.  There are all sorts of wave-forms, but the main three are:

1.  Phase Correct
2.  CTC
3.  Fast PWM

([Here](http://arduino.cc/en/Tutorial/SecretsOfArduinoPWM#.Uwjeo_ldV8E) is an Arduino article that explains them a bit.)

The one I'll invoke is Fast PWM,

![](/images/8_Bit_PWM_WGM.png)

We select this by setting WGM00 and WGM01 bits.

**4. How to set the TCCR registers.**

So, setting things up, the code will look something like this,</span>

CODE!

I left the assignment of the TCCR registers in a binary format.  This was just easier for me, but you could as easily use bitwise operations, e.g.,

*    </span>TCCR1A |= (1<<COM1A1)|(1<<WGM01)</span>

You notice we set the COM0A1 or COM1A1 bits, but later I'll change this so they are not set at initialization.  I found if you connect the pins to the timers at the beginning, then they'll constantly have a nominal voltage on them.  This is made clearer if you have an LED on the pin.  Therefore, unless you set the COM0A1 and COM1A1 bits low then the LED will never fully turn off.</span>

Also, we have to set the data direction registers for the PWM pins to outputs.

Now, that the initialization is done, let's look at the code I used to demonstrate PWM on the ATtiny1634.

CODE!

You'll notice this is a modified "Fade" sketch from the Arduino world.  



The above code provided this output,

<div class="flex-video">
<iframe width="560" height="315" src="https://www.youtube.com/embed/6dTCbc8Pd1Q?list=UUKodYd0Fj3TSHzXg7aOJYYQ" frameborder="0" allowfullscreen></iframe>




How the magic happens in AVR is around the output comparison registers,</span>

1.  OCR0A -- controls PC0
2.  OCR0B -- controls PA5
3.  OCR1A -- controls PB3
4.  OCR1B -- controls PA6

Basically, the OCR registers flip the pin HIGH or LOW (as setup by the TCCR) based upon the number you assign to it.  If you assign OCR0A a value you of 144, it'll be LOW (0v) for 144 clock cycles (TCNT) and HIGH (5v) for 111 clock cycles.  This gives us our PWM.  Booyah!

*   OCROA = 127;

This sets PC0 to approximately 2.5v.  (127/255bit * 5v = ~2.5v)

*   OCR1A = 255;

This sets PB3 to 5v. (255/255bit * 5v = 5v)

Ok, here's the tricky one,

*   OCR0A = 0;

This should set PC0 to 0v, but that's not the case.  When we set the COM registers (COM0A1, etc.) there are internal pull-up resistors connected to the corsponding pin.  This results in a constant nominal voltage unless the COM register is set low again.

This can be done using the XOR operator on the TCCR register,

*   TCCRO ^= (1<<COM0A0)

This should set the PC0 pin to 0v.

It's really that simple...well, unless you want to mess with the type of PWM you are creating.  Ugh.</span>

**5. ATtiny1634 analogWrite.h**

After I figured out how to use PWM on the ATtiny1634, I started thinking how nice it would be to re-create the Arduino library for it.



Being able to write,



*   analogWrite(pin, strength)

had a lot of appeal to me.

I played with it a bit and ended up with the following,

CODE!

A synopsis of the library,

*   Lines 1-2 and 90 make sure the library is only included once.
*   Lines 13-16 define the ATtiny1634 pins.
*   18-28 setup the TCCR registers (notice, the pins start out off to prevent nominal voltage).
*   41-42 makes sure our PWM value is in range.
*   46-85 control the PWM on each pin, with an else statement to gives us a true zero voltage in the case a PWM value of 0 is passed to the function.

I saved this as **1634analogWrite.h** and then wrote a sketch to use

CODE!

Ok.  I'll revisit this probably with a complete H-Bridge control library.

<span style="text-decoration: underline;">**As always, please feel free to correct my f'ups.**</span>  **:)**
