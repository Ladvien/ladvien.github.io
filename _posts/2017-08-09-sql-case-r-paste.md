---
layout: post
title: SQL CASE and R Paste
desription: Fourth work challenge in mixing R and SQL to derive information from HMIS data.
series: SQL-R
categories: HMIS
excerpt:
tags: [HMIS, R, SQL]
image:
comments: true
custom_css: 
custom_js: 
---
## SQL Case
The SQL `CASE` function is one of my favorite.  The command basically works like if-then command.  If you are familiar with if-then commands, then feel free to skip this next bit.

### If-Then
One of the reasons we have the amazing devices we do today is because a computer is capable of reasoning.  A computer can compare two things and decide which one it likes.

Now, this may sound simple, but it's actually a subtle miracle.  Anyone who has been stuck on the toothpaste isle trying to decide between the 45 kinds of toothpaste probably understands making decisions is difficult.  Of course, human decision making and computer decision making are not even on the same level.  Humans can make comparisons of all 45 products at once(sort of).  Computers, they have to make a decision between two objects, then, two objects, then two objects, so forth, until it has made it through all 45.  Fortunately, computers can make these decisions blazing fast.

![](https://ladvien.com/images/toothpaste-decision-1.png)

In computer programming we call this computer decision making process [control flow](https://en.wikipedia.org/wiki/Control_flow).  But let's write some pseudocode for a little better understanding:

{% highlight bash %}
    If (Computer Likes Toothpaste 1) then buy Toothpaste 1
{% endhighlight %}

Pretty simple, right?  The only thing a computer can't is decide if it likes Toothpaste #1 on its own.  We have to program it to do that.  

Well, this sentence makes sense if a computer is trying to decide to buy toothpaste or no toothpaste, but what if there are more than two toothpaste options?  We just create another if-then statement.

{% highlight bash %}
    If (Computer Likes Toothpaste 1 Best) then buy Toothpaste 1
    If (Computer Likes Toothpaste 2 Best) then buy Toothpaste 2
{% endhighlight %}

Because the computer makes decisions in order it read them, then if it buys Toothpaste #1 then it will not buy Toothpaste #2.  However, if he doesn't like Toothpaste #1 the best, then if he thinks Toothpaste #2 is the best he'll buy it.  Otherwise, he will not buy any toothpaste--which makes sense, computers don't have teeth.

This almost everything we need to know about `if-then`, two more little catches.

First, what do we do if the computer doesn't like any of the Toothpaste and don't want him to just give up?  We need a way to say, "Look computer, if decided you don't like any, then go ask for help."

In programming language this is known as `if-then-else` statements.  They are similar to `if-then` but with a contingency clause if something goes wrong.  

Let's take a look:

{% highlight bash %}
    if (Computer Likes Toothpaste #1 Best) then buy Toothpaste #1
    If (Computer Likes Toothpaste #2 Best) then buy Toothpaste #2
    else Go Ask a Computer Dentist what to buy
{% endhighlight %}

Ok, that's it.  Now let's apply it to SQL.

### SQL CASE WHEN
SQL applies if-then logic in several ways.  We've already looked at the `WHERE` statement, which basicaly works like an `if-then`.

{% highlight SQL %}
    SELECT * FROM data WHERE Name = 'Bob'
{% endhighlight %}

See how this could be written as
{% highlight SQL %}
    SELECT * FROM data IF Name = 'Bob'
{% endhighlight %}

But the most likely SQL statement used for `if-then-else` logic is the `CASE WHEN` statement.

Here's an example to be run in R.

{% highlight r %}
################### Data DO NOT CHANGE ###########################
peopleDf <- data.frame(PersonalID=c("ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7", "IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV", "LASDU89NRABVJWW779W4JGGAN90IQ5B2"), 
                       FirstName=c("Timmy", "Fela", "Sarah"),
                       LastName=c("Tesa", "Falla", "Kerrigan"),
                       DOB=c("2010-01-01", "1999-1-1", "1992-04-01"))
##################################################################

peopleDf <- sqldf("SELECT *, 
                  CASE WHEN DOB > '2000-1-1' THEN 'Yes' ELSE 'No' END As 'Millennial' 
                  FROM peopleDf")

{% endhighlight %}

Here is the output:

|PersonalID                       |FirstName |LastName |DOB        |Millennial |
|:--------------------------------|:---------|:--------|:----------|:----------|
|ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7 |Timmy     |Tesa     |2010-01-01 |Yes        |
|IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV |Fela      |Falla    |1999-1-1   |No         |
|LASDU89NRABVJWW779W4JGGAN90IQ5B2 |Sarah     |Kerrigan |1992-04-01 |No         |

The SQL query, specifically the `CASE WHEN` statement created a column called `Millennial`, it then went through every person's date of birth, comparing it. When the query found a person who was born after 2000-01-01 it inserted a 'Yes' in the Millennial column.  If they were not born after 2000-01-01 then it set the `Millennial` column to 'No.'  Nifty, right?

Notice, the `ELSE` is required to get the 'No'.  Otherwise, the query would leave everyone else blank.

Here's a few more examples of using CASE WHEN for powerful results.

#### Using OR with CASE WHEN
{% highlight r %}
peopleDf2 <- sqldf("SELECT *, 
                  CASE WHEN DOB > '2000-1-1' OR FirstName = 'Sarah' THEN 'PersonIsCool' ELSE 'NotHip' END As 'Cool?' 
                  FROM peopleDf")
{% endhighlight %}

|PersonalID                       |FirstName |LastName |DOB        |Cool?        |
|:--------------------------------|:---------|:--------|:----------|:------------|
|ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7 |Timmy     |Tesa     |2010-01-01 |PersonIsCool |
|IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV |Fela      |Falla    |1999-1-1   |NotHip       |
|LASDU89NRABVJWW779W4JGGAN90IQ5B2 |Sarah     |Kerrigan |1992-04-01 |PersonIsCool |

#### Using AND with CASE WHEN
{% highlight r %}
peopleDf3 <- sqldf("SELECT *, 
                  CASE WHEN FirstName = 'Sarah' AND LastName = 'Kerrigan' THEN 'Yes' ELSE '' 
                  END As 'Queen of Blades' 
                  FROM peopleDf")
{% endhighlight %}

|PersonalID                       |FirstName |LastName |DOB        |Queen of Blades |
|:--------------------------------|:---------|:--------|:----------|:---------------|
|ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7 |Timmy     |Tesa     |2010-01-01 |                |
|IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV |Fela      |Falla    |1999-1-1   |                |
|LASDU89NRABVJWW779W4JGGAN90IQ5B2 |Sarah     |Kerrigan |1992-04-01 |Yes             |