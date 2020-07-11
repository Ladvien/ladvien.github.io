---
layout: post
title: Comparing Values in R and SQL
categories: HMIS
excerpt: Comparing values in R and SQL, using HMIS data.
series: SQL-R
tags: [HMIS, R, SQL]
image: 
    feature: R_SQL.png
comments: true
custom_css:
custom_js: 
---

## Comparative Functions
Comparing two or more values is an extremely important concept when talking to computers.  In writing a report script, it is is essential.  Comparisons allow us to filter to values within a range, allowing us to provide a report of relevant information.

Take the following data:

{% highlight r %}
######################### Data ###################################
###################### DO NOT CHANGE #############################
peopleDf <- data.frame(PersonalID=c("ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7", "IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV", "LASDU89NRABVJWW779W4JGGAN90IQ5B2"), 
           FirstName=c("Timmy", "Fela", "Sarah"),
           LastName=c("Tesa", "Falla", "Kerrigan"),
           DOB=c("2010-01-01", "1999-1-1", "1992-04-01"))
##################################################################
##################################################################
{% endhighlight %}

If you run the above in R you should get a dataframe called `peopleDf` which looks like this:

|PersonalID                       |FirstName |LastName |DOB        |
|:--------------------------------|:---------|:--------|:----------|
|ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7 |Timmy     |Tesa     |2010-01-01 |
|IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV |Fela      |Falla    |1999-1-1   |
|LASDU89NRABVJWW779W4JGGAN90IQ5B2 |Sarah     |Kerrigan |1992-04-01 |

It's a simple table.  But let's say we wanted to get a list of everyone born before 2000-01-01.  Of course, we can easily see Timmy is the only person born after 2000. But if our table was thousands of records it wouldn't be possible to quickly assess.

Luckily, this is pretty straight forward in SQL-R.  We will use a `less than operator` (**<**).  You probably remember this sign from high-school while solving inequalities.  However, we will be using it as what's known as a [relational operator](https://en.wikipedia.org/wiki/Relational_operator).  

In short, it states, 

> Is x less than y

If `x is less than y` the computer is going to say the statement is true (or 1 in binary).  If it is not, then the computer will say it's false (or 0 in binary).  Believe it or not, this simple operation is why you have a device in your pocket which could calculate the internal mass of the sun.

For us, things are a little simpler.  We just want to know who was born before 2000.  Let's re-write the statement above with our problem:

> Is Sarah's DOB less than 2000-01-01

Well, what is Sarah's DOB? 1992-04-01.  Let's rewrite and assess (gah, this feels like high-school algebra again).

> Is 1992-04-01 less than 2000-01-01

Hmm.  This can get confusing for humans, but more importantly, confusing to computers.

In English, we'd probably state this as, 

> Did 1992-04-01 come before 2001-01-01?

Essentially, that's what we are doing.  Just know, the computer will translate all dates into a number.  This number is how many seconds transpired since 1970-01-01.

