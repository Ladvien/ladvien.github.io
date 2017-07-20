---
layout: post
title: Working with R Excel Libraries
categories: HMIS
excerpt: Using R Excel libraries to load and write Excel documents.
series: SQL-R
tags: [HMIS, R, SQL]
image: 
    feature: R_SQL.png
comments: true
custom_css:
custom_js: 
---
We've worked a bit with Comma Separated Values (`.csv`) files, but it they aren't the only way to store data. There are a lot of data storage formats, each with its strengths and weaknesses.  One of the deficits of the `CSV` format is it cannot store formatting or graphs. This is the reason Excel format (`.xls` or `.xlsx`) has become another industry standard.

Excel is a program created by Microsoft to allow people to easily work with spreadsheets.  With it, they created a way of storing data which allows for formatting and other information to be included.  In fact, Excel documents have become so sophisticated programmers can include entire programs within the document.  This is the reason you'll often get the "Enable Content" button when open Excel document.  That means there is some code embedded in the Excel document which will run if you say "Enable".  (Be careful, malicious programmers can insert code which could royally blink up your computer.)

When working with HMIS data being able to load and write Excel documents is necessary.  Unfortunately, it adds a lot of complexity.

There are several R libraries which will allow us to work with Excel documents in R.  They have different strengths, therefore, I'll focus on two libraries, rather than one.

* [XLConnect](https://cran.r-project.org/web/packages/XLConnect/index.html)
* [openxlsx](https://cran.r-project.org/web/packages/openxlsx/openxlsx.pdf)

## Installing R Libraries for Excel
Installing either of these libraries should be as simple as running the following code:

{% highlight r %}
install.packages("XLConnect", dependencies=TRUE)
install.packages("openxlsx")
{% endhighlight %}

However, there are lots of _ifs_.  Both of these libraries rely on the `rJava` library.  Unfortunately, there is often some mismatch of computer architecture.  What does that mean?  Well, often you'll install R for amd64, but rJava is easiest to get working with R for i386.

Just know, RStudio has a way to set the version of R you are using by going to `Tools` then go to `Global Options`.  If you are in Windows, at the top of the `R General` section you will see the option to change your R version.  If you are having difficulty getting the above Excel documents working, try switching the R version to i386.  (Don't forget to restart RStudio after switching.)

Past this, I'd be more than happy to help you troubleshoot.  Just leave a comment below or shoot me an email.  However, it can get pretty hairy--especially on a Mac.

## Working with XLConnect
Now days, I really only use XLConnect for loading data from Excel sheets.  I've just been too lazy to re-write all my code to use one library.  It's my opinion the reason to use XLConnect is it's a little easier to get going.  Its weakness is it doesn't have as much flexibility in formatting Excel documents to be saved on your computer.

### Loading Data from Xlsx Documents
Loading data using XLConnect is a little different than using the `read.csv` function.  Like I stated earlier, Xlsx documents contain other information besides data.  One critical piece of information is the sheet number.

Unlike `CSVs` a single Excel document can contain multiple spreadsheets.  Each of these sheets will be broken out in tabs when you open an Excel document

![](https://ladvien.com/images/excel_sheets.png)

XLConnect doesn't make any assumptions, it wants you to tell it which sheet you'd like to load.  

Here's how to load an Excel document, the first sheet, in XLConnect:

{% highlight r %}
library(XLConnect)
excelDf <- readWorksheetFromFile("/Users/user/Data/VI-SPDAT v2.0.xlsx", sheet = 1, startRow = 1)
{% end highlight %}

It is similar to the `read.csv()` function, but notice the file in the path refers to `VI-SPDAT v2.0.xlsx`? You want to make sure your file format is either `.xlsx` or `.xls` as the `readWorkSheetFromFile()` function only works with Excel documents.

Also, there are two other parameters.  The first, `sheet = 1` is telling XLConnect to read in only the first sheet.  Just know, you could set it to whatever sheet number you'd like.  And for reference, the sheets are 1, 2, 3, 5...etc., left to read when open Excel document.  So, even if your sheets have different names XLConnect will still load the data correctly.

The second parameter is `startRow = 1`.  This allows you to tell R where to start the dataframe.  For example, if you had a header in your Excel document which didn't contain data.

![](https://ladvien.com/images/excel_robot_budget.png)

We could skip down to row three, where the column headers, by telling XLConnect `startRow = 3`.

### Writing a Dataframe to Excel Document
Writing Excel documents are a little more complex--and one reason I'm not a huge fan of XLConnect. 

Here's how you'd write an Excel file:

{% highlight r %}
######################### Data ###################################
###################### DO NOT CHANGE #############################
peopleDf <- data.frame(PersonalID=c("ZP1U3EPU2FKAWI6K5US5LDV50KRI1LN7", "IA26X38HOTOIBHYIRV8CKR5RDS8KNGHV", "LASDU89NRABVJWW779W4JGGAN90IQ5B2"), 
                       FirstName=c("Timmy", "Fela", "Sarah"),
                       LastName=c("Tesa", "Falla", "Kerrigan"),
                       DOB=c("2010-01-01", "1999-1-1", "1992-04-01"))
##################################################################
##################################################################
excelDf <- readWorksheetFromFile("/Users/user/Data/VI-SPDAT v2.0.xlsx", sheet = 1, startRow = 1)
peopleWorkbook <- loadWorkbook("People.xlsx",  create = TRUE)
myPeopleWorksheet <- createSheet(peopleWorkbook, "My People")
writeWorksheetToFile("People.xlsx", data = peopleDf, sheet = "My People")
{% endhighlight %}