---
layout: post
title: HMIS, R, SQL -- Work Challenge Four
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
# Creating Reusable Code

Writing report code which can be reused is critical to being an effective report specialist.  By now, hopefully, you see the power of SQL-R, especially around HMIS data.  But you may still feel slow.  Or have thoughts like, "If I pulled these data into Excel I could manually filter them in 1/10th the time." That's probably true.  But, after manually filtering dataset after dataset it becomes apparent finding a way to automate some tasks would save many hours in the long-run. Thus, writing an R scripts for routine work would save countless hours of monotony.

However, one problem remains, each task will usually have a _slight_ variation from the one before it.  This causes you to write 95% of the same code with a slight tweak for the current project.  And that doesn't save time at all.  In the programming world, the 95% code which is the same is known as [bolierplate code](https://en.wikipedia.org/wiki/Boilerplate_code).

Ok, that's the problem.  The solution? Functions.

A function is nothing more than a section of code you save into a variable for easy reuse.  

Defining a function looks like this:

{% highlight r %}
myNewFunction <- function(){
  # Code you want to run goes here.
}
{% endhighlight %}

Then, whenever you want to use this code it can be called like this:

{% highlight r %}
myNewFunction()
{% endhighlight %}

If you want to pass the function something to use:
{% highlight r %}

myNewFunction <- function(clientDf){
  clientDf$VeteranStatus
}
clientDf <- read.csv(clientCsvPath)
myNewFunction(clientDf)
{% endhighlight %}

And the coolest thing about functions is being able to `return` data.  This can be a tricky concept, but at its root it is simple.

If you want to pass the function something to use:
{% highlight r %}
myNewFunction <- function(clientDf){
  clientDf$VeteranStatus[clientDf$VeteranStatus == "1"]
  clientDf
}
clientDf <- read.csv(clientCsvPath)
veteranList <- myNewFunction(clientDf)
{% endhighlight %}

The key is to understand whatever is the last line in a function it becomes the result of the functions work. The result is then passed back out of the function, where it can be assigned to a new variable.  

You may notice, this is similar to a lot of code we have been using.  
{% highlight r %}
clientDf <- read.csv(clientCsvPath)
{% endhighlight %}
Let `read.csv`.  That's because `read.csv` is a function written by the makers of R, and included for our use.

This is exactly how R has become such a powerful tool.  Many smart people have written sets of functions, which are called libraries.  Feel the power of open-source.

## Data Needed

For this work challenge you will need:

1. Client.csv
2. Enrollment.csv
3. Project.csv
4. Exit.csv

## The Goal

Write functions which will do the following:

* Join `clientDf`, `enrollmentDf`, `projectDf`, `exitDf` and return the combined dataframe.
* Make the following columns readable:
  * Gender
  * VeteranStatus
  * DisablingCondition
  * RelationshipToHoH
  * ResidencePriorLengthOfStay
  * LOSUnderThreshold
  * PreviousStreetESSH
  * TimesHomelessPastThreeYears
  * MonthsHomelessPastThreeYears
  * Destination
* Get most recent HUD Assessment per PersonalID
* Filter to clients who are active in programs (except Night-by-Night and Street Outreach projects)
* Write a function to filter `enrollmentDf` based upon a user defined parameter.

***BONUS***
* Write a function which returns a list of Chronically Homeless individuals.

For the last function, here's an example,

{% highlight r %}
clientsWithDisablingCondition <- getSubpopulation(df, "DisablingCondition", "Yes")
{% endhighlight %}

The function you'd write would be `getSubpopulation()`.  The first parameter would be the dataframe the user is passing into your function. Second parameter is the column to look at.  The last is which response the user wants in the column to look in.


## The Resources
Below are the resources which should help for each step:

* R Programming A-Z -- Video 21 -- Functions in R
* [paste()](https://www.r-bloggers.com/paste-paste0-and-sprintf/)

