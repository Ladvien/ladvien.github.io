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
We've worked a bit with Comma Separated Values (`.csv`) files, but it they aren't the only way to store data.'t the only way to store data on a computer.  One of the deficits of the `CSV` format is it cannot store formatting or graphs. This is the reason Excel format (`.xls` or `.xlsx`) has become another industry standard.

Excel is a program created by Microsoft to allow people to easily work with spreadsheets.  With it, they created a way of storing data which allows for formatting and other information to be included.  In fact, Excel documents have become so sophisticated programmers can include entire programs within the document.  This is the reason you'll often get the "Enable Content" button when open Excel document.  That means there is some code embedded in the Excel document which will run if you say "OK".

When working with HMIS data being able to load and write Excel documents is necessary.  Unfortunately, it adds a lot of complexity.

There are several R libraries which will allow us to work with Excel documents in R.  They have different abilities, therefore, I'll be focus on two libraries, rather than one.

* [XLConnect](https://cran.r-project.org/web/packages/XLConnect/index.html)
* [openxlsx](https://cran.r-project.org/web/packages/openxlsx/openxlsx.pdf)

## Installing R Libraries for Excel
Installing either of these libraries should be as simple as running the following code:

{% highlight r %}
install.packages("XLConnect")
install.packages("openxlsx")
{% endhighlight %}

However, there are lots of _ifs_.  Both of these libraries rely on the `rJava` library.  Unfortunately, there is often some mismatch of computer architecture.  What does that mean?  Well, often you'll install R for amd64, but rJava is easiest to get working with R for i386.

Just know, RStudio has a way you are able to set the version of R you are using by going to `Tools` then go to `Global Options`.  If you are in Windows, at the top of the `R General` section you will see the option to change your R version.  If you are having difficulty getting the above Excel documents working, try switching the R version to i386.  (Don't forget to restart RStudio after switching.)

Past this, I'd be more than happy to help you troubleshoot.  Just leave a comment below or shoot me an email.  However, it can get pretty hairy--especially on a Mac.

