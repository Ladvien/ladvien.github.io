---
layout: post
title: Preamble to Mixing R and SQL
series: SQL-R
desription: Information why mixing R and SQL is powerful.
categories: HMIS
excerpt:
tags: [HMIS, R, SQL]
image:
comments: true
custom_css: 
custom_js: 
---

# The R and SQL Way

Below is my attempt to describe the method I use to get at HMIS data.  In short, I'm mixing two powerful data languages to get answers from a data set quickly.
<!-- more -->
## What is SQL?

SQL stands for Structured Query Language.  Which can be translated as, "Asking a question a computer could understand." This computer language was designed to get data off a remote [relational database](https://en.wikipedia.org/wiki/Relational_database).

A sample of what SQL looks like:

{% highlight sql %}

SELECT Data FROM DataSet WHERE Data='BlueEyes'

{% endhighlight %}

SQL Pros:

* Easy to understand
* Can be learned quickly
* Powerful in merging data sets

SQL Cons:
* No advanced functions
* Does not allow for additional features to be added by users

[Would you like to know more?](https://en.wikipedia.org/wiki/SQL)

## What is R?

R is a programming language for super nerds.  Often, it is used by those working in:

* Bio-statistic (genetic sequencing)
* High-level economics
* Big-data (think all data collected by Facebook)
* Machine learning

It is _extremely_ fast computationally.  The people who designed it wanted something which could crunch big data sets, on their computer, in a matter of minutes.

One of the neatest parts of R is it allows for user written plugins.  Want to translate a data set of ZIP codes into their corresponding GPS coordinateds.  Their's a plugin for that!  And did I mention it's all free!

[Would you like to know more?](https://en.wikipedia.org/wiki/R_(programming_language))

## Mix R _and_ SQL? But why...

Think of our approach to data as Spanglish.  We are going to take two major programming languages to get the best of both.  When we don't have the exact word to describe something, we will switch to a different language and use its vocabulary.

R is a powerful tool, but often, the [syntax](https://en.wikipedia.org/wiki/Syntax_(programming_languages)) is boggish.  It is hard to read and figure out what’s going on.  SQL on the other hand, it’s pretty simple.  And humans have an easier time reading it.

Personally, I'm looking to solve problems as quickly as possible and I’ve found by mixing the two I get to solutions quick.  If I'm having a hard time getting Google to tell me how to do something in SQL, I'll switch and see if Google know's how to do it in R.  Thus, getting to what I need do much quicker. And let's not fool ourselves--learning a programming language is learning how to Google well.

A second reason to mix SQL is about respect and marketability.  R seems to be gaining ground in a lot of data sciences, and seems to be the tool when it comes to economics and statistics, however, most data exchanges have SQL at their heart.  Therefore, when I can use my work as an excuse to develop a marketable skill, I’m going to do it.

A third reason to mix the two, most often the servers where our data calculations are being done are extremely limited in their hardware.  This results in calculations taking _much_ longer on a server than they would on or personal PC.  For example, a query which would take 45 minutes on our HMIS software vendor's server takes around 30 seconds on my personal PC.

A fourth reason, by completing our calculations on our personal computers it reduces the number of times client level information would need to be transmitted back-and-forth from the server.  Of course, this doesn't mean the data is more secure, it simply means the opportunities for more secure data are in our hands.  This method makes follow proper PC security practices much more important (encrypting hard-drives, not sharing passwords, etc)
Localization of data.