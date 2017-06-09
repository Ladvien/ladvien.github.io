---
layout: post
title: Identifying Chronically Homeless and Veteran Participants throughout a COC
categories: HMIS, R, SQL
excerpt: 
tags: [ETO, HMIS, R, SQL]
image: 
    feature: R_SQL.png
comments: true
custom_css:
custom_js: 
---

This is my attempt to write SQL against the HMIS 5.1 CSVs.  It includes:

1.  Identifying Chronically Homeless (CHP) Participants enterprise Wide
2.  Identifying Veterans (Vets) enterprise wide
3.  Sorting CHPs and Vets to identify those who've exited the literal homelessness and where they went.
4.  Sorting CHPs and Vets to identify those are still in the literal homelessness
5.  Filtering to Active Participants in Projects using Entry / Exit
6.  Filtering to Active Participants in Projects using NBN
7.  Getting total NBN stays by participant

To actualy get anything done through writing SQL against these CSVs, one will need the HMIS Vendor CSV Specifications  

[Current HMIS CSV Specifications](http://www.hudhdx.info/VendorResources.aspx)  

{% highlight r %}
library("sqldf")
library("tcltk")

startDate <- "2015-10-01"
endDate <- "2016-09-30"

affiliation <- read.csv("Affiliation.csv")
client <- read.csv("Client.csv")
disabilities <- read.csv("Disabilities.csv")
employementEducation <- read.csv("EmploymentEducation.csv")
enrollment <- read.csv("Enrollment.csv")
exit <- read.csv("Exit.csv")
export <- read.csv("Export.csv")
funder <- read.csv("Funder.csv")
healthAndDv <- read.csv("HealthAndDV.csv")
incomeBenefits <- read.csv("IncomeBenefits.csv")
inventory <- read.csv("Inventory.csv")
organization <- read.csv("Organization.csv")
project <- read.csv("Project.csv")
projectCoc <- read.csv("ProjectCoC.csv")
services <- read.csv("Services.csv")
site <- read.csv("Site.csv")

#############################################
##### Get those Impairing Disability ########
#############################################
disabledAndImpairedDf <- sqldf("SELECT PersonalID 
                              FROM disabilities 
                              WHERE DisabilityResponse = 1 
                              AND IndefiniteAndImpairs = 1")

#############################################
##### Get those with Disabling Condition ###
#############################################
disablingCondition <- sqldf("SELECT PersonalID 
                            FROM activeEnrollment 
                            WHERE DisablingCondition = 1")

#############################################
##### Get Active Participants #1 ############
#############################################
# Compares enrollment.ProjectEntryID and exit.ProjectEntryID.  
# Should take all records where there is no matching exit.

activeEnrollment <- sqldf("SELECT * 
                          FROM enrollment a 
                          LEFT JOIN exit b 
                          ON a.ProjectEntryID=b.ProjectEntryID 
                          WHERE b.ProjectEntryID IS NULL")
activeEnrollment <- subset(activeEnrollment)

## ^^^^^^ Doesn't work. ^^^^^^
# Rhis will not work for us, since many shelters are
# not entering HUD Exit Assessments.

#############################################
##### Get Active Participants #2 ############
#############################################
# For activeEnrollment, take the MAX(EntryDate) from enrollment and
# MAX(ExitDate) FROM exit.  Then, compare the dates, if the entry date is later
# then the exit date, then the participant is still active in the project.
# if the ExitDate is after the entry, then the participant is no longer in the project.
mostRecentEnrollment <- sqldf("SELECT *, MAX(EntryDate) As 'MostRecentEntryDate'
                              FROM enrollment
                              GROUP BY PersonalID")

mostRecentExit <- sqldf("SELECT *, MAX(ExitDate) As 'MostRecentExitDate'
                              FROM exit
                              GROUP BY PersonalID")

mostRecentEntryAndExit <- sqldf("SELECT a.PersonalID, a.MostRecentEntryDate, b.MostRecentExitDate, a.ProjectEntryID, b.ExitID
                                  FROM mostRecentEnrollment a 
                                  LEFT JOIN mostRecentExit b
                                  ON a.PersonalID=b.PersonalID
                                ")

activeParticipants <- sqldf("SELECT PersonalID, MostRecentEntryDate, MostRecentExitDate, ProjectEntryID, ExitID
                              FROM mostRecentEntryAndExit
                                WHERE (MostRecentEntryDate > MostRecentExitDate)
                                OR MostRecentExitDate IS NULL
                            ")

dayLongParticipants <- sqldf("SELECT PersonalID, MostRecentEntryDate, MostRecentExitDate, ProjectEntryID, ExitID
                              FROM mostRecentEntryAndExit
                              WHERE (MostRecentEntryDate = MostRecentExitDate)
                            ")

inactiveParticipants <- sqldf("SELECT PersonalID, MostRecentEntryDate, MostRecentExitDate, ProjectEntryID
                              FROM mostRecentEntryAndExit
                              WHERE (MostRecentEntryDate < MostRecentExitDate)
                            ")

## ^^^^^^ Grr...Doesn't work. ^^^^^^
# Unfortunately, this wont work because of participants exited from a project
# then enrolled in a different project on the same day.
# Looks like I'm getting active participants through method one, filtering out
# the TCES, and then adding them back in.  
# Wait, the TCES:PNS and TCES:TSA should both be pulling only participants
# who've stayed in a bed.  Maybe it's the DRC which is responsible for the high total?
# I'll re-pull the data excluding the DRC and see if that drastically lowers the number.

#############################################
##### Get Active Participants #3 ############
############## Incomplete ###################
#############################################

# My next thought is to break out NBN data, where Exits are collected.  Once removed, then the activeEnrollment formula
# should work, since everything else is Entry / Exit.  I'll then use the Services NBN dates to determine if someone is
# still active in the shelters.

#############################################
##### Get Active NBN Participants  ##########
###### And their total NBN stays ############
#############################################
# 200 = NBN Service
# http://www.hudhdx.info/VendorResources.aspx
clientNbn <- sqldf("SELECT * 
                   FROM services
                   WHERE RecordType = 200 
                   ") 

str <- paste("SELECT * FROM clientNbn WHERE DateProvided > '", startDate, "' AND DateProvided < '", endDate,"'", sep = "")

activeClientNbn <- sqldf(str)
distinctActiveClientNbn <- sqldf("SELECT DISTINCT(PersonalID) FROM activeClientNbn")

clientNbnDuration <- sqldf("SELECT PersonalID, COUNT(DateProvided) As 'Total NBN Stays'
                            FROM clientNbn
                            GROUP BY PersonalID
                           ")

activeNbnClientWithTotalNbnDuration <- sqldf("SELECT a.PersonalID, b.'Total NBN Stays'
                                             FROM distinctActiveClientNbn a
                                             INNER JOIN clientNbnDuration b
                                             ON a.PersonalID=b.PersonalID
                                             ORDER BY b.'Total NBN Stays' DESC
                                             ")

#################

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

# Get client info for chronically homeless.
chClient <- sqldf("SELECT *, 'Yes' As 'Chronically Homeless' 
                  FROM client a 
                  INNER JOIN chronicallyHomeless b 
                  ON a.PersonalID=b.PersonalID
                  ")
chClient <- subset(chClient)

#############################################
##### Chronically Homeless Veterans #########
#############################################
# Finds the total Chronically Homeless Veterans in the data set.
chronicallyHomelessVeterans <- sqldf("SELECT * 
                                     FROM chClient 
                                     WHERE VeteranStatus = 1
                                     ")

#############################################
##### Exit Destination Information ##########
############## Incomplete ###################
#############################################
# Take only the most recent exit assessment
clientLastExit <- sqldf("SELECT PersonalID, MAX(ExitDate), Destination
                        FROM exit
                        GROUP BY PersonalID
                        ")

clientLastExit <- destinationToReadable(clientLastExit)

clientsBrief <- sqldf("SELECT PersonalID, FirstName, LastName, SSN FROM client")
clientsBriefExit <- sqldf("SELECT * 
                          FROM clientsBrief a 
                          INNER JOIN clientLastExit b
                          ON a.PersonalID=b.PersonalID
                        ")

# Target day is 1-26-2017

# activeRecords <- activeFilter(df, "occStartDate", "occEndDate", "2017-01-23", '2017-01-26')
activeFilter <- function(df, dateVector1, dateVector2, beginRange, endRange){
  df[is.na(df)] <- ""
  df[dateVector1,] <- as.character(df[dateVector1,])
  df[dateVector2,] <- as.character(df[dateVector2,])
  str <- paste("SELECT * FROM df WHERE (", dateVector1, "< '", endRange, "' AND ", dateVector2, " = '') OR (", dateVector1, "< '", endRange, "' AND ", dateVector2, " > '", beginRange, "')", sep = "")
  sqldf(str)
}

makeDestinationReadable <- function (df) {
  df <- exit
  df <- sqldf("SELECT *, Destination as 'ReadableDestination' FROM df")
  df$ReadableDestination[df$ReadableDestination == "1"] <- "Emergency shelter, including hotel or motel paid for with emergency shelter voucher"
  df$ReadableDestination[df$ReadableDestination == "2"] <- "Transitional housing for homeless persons (including homeless youth)"
  df$ReadableDestination[df$ReadableDestination == "3"] <- "Permanent housing for formerly homeless persons (such as: CoC project; or HUD legacy programs; or HOPWA PH)"
  df$ReadableDestination[df$ReadableDestination == "4"] <- "Psychiatric hospital or other psychiatric facility"
  df$ReadableDestination[df$ReadableDestination == "5"] <- "Substance abuse treatment facility or detox center"
  df$ReadableDestination[df$ReadableDestination == "6"] <- "Hospital or other residential non-psychiatric medical facility"
  df$ReadableDestination[df$ReadableDestination == "7"] <- "Jail, prison or juvenile detention facility"
  df$ReadableDestination[df$ReadableDestination == "8"] <- "Client doesn’t know"
  df$ReadableDestination[df$ReadableDestination == "9"] <- "Client refused"
  df$ReadableDestination[df$ReadableDestination == "10"] <- "Rental by client, no ongoing housing subsidy"
  df$ReadableDestination[df$ReadableDestination == "11"] <- "Owned by client, no ongoing housing subsidy"
  df$ReadableDestination[df$ReadableDestination == "12"] <- "Staying or living with family, temporary tenure (e.g., room, apartment or house)"
  df$ReadableDestination[df$ReadableDestination == "13"] <- "Staying or living with friends, temporary tenure (e.g., room apartment or house)"
  df$ReadableDestination[df$ReadableDestination == "14"] <- "Hotel or motel paid for without emergency shelter voucher"
  df$ReadableDestination[df$ReadableDestination == "15"] <- "Foster care home or foster care group home"
  df$ReadableDestination[df$ReadableDestination == "16"] <- "Place not meant for habitation (e.g., a vehicle, an abandoned building, bus/train/subway station/airport or anywhere outside)"
  df$ReadableDestination[df$ReadableDestination == "17"] <- "Other"
  df$ReadableDestination[df$ReadableDestination == "18"] <- "Safe Haven"
  df$ReadableDestination[df$ReadableDestination == "19"] <- "Rental by client, with VASH housing subsidy"
  df$ReadableDestination[df$ReadableDestination == "20"] <- "Rental by client, with other ongoing housing subsidy"
  df$ReadableDestination[df$ReadableDestination == "21"] <- "Owned by client, with ongoing housing subsidy"
  df$ReadableDestination[df$ReadableDestination == "22"] <- "Staying or living with family, permanent tenure"
  df$ReadableDestination[df$ReadableDestination == "23"] <- "Staying or living with friends, permanent tenure"
  df$ReadableDestination[df$ReadableDestination == "24"] <- "Deceased"
  df$ReadableDestination[df$ReadableDestination == "25"] <- "Long-term care facility or nursing home"
  df$ReadableDestination[df$ReadableDestination == "26"] <- "Moved from one HOPWA funded project to HOPWA PH"
  df$ReadableDestination[df$ReadableDestination == "27"] <- "Moved from one HOPWA funded project to HOPWA TH"
  df$ReadableDestination[df$ReadableDestination == "28"] <- "Rental by client, with GPD TIP housing subsidy"
  df$ReadableDestination[df$ReadableDestination == "29"] <- "Residential project or halfway house with no homeless criteria"
  df$ReadableDestination[df$ReadableDestination == "30"] <- "No exit interview completed"
  df$ReadableDestination[df$ReadableDestination == "99"] <- "Data not collected"

  df
}
    
{% endhighlight %}