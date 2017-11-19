---
layout: post
title: In the Weeds -- Lessons Learned as an HMIS System Administrator
categories: robots
tags: []
color: "#152a55"
image:
  feature: 
  teaser: 
  thumb:
comments: true
---

<link href="https://ladvien.com/projects/d3/practice/c3-0.4.15/c3.css" rel="stylesheet">  
<script src="https://d3js.org/d3.v3.min.js"></script>
<script src="https://ladvien.com/projects/d3/practice/c3-0.4.15/c3.min.js"></script>
<script src="https://ladvien.com/projects/d3/tx-601/trends-tx-601.js"></script>

## Ignorance is Bliss

In June of 2015 I became a [Homeless Management Information System](https://www.hudexchange.info/programs/hmis/) Administrator.  Going into the job I had no idea what was to be done.  I'd been working as a homeless street-outreach specialist for MHMR of Tarrant County for several years before.  The reason I landed the job, I think, is I was tech savvy, something rare in the social service world, but more on that later.

I'd become tech savvy because working a street outreach specialist one sees a lot of bad.  _A lot_  It will leave scares in your psyche if you are not vigilant to guard against those bad scenes replaying in your head.  I found if I filled my head with something complex there was no room for the dissonance created by being helpless to aid the 17-year-old heroine addict and future mother under the unfinished bridge off of I-30.  So, I took up [robotics](https://ladvien.com/tags/#robots).  It worked well.

Anyway, I when I started as an HMIS System Administrator I was clueless.  Looking back, I'd wished there was someone who was around to teach me.  Most of the skills needed are esoteric, and few on-line resources exist.  Well, as I step away from the desk, I'm going to do my best to write down everything I learned for my replacement--of course, it'll be laden with opinion--but hopefully, it'll provide a spring-board into your new job.

Brand new HMIS System Administrator, this is for you, as you start your new job.  The best job in the world.

## Get In the Weeds
Hey, by now, you've been to a few meetings and you know a few things about the data.  A word of warning, don't let others tell you, "Hey, that's 'too in the weeds' for this conversation."  Bull.

Often, your boss or peer will be saying it with good intent.  They want to make sure the content of what your agency is providing to a partner agency or funder is digestable in one meeting, and often, the critique is fair.  But don't let it become the only rule you live by. The weeds are necessary for several reasons.

First, if you are never allowed to talk about the mechanics of your job then then you will not have the vocabulary, analogies, and metaphors worked out to talk about critical system issues when it is necessary to vet HMIS decisions with those outside your office.

Secondly, others will not be primed for a conversation about something they have _never_ heard about until it matters.

In short, getting into the weeds of how an HMIS works is needed for more reasons than there are to prevent going into them.

One thing I'll encourage you do shortly after you start.  Cold-call all the HMIS system administrators in your state.  Introduce yourself, ask if they would be willing to chat with you when needing to discuss HMIS stuff no one else will listen to.  I've found this to be the absolutely most critical piece of advice I can give.

This job is great.  But you'll have no friends.  No one will understand you.  And no one will want to talk about how HUD has changed the chronically homeless definition _yet_ again--except, other HMIS system admins.  When you first make contact with another HMIS Admin, after being in the job a year, it will be as if you've discovered a neighboring isle next to the one you've been on--and that isle has another human to talk to!

## Data Quality is Key

Three months into my job I realized we had to do something about our data quality.  We had two major cities and the county both complaining about how reports coming from our HMIS were not reliable.  One month they'd produce an "accurate" account of who was in a program the municipalities were funding, then, the next month they would be completely off.  (Of course, the municipalities knew they were off because the agencies funded were keeping a separate set of books--more on that later)

We had to do something.  To be honest--oh yah, and always be honest--we didn't have a clue what our system data quality was like.  There was data quality detection system in place to determine if it was good or bad.  

Luckily, our software vendor had an HMIS data error report which would list out HUD data errors of clients active in any program.  Without a better solution, I pulled this report for every program and aggregated the data errors.

<script src="https://ladvien.com/projects/d3/tx-601/data-errors-2016.js"></script>

<div id="data-errors-2016"></div>

No one will trust reports without good data
Show Tree Graph

## DTR 

## Find _Your_ Tools

R, SQL, Tablaeu

## Power of the Purse

ESG Funders
COC Funder

## Discourage Separate Sets of Book

Data Quality Goes Down

## Try to be HMIS Software Independent
You can only love something if you don't need it

## Departmental Checks and Balances

## Don't scrub data, ever, not even once -- don't do it... seriously

If you give a mouse a cookie

## Advocate for everyone to Create Reports

Taking care of the date = cook
Pulling reports for you = your cook chewing your food

## Get a Help Desk

## Automate Everything

## Give them What they Need Always, and What they Want, when Possible

## Understand How You're Funded

HUD funds you -- they are your boss, kinda', but your other boss if who provides match for those funds.

## Always Be Honest

## Eminence Based vs. Data Based Decision Making