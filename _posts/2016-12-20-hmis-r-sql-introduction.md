---
layout: post
title: HMIS, R, and SQL -- Introduction
series: SQL-R
categories: HMIS
excerpt:
tags: [HMIS, R, SQL]
image: 
    feature: R_SQL.png
comments: true
custom_css:
custom_js: 
---

## "I love our software, I love our software."

I'm a HMIS Database Manager for a living.  It's a dream job--all the nerdy stuff, plus, there is a possibility I'm helping people.  Currently, one area our software really lacks is quickly generating complex reports. It has the ability, but the servers are laggy, it crashes often, and a project which should take 20 minutes will take 50 minutes to 40 hours depending on the "report weather."  These issues are probably caused by the reporting platform being web-based and calculations done server-side.  Regardless, given the amount of time the staff are eating on report projects I've decided to explore alternative systems for generating some of our needed reports.

Luckily, HUD has dictated a HMIS data format.  This is often known as the "CSV version."  The specification of these data sets are outlined in HUD's document:

*   [HMIS Data Dictionary](https://www.hudexchange.info/resources/documents/HMIS-Data-Dictionary.pdf)

These data standards are currently on version 5.1, however, HUD issues tweaks to these standards every October 1st.  Point is, if the data is standardized it should make it easy to manipulate using local tools.  

Here are a few pros to explore local reporting tools:

*   Software vendor ambivalent
*   No bottleneck due to routing issues
*   Greater flexibility of reporting
*   No outage concerns
*   More control on optimization of queries

And the cons:

*   Somewhat more difficult to deploy to end-users (integration would probably be through batch files or Excel-VB)

Before jumping in to the alternatives it is important to point out HUD requires all HMIS software vendors have the ability to export a set of CSV files which contain all the HUD manadated data elements (also known as universal data elements).  This export process is reliable, fast, and predictable--at least, from my experience.  As the alternative tools are explored the data sets being used will most often be these HMIS CSVs, however, there will probably be other data our COC reports locally which will be joined to these CSVs using each participant's unique ID.  

Ok! Let's take a look.  

## R

[R](https://en.wikipedia.org/wiki/R_(programming_language)) gets me excited.  It is programming language for data miners.  It is primarily C under the hood, which potentially makes it blazingly fast. R is meant to be a command-line interface, but I'm using RStudio as convenient overaly.  R studio has a few limitations, for example only 15 columns may be view inside the IDE, but nothing show stopping.  

This entry is not meant to be a course in R, however, I'll add some of my favorite links:

1.  [Coursera's R Courses](https://www.coursera.org/courses?languages=en&query=R)
2.  [John Hopkins -- R Programming](https://www.coursera.org/learn/r-programming)

Here's the toolchains:

1.  [Mirror List for R Download](https://cran.r-project.org/mirrors.html) (the CLI)
2.  [RStudio](https://www.rstudio.com/products/rstudio/download3/) (the R IDE used)

Alright, now we've got R going!  

![](/../../images/Screenshot%202016-12-26%2007.46.49.png)  

Ok, let's dig into some code.  

First it is important to be able to read in CSV and Excel files.  The ability to read in CSVs is built into R.  To start loading Excel documents the [read_excel](https://cran.r-project.org/web/packages/readxl/readxl.pdf) package will need to be installed. R has a package manager, allowing method libraries to be easily added.  Pretty much any package can be installed from the CLI using install.package("name_of_package").  For example:

{% highlight r %}

    # Installs the readxl package, which allows Excel files to be
    # read in as data-frames
    install.package("readxl")
    
{% endhighlight %}

A package only needs to be installed once, however, every R session will need to refer to the library before making calls to its methods.  For example,

{% highlight r %}
    # Adds the readxl methods to this session.
    library("readxl")
{% endhighlight %}

 After this package has been installed and added to the session, then we should be able to import all sorts of data into R using the following:

{% highlight r %}
    # Load data
    read.csv( <- read_excel("DRC PoS Check In for October 2016.xlsx")
    csvData <- read.csv("My_CSV_file.csv")
{% endhighlight %}

 This creates two data-frames.  One thing action I found to be necessary for later functions the ability to rename column headers.  This can be done using the following:

{% highlight r %}
    # Make the disability column easier to work with.
    colnames(data_frame)[col_number_to_rename] <- "new_name"

    # For example, renames the header of column 8 to "ethnicity"
    colnames(client)[8] <- "ethnicity"
{% endhighlight %}

This is important later when SQL functions are used inside of R, as speciali characters SQLite doesn't like and workarounds make the SQL code verbose.  

The most important thing which can be done by data people is merging datasets.  I've only started on this journey, but it looks to be an art which requires mastery to be effective.  But to get us going, here's how to perform a [left join](http://www.w3schools.com/sql/sql_join_left.asp) in R.

{% highlight r %}
    # Join data_frame_2 to data_frame_1 where the "key" column matches.
    # Do not keep any data which doesn't match the keys in data_frame_1
    combined_data_frames <- merge(data_frame_1, data_frame_2, by="key")

    # Here's a real example, using HUD HMIS CSVs
    client <- read.csv("Client.csv")
    enrollments <- read.csv("Enrollments.csv")
    client_and_hud_assessments <- merge(client, enrollments, by="PersonalID")
{% endhighlight %}

If you're pretty sharp--or a data scientist--you might notice the flaw in the in the merger above.  The HMIS Client.csv should only have one record per participant, but the relationship from Client.csv to Enrollments.csv is one-to-many.  Meaning, each client could have mutiple project enrollments.  This makes the above code somewhat unpredictable--and I've no time to explore the results.  Instead, I've focused on taking the most recent entry from Enrollments.csv.  This can be done using some SQL code.

## The SQL to R

Professional data folk may wonder why I've chosen to mix R and SQL.  Well, it may not be the best reason or explanation, but here goes.  R is a powerful tool, but often, the syntax is boggish.  It is hard to read and figure out what's going on.  SQL on the other hand, it's pretty intuitive.  For me, I'm looking to solve problems as quickly as possible and I've found by mixing the two I get to solutions much more quickly.  Often, it is a trade off, if a SQL query is running too slow, I look for an R solution.  And if I've re-read an R statement twenty times without being able to spot a bug, then I find a SQL solution.  For me, it's about getting to the result as quickly as possible  

A second reason to mix SQL is about respect and marketability.  R seems to be gaining ground in a lot of data sciences, and seems to be _the_ tool when it comes to economics and statistics, however, most data exchanges have SQL at their heart.  Therefore, when I can use my work as an excuse to develop a marketable skill, I'm going to do it.    

If someone still has problems with those assertions, feel free to hate away in the comments below.  

Alright, how does one mix SQL into R?  It centers around the package [sqldf](https://cran.r-project.org/web/packages/sqldf/sqldf.pdf).  This package can be installed and added to a session with the following:

{% highlight r %}
    # Install SQLdf package (run once)
    install.package("sqldf")

    # Adds sqldf to the current R session
    library("sqldf")
{% endhighlight %}

Underneath the hood of sqldf is [SQLite](https://sqlite.org/), this important to note when it comes to debugging SQL queries in R--as we will see in a moment.  

But, to get us kicked off, let's look at how sqldf works in R.

{% highlight r %}
    result_df <- sqldf("YOUR SQL QUERY HERE")
{% endhighlight %}

This is a sample of how sqldf works.  Basically, the sqldf() makes a SQLite query call and returns the results.  Here, all of the vector for PersonalIDs was taken from the Client.csv and put into a dataframe called personalIDs.  And that's pretty much it.  

Here's an example in the context of HMIS CSV data.

{% highlight r %}
    # Add the SQLdf library
    library("sqldf)
    # Load Client CSV data
    client <- read.csv("Client.csv")
    # Get a vector of the client IDs from the Client.csv
    personalIDs <- sqldf("SELECT DISTINCT PersonalID FROM client")

{% endhighlight %}

Alright, from here on in I'm going to outline SQL queries seperately, just know, the SQL query will need to be insert into the sqldf("") call.  

{% highlight sql %}
    SELECT DISTINCT PersonalID FROM client
{% endhighlight %}

Ok -- I'm going to stop this article here, since it seems to have gotten us going.  However, I'll continue adding to this series as I write useful queries for HMIS data.