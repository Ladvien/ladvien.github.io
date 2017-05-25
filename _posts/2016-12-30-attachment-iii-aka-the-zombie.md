---
layout: post
title: Attachment II, aka, The Zombie
categories: HMIS, R, SQL
excerpt:
tags: [ETO, HMIS, R, SQL]
image: 
    feature: Rlogo-300x263.png
comments: true
custom_css:
custom_js: 
---

Continuing to explore R and SQL's usefulness when it comes to HMIS data I decided to start posting HMIS problems and R and SQL solutions.  

Problem: One of our Emergency Solutions Grant (ESG) funders requires the subrecipients to produce a report of all the participants which receive services from the shelter.  This requirement was written into the contract the ESG funders have with the subrecipient.  This worked somewhat in 2011 when it was implemented, however, it is 2016 and the data which is queried against to produce the report is well over 1.3 million entries.  These data are generated _every_ time a participant checki in a shelter for meal, bed, or to sit.  It is unlikely this data set will ever get smaller.  In short, the data have grown beyond the report server currently provided by our software vendor.  Since the query is handled server-side it has resulted in the subrecipients being unable to reliably meet the requirement.  

Solution:    
In attempt to circumvent the server-side query, I've written a R and SQL script which takes two data files:

1.  Point of Service (PoS)
2.  Demographic and HUD Assessment data (enrolledInTCES)

These data were pulled using the software report services, but without any query.  This seems to allow bypassing the server-side bottle-neck.  The script then merges the data, formats it, and aggregates it for the final report.  

The report should be something which could be run using a batch file, so I hope to deploy it to the subrecipients.  Then, with a little training, it should allow them to continue to produce the report for the funders.

{% highlight r %}
nameOfMonth <- readline("Provide the month for which the data was pulled: \n")
nameOfAgency <- readline("Provide the name of your agency: \n")

library("sqldf")
library("readxl")

# Load data
enrolledInTCES <- read_excel("Attachment III Date for Oct and Dec 2016 -- DRC Program.xlsx")
PoS <- read_excel("DRC PoS Check In for November 2016.xlsx")
colnames(enrolledInTCES)[1] <- "peid"
colnames(PoS)[1] <- "peid"

# Check for duplicates
PoS <- sqldf("SELECT DISTINCT peid FROM PoS")

# Join allPos and enrolledInTCES
attachmentIIIClientData <- merge(PoS, enrolledInTCES, by="peid")

# Make the disability column easier to work with.
colnames(attachmentIIIClientData)[8] <- "ethnicity"
colnames(attachmentIIIClientData)[9] <- "tmi"
colnames(attachmentIIIClientData)[10] <- "race"
colnames(attachmentIIIClientData)[11] <- "disability"
colnames(attachmentIIIClientData)[12] <- "FSI"
colnames(attachmentIIIClientData)[13] <- "gender"
colnames(attachmentIIIClientData)[14] <- "HHSize"

# Replaces all NAs with 0
attachmentIIIClientData[is.na(attachmentIIIClientData)] <- 0
# Create annual income column
attachmentIIIClientData$annualIncome <- attachmentIIIClientData$tmi * 12
# Remove decimals.
attachmentIIIClientData$annualIncome <- as.integer(attachmentIIIClientData$annualIncome)

# AMI Matrix
# N = Number of People in a Household
#  <30%AMI	  30%-50% AMI	 51-80% AMI	 >80% AMI
# 1<$14600	  1<$24300	   1<$38850	  1>$38850
# 2<$16650	  2<$27800	   2<$44400	  2>$44400
# 3<$18750	  3<$31250	   3<$49950	  3>$49950
# 4<$20800	  4<$34700	   4<$55500	  4>$55500
# 5<$22500	  5<$37500	   5<$59950	  5>$59950
# 6<$24150	  6<$40300	   6<$64400	  6>$64400
# 7<$25800	  7<$43050	   7<$68850	  7>$68850
# 8<$27500	  8<$45850     8<$73300 	8>$73300

