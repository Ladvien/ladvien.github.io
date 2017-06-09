---
layout: post
title: R Function to Split CSVs
categories: HMIS, R, SQL
excerpt:
tags: [ETO, HMIS, R, SQL]
image: 
    feature: R_SQL.png
comments: true
custom_css:
custom_js: 
---

This is an R function written to split a dataset into particular sized sets, then write them as a CSV.  Often, our office is need a quick way to split files for uploading purposes, since our HMIS software doesn't handle large uploads well.  

For example:

{% highlight r %}
splitDataAndWriteFiles(df, 500, "My_Data")  
{% endhighlight %}

Will produce X number of files named "My_data_X.csv"

{% highlight r %}
options(java.parameters = "-Xmx14336m")  ## memory set to 14 GB
library("XLConnect")

# Function to split files.
splitDataAndWriteFiles <- function(df, chunkSize, nameOfFiles) {
  success <- FALSE
  count <- 0
  while (!success) {
    # If you want 20 samples, put any range of 20 values within the range of number of rows
    s <- paste(((count*chunkSize)+1), "_", ((count+1)*chunkSize))
    print(s)
    chunk <- subset(df[((count*chunkSize)+1):((count+1)*chunkSize),])
    #chunk <- sample(df[5:20,])
    ## this would contain first 20 rows
    fileName <- paste(nameOfFiles, "_", as.character(count), ".csv")
    # Write out all the Active HUD Assessments.
    write.csv(chunk, file = fileName, na = "", row.names = FALSE, fileEncoding = "utf8")
    count <- count + 1
    success <- (count * chunkSize) > nrow(df)
  }
  return(success)
}

fileToSplit <- read.csv("UPLOAD -- Sal Men-- TCES Move -- TSA Bed Data Template.csv")

splitDataAndWriteFiles(fileToSplit, 5000, "Sal_Men_NBN")
{% endhighlight %}