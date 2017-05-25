---
layout: post
title: Sampling Large Data
categories: HMIS, R, SQL
excerpt: 
tags: [ETO, HMIS, R, SQL]
image: 
    feature: SQL-HMIS-R3_0_0.png
comments: true
custom_css:
custom_js: 
---

This R function allows sampling of a dataframe.  This is helpful when writing a script which will be used against a large dataframe, however, writing the script is iterative.  Sampling allows the overall reduction in time of testing iterations, without losing the validity of realistic results.

{% highlight r %}

    options(java.parameters = "-Xmx14336m")  ## memory set to 14 GB
    library("sqldf")
    library("XLConnect")
    library("tcltk")

    df <- readWorksheetFromFile("Data_X.xlsx", sheet = 1, startRow = 1)

    sampleVector <- sample(1:nrow(df), 30000)
    df2 <- df[sampleVector,]

    write.csv(df2, file="Sample of Data_X (30000).csv", na="")
    
{% endhighlight %}