ami <- sqldf("SELECT 

              (
              SUM (CASE WHEN annualIncome < 14600 AND HHSize == 1 THEN 1 ELSE 0 END) +
              SUM (CASE WHEN annualIncome < 16650 AND HHSize == 2 THEN 1 ELSE 0 END) +
              SUM (CASE WHEN annualIncome < 18750 AND HHSize == 3 THEN 1 ELSE 0 END) +
              SUM (CASE WHEN annualIncome < 20800 AND HHSize == 4 THEN 1 ELSE 0 END) +
              SUM (CASE WHEN annualIncome < 22500 AND HHSize == 5 THEN 1 ELSE 0 END) +
              SUM (CASE WHEN annualIncome < 24150 AND HHSize == 6 THEN 1 ELSE 0 END) +
              SUM (CASE WHEN annualIncome < 25800 AND HHSize == 7 THEN 1 ELSE 0 END) +
              SUM (CASE WHEN annualIncome < 27500 AND HHSize > 7 THEN 1 ELSE 0 END)) as '<30% AMI',

              (
              SUM(CASE WHEN annualIncome < 24300 AND HHSize == 1 THEN 1 ELSE 0 END) +
              SUM(CASE WHEN annualIncome < 27800 AND HHSize == 2 THEN 1 ELSE 0 END) +
              SUM(CASE WHEN annualIncome < 31250 AND HHSize == 3 THEN 1 ELSE 0 END) +
              SUM(CASE WHEN annualIncome < 34700 AND HHSize == 4 THEN 1 ELSE 0 END) +
              SUM(CASE WHEN annualIncome < 37500 AND HHSize == 5 THEN 1 ELSE 0 END) +
              SUM(CASE WHEN annualIncome < 40300 AND HHSize == 6 THEN 1 ELSE 0 END) +
              SUM(CASE WHEN annualIncome < 43050 AND HHSize == 7 THEN 1 ELSE 0 END) +
              SUM(CASE WHEN annualIncome < 45850 AND HHSize > 7 THEN 1 ELSE 0 END)) as '30-50% AMI',

              (
              SUM(CASE WHEN annualIncome < 38850 AND HHSize == 1 THEN 1 ELSE 0 END) +
              SUM(CASE WHEN annualIncome < 44400 AND HHSize == 2 THEN 1 ELSE 0 END) +
              SUM(CASE WHEN annualIncome < 49950 AND HHSize == 3 THEN 1 ELSE 0 END) +
              SUM(CASE WHEN annualIncome < 55500 AND HHSize == 4 THEN 1 ELSE 0 END) +
              SUM(CASE WHEN annualIncome < 59950 AND HHSize == 5 THEN 1 ELSE 0 END) +
              SUM(CASE WHEN annualIncome < 64400 AND HHSize == 6 THEN 1 ELSE 0 END) +
              SUM(CASE WHEN annualIncome < 68850 AND HHSize == 7 THEN 1 ELSE 0 END) +
              SUM(CASE WHEN annualIncome < 73300 AND HHSize > 7 THEN 1 ELSE 0 END)) as '51-80% AMI',

              (
              SUM(CASE WHEN annualIncome > 38850 AND HHSize == 1 THEN 1 ELSE 0 END) +
              SUM(CASE WHEN annualIncome > 44400 AND HHSize == 2 THEN 1 ELSE 0 END) +
              SUM(CASE WHEN annualIncome > 49950 AND HHSize == 3 THEN 1 ELSE 0 END) +
              SUM(CASE WHEN annualIncome > 55500 AND HHSize == 4 THEN 1 ELSE 0 END) +
              SUM(CASE WHEN annualIncome > 59950 AND HHSize == 5 THEN 1 ELSE 0 END) +
              SUM(CASE WHEN annualIncome > 64400 AND HHSize == 6 THEN 1 ELSE 0 END) +
              SUM(CASE WHEN annualIncome > 68850 AND HHSize == 7 THEN 1 ELSE 0 END) +
              SUM(CASE WHEN annualIncome > 73300 AND HHSize > 7 THEN 1 ELSE 0 END)) as '>80% AMI'

              FROM attachmentIIIClientData")

# Remove duplicate counts.
ami$'30-50% AMI' <- (ami$'30-50% AMI' - ami$'<30% AMI')
ami$'51-80% AMI' <- (ami$'51-80% AMI' - ami$'<30% AMI' - ami$'30-50% AMI')

# Aggregates data for Attachment III.
attachmentIIIAggregate <- sqldf("SELECT 

                 COUNT(peid) as 'Total Participants',
                 SUM(CASE WHEN disability = 'Yes' THEN 1 ELSE 0 END) as DisabledCount,

                 SUM(CASE WHEN age < 5 THEN 1 ELSE 0 END) as 'Under 5',
                 SUM(CASE WHEN age > 4 AND age < 13 THEN 1 ELSE 0 END) as '5 to 12',
                 SUM(CASE WHEN age > 12 AND age < 18 THEN 1 ELSE 0 END) as '13 to 17',
                 SUM(CASE WHEN age > 17 AND age < 25 THEN 1 ELSE 0 END) as '18 to 24',
                 SUM(CASE WHEN age > 24 AND age < 35 THEN 1 ELSE 0 END) as '25 to 34',
                 SUM(CASE WHEN age > 34 AND age < 45 THEN 1 ELSE 0 END) as '35 to 44',
                 SUM(CASE WHEN age > 44 AND age < 55 THEN 1 ELSE 0 END) as '45 to 54',
                 SUM(CASE WHEN age > 54 AND age < 62 THEN 1 ELSE 0 END) as '55 to 61',
                 SUM(CASE WHEN age > 61 THEN 1 ELSE 0 END) as '60+',

                 SUM(CASE WHEN race  = 'Black or African American' THEN 1 ELSE 0 END) as 'Black or African American',
                 SUM(CASE WHEN race  = 'White' THEN 1 ELSE 0 END) as 'White',
                 SUM(CASE WHEN race  = 'American Indian or Alaska Native' THEN 1 ELSE 0 END) as 'American Indian or Alaska Native',
                 SUM(CASE WHEN race  = 'Asian' THEN 1 ELSE 0 END) as 'Asian',
                 SUM(CASE WHEN race  = 'Native Hawaiian or Other Pacific Islander' THEN 1 ELSE 0 END) as 'Native Hawaiian or Other Pacific Islander',
                 SUM(CASE WHEN race = 'Black or African American' OR
                 race = 'White' OR
                 race = 'American Indian or Alaska Native' OR
                 race = 'Asian' OR
                 race = 'Native Hawaiian or Other Pacific Islander'
                 THEN 0 ELSE 1 END) as 'Other',

                 SUM(CASE WHEN ethnicity  = 'Non-Hispanic/Non-Latino' THEN 1 ELSE 0 END) as 'Non-Hispanic/Non-Latino',
                 SUM(CASE WHEN ethnicity  = 'Hispanic/Latino' THEN 1 ELSE 0 END) as 'Hispanic/Latino',

                 SUM(CASE WHEN gender = 'Male' THEN 1 ELSE 0 END) as 'Male',
                 SUM(CASE WHEN gender = 'Female' THEN 1 ELSE 0 END) as 'Female'
                 FROM attachmentIIIClientData")

attachmentIIIAggregate <- sqldf("SELECT * FROM attachmentIIIAggregate LEFT JOIN ami ")

aggregateFileNameString <- paste(nameOfMonth, "_", nameOfAgency, "_attachment_III_aggregate.csv")
write.csv(attachmentIIIAggregate, file = aggregateFileNameString)

clientDataFileNameString <- paste(nameOfMonth,"_", nameOfAgency, "_attachment_III_client_data.csv")
write.csv(attachmentIIIClientData, file = clientDataFileNameString)

{% endhighlight %}