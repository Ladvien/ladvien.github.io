---
layout: post
title: Shaping and Combining HMIS Data from ETO
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

Problem:  Our HMIS implementation has had three shelters entering data into one partition.  This has been a lot like mixing three different colors of sand into one bucket--much easier to put in then sort out.  It is also a problem since HUD requires Emergency Solution Grant (ESG) recipients to provide an annual standardized report, known as the CAPER, on data defined by the [HMIS Data Dictionary](https://www.hudexchange.info/resources/documents/HMIS-Data-Dictionary.pdf). These data elements are referred to as Universal Data Elements.  With this mixed bucket data error responsibility becomes a big issue.  The CAPER only allows up to 25% missing data, which makes data quality important.  As for data repair, this should be completed by the agency which created the error.  This makes communicating data issues imperative.

Unfortunately, when data from several agencies is mixed ,creating an error report is problematic—at least, for the HMIS software our continuum of care utilizes.  The data quality reports our HMIS office produces lumps all errors together.  This leads to [social loafing](https://en.wikipedia.org/wiki/Social_loafing) between the agencies, in turn, few data repairs.  

 Solution:  The solution seems to sort the data back out, re-assigning it to the respective agency's data.  This would allow data quality reports to assign responsibility of repair.  Currently, our COC uses Social Solutions ETO software for manage our HMIS.  The process of the moving the data consists of the following steps:

1.  Determine all data which needs to be migrated.  For us, this is Demographic, HUD Assessment, and Bed Stay data.  
2.  Export these data sets.
3.  Sort the data sets to respective agencies.
4.  Import the data using a predefined template.

This article focuses on the third step.  The data has been exported, but how to sort it?  

Below is a script written to take a flat file of HUD Assessments and 

1.  Filter to to the respective program
2.  Filter HUD Assessments to _just_ Protect Entry
3.  Repair the COC code (e.g., "tx601" -> "TX-601")
4.  Re-assign the data to the proper Site (agency's data) and Program.
5.  Chop data into sets of no more than 500 rows, making the import process easier
6.  Write the data out to files.

It's pretty hackish, but it worked.

{% highlight r %}
library("sqldf")
library("readxl")

# Script Settings --------------------------------------------------------

# Name of output file, not including CSV extension.
outputFileName <- paste("HUD Assessments to Upload - v01 -")

# Paths to input files.
inputFileNameforHUDAssessments <- paste("TCES HUD Assesment Batch Report of Active Participants on 12-31-2016 - v09.xlsx")
inputFileNameforKeysToMatch <- paste("PEIDs of TCES Active Participants.xlsx")

# Names of target Site and Program
siteName <- "The Salvation Army Mabee Center"
programName <- "TSA Emergency Shelter Check In"

# ----------------------------------------

# Function to split files.
splitDataAndWriteFiles <- function(df, chunkSize, filename) {
  success <- FALSE
  count <- 0
  while (!success) {
    # If you want 20 samples, put any range of 20 values within the range of number of rows
    s <- paste(((count*chunkSize)+1), "  ", ((count+1)*chunkSize))
    print(s)
    chunk <- subset(df[((count*chunkSize)+1):((count+1)*chunkSize),])
    #chunk <- sample(df[5:20,])
    ## this would contain first 20 rows
    fileName <- paste(outputFileName, "_", as.character(count), ".csv")
    # Write out all the Active HUD Assessments.
    write.csv(chunk, file = fileName, na = "", row.names = FALSE)
    count <- count + 1
    success <- (count * chunkSize) > nrow(df)
  }
  return(success)
}

# Load all HUD Data
hudAssRaw <- read_excel(inputFileNameforHUDAssessments, na = "")

hudAssRaw <- subset(hudAssRaw, slect = -NA)

# Re-title columns for easier handling.
colnames(hudAssRaw)[1] <- "peid"
colnames(hudAssRaw)[11] <- "Relation_to_HH"
colnames(hudAssRaw)[12] <- "COC_Code"

# Replaces COC code for head's of household
hudAssRaw$COC_Code[with(hudAssRaw, Relation_to_HH == "Self (head of household)")] <- "TX-601"

hudAssRaw <- subset(hudAssRaw, slect = -NA)

# Subset Project Entry data.
hudAssRaw <- sqldf("SELECT * FROM hudAssRaw WHERE hudAssRaw.'At what point is this data being collected?_2270' = 'Project Entry'")

# Replaces COC code for head's of household
hudAssRaw$'Program Name' <- programName
hudAssRaw$'Site Name' <- siteName
colnames(hudAssRaw)[13] <- "A-3 What is the client's relationship t_2272"
colnames(hudAssRaw)[14] <- "A-5 HUD-assigned CoC code for the clien_2273"

# Set the dates back to YYYY-MM-DD
#hudAssRaw$`Response Date` <- as.Date(hudAssRaw$`Response Date`, "%Y%m%d")
#hudAssRaw$`DOB` <- as.Date(hudAssRaw$`DOB`, "%Y%m%d")
#hudAssRaw$`A-57 Approximate date homelessness star_6115` <- as.Date(hudAssRaw$`A-57 Approximate date homelessness star_6115`, "%Y%m%d")
#hudAssRaw$`A-58 Approximate date homelessness star_6116` <- as.Date(hudAssRaw$`A-58 Approximate date homelessness star_6116`, "%Y%m%d")

hudAssRaw <- subset(hudAssRaw, slect = -NA)

# Get target site Participant IDs
targetSiteParticipantIDs <- read_excel("TSA ESCI Target PSID.xlsx")

assessmentsWithTargetPID <- sqldf("SELECT * FROM targetSiteParticipantIDs
                                  INNER JOIN hudAssRaw   
                                  ON hudAssRaw.'Case Number'=targetSiteParticipantIDs.'Case Number'")

# Free up space.
rm(hudAssRaw)
rm(targetSiteParticipantIDs)

assessmentsWithTargetPID <- subset(assessmentsWithTargetPID, slect = -NA)

colnames(assessmentsWithTargetPID)[1] <- "pid"
colnames(assessmentsWithTargetPID)[12] <- "rid"

# INNER JOIN on self to get -only- the first HUD Assessment
# Thanks SO! http://stackoverflow.com/questions/7745609/sql-select-only-rows-with-max-value-on-a-column
assessmentsWithTargetPID <- sqldf("SELECT *
              FROM assessmentsWithTargetPID a
               INNER JOIN (
                  SELECT pid, MIN(rid) rid
                  FROM assessmentsWithTargetPID
                  GROUP BY pid
                ) b ON a.pid = b.pid AND a.rid = b.rid
              ")

# Remove PEID
assessmentsWithTargetPID <- subset(assessmentsWithTargetPID, select = -c(peid,peid.1))

write.csv(assessmentsWithTargetPID, file = "First HUD Entry Assessments for ESCI.csv", na = "", row.names = FALSE)

# Split the data into chunks and write to files.
splitDataAndWriteFiles(activeEntryAssessments, 500)

{% endhighlight %}