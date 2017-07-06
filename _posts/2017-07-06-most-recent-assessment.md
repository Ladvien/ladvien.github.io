---
layout: post
title: Filter to Most Recent HUD Assessment
categories: HMIS
excerpt: Finding the most recent HUD Assessment by filtering dataframe by date.
tags: [ETO, HMIS, R, SQL]
image: 
    feature: R_SQL.png
comments: true
custom_css:
custom_js: 
---

## Enrolmment.csv
Many of the CSVs in the HMIS CSV may contain multiple rows per client.  This can make it difficult when working with HMIS data, as it appears to the non-data person there are duplicates within your data.  

Let's look at some dataframes:

**enrollmentDf**

ProjectEntryID | PersonalID | FirstName | EntryDate
---------|----------|----------|---------
 L0TDCLTDEARVHNIQ4F9EDDKXJ764Z65Q | **ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7** | Bob | 10/17/2016 
 169ACC89JY5SX0U87U7HQ28PMMHNJEXQ | IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV | Jane | 05/05/2015
 XB52BYOGJ1YDFESNZVNGDGA58ITDML0A | **ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7** |Bob| 01/01/2013

 Notice how Bob has two records?  One on 10/17/2016 and 01/01/2013.  This represents two HUD Entry Assessments completed on Bob.  These HUD Entry Assessments could represent two stays in the _same_ program, or one stay in two programs.

 Regardless, whenever you go to join this dataframe with a another dataframe, like the Client.csv, it will cause the resulting dataframe to have two rows representing both of Bob's enrollments.

 Let me walk us through joining the above dataframe with another dataframe.

We are going to join the enrollmentDf (above) with this clientDf

**enrollmentDf**

ProjectEntryID | PersonalID | FirstName | EntryDate
---------|----------|----------|---------
 L0TDCLTDEARVHNIQ4F9EDDKXJ764Z65Q | **ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7** | Bob | 10/17/2016 
 169ACC89JY5SX0U87U7HQ28PMMHNJEXQ | IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV | Jane | 05/05/2015
 XB52BYOGJ1YDFESNZVNGDGA58ITDML0A | **ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7** |Bob| 01/01/2013

**clientDf**

| PersonalID | FirstName | LastName
----------|----------|---------
ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7 | Bob | Beber
IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV | Jane | Goodall

In R, we can join these two dataframes with the following.

Please copy the code below to R and execute.

{% highlight r%}

####### BEGIN LOADING DATA FRAMES ###############
enrollmentDf = data.frame(ProjectEntryID=c("L0TDCLTDEARVHNIQ4F9EDDKXJ764Z65Q", "169ACC89JY5SX0U87U7HQ28PMMHNJEXQ", "XB52BYOGJ1YDFESNZVNGDGA58ITDML0A"), 
               PersonalID=c("ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7", "IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV", "ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7"), 
               FirstName=c("Bob","Jane", "Bob"), 
               EntryDate=c("10/17/2016", "05/05/2015", "01/01/2013"))

clientDf = data.frame(PersonalID=c("ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7", "IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV"), 
                      FirstName=c("Bob","Jane"),
                      LastName=c("Beber", "Goodall"))
####### ENDS LOADING DATA FRAMES ###############

# Load the SQLdf package (note, it must be installed first. See install.packages())
library(sqldf)

