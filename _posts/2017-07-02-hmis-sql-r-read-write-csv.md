---
layout: post
title: Read and Write CSVs in R
categories: HMIS, R, SQL
excerpt: 
tags: [ETO, HMIS, R, SQL]
image: 
    feature: R_SQL.png
comments: true
custom_css:
custom_js: 
---

R let's us work with HMIS data, but there is still the problem of how to load the data into R from a source.  R is actually pretty neat regarding data importing.  One can load data from a website, SQL database, text file, Excel file, or CSV.

When working with HMIS data the two most common types of data source are Excel and CSV.  Therefore, it's going to pay to spend a little time on how to bring those files into R.

## Importing CSVs into R
CSV stand for Comma Separated Value format.  It is a near ancient file format which is used to store data in rows and columns.  If you have a CSV file on the computer (in Windows) right-click on it and open it in Notepad.  The contents should look something like this:

{% highlight text %}
PersonalID,FirstName,LastName
B7YIOJIGF9CDP6FV7TANQXLMQRMBTVTB, Bob, Person
ASGJ4F95HS85N39DJ12AJB094M59DJ45, Jane, People
{% endhighlight %}

However, if you open the same CSV in Excel it will look something like this:

PersonalID | FirstName | LastName
---------|----------|---------
 B7YIOJIGF9CDP6FV7TANQXLMQRMBTVTB | Bob | Person
 ASGJ4F95HS85N39DJ12AJB094M59DJ45 | Jane | People

 Let's be honest, the second example is easier for humans to read (well, unless you're an odd human).  And for the most part, we will be looking at CSVs in Excel or in RStudio's dataview which looks similar to Excel.  *_However_*, it is important to note the easier to read version can hide data errors that may only be visible by viewing the raw CSV.  Nothing to worry about now, but keep it in mind.

 Alright, let's explore how to load a CSV file into R.  There is many way's to do this, but let's start with a super-easy way:

 {% highlight r %}
pathToCsv <- file.choose()
myCsvAsADataFrame <- read.csv(pathToCsv)
 {% endhighlight %}

These two commands, when executed, will force R to create a file selection box. This will allow one to easily select the CSV to load into R.  Once selected and one presses `Ok` then R will load the selected file's path into the variable `pathToCsv`.

The next command `read.csv()` takes the path provided and attempts to load the file it points to and converts it into a dataframe.  Once R creates a dataframe from the file selected it saves it in the variable `myCsvAsADataFrame`

And that's it.  The data is now loaded into R and it can be manipulated with other commands.

## Writing CSVs
Saving data from R is the other end of importing data.  This process is often referred to as exporting data.  Really, it's simply taking a R dataframe and converting it into a file--once in a file form it can be loaded into Excel or emailed to a peer (but, please don't email personal information--remember, CSVs are simply text).

To write data a CSV use `write.csv()`.  

For example:
{% highlight r %}
write.csv(theDataFrameToWrite, "NameOfFile.csv")
{% endhighlight %}

That's it, pretty simple, eh?  Well, there are a couple of catches.  When R saves a CSV it does a few things which are annoying for using the data in other way.  For example, let's say one has data in R that looks like this:

PersonalID | Name | SSN
---------|----------|---------
 123JJKLDFWE234234JGD0238D2342346 |  | 123-45-6589
 B7YIOJIGF9CDP6FV7TANQXLMQRMBTVTB | Bob Purdy | 
 DSK329GJB9234J5JFSDF94056NDUNVDF | Frank | 123-99-9999

However, after it is written to a file it will look like this:

PersonalID | Name | SSN
---------|----------|---------
 123JJKLDFWE234234JGD0238D2342346 | **NA** | 123-45-6589
 B7YIOJIGF9CDP6FV7TANQXLMQRMBTVTB | Bob Purdy | **NA**
 DSK329GJB9234J5JFSDF94056NDUNVDF | Frank | 123-99-9999

 Note the added `NA`.  It is a good practice to put an NA in places where there are no data.  Unfortunately, when dealing with HMIS data sets the standard is to leave a blank instead.  To get R to conform to this standard one uses an option in the `write.csv()` function.  

 For example:
{% highlight r %}
write.csv(theDataFrameToWrite, "NameOfFile.csv", na="")
{% endhighlight %}

The `na=""` tells R to write the document without changing blanks into `NA`.  The result of the code above should look like:

PersonalID | Name | SSN
---------|----------|---------
 123JJKLDFWE234234JGD0238D2342346 |  | 123-45-6589
 B7YIOJIGF9CDP6FV7TANQXLMQRMBTVTB | Bob Purdy | 
 DSK329GJB9234J5JFSDF94056NDUNVDF | Frank | 123-99-9999