Why? On Thursday, January 1st 1970 the [Universal Coordinated Time](https://en.wikipedia.org/wiki/Coordinated_Universal_Time) (UTC) was established.  Think of it is when the world came together to standardize time.  Computer people figured, "Well, if we have to convert dates into a raw number for computers to understand it, it might as well be the number of seconds since UTC was established."

Ok, enough history lesson.  How is this relevant?

1. Computers convert dates into seconds since 1970-01-01.
2. Comparing dates is actually comparing numbers.

Taking our statement again, let's re-write it with the number of seconds since `1970-01-01`

> Is number of seconds between 1970-01-01 and 1992-04-01 less than number of seconds between 1970-01-01 and 2000-01-01

Which becomes:

> Is 702,086,400 less than 46,684,800 seconds

Aha, now this makes sense.  And the result is `true`.  We can now say, in computer speak: Sarah was born before `2000-01-01`.

### Why?  Really, dude.
In my world there is a saying: [RFTM](https://en.wikipedia.org/wiki/RTFM).  

It's hard to follow now days.  Everything moves quick and we don't have time to dig into the "Why."  But, like most things, if you want to be good, you must take the time to do so.

The reason we review how computers understand dates is it directly impacts how we write reports.  Do you remember the [date conversion trick](https://ladvien.com/sqldf-dates/) to get dates to work in SQL from R? This is because R holds dates as the number of seconds since 1970 and passes it as a string to SQL.  But, then SQL tries to convert the date from a date into seconds again, screwing everything up.

It pays to RFTM.

## Filtering Dataframes by Date
Back to the problem.  How do we write a script which provides a dataframe of people born before 2000-01-01?

The code is actually pretty simple,

{% highlight r %}
library(sqldf)
nonMillennialsDf <- sqldf("SELECT * FROM peopleDf WHERE DOB < '2000-01-01'")
{% endhighlight %}

This should provide a `nonMillennialsDf` dataframe, which contains:

|PersonalID                       |FirstName |LastName |DOB        |
|:--------------------------------|:---------|:--------|:----------|
|IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV |Fela      |Falla    |1999-1-1   |
|LASDU89NRABVJWW779W4JGGAN90IQ5B2 |Sarah     |Kerrigan |1992-04-01 |

And there we go, for all my nerdsplaining the code's pretty simple, right?  

Well, there are a few gotchas.  Notice the date we've written.  It has the following format `YYYY-MM-DD` and is surrounded by single quotes.  Any time you use dates in SQL they must be written in this format.

Another tricky part is trying to find if a date falls between two dates.  Let's take the `peopleDf` and write a query which provides everyone who was born between `1998-01-01` and `2005-01-01`

Here's the query.

{% highlight r %}
bornBetweenDf <- sqldf("SELECT * FROM peopleDf WHERE DOB > '1998-01-01' AND DOB < '2005-01-01'") 
{% endhighlight %}

This should result in a table with only Fela:

|PersonalID                       |FirstName |LastName |DOB      |
|:--------------------------------|:---------|:--------|:--------|
|IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV |Fela      |Falla    |1999-1-1 |

It is important to understand, the first comparison removed Sarah, as `1992-04-01` is less than `1998-01-01`.  Then, the second comparison got rid of Timmy as `2010-01-01` is greater than `2005-01-01`.

## Now()
There is one more critical command in writing robust date comparisons.  The `NOW()` function.  This function is different in R and SQL, but pretty much every programming language has a version of the function.

Essentially, the `NOW()` asks the computer what today's date is when the script runs.

In SQL-R it looks like this:
{% highlight r %}
nowDf <- sqldf("SELECT *, DATE('NOW') As 'TodaysDate' FROM peopleDf")
{% endhighlight %}

This should provide:

|PersonalID                       |FirstName |LastName |DOB        |TodaysDate |
|:--------------------------------|:---------|:--------|:----------|:----------|
|ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7 |Timmy     |Tesa     |2010-14-01 |2017-07-18 |
|IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV |Fela      |Falla    |1999-1-1   |2017-07-18 |
|LASDU89NRABVJWW779W4JGGAN90IQ5B2 |Sarah     |Kerrigan |1992-04-01 |2017-07-18 |

And it doesn't matter when this script is run, it will always insert today's date in the `TodaysDate` column.  Nifty, right?  Trust me, if you don't see the possibilities yet, give it time.  It'll grow into one of your favorite functions.

Well, we can't talk about the `NOW()` function without discussing the `DATE()` function I slipped in there.  What does it do?  

As we discussed earlier, the computer looks at dates as the number of seconds since `1970-01-01`.  When you use the `NOW()` function by itself then it will return the number of seconds--um, not something humans like to read.  The `DATE()` function says, "Take whatever is inside the parentheses and try to convert it into a human readable date."  _Voila!_ A human readable date.

## Age
Let's get fancy.  We can use the `NOW()` function and our `peopleDf` to calculate everyone's age.

{% highlight r %}
peopleWithAgeDf <- sqldf("SELECT *, (DATE('NOW') - DOB) As 'Age' FROM peopleDf")
{% endhighlight %}

This should provide:

|PersonalID                       |FirstName |LastName |DOB        | Age|
|:--------------------------------|:---------|:--------|:----------|---:|
|ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7 |Timmy     |Tesa     |2010-14-01 |   7|
|IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV |Fela      |Falla    |1999-1-1   |  18|
|LASDU89NRABVJWW779W4JGGAN90IQ5B2 |Sarah     |Kerrigan |1992-04-01 |  25|


Cool, right?  Now, it does not matter when this above code of line is run, it will calculate everyone's age correctly.

**One important note,** if the date and time are wrong on your computer this calculation will be incorrect.

The nerd-judo which can be done with dates in SQL-R is endless.  But this covers a lot of the basics.

If you've missed the code bits throughout this article, here it is all at once:

{% highlight r%}
######################### Data ###################################
###################### DO NOT CHANGE #############################
peopleDf <- data.frame(PersonalID=c("ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7", "IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV", "LASDU89NRABVJWW779W4JGGAN90IQ5B2"), 
           FirstName=c("Timmy", "Fela", "Sarah"),
           LastName=c("Tesa", "Falla", "Kerrigan"),
           DOB=c("2010-14-01", "1999-1-1", "1992-04-01"))
##################################################################
##################################################################
library(sqldf)
nonMillennialsDf <- sqldf("SELECT * FROM peopleDf WHERE DOB < '2000-01-01'")
bornBetweenDf <- sqldf("SELECT * FROM peopleDf WHERE DOB > '1998-01-01' AND DOB < '2005-01-01'") 
nowDf <- sqldf("SELECT *, DATE('NOW') As 'TodaysDate' FROM peopleDf")
peopleWithAgeDf <- sqldf("SELECT *, (DATE('NOW') - DOB) As 'Age' FROM peopleDf")
{% endhighlight %}