# Join the two dataframes.
clientAndEnrollmentDf <- sqldf("SELECT * 
                               FROM clientDf 
                               LEFT JOIN enrollmentDf 
                               ON clientDf.PersonalID=enrollmentDf.PersonalID")

{% endhighlight %}


***Important Sidenote***

If you ever see the following error:

`In field_types[] <- field_types[names(data)] :
  number of items to replace is not a multiple of replacement length`

It's a problem with going back-and-forth between R and SQL.  To fix it, use the following code on the dataframe you are trying to work with before executing the line of code causing the error

{% highlight r %}
dfCausingProblem <- subset(dfCausingProblem)
{% endhighlight %}

Ok, back to work.

After executing the code, you should end up with a table like this.  Not too shabby.  

|PersonalID |FirstName |LastName |ProjectEntryID|PersonalID|FirstName |EntryDate  |
|:--------------------------------|:---------|:--------|:--------------------------------|:--------------------------------|:---------|:----------|
|ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7 |Bob       |Beber    |L0TDCLTDEARVHNIQ4F9EDDKXJ764Z65Q |ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7 |Bob       |10/17/2016 |
|ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7 |Bob       |Beber    |XB52BYOGJ1YDFESNZVNGDGA58ITDML0A |ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7 |Bob       |01/01/2013 |
|IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV |Jane      |Goodall  |169ACC89JY5SX0U87U7HQ28PMMHNJEXQ |IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV |Jane      |05/05/2015 |

However, notice there are still rows for Bob?  These aren't _technically_ duplicates.  A duplicate is when there are two rows where items in every column are exactly the same.  But in the case of the dataframe above, notice how the **ProjectEntryID** and **EntryDate** columns for Bob's records are different?  

As stated before, this is carried forth from Bob having two HUD Entry Assessments.  But to the people whom we are going to present these data, it looks like duplicates.  This is a problem because it will be seen as sloppy work (but remember, it's not.  It's merely a technical artefact).

Who cares! How do we get rid of it?

First, we have to make a decision among three options.  First, we can get _only_ the most HUD Entry Assessment per client, only the the first HUD Entry Assessment ever taken per client, or leave it as it is.  

The last option is out, so it's a choice between most recent and the oldest one.  In our world, homelessness usually gets worse and HUD wants us to be helping those who are the most vulnerable first, so the most recent is probably going to give us the best picture how vulnerable a client is right now.

Alright, how do we get the most recent HUD Assessment?

In SQL there is a function called **MAX()**.  It will take the most recent of a record.  Let's look at how to use it, then we can discuss it.

For the following code to work, make sure all code above has been executed in R.

{% highlight r %}
clientAndEnrollmentDf2 <- sqldf("SELECT *, MAX(EntryDate) FROM clientAndEnrollmentDf")
{% endhighlight %}

This should provide you with the following table:

|PersonalID |FirstName |LastName |ProjectEntryID|PersonalID.1|FirstName.1 |EntryDate  |MAX(EntryDate) |
|:--------------------------------|:---------|:--------|:--------------------------------|:--------------------------------|:-----------|:----------|:--------------|
|ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7 |Bob       |Beber    |L0TDCLTDEARVHNIQ4F9EDDKXJ764Z65Q |ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7 |Bob         |10/17/2016 |10/17/2016     |

Wait! What happened to Jane!?  Well, the MAX() took the row with the greatest EntryDate, which is 10/17/2016.  Unfortunately, Jane's record wasn't the most recent, so her record was removed.

Well, that's not going to work.  But we're close.  If only we had a way to take the MAX(EntryDate) per client.

We do.  SQL has another command called GROUP BY, which allows us to tell SQL to apply another command by a group of records.

Again, let's use it and then dissect it.

Copy this to R and execute it.

{% highlight r %}
clientAndEnrollmentDf3 <- sqldf("SELECT *, MAX(EntryDate) FROM clientAndEnrollmentDf GROUP BY PersonalID")
{% endhighlight %}

You should end up with a table like this:

|PersonalID                       |FirstName |LastName |ProjectEntryID                   |PersonalID.1                     |FirstName.1 |EntryDate  |MAX(EntryDate) |
|:--------------------------------|:---------|:--------|:--------------------------------|:--------------------------------|:-----------|:----------|:--------------|
|IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV |Jane      |Goodall  |169ACC89JY5SX0U87U7HQ28PMMHNJEXQ |IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV |Jane        |05/05/2015 |05/05/2015     |
|ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7 |Bob       |Beber    |L0TDCLTDEARVHNIQ4F9EDDKXJ764Z65Q |ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7 |Bob         |10/17/2016 |10/17/2016     |

Aha! That's it!

What the GROUP BY did was say, "Ok, SQL, create a group of data where the rows PersonalID are the same.  Now, for each group, take the row with the greatest EntryDate."

This gives exactly what we want.  A single row per participant.


