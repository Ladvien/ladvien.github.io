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

When I started as an HMIS System Administrator I was clueless.  Looking back, I'd wished there was someone who was around to teach me.  Most of the skills needed are esoteric and few on-line resources exist.

Well, as I step away from the desk, I'm going to do my best to write down everything I learned--of course, it'll be laden with opinion--but hopefully, it'll provide the missing manual I sought.

Brand new HMIS System Administrator, this is for you, as you start your new job.  The best job in the world.

## Get In the Weeds
Hey, by now, you've been to a few meetings and you know a few things about the data.  A word of warning, don't let others tell you, "Hey, that's too in the weeds for this conversation."

Bull.

Often, your boss or peer will be saying it with good intent.  They want to make sure your content is digestable, and often, the critique is fair.  But don't let it become the only rule you live by. The weeds are necessary for several reasons.  And if metaphors aren't your thing, we are talking about the details of data.

First, if you are never allowed to talk about the mechanics of the job, then you will not have the vocabulary, analogies, and metaphors ready to talk about critical system issues when it is necessary.  Why would it be necessarty?  Let's say you needed to vet a critical HMIS decision with the goverening board.

Secondly, others will not be primed for a conversation about something they have _never_ heard about until it matters. In short, getting into the weeds of how an HMIS works is needed for more reasons than there are to prevent going into them.

Regarding building your ability to communicate complex HMIS activities concisely, I'd encourage you to cold-call some HMIS system administrators in your state.  Introduce yourself, ask if they would be willing to chat with you when needing to discuss HMIS stuff no one else will listen to.  I've found this to be the absolutely critical to explaining HMIS problems to a COC who doesn't care or understand.

Also, this job is great.  But you'll have no friends (no one told you?).  No one will understand you.  And no one will want to talk about how HUD has changed the chronically homeless definition yet again--_except_, other HMIS system admins.  When I first made contact with another HMIS Admin, after being in the job a year, it was like I'd discovered a neighboring isle next to the one I was stranded--and that isle had other humans who understood my language!

## Data Quality is Key

Three months into my job I realized we had to do something about data quality.  We had two cities and a county both complaining the reports coming from HMIS were not reliable.  One month they'd produce an "accurate" account of who was in a program, then, the next month they would be completely off.  (Of course, the municipalities knew they were off because the agencies funded were keeping a separate set of books--more on that later)

We had to do something.  To be honest--oh yah, and always be honest--we didn't have a clue what our data quality was like.  There was no data quality detection system in place to determine if it was good or bad. Luckily, our software vendor had an HMIS data error report which would list out HUD data errors of participants active in any program.  Without a better solution, I pulled this report for every program and aggregated the data errors.

<div id="data-errors-2016"></div>
<script src="https://ladvien.com/projects/d3/tx-601/data-errors-2016.js"></script>

Well, crap.  They had right to complain.

Above is a graph of 2016's data errors, in 2015 it started at approximately 100,000 errors.  Without the wisdom I've now, I used the raw numbers to present to our COC Governing board to show we were addressing the municipalities concerns.

But this is only half the story.  What if only one agency was causing all these data errors?

To address this problem, we used a tree graph.

<script src="//d3plus.org/js/d3.js"></script>
<script src="//d3plus.org/js/d3plus.js"></script>
<div id="viz"></div>

<script>
d3.csv("https://ladvien.com/projects/d3/data/data-errors-tree-map.csv", function(data) {

  data.forEach(function(d) {
    d3.keys(d).forEach(function(k){
      if(k != "Agency"){
        d[k] = +d[k]
      }
    })
  });
  // instantiate d3plus
  var visualization = d3plus.viz()
    .container("#viz")  // container DIV to hold the visualization
    .data(data)  // data to use with the visualization
    .type("tree_map")   // visualization type
    .id("Agency")         // key for which our data is unique on
    .size("DataErrors")      // sizing of blocks
    .height(500)
    .color({
      "range": ["#69d2e7","#a7dbd8","#e0e4cc","#f38630","#fa6900" , "#fe4365","#fc9d9a","#f9cdad","#c8c8a9","#83af9b" , "#ecd078","#d95b43","#c02942","#542437","#53777a","#556270","#4ecdc4","#c7f464","#ff6b6b","#c44d58"],
      "value": "DataErrors"
    })
    .draw()
});
</script>

Tree graphs are _great_ to show how certain agencies are causing a disproportionate amount of data errors.  We presented the graph much as shown here, without Agency names, at first.  But eventually, the Board asked we provide names along with the graph.

