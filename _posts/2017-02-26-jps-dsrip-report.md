---
layout: post
title: Identifying Chronically Homeless and Veteran Participants throughout a COC
categories: HMIS, R, SQL
excerpt: 
tags: [ETO, HMIS, R, SQL]
image: 
    feature: SQL-HMIS-R3_0_0.png
comments: true
custom_css:
custom_js: 
---
JPS DSRIP Report V2.0  

{% highlight r %}

options(java.parameters = "-Xmx14336m")  ## memory set to 14 GB
library("XLConnect")
library("sqldf")
library("tcltk")

startDate <- "2015-10-01"
endDate <- "2016-09-30"

df <- readWorksheetFromFile("JPS_Raw_Data.xlsx", sheet = 1, startRow = 2)

#sampleVector <- sample(1:nrow(df), 30000)
#df2 <- df[sampleVector,]

#write.csv(df2, file="Sample of JPS_Raw_Data (30000).csv", na="")

#df3 <- read.csv("Sample of JPS_Raw_Data (30000).csv")

### Formatting ###################################
df3[is.na(df3)] <- ""
df3$Participant.Enterprise.Identifier <- gsub("-", "", df3$Participant.Enterprise.Identifier)
colnames(df3)[2] <- "peid"
colnames(df3)[5] <- "CaseNumber"
colnames(df3)[7] <- "Gender"
colnames(df3)[8] <- "Race"
colnames(df3)[9] <- "Ethnicity"
colnames(df3)[10] <- "ProgramName"
colnames(df3)[11] <- "SiteName"
colnames(df3)[12] <- "AgreesToShareOne"
colnames(df3)[13] <- "AgreesToShareTwo"
colnames(df3)[17] <- "ScanCardIssuedDate"
colnames(df3)[21] <- "ProgramStartDate"
df3$ProgramStartDate <- as.character(df3$ProgramStartDate)
colnames(df3)[22] <- "ProgramEndDate"
df3$ProgramEndDate <- as.character(df3$ProgramEndDate)
df3$ScanCardIssuedDate <- as.character(df3$ScanCardIssuedDate)
colnames(df3)[19] <- "OutreachContactDate"
df3$OutreachContactDate <- as.character(df3$OutreachContactDate)

##################################################

