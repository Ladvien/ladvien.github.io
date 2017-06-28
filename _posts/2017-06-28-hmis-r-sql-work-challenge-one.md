---
layout: post
title: HMIS, R, SQL -- Work Challenge One
desription: First work challenge in mixing R and SQL to derive information from HMIS data.
categories: HMIS
excerpt:
tags: [HMIS, R, SQL]
image:
comments: true
custom_css: 
custom_js: 
---
# Finding Veterans with Mental Health Issues
In this first work challenge you will use R and SQL to get a by-name-list of those who are domestic violence victims from an HMIS data pull (5.1).

## Data Needed
The HMIS Data Pulls are simply a [relational database](https://en.wikipedia.org/wiki/Relational_database) which are broken into multiple CSVs.  These CSVs will change in formatting, as stipulated by HUD.  The current version of these CSVs is 5.1.  For this work challenge we will focus on two CSVs.

1. Client.csv
2. HealthAndDV.csv

The Client file will contain one row per client.  Each row will contain must of all the Client's demographic information.

The HealthAndDV file will contain general health information as well the client's domestic violence information.

What ties the two files together is the `PersonalID` column.  This ID is meant to be the grand-mamma of all client IDs.  It is 32 characters long and has both numbers and letter:

{% highlight bash %}
B7YIOJIGF9CDP6FV7TANQXLMQRMBTVTB
{% endhighlight %}

(note, this ID is called the "Enterprise ID" in our HMIS software)

Both files will have a row for every client, with their the data contained in that row respective of the client's ID.  This will allow us to merge the two data sets together using something called **joins**.

Now, in the Client.csv the information there is readable to us humans.  There will be the `FirstName`, `LastName`, `SSN` columns and many more.  But in the HealthAndDV.csv the information is trickier.  For this challenge we are going to focus on one column `DomesticViolenceVictim`. When you open the data set you will notice that instead of "Yes" or "No" answers in the columns you will see "1" or "0".  That's because computers understand the 1 and 0 much quicker than Yes or No.  

This is an important side note for managing data.  Make the databases easy for computers to understand and report generation will be _much_ faster.  You have to think, if using a 1 instead of Yes could save 0.5 seconds on a calculation, then when you have a dataset which contains 1000 records you just saved 500 seconds 8.3 seconds.  Now, multiple that by 1,700,000 records.  Well, you get the picture.

Ok.  Back to the problem at hand.  Just know "1" is equal to "Yes" and "0" is equal to "No".  So, for this challenge, we will want to find all the clients who have a "1" in the `DomesticViolenceVictim` column


## The Goal
We are going to take the two data sets and find out two pieces of information:

1. A list of clients who are victims of domestic violence
2. A count of how many clients are fleeing domestic violence.

Really, the second piece of information is just counting how many people are in the list of those who are victims.  

To get this information we will need to do the following:

1. Load the Client.csv and HealthAnd
2.  Get a dataframe of all participants from the HealthAndDV file.
3. Get a dataframe from the Client file
4. Join (merge) the dataframes where their `PersonalID` is the same
5. Filter the merged dataframe to those who've report `1` in `DomesticViolenceVictim`
6. Write this data to a file.
7. Use a function to count how many participants are in this victim list.

## The Resources
Below are the resources which should help you understand each step of the process.

### Step 1, 2, 3 -- 
* R Programming A-Z -- Video 41 -- Loading and Importing Data in R
* R Programming A-Z -- Video 21 -- Functions in R

### Step 4 --
* [HMIS, R, SQL -- Queries](https://ladvien.com/hmis/hmis-r-sql-query/)
* [SQL Joins](https://www.youtube.com/watch?v=KTvYHEntvn8)

### Step 5 -- 
* 

### Step 6 --
* 