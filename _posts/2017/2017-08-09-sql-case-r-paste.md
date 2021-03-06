---
layout: post
title: SQL CASE and R Paste
desription: Using the SQL CASE WHEN statement, the R Paste function, and the R GSUB command on HMIS data.
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

![](/images/toothpaste-decision.svg)

In computer programming we call this computer decision making process [control flow](https://en.wikipedia.org/wiki/Control_flow).  But let's write some pseudocode for a little better understanding:

{% highlight bash %}
    If (Computer Likes Toothpaste 1) then buy Toothpaste 1
{% endhighlight %}

Pretty simple, right?  The only thing a computer can't do is decide if it likes Toothpaste 1 on its own.  We have to program it to do that.  

Well, this sentence makes sense if a computer is trying to decide to buy toothpaste or no toothpaste, but what if there are more than two toothpaste options?  We just create another if-then statement.

{% highlight bash %}
    If (Computer Likes Toothpaste 1 Best) then buy Toothpaste 1
    If (Computer Likes Toothpaste 2 Best) then buy Toothpaste 2
{% endhighlight %}

Because the computer makes decisions in order it read them, then if it buys Toothpaste 1 then it will not buy Toothpaste 2.  However, if he doesn't like Toothpaste 1 the best, then if he thinks Toothpaste 2 is the best he'll buy it.  Otherwise, he will not buy any toothpaste--which makes sense, computers don't have teeth.

This is almost everything we need to know about `if-then`, two more little catches.

First, what do we do if the computer doesn't like any of the Toothpaste and don't want him to just give up?  We need a way to say, "Look computer, if you don't like any toothpaste the best then go ask for help."

In programming this is known as `if-then-else` statements.  They are similar to `if-then` but with a contingency clause if something goes wrong.  

Let's take a look:

{% highlight bash %}
    if (Computer Likes Toothpaste 1 Best) then buy Toothpaste 1
    if (Computer Likes Toothpaste 2 Best) then buy Toothpaste 2
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
library(sqldf)
################### Data DO NOT CHANGE ###########################
peopleDf <- data.frame(PersonalID=c("ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7", "IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV", "LASDU89NRABVJWW779W4JGGAN90IQ5B2"), 
                       FirstName=c("Timmy", "Fela", "Sarah"),
                       LastName=c("Tesa", "Falla", "Kerrigan"),
                       DOB=c("2010-01-01", "1999-1-1", "1992-04-01"))
##################################################################

peopleDf1 <- sqldf("SELECT *, 
                  CASE WHEN DOB > '2000-1-1' THEN 'Yes' ELSE 'No' END As 'Millennial' 
                  FROM peopleDf")
{% endhighlight %}

Here is the output:

|PersonalID                       |FirstName |LastName |DOB        |Gender |Millennial |
|:--------------------------------|:---------|:--------|:----------|:------|:----------|
|ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7 |Timmy     |Tesa     |2010-01-01 |Male   |Yes        |
|IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV |Fela      |Falla    |1999-1-1   |Female |No         |
|LASDU89NRABVJWW779W4JGGAN90IQ5B2 |Sarah     |Kerrigan |1992-04-01 |Female |No         |

The SQL query, specifically the `CASE WHEN` statement created a column called `Millennial`, it then went through every person's date of birth, comparing it. When the query found a person who was born after 2000-01-01 it inserted a 'Yes' in the Millennial column.  If they were not born after 2000-01-01 then it set the `Millennial` column to 'No.'  Nifty, right?

Notice, the `ELSE` is required to get the 'No'.  Otherwise, the query would leave everyone else blank.

Here's a few more examples of using CASE WHEN for powerful results.

#### Using OR with CASE WHEN
{% highlight r %}
peopleDf2 <- sqldf("SELECT *, 
                  CASE WHEN DOB > '2000-1-1' OR FirstName = 'Sarah' THEN 'PersonIsCool' ELSE 'NotHip' END As 'Cool?' 
                  FROM peopleDf")
{% endhighlight %}

|PersonalID                       |FirstName |LastName |DOB        |Gender |Cool         |
|:--------------------------------|:---------|:--------|:----------|:------|:------------|
|ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7 |Timmy     |Tesa     |2010-01-01 |Male   |PersonIsCool |
|IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV |Fela      |Falla    |1999-1-1   |Female |NotHip       |
|LASDU89NRABVJWW779W4JGGAN90IQ5B2 |Sarah     |Kerrigan |1992-04-01 |Female |PersonIsCool |

#### Using AND with CASE WHEN
{% highlight r %}
peopleDf3 <- sqldf("SELECT *, 
                  CASE WHEN FirstName = 'Sarah' AND LastName = 'Kerrigan' THEN 'Yes' ELSE '' 
                  END As 'Queen of Blades' 
                  FROM peopleDf")
{% endhighlight %}

|PersonalID                       |FirstName |LastName |DOB        |Gender |Queen of Blades |
|:--------------------------------|:---------|:--------|:----------|:------|:---------------|
|ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7 |Timmy     |Tesa     |2010-01-01 |Male   |                |
|IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV |Fela      |Falla    |1999-1-1   |Female |                |
|LASDU89NRABVJWW779W4JGGAN90IQ5B2 |Sarah     |Kerrigan |1992-04-01 |Female |Yes             |

#### Using SUM with CASE WHEN
Using `CASE WHEN` in combination with `SUM` is a great way to get counts of different discrete data.  Below is an example of getting total counts of males and females within the peopleDf

{% highlight r %}
count1 <- sqldf("SELECT 
                  SUM(
                      CASE WHEN Gender = 'Female' THEN 1 ELSE 0 END
                    ) As 'NumberOfFemales',
                  SUM(
                      CASE WHEN Gender = 'Male' THEN 1 ELSE 0 END
                    ) As 'NumberOfMales'
                   FROM peopleDf")
{% endhighlight %}

| NumberOfFemales| NumberOfMales|
|---------------:|-------------:|
|               2|             1|

#### Using Multiple CASES
So far, we've only covered one `if-then` statement, but in our example with the toothpaste we could string them together.  The same can be done with `CASE WHEN`.


{% highlight r %}
peopleDf4 <- sqldf("SELECT *, CASE WHEN DOB >= '1980-01-01' AND DOB < '1990-01-01' THEN 'X'
                           WHEN DOB >= '1990-01-01' AND DOB < '2000-01-01' THEN 'Y'
                           WHEN DOB >= '2000-01-01' AND DOB < '2010-01-01' THEN 'Millennial'
                           WHEN DOB >= '2010-01-01' AND DOB < '2020-01-01' THEN 'NotYetDefined'
                           END As 'Generation'
                   FROM peopleDf")
{% endhighlight %}

|PersonalID                       |FirstName |LastName |DOB        |Gender |Generation    |
|:--------------------------------|:---------|:--------|:----------|:------|:-------------|
|ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7 |Timmy     |Tesa     |2010-01-01 |Male   |NotYetDefined |
|IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV |Fela      |Falla    |1999-1-1   |Female |Y             |
|LASDU89NRABVJWW779W4JGGAN90IQ5B2 |Sarah     |Kerrigan |1992-04-01 |Female |Y             |


## Paste
The `paste()` in R is meant for manipulating strings of text. You pass it strings as parameters and it returns one string containing all the strings passed into it.  Let's take a look.

{% highlight r %}
greeting <- paste("Hello how are you,", "Bob?")
{% endhighlight %}

After running this line the `greeting` variable contains the following string `Hello how are you, Bob?`.  This can be used by printing the contents of the variable using the `print()`

{% highlight r %}
print(greeting)
{% endhighlight %}

Side note, `print()` will actually print out anything you pass it to the console.  This can be useful when trying to debug code.

Back to our combined strings, notice whenever the greeting prints out there is a space inserted between 'you,' and 'Bob?', this is done automatically by paste.  It will insert a space between every string you pass it, unless you pass the additional parameter `sep`.  This parameter will take whatever you set it as and insert it between the two strings.

{% highlight r %}
greeting <- paste("Hello how are you,", "Bob?", sep = "!!")
print(greeting)
{% endhighlight %}

This time `print()` will display "Hello how are you,!!Bob?" in the console.  But, inserting exclamation marks is probably not what we want.  Most of the time we will not want paste to insert anything and we can tell it to insert nothing.

{% highlight r %}
greeting <- paste("Hello how are you,", "Bob?", sep = "")
print(greeting)
{% endhighlight %}

Print will spit out "Hello how are you,Bob?".  Notice, there is no longer any character between "you," and "Bob?".

Paste is a pretty straightforward function, the one last trick is knowing you can pass in multiple strings.

{% highlight r %}
greeting <- paste("Hello", " how are you,", " Bob?", sep = "")
print(greeting)
{% endhighlight %}

This will produce the string "Hello how are you, Bob?".  Notice the spaces were inserted manually so the end string is readable to humans.

## Dynamic SQL with Paste()

Prepare to have your mind blown.  One of the powers of the `paste()` is building a `sqldf` string.  Remember using SQLdf like this?

{% highlight r %}
library(sqldf)
################### Data DO NOT CHANGE ###########################
peopleDf <- data.frame(PersonalID=c("ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7", "IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV", "LASDU89NRABVJWW779W4JGGAN90IQ5B2"), 
                       FirstName=c("Timmy", "Fela", "Sarah"),
                       LastName=c("Tesa", "Falla", "Kerrigan"),
                       DOB=c("2010-01-01", "1999-1-1", "1992-04-01"))
##################################################################

peopleDf1 <- sqldf("SELECT * FROM peopleDf WHERE DOB > '2001-01-01'")

{% endhighlight %}

This creates the table

|PersonalID                       |FirstName |LastName |DOB        |
|:--------------------------------|:---------|:--------|:----------|
|ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7 |Timmy     |Tesa     |2010-01-01 |

This is a dataframe of everyone who was born after January 1st, 2001.  This method of filtering data works for a static date.  But let's say you wanted to easily change out the `2001-01-01` with other dates.  You _could_ replace the date with a different date, but when that date is in multiple SQL calls it can be easy to miss one.  A better way to do it is using the `paste()`.  And remember, everything inside the `sqldf()` parentheses is a string.

{% highlight r %}
targetDate <- "2001-01-01"
sqlString <- paste("SELECT * FROM peopleDf WHERE DOB > '", targetDate, "'", sep = "")
peopleDf5 <- sqldf(sqlString)
{% endhighlight %}

Ok, let's take this slow, there's a lot going on.  First, we create a variable called `targetDate` and assign it the string `2001-01-01`.  Next, we create a complex string using the `paste()` which looks a lot like a SQLdf string, but instead of hardcoding the date, we insert the `targetDate` variable.  This creates the following string:

{% highlight r %}
"SELECT * FROM peopleDf WHERE DOB > '2001-01-01'"
{% endhighlight %}

Which is then inserted into the variable `sqlString`, which is a string.  

Lastly, we pass the `sqlString` variable into the `sqldf()` which executes the fancy SQL query.  Awesome, right?

Now, if we want to look at those born after a different date, we simply change the `targetDate` variable and re-run the script.

{% highlight r %}
targetDate <- "1980-01-01"
sqlString <- paste("SELECT * FROM peopleDf WHERE DOB > '", targetDate, "'", sep = "")
peopleDf5 <- sqldf(sqlString)
{% endhighlight %}

### Sys.Date()


### GSUB