# Filter to only participants who agree to share information.
df4 <- sqldf("SELECT * FROM df3 
              WHERE (
                 AgreesToShareOne == 'Yes' 
                OR AgreesToShareTwo == 'Yes')
             ")

##################################################
####### Start ####################################
####### Get Most Recent Scancard PEIDs ###########
##################################################

df5a <- sqldf("SELECT * FROM df4 WHERE ScanCardIssuedDate != ''")

# Filter to Scan Card Creations (First time Homeless) or Return in Six Months
str2 <- paste("SELECT * FROM df5a WHERE ScanCardIssuedDate > '", startDate, "' AND ScanCardIssuedDate < '", endDate, "'", sep="")
df5a <- sqldf(str2)

str <- paste("SELECT peid, MAX(ScanCardIssuedDate) AS 'MostRecentScanCardDate', 'Scan-card' As 'DateType', Value_1712 As 'Issuance Type', 'Scan-card' As 'ContactType' FROM df5a WHERE Value_1712 = 'Scan Card Creation (First time homeless clients)' OR  Value_1712 = 'Scan Card Renewal (clients who return to the shelter after six months of being away)' GROUP BY peid ORDER BY MostRecentScanCardDate DESC", sep = "")

df5a <- sqldf(str)
##################################################
####### End = df5a ###############################
####### Get Most Recent Scancard PEIDs ###########
##################################################

##################################################
####### Start ####################################
####### Get most recent Outreach Contact #########
##################################################

df5b <- sqldf("SELECT *
              FROM df4 
              WHERE Outreach_Contact_2478 != ''
              ")

str <- paste("SELECT peid, MAX(Outreach_Contact_2478) As 'MostRecentOutreachContact', 'OutreachContact' As 'DateType' FROM df5b WHERE Outreach_Contact_2478 > '", startDate, "' AND Outreach_Contact_2478  < '", endDate, "' GROUP BY peid ORDER BY MostRecentOutreachContact DESC", sep = "")

df5b <- sqldf(str)
##################################################
####### End = df5a ###############################
####### Get most recent Outreach Contact #########
##################################################

##################################################
####### Start ####################################
####### Get most recent Program Enrollment #######
##################################################

#### 'CD PIT ES LTB' Program Group #######
  # Emergency Youth Shelter
  # ALS Emergency Shelter
  # Employment Program
  # Emergency Shelter
  # PNS-Lowden Schutts Program for Women and Children
  # PNS-Moving Home
  # Veteran's Voice Shelter Based
  # S.T.A.R.T

#### 'TH JPS Project' Program Group
  # Families Together TH
  # ARL.HA -Transitional Housing
  # YWCA-TBLA 114 RRH
  # CEC TH
  # CEC- TBLA 114 Transitional Housing
  # 3CP
  # GRACE-Transitional Housing - TBLA 114
  # NASH TH
  # Liberty House TH
  # MHMR-HS- TBLA 114 TH
  # PNS-Veteran Transitional Living
  # TC-TBLA 114 Transitional Housing TCCD
  # SIMON
  # The Salvation Army Mabee Center -- TBLA 114

#### Individual Program Groups
  # ALS Emergency Shelter
  # Emergency Shelter

df5c <- sqldf("SELECT * 
              FROM df4
              WHERE ProgramName = 'Emergency Youth Shelter'
                 OR ProgramName = 'ALS Emergency Shelter'
                 OR ProgramName = 'Employment Program'
                 OR ProgramName = 'Emergency Shelter'
                 OR ProgramName = 'PNS-Lowden Schutts Program for Women and Children'
                 OR ProgramName = 'PNS-Moving Home'
                 OR ProgramName = 'Veteran''s Voice Shelter Based'
                 OR ProgramName = 'S.T.A.R.T'

                OR ProgramName = 'YWCA-TBLA 114 RRH'
                OR ProgramName = 'CEC TH'
                OR ProgramName = 'CEC- TBLA 114 Transitional Housing'
                OR ProgramName = '3CP'
                OR ProgramName = 'GRACE-Transitional Housing - TBLA 114'
                OR ProgramName = 'NASH TH'
                OR ProgramName = 'Liberty House TH'
                OR ProgramName = 'MHMR-HS- TBLA 114 TH'
                OR ProgramName = 'PNS-Veteran Transitional Living'
                OR ProgramName = 'TC-TBLA 114 Transitional Housing TCCD'
                OR ProgramName = 'SIMON'
                OR ProgramName = 'The Salvation Army Mabee Center -- TBLA 114'

                OR ProgramName = 'ALS Emergency Shelter'
              ")

# TODO: Fix ProgramEndDate to remove HH:MM:SS instead of hacking it.
df5c <- sqldf("SELECT *, date(ProgramEndDate) As ProgramEndDate2 FROM df5c")

#df5c <- sqldf("SELECT * FROM df5c WHERE ProgramStartDate >= '2015-10-01'
#                                  AND ( ProgramEndDate2 = ''
#                                        OR ProgramEndDate2 >= '2015-01'
#                                      ) 
#              ")

df5c <- activeFilter(df5c, 'ProgramStartDate', 'ProgramEndDate2', startDate, endDate)

df5c <- sqldf("SELECT peid, ProgramName, SiteName, MAX(ProgramStartDate) As 'MostRecentProgramStart', ProgramEndDate As 'MostRecentProgramEnd' 
              FROM df5c
              GROUP BY peid
              ORDER BY MostRecentProgramStart
              ")

##################################################
####### Start ####################################
####### Aggregate Outreach, Scancard, Program ####
##################################################

df6 <- sqldf("SELECT * FROM df5a a LEFT JOIN df5b b ON a.peid=b.peid")
df6 <- subset(df6)
df6 <- sqldf("SELECT * FROM df6 a LEFT JOIN df5c b ON a.peid=b.peid")
df6 <- subset(df6)

df6$MostRecentProgramStart[is.na(df6$MostRecentProgramStart)] <- "1900-01-01"
df6$MostRecentOutreachContact[is.na(df6$MostRecentOutreachContact)] <- "1900-01-01"
df6$MostRecentScanCardDate[is.na(df6$MostRecentScanCardDate)] <- "1900-01-01"

#df6 <- sqldf(c("UPDATE df6 SET MostRecentScanCardDate = replace(MostRecentScanCardDate, '', '1900-01-01')", "SELECT * FROM df6"))
#df6 <- sqldf(c("UPDATE df6 SET MostRecentProgramStart = replace(MostRecentProgramStart, '', '1900-01-01')", "SELECT MostRecentProgramStart FROM df6"))

df6 <- sqldf("SELECT DISTINCT(peid), 
             CASE 
                WHEN MostRecentScanCardDate > MostRecentOutreachContact
                AND MostRecentScanCardDate > MostRecentProgramStart
              THEN MostRecentScanCardDate 
                WHEN MostRecentProgramStart > MostRecentOutreachContact
              THEN MostRecentProgramStart
                WHEN MostRecentOutreachContact = MAX(MostRecentScanCardDate, MostRecentProgramStart, MostRecentOutreachContact)
              THEN MostRecentOutreachContact
              ELSE 'Unknown'
              END AS LastContactDate, 
             CASE 
                WHEN MostRecentScanCardDate > MostRecentOutreachContact
                AND MostRecentScanCardDate > MostRecentProgramStart
             THEN 'Scan Card Issuance' 
                WHEN MostRecentProgramStart > MostRecentOutreachContact
             THEN 'Program Start Date'
                WHEN MostRecentOutreachContact = MAX(MostRecentScanCardDate, MostRecentProgramStart, MostRecentOutreachContact)
             THEN 'Outreach Contact'
             ELSE 'Unknown'
             END AS ContactDateType 
             FROM df6
             ")

##################################################
####### End = df6 ################################
####### Aggregate Outreach, Scancard, Program ####
##################################################

##################################################
####### Start ####################################
####### Add Demographics #########################
##################################################

df7 <- sqldf("SELECT DISTINCT(peid), SSN, Name, CaseNumber, DOB, Gender, Race, Ethnicity
             FROM df3
             ")

df7 <- sqldf("SELECT a.*, b.SSN, b.Name, b.CaseNumber, b.DOB, b.Gender, b.Race, b.Ethnicity
             FROM df6 a
             INNER JOIN df7 b
             ON a.peid=b.peid
             ")

# activeRecords <- activeFilter(df, "occStartDate", "occEndDate", "2017-01-23", '2017-01-26')
activeFilter <- function(df, beginDate, endDate, beginRange, endRange){
  df[is.na(df)] <- ""
  str <- paste("SELECT * FROM df WHERE ", beginDate, " >= '", beginRange, "' AND ( ", endDate, " = '' OR ", endDate, " >= '", beginRange, "')", sep = "")
  #print(str)
  df <- sqldf(str)
  df
}
{% endhighlight %}