---
layout: post
title: HMIS, R, SQL -- Work Challenge Two
desription: Second work challenge in mixing R and SQL to derive information from HMIS data.
series: SQL-R
categories: HMIS
excerpt:
tags: [HMIS, R, SQL]
image:
comments: true
custom_css: 
custom_js: 
---
# Providing Chronically Homeless List
With this work challenge we are going to take the concepts we've learned from the first challenge and build on them.  We will combine two dataframes derived from Client.csv and Enrollment.csv.  Then, we will apply HUD's formula to get a by-name-list of those who are chronically homeless.

## Data Needed
The current definition of chronically homeless is found in [HUD's federal register](https://www.federalregister.gov/documents/2015/12/04/2015-30473/homeless-emergency-assistance-and-rapid-transition-to-housing-defining-chronically-homeless):

>A “chronically homeless” individual is defined to mean a homeless individual with a disability who lives either in a place not meant for human habitation, a safe haven, or in an emergency shelter, or in an institutional care facility if the individual has been living in the facility for fewer than 90 days and had been living in a place not meant for human habitation, a safe haven, or in an emergency shelter immediately before entering the institutional care facility. In order to meet the “chronically homeless” definition, the individual also must have been living as described above continuously for at least 12 months, or on at least four separate occasions in the last 3 years, where the combined occasions total a length of time of at least 12 months. Each period separating the occasions must include at least 7 nights of living in a situation other than a place not meant for human habitation, in an emergency shelter, or in a safe haven.

That stated, there are several data elements which will be needed for us to calculate whether someone is chronically homeless.  Most all of these data elements are reported to case-managers and entered into a HUD Entry Assessment when a client enters a program.

Here's a list of the data elements we will use:

1. DisablingCondition
2. TimesHomelessPastThreeYears
3. MonthHomelessPastThreeYears
4. DateToStreetESSH

All of the above data elements are found in the Enrollment.csv.  Therefore, similar to the last Challenge, we will need to join the Client.csv and the Enrollment.csv.

We've covered how to get all data from CSVs into one dataframe using joins.  This Challenge will build on that skill.  The new concepts here will be combining logic to get to a specific answer.

* [Logic](https://en.wikipedia.org/wiki/Logical_connective)

In SQL we will use the following boolean logic operators:

* **IS (==)**
* **NOT (!=)**
* **AND (&&)**
* **OR (\|\|)**
* **\> (greater than)**
* **< (less than)**

For example, let's take the chronically homeless definition and turn it into a sentence using these logic operators:

A chronically homeless individual is disabled and been homeless greater than 364 days.  Or, is disabled and been homeless greater than three times in three years and the time her or she spent in homelessness adding up to greater than 364 days.

That paragraph seems a little hard to read, right?  But still, humans should be able to understand it.  Now, let's look at the same paragraph emphasizing the logic operators.

A chronically homeless individual **IS** disabled **AND** been homeless **GREATER THAN** 364 days.  **OR**, **IS** diabled **AND** been homeless **GREATER THAN** three times in three years **AND** the time her or she spent in homelessness adding up to **GREATER THAN** 364 days.

This is skill of a Computational-Thinker, taking a definition like HUD provided and re-write it from something a human would understand into something a computer will understand.

The next step is re-writing the paragraph in something called [pseudo-code](https://en.wikipedia.org/wiki/Pseudocode).

Chronic Homeless Individual == 
                
                    A person IS Disabled AND
                    A person > Homeless 364 days

                    OR

                    A person IS Disabled AND
                    A person homeless > 4 times AND
                    A person > 12 months homeless within 3 years

This helps us make sure everything is in place to feed to the computer.  The next step will be actually writing the SQL code.

Below is the following code to get chronically homeless:

{% highlight r %}
#############################################
##### Get those with Disabling Condition ###
#############################################
disablingCondition <- sqldf("SELECT PersonalID 
                            FROM activeEnrollment 
                            WHERE DisablingCondition = 1")

#############################################
##### Length-of-Stay ########################
#############################################
# Participants who meet the length-of-stay in homelessness requirement
# Either through four or more occurences with cumulative duration exceeding a year
# Or a consequtive year.
#                 113 = "12 Months"
#                 114 = "More than 12 Months"
chronicityDf <- sqldf("SELECT PersonalID, 'Yes' As 'Meets LOS'
                               FROM activeEnrollment
                               WHERE (TimesHomelessPastThreeYears = 4
                                    AND (
                                          MonthsHomelessPastThreeYears = 113
                                          OR MonthsHomelessPastThreeYears = 114)
                                        )
                               OR (CAST(JULIANDAY('now') - JULIANDAY(DateToStreetESSH) AS Integer) > 364
                                   AND (DateToStreetESSH != '') 
                                  )
                               ")

#############################################
##### Chronically Homeless ##################
#############################################
# Take the distinct PersonalIDs of individuals who meet both chronicity
# and disabling condition.
chronicallyHomeless <- sqldf("SELECT DISTINCT(a.PersonalID)
                              FROM chronicityDf a
                              INNER JOIN disablingCondition b
                              ON a.PersonalID=b.PersonalID
                             ")
{% endhighlight %}

This may look overwhelming, but that'll be the purpose of this week's Challenge, to demonstrate this is code is actually pretty simple when broke down into its basic parts.

That's the _real_ lesson here, every complex question may be made _extremely_ simple when taken once piece at a time.  The power of computational-thinking is extraordinary.

## The Goal
We are going to merge the two data sets and to discover the following:

1. A list of individuals who are chronically homeless.
2. Export this list to an Excel document.

To get this information we will need to do the following:

1. Load the Client.csv into the dataframe clientDf.
2. Load the Enrollment.csv into the dataframe enrollmentDf.
3. Inner join the clientDf to enrollmentDf.
4. Calculate whether someone is chronically homeless
5. Filter to those who are chronically homeless
6. Write the by-name-list of individuals to an Excel document.

## The Resources
Below are the resources which should help you understand each step of the process.

### Step 1 & 2
* R Programming A-Z -- Video 41 -- Loading and Importing Data in R
* R Programming A-Z -- Video 21 -- Functions in R
* [Read and Write CSVs in R](https://ladvien.com/hmis-sql-r-read-write-csv/)

### Step 3
* The Complete SQL Bootcamp -- Video #51 -- Overview of Inner Joins
* The Complete SQL Bootcamp -- Video #52 -- Example of Inner Joins
[* HMIS, R, SQL -- Basics](https://ladvien.com/hmis-r-sql-query/)

### Step 4 & 5
* [HMIS, R, SQL -- Queries](https://ladvien.com/hmis/hmis-r-sql-query/)
* [HMIS Data Dictionary](https://www.hudexchange.info/resources/documents/HMIS-Data-Dictionary.pdf)
* [Query Results Using Boolean Logic (all sections and videos)](https://www.essentialsql.com/get-ready-to-learn-sql-4-query-results-using-boolean-logic/)

### Step 6
* Writing Excel Workbooks -- Tutorial Coming