These graphs provided the political insurance needed to to approach the partner agencies on the behalf of the board, which is much safer than enduring the resentment engendered otherwise.

When approaching the troubled agency, it helps to have a plan.  In TX-601 we called these "Data Quality Action Plans" and consisted a list of all the errors needing to be repaired, and a [SMART goal](https://en.wikipedia.org/wiki/SMART_criteria).

By focusing on the agency which has the most data errors it is like you are on a ship with many holes, possibly sinking.  Before bailing water, or patching small holes, you patch the biggest, as it'll have the greatest impact on the entire ship
![](https://ladvien.com/images/boat-with-holes.png)

## Eminence vs. Data Based Decision Making

## Always Be Honest

## Understand How You're Funded

HUD funds you -- they are your boss, kinda', but your other boss if who provides match for those funds.

## Power of the Purse

ESG Funders
COC Funder

## DTR

Define the relationship.  This may have already be done for you, but if it hasn't, please don't underestimate how powerful an agency's perception of your responsibilities.

For example, within three months of starting I received a call from shelter intake staff.  He was upset because he wasn't able to scan-in clients.  He "didn't have time to troubleshoot" and suggested I drive down, which I did.  Shortly after I arrived I realized the problem was his computer was shorting--sparks were clear.  I let him know he would need to contact his IT department to get it addressed, to which he stated, "I thought you were the IT department?" After explaining I wasn't, he still insisted I fixed it since it kept him from recording HMIS data and "that was my job."

Take time, and do it early, to explain to what your role is.  For me I listed bullets of what were my responsibilities and what were not:

HMIS System Administrator Responsibilities

* Data Quality
* Timely enabling / disabling user permissions
* Assessing software defects
* Providing technical assistance
* Conducting trainings on how to use the software
* Facilitating oversight and guidance committees
* Communicating with end-users when system issues impact their work
* Technical assistance on producing CAPER
* Technical assistance on producing APR
* Technical assistance on running standard reports
* Federal system reports:
  * System Performance Measures
  * Annual Homelessness Assessment Report
  * Point-in-Time (PIT)
  * Housing Inventory Count (HIC)
  * HUD Data Quality Report (HDQ)
  * Coordinated Entry Reports
* Supporting ESG Participating Jurisdictions
* Supporting COC Lead

These responsibilities I would continually message.  It is important they are understood for both sides.  End-users need to know your are there to support their efforts.  _But_, it is also important they understand _how_ you can and may help.

Along side this list of how we could help, I had a list of how we could not help (at least, not guaranteed assistance).

_*NOT*_ HMIS System Administrator Responsibilities
* Fixing equipment
* Generating CAPER or APR on an agency's behalf
* Fixing data errors created by an end-user(s)
* Generating standard reports for an agency
* Meeting (all) customization requests
* Generating data or reports for domestic violence providers (as they are prohibited from participating in the HMIS)
* Fulfilling custom report requests in an unrealistic time frame (we would advertise a five business day notice).
* Providing routine trainings for less than four end-users.  Or, short notice ad hoc trainings.
* Adjusting system reports to bolster performance (these request are insidious)

## Find **_Your_** Tools

R, SQL, Tablaeu

## Automate Everything

## Discourage Separate Sets of Book

Data Quality Goes Down

## Try to be HMIS Software Independent

My wife is fond of saying, "I love you, but I don't need you."  It took me awhile to get over being butt-hurt by this statement.  But at it's root is a profound nuance of a good relationship. In good relationships, you are aren't needed--but you are liked.

This is how it should be with software.  It's hard.  But where possible, don't depend on your HMIS software solution to do your job.  Instead, use the software because your continuum-of-care likes using them.

This feat is harder than it appears.  It means you need to be able to create your own System Performance Report, CAPER, or APR.  That sounds hard, and it is, but not impossible.  And I'm not suggesting you need to write all these reports, but you need to be _able_ to write these reports.

For example, if you're attempting to pull the Annual Homelessness Assessment Report and several days before you submit you notice shelter bed counts are extremely off.  Then, it will be beneficial for you to be able to write a report which can double check the software vendor's number--and if needed, provide the correct numbers.  In this way, you are not dependent on the software company to provide you a fix before submission.

There are countless benefits to being in this kind of relationship.  If you have the skill to dig into the HMIS data sets to find the problem, then you probably have some valuable debugging information to provide back to the software vendor.  This information will allow them to roll out a fix even faster.  It's just good all the way around.

_Also_, and I'd argue most importantly, you aren't trapped in an abusive relationship with your software.  Fearing your current software vendor will never extract the data from your HMIS in such a way it could be migrated to another vendor.  Of course not! If necessary, you have the skill to build your own data warehouse and migrate the data, possibly without any degradation.

A relationship where you need the other person is not one built on love.

## Departmental Checks and Balances

## Don't scrub data, ever, not even once -- don't do it... seriously

If you give a mouse a cookie

## Advocate for everyone to Create Reports

Taking care of the date = cook
Pulling reports for you = your cook chewing your food

## Get a Help Desk

If you are not already, you will become overcome with requests.  Everyone will be emailing you their wants like you're Santa Clause in November.  This is dangerous.  Your end-users only see their one request and they don't understand why it is taking you more than an hour to fulfill it.

Please tell me you have staff?  HUD recommends having one FTE for every 75 end-users.  For us, this meant we should have had 3.73 FTEs, but we operated with 3.  However, your staff will do little good if everyone is sending their requests directly to you.

Sure, you'll try forwarding the email to Joe, but then Joe gets sick and the request sits in his inbox for several days.

Get a Help Desk.

For us, we had next to no-budget for a help desk, so I spun up a server and used Drupal's ticket module to create a help desk.  This allowed us to implement a help desk for about $12.50.  Not too shabby.  

Getting the end-users to use the help desk was painful.  Trying to convince them it was in their best interest was not easy.  But, eventually, messaging our ability to collaborate on ticket responses won through.  They start using ticket system.

There were many other advantages of using a help desk.  As a manager, I was able to review my staff's responses to request.  If I were a better manager (or if I had more time, hard to tell which it was) I could have used this information to coach my staff on being customer service focused.  Making sure we are providing friendly and relevant responses to all requests.

Another advantage is having a log of all requests made to our department in a searchable fashion.  This would allow us to review statements we were being unresponsive with ticket links containing time stamps.  I'd like to tell you being prepared to defend your department is unnecessary, but sadly, that's not true.

## Get Used to Bus Treads

Software is organized crime, and those who support it, wild villains.  At least, this is the perception of everyone of your users.  Any time something goes wrong the software and support are to blame.  This will often put you in a tough position with funders.

For example, when an agency is fails to submit their CAPER in a timely manner and the funder is attempting to hold the agency accountable, one of the natural shirking strategies is to blame software and support.

Unfortunately, this conversation between the funder and funded you usually are not privy to.  You have no opportunity to cry "bull."  It's not until the funder contacts you stating the agency's CAPER is late because of problems with software and support.  At this point, no amount of empty excuses will defend you and the team.  You've failed.  I know this to be true, because I've failed many times.

I've found there are two key strategies to avoid this problem.

First, be proactive.  When you know a CAPER, RHY, SSVF, PATH, or APR is due for an agency, send the program manager _one_ simple email.

>"Good afternoon Ms. Program Manager,
>
>I know your Report is due pretty soon, I just wanted to check in and see how our team might assist you in being successful.
>
>Sincerely,
>
>--HMIS System Administrator"

Keep it short, you'll be writing a lot of them.

This let's the program manager know you're there to assist.  And you are aware the report is due.

**_Do not_** CC the funder. That's silly.  I've honestly found the aggressive nature of CC'ing everyone and their dog a huge detractor of good working relationships.  There's a better way--show them.

However, do archive your sent emails so you can easily access offers to assist.

Secondly, record Everything. Find a way to record every interaction with your partners.  If you're following the advice about a Help Desk, then great.  But make sure every email thread which is a request for help gets moved into the Help Desk.

Also, if you are meeting with partners about issues, make sure to recommend they write the request down using the Help Desk, that way your staff could start working on it right away.  (Or if you're like me and your auditory memory is non-existent, you'll actually get it done.)

Between these two things, when a funder comes asking you, "Do you know why Shelter of Hope hasn't been able to generate the CAPER?" You may quickly say, "I'm not sure.  I've sent an offer to assist September 1st and I've looked through our Help Desk, there are no requests for help from Shelter of Hope."  This usually helps show software or support were not the determining reason the report wasn't submitted in time.

One word of warning.  It took me two years to figure out not to blame my end-users for this behavior.  They are dealing with cramped work spaces, angry individuals, emergency responses, suicidal clients, bed-bugs, oh! And pay on par with a McDonald's employee!  Don't be upset with the end-users--they are good souls, just not data souls.

## Need Always; Wants, When Possible







