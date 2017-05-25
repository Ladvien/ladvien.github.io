---
layout: post
title: Splitting Program Data
categories: HMIS, R, SQL
excerpt: 
tags: [ETO, HMIS, R, SQL]
image: 
    feature: SQL-HMIS-R3_0_0.png
comments: true
custom_css:
custom_js: 
---

{% highlight csharp %}
options(java.parameters = "-Xmx14336m")  ## memory set to 14 GB
library("sqldf")
library("XLConnect")
library("tcltk")

# 1. Load all PoS 
# 2. Load all NBN stays
# 3. Find all PEID's who have had a PoS in the last year
# 4. Find all PEID's of those who have stayed in a NBN bed in the last year
# 5. Append the lists and get a distinct set of PEIDs
# 6. Load family and individual demographic information
# 7. Inner join the demographic data to the distinct PEID set.
# 8. Write all information to file.
# 9. Pray.


allNBN <- readWorksheetFromFile("All TCES NBN Bed Data up to 1-19-2017 -- v04.xlsx", sheet = 1, startRow = 1)
allPoS <- readWorksheetFromFile ("All PoS up to 12-14-16.xlsx", sheet = 1, startRow = 1)

# Make SQL friendly headers
colnames(allNBN)[1] <- "peid"
colnames(allNBN)[3] <- "caseNumber"
colnames(allNBN)[5] <- "firstName"
colnames(allNBN)[6] <- "lastName"
colnames(allNBN)[10] <- "OccupancyStart"
colnames(allNBN)[11] <- "OccupancyEnd"


colnames(allPoS)[1] <- "ServiceName"
colnames(allPoS)[2] <- "peid"
colnames(allPoS)[3] <- "DateOfContact"

# Change dates to by SQL friendly.
allNBN$OccupancyStart <- as.character(allNBN$OccupancyStart)
allNBN$OccupancyEnd <- as.character(allNBN$OccupancyEnd)

allPoS$DateOfContact <- as.character(allPoS$DateOfContact)

# Find the days since the stay in the NBN bed started
allNBN <- sqldf("SELECT *, CAST((julianday('NOW') - julianday(OccupancyStart))AS INTEGER) 'DaysSince' 
                FROM allNBN 
                ORDER BY 'DaysSince' DESC")

write.csv(allNBN, "Test.csv")

# Find the days since the PoS was occurred.
allPoS <- sqldf("SELECT *, CAST((julianday('NOW') - julianday(DateOfContact))AS INTEGER) 'DaysSince' 
                FROM allPoS 
                ORDER BY 'DaysSince' DESC")


allNBN <- subset(allNBN)
allPoS <- subset(allPoS)

# Get all PEIDs who've stayed in a NBN bed in the last year
activeInNBN <- sqldf("SELECT * FROM allNBN WHERE DaysSince < 366")

# Get all PEIDS who received a Service in the last year
activePoS <- sqldf("SELECT * FROM allPoS WHERE DaysSince < 366")

targetElementsFromActivePoS <- sqldf("SELECT peid, ServiceName, DaysSince, 'PoS' FROM activePoS ORDER BY DaysSince DESC")
targetElementsFromActiveNBN <- sqldf("SELECT peid, caseNumber, firstName, lastName, DaysSince, 'NBN' FROM activeInNBN ORDER BY DaysSince DESC") 

# Get all distinct PEIDs.
posPEIDs <- sqldf("SELECT DISTINCT(peid) FROM targetElementsFromActivePoS")
nbnPEIDs <- sqldf("SELECT DISTINCT(peid) FROM targetElementsFromActiveNBN")

# Combine the PEIDs
posAndNbnPEIDs <- rbind(posPEIDs, nbnPEIDs)

# Get de-duplicate.
allPEIDsDistinct <- sqldf("SELECT DISTINCT(peid) FROM posAndNbnPEIDs")

# Load all FAMILY demographic info
allTCESDemographicsFamilies <- readWorksheetFromFile("Demographics in TCES up to 1-24-2017 -- Batch Upload - Participants.xlsx", sheet = 1, startRow = 1)
colnames(allTCESDemographicsFamilies)[1] <- "peid"

# Load all INDIVIDUAL demographic info
allTCESDemographicsIndividuals <- readWorksheetFromFile("Demographics in TCES up to 1-24-2017 -- Batch Upload - Participants.xlsx", sheet = 2, startRow = 1)
colnames(allTCESDemographicsIndividuals)[1] <- "peid"


# Add back demographics
activeThisYearWithDemoFamilies <- sqldf("SELECT * FROM allPEIDsDistinct INNER JOIN allTCESDemographicsFamilies ON allPEIDsDistinct.peid=allTCESDemographicsFamilies.peid")
activeThisYearWithDemoIndividuals <- sqldf("SELECT * FROM allPEIDsDistinct INNER JOIN allTCESDemographicsIndividuals ON allPEIDsDistinct.peid=allTCESDemographicsIndividuals.peid")

write.csv(activeThisYearWithDemoFamilies, file = "Active Families Demographics from TCES.csv")
write.csv(activeThisYearWithDemoIndividuals, file = "Active Individuals Demographics from TCES.csv")
{% endhighlight %}