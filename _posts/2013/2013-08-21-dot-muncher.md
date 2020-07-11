---
layout: post
title: Dot Muncher
categories: robots
excerpt:
tags: [robots]
color: "#152a55"
image:
  feature: Silas_Bot_63.JPG
  teaser: Silas_Bot_63.JPG
  thumb:
comments: true
---

Originally posted on [www.letsmakerobots.com](www.letsmakerobots.com)

I threw this little guy together for my son Silas because he wanted to play with dad's "Wobot."  There's not a lot to say about him, he's a hodgepodge of parts I had lying about:

*   HDPE Bought at the Dollar Store for $2 (I guess that's the Two Dollar store.)
*   3-6v 400 RPM Geared Mini Motors: $8
*   Two wheels from eBay: $2
*   4-40 bolts, nuts, and washers (local): $4
*   Arduino Uno: $9.85
*   Ardumoto Shield: $11
*   Bluetooth 4.0 Module: $9
*   4 x NiHM lying about: $0
*   1 x Free Sunday morning

Total: $36.85

The first iteration took maybe an hour.

But, after I tossed the little guy together there were a few adjustments.  I noticed right away I got this "Oh lord! Don't drop it!" feeling every time Silas picked him up.  Psychology being my profession, I sat on my couch and analyzed it :P

I want my son to spend time with me so I may teach him how to live.  I know males often need co-operative tasks to feel secure in their bonding.  Therefore, if I'm constantly upset my son is playing with the fruits of my interest he _will not_ share the interests with me.  It's a simple matter of reinforcement.  Silas comes into my lab; Silas gets reprimanded; therefore, the behavior of coming into my lab is punished (negative reinforcement) and thereby decreases.  This means, for Silas to share my interest, thereby allowing us to bond, I'd need to find a solution to my cognitive dissonance regarding him picking up the robot.

Like most things, I narrowed it down to money.  I would get tense because I knew the robot was fragile.  It had a mixture of 5 and 3.3v components, and it was still using breadboards and jumpers, **I was afraid he'd drop it, it'd break, and I'd lose money.**

I couldn't ask a three-year-old not to pick up a robot; tactual experience is primary for young males, it was an expression of his interest, something I wanted.  And I couldn't make the parts cost less.  This left me with only one option**: [robustness](http://en.wikipedia.org/wiki/Structural_robustness).  **

I vaguely remembered this was a key component of systems theory, but it was one I _very_ often ignored.  So, I did what someone who has never had a science would do, I added a lot of bolts.

**Video of the "Process":**

**Warning**: My son is worse than Matthew McConaughey about wearing shirts.  Hey, we try, boy's just proud of his belly.

<div class="flex-video">
<iframe width="560" height="315" src="https://www.youtube.com/embed/Qrwr_evhUgg" frameborder="0" allowfullscreen></iframe>
</div>

At the local hardware store I bought some 4-40 bolts and nuts, and started revamping the little bot.

![](/images/Silas_Bot.jpg)In the end, I really didn't do anything fancy, as apparent.  I drilled holes into the battery plastic-case, that aligned with holes in the robot base, and bolted it together.  I, for the first time, used the mounting holes in the Arduino Uno, bolting it to the base.  I then "designed" a hood (bonnet) for the little guy. from match HDPE, making sure to bolt it down as well.  Lastly, I sealed the motor-gears with electrical tape and put a few drops of oil in them.  I noticed this regarding geared mini-motors, they collect hair and _will_ strip out the gears.  

In the end, I did nothing a second grader would be proud of, but I did force myself to drop it from hip heigt five times to make sure I was over the "Oh Shiii-nobi Ninja!" feeling. In psychology we call that [systematic desensitization](http://en.wikipedia.org/wiki/Systematic_desensitization). Or something as equally important sounding.

![](/images/IMG_0075.jpg)

It collected so much hair the tires poped off.

Bleh.

![](/images/IMG_0048_2.jpg)I was careful not to wrap too much of the motor, since I had the thought it might decrease thermal exchange.
