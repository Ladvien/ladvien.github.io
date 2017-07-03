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
# Creating a List of Domestic Violence Victims
In this first work challenge you will use R and SQL to get a by-name-list of those who are domestic violence victims from an HMIS data pull (5.1).

## Data Needed
The HMIS Data Pulls are simply a [relational database](https://en.wikipedia.org/wiki/Relational_database) which are broken into multiple CSVs.  These CSVs will change in formatting, as stipulated by HUD.  The current version of these CSVs is 5.1.  For this work challenge the focus will be on two CSVs.

1. Client.csv
2. HealthAndDV.csv

The `Client` file will contain one row per client and only one row.  Each row will contain most of all the Client's demographic information.

The `HealthAndDV` file will contain a row for every HUD Entry Assessment completed on the participant.  Each entry will contain general health information as well the client's domestic violence information, which the client reported during the HUD Entry Assessment.

What ties the two files together is the `PersonalID` column.  This ID is meant to be the grand-mamma of all client IDs.  It is 32 characters long and contain both numbers and letter:

{% highlight bash %}
B7YIOJIGF9CDP6FV7TANQXLMQRMBTVTB
{% endhighlight %}

(note, this ID is called the "Enterprise ID" in our HMIS software)

Both the `Client` and `HealthAndDV` contain the `PersonalID` column.  This often referred to as a `key` when dealing with relational databases. This unique ID in both files will allow us to merge the two data sets together using something called **joins**.

Now, in the Client.csv the information is readable to us humans.  There will be the `FirstName`, `LastName`, `SSN` columns and many more.  But in the HealthAndDV.csv the information is trickier.  For this challenge we are going to focus on one column `DomesticViolenceVictim`. When you open the data set you may notice that instead of "Yes" or "No" answers in the columns you will see "1" or "0".  That's because computers understand the 1 and 0 much quicker than Yes or No.  

This is an important side note for managing data.  Make the databases easy for computers to understand and report generation will be _much_ faster.  You have to think, if using a 1 instead of Yes could save 0.5 seconds on a calculation, then when you have a dataset which contains 1000 records you just saved 500 seconds 8.3 seconds.  Now, multiply by 1,700,000 records.  Well, you get the picture.

Ok.  Back to the problem at hand.  Just know "1" is equal to "Yes" and "0" is equal to "No".  So, for this challenge, we will want to find all the clients who have a "1" in the `DomesticViolenceVictim` column


## The Goal
We are going to merge the two data sets and to discover the following:

1. A list of clients who are victims of domestic violence.
2. A count of how many clients are fleeing domestic violence.

Really, the second piece of information is counting how many people are in the list of those who are victims.  

To get this information we will need to do the following:

1. Load the Client.csv and HealthAnd.csv
2. Filter the HealthAndDV dataset to the most recent according to the column `DateCreated`
3. Join (merge) the dataframes where their `PersonalID` are the same
4. Filter the merged dataframe to those who've reported `1` in `DomesticViolenceVictim`
5. Write this data to a file.
6. Use a function to count how many participants are in this victim list.

## The Resources
Below are the resources which should help you understand each step of the process.

### Step 1
* R Programming A-Z -- Video 41 -- Loading and Importing Data in R
* R Programming A-Z -- Video 21 -- Functions in R

### Step 2
* The Complete SQL Bootcamp -- All Videos in Section 5
* The Complete SQL Bootcamp -- All Videos in Section 6
* [Working with Dates in SQLdf](https://ladvien.com/sqldf-dates/)

### Step 3
* The Complete SQL Bootcamp -- All Videos in Section 8

### Step 4 --
* [HMIS, R, SQL -- Queries](https://ladvien.com/hmis/hmis-r-sql-query/)

### Step 5 -- 
* [Read and Write CSVs](https://ladvien.com/hmis-sql-r-read-write-csv/)

### Step 6 --
* The Complete SQL Bootcamp -- All Videos in Section 5
* The Complete SQL Bootcamp -- All Videos in Section 6